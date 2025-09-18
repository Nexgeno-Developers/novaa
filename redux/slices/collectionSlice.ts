import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type PropertyType = {
  _id: string;
  name: string;
  price: string;
  images: string[];
  location: string;
  description: string;
  badge?: string;
  category: {
    _id: string;
    name: string;
  };
  categoryName: string;
  isActive: boolean;
  order: number;
};

export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
};

export type CuratedCollectionType = {
  _id?: string;
  title: string;
  description: string;
  isActive: boolean;
  selectedRegion? : string;
  items: {
    [categoryId: string]: PropertyType[];
  };
  maxItemsPerCategory?: number;
};

interface CuratedState {
  selectedRegion: string;
  collection: CuratedCollectionType | null;
  categories: CategoryType[];
  allProjects: PropertyType[]; // All projects from projects API
  loading: boolean;
  error: string | null;
  dataSource: 'curated' | 'all'; // New field to track data source
  // Load More functionality
  visibleItemsPerCategory: { [categoryName: string]: number };
  itemsPerPage: number;
  loadingMore: boolean;
}

const initialState: CuratedState = {
  selectedRegion: "",
  collection: null,
  categories: [],
  allProjects: [],
  loading: false,
  error: null,
  dataSource: 'all',
  // Load More initial state
  visibleItemsPerCategory: {},
  itemsPerPage: 9,
  loadingMore: false,
};

