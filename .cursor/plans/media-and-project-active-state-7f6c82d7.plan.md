<!-- 7f6c82d7-9c44-49e7-a7b4-a4ed638e8324 3d91f2a8-ef45-4a00-a742-ee9e40ecbfed -->
# Clone Project Feature Implementation

## Overview

Add a three-dot dropdown menu next to Edit and Delete buttons in the projects listing, containing a "Clone Project" option that duplicates the entire project with a unique name and slug.

## Implementation Steps

### 1. Create Clone API Endpoint

**File: `app/api/cms/projects/clone/route.ts`** (new file)

Create a new POST endpoint that:

- Accepts the original project ID
- Fetches the complete project data including all `projectDetail` fields
- Generates a unique name by appending " (Copy)" or " (Copy N)" where N increments
- Generates a unique slug from the new name
- Validates slug uniqueness using existing validation logic
- Sets `isActive: false` by default
- Removes the original `_id` field
- Creates the new project using the Project model
- Returns the newly created project

Key logic:

```typescript
// Find existing copies to determine the next number
const copyPattern = new RegExp(`^${escapedName} \\(Copy( \\d+)?\\)$`);
const existingCopies = await Project.find({ name: copyPattern });
// Generate name like "Project Name (Copy)" or "Project Name (Copy 2)"
```

### 2. Add Clone Action to Redux

**File: `redux/slices/projectsSlice.ts`**

Add a new async thunk after `deleteProject` (around line 256):

```typescript
export const cloneProject = createAsyncThunk(
  "adminProjects/cloneProject",
  async (id: string) => {
    const response = await fetch("/api/cms/projects/clone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id }),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);
```

Add reducer case in `extraReducers`:

```typescript
.addCase(cloneProject.fulfilled, (state, action) => {
  state.projects.push(action.payload);
})
```

### 3. Update ProjectsManager Component

**File: `components/admin/ProjectsManager.tsx`**

#### Add Required Imports

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy } from "lucide-react";
import { cloneProject } from "@/redux/slices/projectsSlice";
```

#### Add Clone Handler Function (after `handleEdit` around line 136)

```typescript
const handleClone = async (id: string) => {
  try {
    await dispatch(cloneProject(id)).unwrap();
    toast.success("Project cloned successfully");
  } catch (error) {
    toast.error("Failed to clone project");
  }
};
```

#### Update Desktop Table Actions Column (line 386-404)

Replace the current actions buttons with:

```typescript
<div className="flex items-center justify-end gap-2">
  <Button
    variant="ghost"
    size="sm"
    className="hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
    onClick={() => handleEdit(project._id)}
  >
    <Edit className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setDeleteDialogId(project._id)}
    className="hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-slate-200 transition-all duration-200 cursor-pointer"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="admin-theme">
      <DropdownMenuItem
        onClick={() => handleClone(project._id)}
        className="cursor-pointer"
      >
        <Copy className="h-4 w-4 mr-2" />
        Clone Project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

#### Update Mobile Card Actions (line 461-478)

Replace the mobile actions with:

```typescript
<div className="flex gap-1 ml-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleEdit(project._id)}
    className="hover:bg-emerald-500 hover:text-white transition-all duration-200 h-8 w-8 p-0"
  >
    <Edit className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setDeleteDialogId(project._id)}
    className="hover:bg-red-500 hover:text-white transition-all duration-200 h-8 w-8 p-0"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-slate-200 transition-all duration-200 h-8 w-8 p-0"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="admin-theme">
      <DropdownMenuItem
        onClick={() => handleClone(project._id)}
        className="cursor-pointer"
      >
        <Copy className="h-4 w-4 mr-2" />
        Clone Project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

## Technical Details

### Unique Name Generation Logic

1. Check if project name already ends with " (Copy)" or " (Copy N)"
2. Query database for all projects matching the pattern `{originalName} (Copy*)` 
3. Find the highest copy number and increment by 1
4. If no copies exist, append " (Copy)"
5. If copies exist, append " (Copy N)" where N is the next number

### Unique Slug Generation

1. Generate slug from the new unique name using existing slug generation logic
2. The Project model's pre-save middleware will handle slug uniqueness automatically
3. If slug collision occurs, it will append numbers (e.g., `project-name-copy-1`, `project-name-copy-2`)

### Clone Behavior

- All project fields are copied including `projectDetail` nested object
- `isActive` is set to `false` by default
- `_id` is removed to create a new document
- `order` field is preserved from original
- All images, videos, and media URLs are preserved (no file duplication needed)

## Files to Create/Modify

1. **Create**: `app/api/cms/projects/clone/route.ts`
2. **Modify**: `redux/slices/projectsSlice.ts` (add cloneProject thunk and reducer)
3. **Modify**: `components/admin/ProjectsManager.tsx` (add dropdown menu and clone handler)

## Success Criteria

- Clicking "Clone Project" creates a duplicate with unique name and slug
- Cloned project appears in the listing immediately
- Cloned project is inactive by default (shows "Inactive" badge)
- Success toast notification appears
- Multiple clones increment the copy number correctly
- No errors occur during the cloning process

### To-dos

- [ ] Update media selectors to fetch all items with pagination (limit 500)
- [ ] Add isActive toggle in CreateProjectForm and EditProjectForm
- [ ] Ensure inactive projects are filtered from project detail page
- [ ] Add image editing to Discover Tranquility and Master Plan edit dialogs