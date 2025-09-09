"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, RotateCcw } from "lucide-react";
import type { Section } from "@/redux/slices/pageSlice";

interface BaseSectionManagerProps {
  section: Section;
  onChange: (changes: Partial<Section>) => void;
  showSaveButton?: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function BaseSectionManager({
  section,
  onChange,
  showSaveButton = true,
  title,
  description,
  children,
}: BaseSectionManagerProps) {
  const [localChanges, setLocalChanges] = useState<Partial<Section>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Memoize the onChange callback to prevent infinite re-renders
  const handleParentChange = useCallback(
    (changes: Partial<Section>) => {
      if (onChange) {
        onChange(changes);
      }
    },
    [onChange]
  );

  // Update parent when local changes occur - use useCallback to memoize
  const handleChange = useCallback(
    (changes: Partial<Section>) => {
      setLocalChanges((prevChanges) => {
        const newChanges = { ...prevChanges, ...changes };
        return newChanges;
      });
      setHasUnsavedChanges(true);

      // Call parent onChange with the changes
      handleParentChange(changes);
    },
    [handleParentChange]
  );

  // Handle visibility toggle - memoized to prevent re-renders
  const handleVisibilityToggle = useCallback(
    (isVisible: boolean) => {
      const changes = {
        settings: {
          ...section.settings,
          isVisible,
        },
      };
      handleChange(changes);
    },
    [section.settings, handleChange]
  );

  // Handle status toggle - memoized to prevent re-renders
  const handleStatusToggle = useCallback(
    (active: boolean) => {
      const changes = {
        status: active ? ("active" as const) : ("inactive" as const),
      };
      handleChange(changes);
    },
    [handleChange]
  );

  // Reset changes - memoized
  const handleReset = useCallback(() => {
    setLocalChanges({});
    setHasUnsavedChanges(false);
    // Optionally emit reset event to parent
    handleParentChange({});
  }, [handleParentChange]);

  // Get current values (local changes override section values) - memoized
  const currentSection = useMemo(() => {
    return {
      ...section,
      ...localChanges,
      settings: {
        ...section.settings,
        ...localChanges.settings,
      },
    };
  }, [section, localChanges]);

  // Handle save action - memoized
  const handleSave = useCallback(() => {
    // This would trigger individual save
    // Implementation depends on your save logic
    console.log("Saving section:", currentSection);
    setHasUnsavedChanges(false);
  }, [currentSection]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary/90">{title || section.name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            className="text-background"
            variant={
              currentSection.status === "active" ? "default" : "secondary"
            }
          >
            {currentSection.status}
          </Badge>
          {hasUnsavedChanges && (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-600 border-orange-200"
            >
              Unsaved
            </Badge>
          )}
        </div>
      </div>

      {/* Section Controls */}
      {/* <Card className="py-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Section Settings</CardTitle>
          <CardDescription>
            Configure visibility and status for this section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentSection.settings.isVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <Label
                htmlFor={`visibility-${section._id}`}
                className="text-sm font-medium"
              >
                Show on Website
              </Label>
            </div>
            <Switch
              id={`visibility-${section._id}`}
              checked={currentSection.settings.isVisible}
              onCheckedChange={handleVisibilityToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  currentSection.status === "active" ? "default" : "secondary"
                }
                className="w-2 h-2 p-0 rounded-full"
              />
              <Label
                htmlFor={`status-${section._id}`}
                className="text-sm font-medium"
              >
                Section Active
              </Label>
            </div>
            <Switch
              id={`status-${section._id}`}
              checked={currentSection.status === "active"}
              onCheckedChange={handleStatusToggle}
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Section Content */}
      {/* <Card className="py-6"> */}
      {/* <CardHeader className="pb-3"> */}
      {/* <CardTitle className="text-base">Content Management</CardTitle>
          <CardDescription>
            Edit the content and settings for this section
          </CardDescription> */}
      {/* </CardHeader> */}
      <div>{children}</div>
      {/* </Card> */}

      {/* Individual Save Button (only show if showSaveButton is true) */}
      {showSaveButton && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                size="sm"
                className="text-background"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          <Button onClick={handleSave} disabled={!hasUnsavedChanges} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Section
          </Button>
        </div>
      )}
    </div>
  );
}