// Fetch curated collection data (for home page)
export const fetchCuratedCollectionData = createAsyncThunk(
  "curated/fetchCuratedData",
  async (pageSlug: string = "home") => {
    try {
      const [sectionResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/cms/sections/${pageSlug}/curated-collection`),
        fetch("/api/cms/categories")
      ]);

      let collectionData = null;
      if (sectionResponse.ok) {
        const sectionResult = await sectionResponse.json();
        collectionData = {
          title: sectionResult.content.title,
          description: sectionResult.content.description,
          isActive: sectionResult.content.isActive,
          items: sectionResult.content.items || {},
          maxItemsPerCategory: sectionResult.content.maxItemsPerCategory || 6
        };
      }

      const categoriesResult = await categoriesResponse.json();
      if (!categoriesResult.success) {
        throw new Error(categoriesResult.error);
      }

      return {
        collection: collectionData,
        categories: categoriesResult.data,
        dataSource: 'curated' as const
      };
    } catch (error) {
      throw error;
    }
  }
);

// Fetch all projects data (for projects page)
export const fetchAllProjectsData = createAsyncThunk(
  "curated/fetchAllProjects",
  async () => {
    try {
      const [categoriesResponse, projectsResponse] = await Promise.all([
        fetch("/api/cms/categories"),
        fetch("/api/cms/projects")
      ]);

      const categoriesResult = await categoriesResponse.json();
      if (!categoriesResult.success) {
        throw new Error(categoriesResult.error);
      }

      const projectsResult = await projectsResponse.json();
      if (!projectsResult.success) {
        throw new Error(projectsResult.error);
      }

      return {
        categories: categoriesResult.data,
        projects: projectsResult.data,
        dataSource: 'all' as const
      };
    } catch (error) {
      throw error;
    }
  }
);

const curatedSlice = createSlice({
  name: "curated",
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.selectedRegion = action.payload;
      
      // Initialize visible items for this category if not exists
      if (!state.visibleItemsPerCategory[action.payload]) {
        state.visibleItemsPerCategory[action.payload] = state.itemsPerPage;
      }
    },
    resetState: (state) => {
      state.selectedRegion = "";
      state.collection = null;
      state.categories = [];
      state.allProjects = [];
      state.dataSource = 'all';
      state.loading = false;
      state.error = null;
      state.visibleItemsPerCategory = {};
      state.loadingMore = false;
    },
    // Direct data setting actions for server-side data
    setCuratedCollectionData: (state, action) => {
      state.collection = action.payload;
      state.loading = false;
      state.error = null;
      state.dataSource = 'curated';
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      
      // Initialize visible items for all categories
      state.categories.forEach(category => {
        if (!state.visibleItemsPerCategory[category.name]) {
          state.visibleItemsPerCategory[category.name] = state.itemsPerPage;
        }
      });
      
      // Auto-select first category with projects if none selected
      if (!state.selectedRegion && state.categories.length > 0) {
        const categoryWithProjects = state.categories.find((category) => {
          if (state.dataSource === 'curated' && state.collection) {
            const curatedProjects = state.collection.items[category._id];
            return category.isActive && curatedProjects && curatedProjects.length > 0;
          } else {
            const categoryProjects = state.allProjects.filter(
              project => project.category._id === category._id && project.isActive
            );
            return category.isActive && categoryProjects.length > 0;
          }
        });

        if (categoryWithProjects) {
          state.selectedRegion = categoryWithProjects.name;
          // Initialize visible items for selected category
          if (!state.visibleItemsPerCategory[categoryWithProjects.name]) {
            state.visibleItemsPerCategory[categoryWithProjects.name] = state.itemsPerPage;
          }
        }
      }
    },
    setDataSource: (state, action) => {
      state.dataSource = action.payload;
    },
    setAllProjects: (state, action) => {
      state.allProjects = action.payload;
      
      // Initialize visible items for all categories
      state.categories.forEach(category => {
        if (!state.visibleItemsPerCategory[category.name]) {
          state.visibleItemsPerCategory[category.name] = state.itemsPerPage;
        }
      });
      
      // Auto-select first category with projects if none selected and categories exist
      if (!state.selectedRegion && state.categories.length > 0) {
        const categoryWithProjects = state.categories.find((category) => {
          const categoryProjects = state.allProjects.filter(
            project => project.category._id === category._id && project.isActive
          );
          return category.isActive && categoryProjects.length > 0;
        });

        if (categoryWithProjects) {
          state.selectedRegion = categoryWithProjects.name;
          // Initialize visible items for selected category
          if (!state.visibleItemsPerCategory[categoryWithProjects.name]) {
            state.visibleItemsPerCategory[categoryWithProjects.name] = state.itemsPerPage;
          }
        }
      }
    },
    // Load More functionality
    loadMoreProjects: (state, action) => {
      const categoryName = action.payload || state.selectedRegion;
      if (categoryName) {
        const currentVisible = state.visibleItemsPerCategory[categoryName] || state.itemsPerPage;
        state.visibleItemsPerCategory[categoryName] = currentVisible + state.itemsPerPage;
      }
    },
    setLoadingMore: (state, action) => {
      state.loadingMore = action.payload;
    },
    resetVisibleItems: (state, action) => {
      const categoryName = action.payload;
      if (categoryName) {
        state.visibleItemsPerCategory[categoryName] = state.itemsPerPage;
      }
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle curated collection data
      .addCase(fetchCuratedCollectionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuratedCollectionData.fulfilled, (state, action) => {
        state.loading = false;
        state.collection = action.payload.collection;
        state.categories = action.payload.categories;
        state.dataSource = action.payload.dataSource;

        // Initialize visible items for all categories
        state.categories.forEach(category => {
          if (!state.visibleItemsPerCategory[category.name]) {
            state.visibleItemsPerCategory[category.name] = state.itemsPerPage;
          }
        });

        // Set first category with curated projects as selected
        if (!state.selectedRegion && state.categories.length > 0 && state.collection) {
          const categoryWithProjects = state.categories.find((category) => {
            const curatedProjects = state.collection?.items[category._id];
            return category.isActive && curatedProjects && curatedProjects.length > 0;
          });

          if (categoryWithProjects) {
            state.selectedRegion = categoryWithProjects.name;
            // Initialize visible items for selected category
            if (!state.visibleItemsPerCategory[categoryWithProjects.name]) {
              state.visibleItemsPerCategory[categoryWithProjects.name] = state.itemsPerPage;
            }
          }
        }
      })
      .addCase(fetchCuratedCollectionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch curated collection data";
      })
      
      // Handle all projects data
      .addCase(fetchAllProjectsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjectsData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.allProjects = action.payload.projects;
        state.dataSource = action.payload.dataSource;

        // Initialize visible items for all categories
        state.categories.forEach(category => {
          if (!state.visibleItemsPerCategory[category.name]) {
            state.visibleItemsPerCategory[category.name] = state.itemsPerPage;
          }
        });

        // Set first category with projects as selected
        if (!state.selectedRegion && state.categories.length > 0) {
          const categoryWithProjects = state.categories.find((category) => {
            const categoryProjects = state.allProjects.filter(
              project => project.category._id === category._id && project.isActive
            );
            return category.isActive && categoryProjects.length > 0;
          });

          if (categoryWithProjects) {
            state.selectedRegion = categoryWithProjects.name;
            // Initialize visible items for selected category
            if (!state.visibleItemsPerCategory[categoryWithProjects.name]) {
              state.visibleItemsPerCategory[categoryWithProjects.name] = state.itemsPerPage;
            }
          }
        }
      })
      .addCase(fetchAllProjectsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects data";
      });
  },
});

export const { 
  setRegion, 
  resetState, 
  setCuratedCollectionData, 
  setCategories, 
  setDataSource, 
  setAllProjects,
  loadMoreProjects,
  setLoadingMore,
  resetVisibleItems,
  setItemsPerPage
} = curatedSlice.actions;

export default curatedSlice.reducer;