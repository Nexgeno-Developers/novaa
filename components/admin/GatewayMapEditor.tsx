"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import { pixelToPercentage, MapDimensions } from "@/lib/mapUtils";

// Types
interface MainProjectLocation {
  title: string;
  description: string;
  icon: string;
  coords: { x: number; y: number };
}

interface GatewayLocation {
  name: string;
  image: string;
  coords: { top: string; left: string };
  icon: string;
  pixelCoords: { x: number; y: number };
  categoryId?: string;
}

interface GatewayCategory {
  title: string;
  description: string;
  icon: string;
  locations: GatewayLocation[];
}

interface CurveLine {
  id: string;
  categoryId: string;
  locationId: string;
  svgPath: string;
  color: string;
  thickness: number;
  dashPattern: number[];
}

interface GatewayMapEditorProps {
  mapImage: string;
  existingData?: {
    mainProjectLocation?: MainProjectLocation;
    curveLines?: CurveLine[];
    categories?: GatewayCategory[];
  };
  onSave: (mapData: {
    mainProjectLocation: MainProjectLocation;
    curveLines: CurveLine[];
    categories: GatewayCategory[];
  }) => void;
}

type EditorMode = "addMainProject" | "addGatewayLocation" | "edit" | "view";

const GatewayMapEditor: React.FC<GatewayMapEditorProps> = ({
  mapImage,
  existingData,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Editor state
  const [mode, setMode] = useState<EditorMode>("view");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<
    "mainProject" | "gatewayLocation" | null
  >(null);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Map data state
  const [mainProjectLocation, setMainProjectLocation] =
    useState<MainProjectLocation>({
      title: "",
      description: "",
      icon: "/gateway-images/main-project-icon.svg",
      coords: { x: 0, y: 0 },
    });

  const [categories, setCategories] = useState<GatewayCategory[]>([]);
  const [curveLines, setCurveLines] = useState<CurveLine[]>([]);

  // UI state
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<{
    type: "mainProject" | "gatewayLocation";
    data?: any;
    coords?: { x: number; y: number };
  } | null>(null);

  // Curve customization
  const [curveSettings, setCurveSettings] = useState({
    color: "#CDB04E",
    thickness: 0.85,
    dashPattern: [0.8529044985771179, 0.8529044985771179],
    lineStyle: "dashed", // solid, dashed, dotted, dash-dot
  });

  // Helper function to convert line style to dash pattern
  const getDashPattern = (lineStyle: string): number[] => {
    switch (lineStyle) {
      case "solid":
        return [];
      case "dashed":
        return [0.8529044985771179, 0.8529044985771179];
      case "dotted":
        return [2, 3];
      case "dash-dot":
        return [10, 5, 2, 5];
      default:
        return [0.8529044985771179, 0.8529044985771179];
    }
  };

  // Load map image
  useEffect(() => {
    if (mapImage && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        drawCanvas();
      };
      img.src = mapImage;
    }
  }, [mapImage]);

  // Load existing data if available (load when mode changes or when data changes)
  useEffect(() => {
    if (existingData && !hasUserMadeChanges) {
      loadExistingData(existingData);
    }
  }, [existingData, mode]); // Added mode to dependencies

  // Load existing map data
  const loadExistingData = (data: any) => {
    console.log("Loading existing data:", data);

    if (data.mainProjectLocation) {
      console.log("Setting main project location:", data.mainProjectLocation);
      setMainProjectLocation(data.mainProjectLocation);
    }

    if (data.categories) {
      console.log("Setting categories:", data.categories);
      setCategories(data.categories);
    }

    if (data.curveLines) {
      console.log("Setting curve lines:", data.curveLines);
      setCurveLines(data.curveLines);
    }

    // Force canvas redraw after loading data
    setTimeout(() => {
      console.log("Forcing canvas redraw after loading data");
      drawCanvas();
    }, 100);
  };

  // Draw canvas with map and markers
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    console.log("Drawing canvas with data:", {
      mainProjectLocation,
      categories: categories.length,
      curveLines: curveLines.length,
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw main project location
    if (mainProjectLocation.coords.x > 0 && mainProjectLocation.coords.y > 0) {
      ctx.fillStyle = "#C3912F";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        mainProjectLocation.coords.x,
        mainProjectLocation.coords.y,
        12,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
    }

    // Draw gateway locations
    categories.forEach((category) => {
      category.locations.forEach((location) => {
        if (location.pixelCoords.x > 0 && location.pixelCoords.y > 0) {
          ctx.fillStyle = "#CDB04E";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            location.pixelCoords.x,
            location.pixelCoords.y,
            8,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.stroke();
        }
      });
    });

    // Draw curves
    curveLines.forEach((curve) => {
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = curve.thickness;
      ctx.setLineDash(curve.dashPattern);
      ctx.beginPath();

      // Parse SVG path and draw
      const pathMatch = curve.svgPath.match(
        /M\s+(\d+)\s+(\d+)\s+C\s+(\d+)\s+(\d+),\s+(\d+)\s+(\d+),\s+(\d+)\s+(\d+)/
      );
      if (pathMatch) {
        const [, x1, y1, cx1, cy1, cx2, cy2, x2, y2] = pathMatch.map(Number);
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });
  }, [mainProjectLocation, categories, curveLines]);

  // Redraw canvas when data changes
  useEffect(() => {
    drawCanvas();
  }, [mainProjectLocation, categories, curveLines, drawCanvas]);

  // Redraw canvas when mode changes
  useEffect(() => {
    drawCanvas();
  }, [mode, drawCanvas]);

  // Update curve lines when main project location changes (for non-drag updates)
  useEffect(() => {
    console.log("useEffect triggered - main project location changed:", {
      coords: mainProjectLocation.coords,
      curveLinesCount: curveLines.length,
      hasValidCoords:
        mainProjectLocation.coords.x > 0 && mainProjectLocation.coords.y > 0,
    });

    if (
      mainProjectLocation.coords.x > 0 &&
      mainProjectLocation.coords.y > 0 &&
      curveLines.length > 0
    ) {
      console.log(
        "Main project location changed, updating curve lines:",
        mainProjectLocation.coords
      );
      updateCurveLinesForNewMainProject(
        mainProjectLocation.coords.x,
        mainProjectLocation.coords.y
      );
    } else {
      console.log("Skipping curve line update - conditions not met:", {
        x: mainProjectLocation.coords.x,
        y: mainProjectLocation.coords.y,
        curveLinesLength: curveLines.length,
      });
    }
  }, [
    mainProjectLocation.coords.x,
    mainProjectLocation.coords.y,
    curveLines.length,
  ]);

  // Update curve lines when main project location changes
  const updateCurveLinesForNewMainProject = (newX: number, newY: number) => {
    console.log("Updating curve lines for new main project location:", {
      newX,
      newY,
    });

    const updatedCurveLines = curveLines.map((curve) => {
      // Find the corresponding gateway location
      const category = categories.find((cat) => cat.title === curve.categoryId);
      if (!category) return curve;

      const location = category.locations.find(
        (loc) => loc.name === curve.locationId
      );
      if (!location) return curve;

      // Convert percentage coordinates to pixel coordinates
      const locationPixelCoords = {
        x: (parseFloat(location.coords.left.replace("%", "")) / 100) * 800,
        y: (parseFloat(location.coords.top.replace("%", "")) / 100) * 600,
      };

      // Generate new SVG path from new main project location to gateway location
      const newSvgPath = generateBezierPath(
        { x: newX, y: newY },
        locationPixelCoords
      );

      console.log("Updated curve path:", {
        curveId: curve.id,
        oldPath: curve.svgPath,
        newPath: newSvgPath,
      });

      return {
        ...curve,
        svgPath: newSvgPath,
      };
    });

    setCurveLines(updatedCurveLines);
  };

  // Update curve lines when gateway location changes
  const updateCurveLinesForGatewayLocation = (
    categoryId: string,
    locationId: string,
    newX: number,
    newY: number,
    mainProjectCoords?: { x: number; y: number }
  ) => {
    const updatedCurveLines = curveLines.map((curve) => {
      if (curve.categoryId === categoryId && curve.locationId === locationId) {
        // Use provided main project coordinates or fall back to state
        const mainCoords = mainProjectCoords || mainProjectLocation.coords;

        // Generate new SVG path from main project location to new gateway location position
        const newSvgPath = generateBezierPath(mainCoords, {
          x: newX,
          y: newY,
        });

        return {
          ...curve,
          svgPath: newSvgPath,
        };
      }
      return curve;
    });

    setCurveLines(updatedCurveLines);
  };

  // Generate bezier curve path between two points with double curve (S-shape)
  const generateBezierPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    // Calculate distance between points
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    // Create control points for a double curve (S-shape)
    const controlOffset = Math.min(distance * 0.2, 80); // Moderate curve offset

    // Determine curve direction based on relative positions
    const isHorizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);

    let control1X, control1Y, control2X, control2Y;

    if (isHorizontal) {
      // Horizontal double curve - create S-shape
      const midX = start.x + (end.x - start.x) * 0.5;
      const curveDirection1 = start.y < end.y ? -1 : 1; // First curve opposite
      const curveDirection2 = start.y < end.y ? 1 : -1; // Second curve opposite to first

      control1X = start.x + (end.x - start.x) * 0.25;
      control1Y = start.y + curveDirection1 * controlOffset;
      control2X = start.x + (end.x - start.x) * 0.75;
      control2Y = end.y + curveDirection2 * controlOffset;
    } else {
      // Vertical double curve - create S-shape
      const midY = start.y + (end.y - start.y) * 0.5;
      const curveDirection1 = start.x < end.x ? -1 : 1; // First curve opposite
      const curveDirection2 = start.x < end.x ? 1 : -1; // Second curve opposite to first

      control1X = start.x + curveDirection1 * controlOffset;
      control1Y = start.y + (end.y - start.y) * 0.25;
      control2X = end.x + curveDirection2 * controlOffset;
      control2Y = start.y + (end.y - start.y) * 0.75;
    }

    const svgPath = `M ${start.x} ${start.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${end.x} ${end.y}`;

    console.log("Generated double curve bezier path:", {
      start,
      end,
      control1: { x: control1X, y: control1Y },
      control2: { x: control2X, y: control2Y },
      svgPath,
      distance,
      isHorizontal,
      controlOffset,
    });

    return svgPath;
  };

  // Handle mouse down for drag start
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "edit") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickRadius = 15;

    // Check if clicking on main project location
    if (mainProjectLocation.coords.x > 0 && mainProjectLocation.coords.y > 0) {
      const distance = Math.sqrt(
        Math.pow(x - mainProjectLocation.coords.x, 2) +
          Math.pow(y - mainProjectLocation.coords.y, 2)
      );
      if (distance <= clickRadius) {
        setIsDragging(true);
        setDragType("mainProject");
        setDragOffset({
          x: x - mainProjectLocation.coords.x,
          y: y - mainProjectLocation.coords.y,
        });
        return;
      }
    }

    // Check if clicking on gateway locations
    categories.forEach((category, categoryIndex) => {
      category.locations.forEach((location, locationIndex) => {
        const pixelCoords = {
          x: (parseFloat(location.coords.left.replace("%", "")) / 100) * 800,
          y: (parseFloat(location.coords.top.replace("%", "")) / 100) * 600,
        };

        const distance = Math.sqrt(
          Math.pow(x - pixelCoords.x, 2) + Math.pow(y - pixelCoords.y, 2)
        );

        if (distance <= clickRadius) {
          setIsDragging(true);
          setDragType("gatewayLocation");
          setDragIndex(categoryIndex * 1000 + locationIndex); // Unique index
          setDragOffset({
            x: x - pixelCoords.x,
            y: y - pixelCoords.y,
          });
          return;
        }
      });
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || mode !== "edit") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - dragOffset.x;
    const y = event.clientY - rect.top - dragOffset.y;

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(800, x));
    const constrainedY = Math.max(0, Math.min(600, y));

    if (dragType === "mainProject") {
      setMainProjectLocation((prev) => ({
        ...prev,
        coords: { x: constrainedX, y: constrainedY },
      }));
    } else if (dragType === "gatewayLocation") {
      const categoryIndex = Math.floor(dragIndex / 1000);
      const locationIndex = dragIndex % 1000;

      setCategories((prev) =>
        prev.map((category, catIdx) => {
          if (catIdx === categoryIndex) {
            return {
              ...category,
              locations: category.locations.map((location, locIdx) => {
                if (locIdx === locationIndex) {
                  const percentageCoords = pixelToPercentage(
                    { x: constrainedX, y: constrainedY },
                    { width: 800, height: 600 }
                  );
                  const updatedLocation = {
                    ...location,
                    coords: percentageCoords,
                    pixelCoords: { x: constrainedX, y: constrainedY },
                  };

                  // Update curve lines for this gateway location
                  updateCurveLinesForGatewayLocation(
                    category.title,
                    location.name,
                    constrainedX,
                    constrainedY,
                    mainProjectLocation.coords
                  );

                  return updatedLocation;
                }
                return location;
              }),
            };
          }
          return category;
        })
      );
    }

    // Redraw canvas during drag
    drawCanvas();
  };

  // Handle mouse up for drag end
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragType(null);
      setDragIndex(-1);
      setDragOffset({ x: 0, y: 0 });
      setHasUserMadeChanges(true);

      // Redraw canvas after drag
      setTimeout(() => {
        drawCanvas();
      }, 50);
    }
  };

  // Handle canvas clicks (for non-drag interactions)
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // If we just finished dragging, don't process click
    if (isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (mode === "addMainProject") {
      setEditingLocation({
        type: "mainProject",
        coords: { x, y },
      });
      setIsMetadataModalOpen(true);
    } else if (mode === "addGatewayLocation" && selectedCategory) {
      setEditingLocation({
        type: "gatewayLocation",
        coords: { x, y },
      });
      setIsMetadataModalOpen(true);
    } else if (mode === "edit" || mode === "view") {
      // Check if clicking on existing markers
      const clickRadius = 15; // Radius to detect clicks on markers

      // Check main project location
      if (
        mainProjectLocation.coords.x > 0 &&
        mainProjectLocation.coords.y > 0
      ) {
        const distance = Math.sqrt(
          Math.pow(x - mainProjectLocation.coords.x, 2) +
            Math.pow(y - mainProjectLocation.coords.y, 2)
        );
        if (distance <= clickRadius) {
          setEditingLocation({
            type: "mainProject",
            coords: mainProjectLocation.coords,
            data: mainProjectLocation,
          });
          setIsMetadataModalOpen(true);
          return;
        }
      }

      // Check gateway locations
      categories.forEach((category) => {
        category.locations.forEach((location) => {
          if (location.pixelCoords.x > 0 && location.pixelCoords.y > 0) {
            const distance = Math.sqrt(
              Math.pow(x - location.pixelCoords.x, 2) +
                Math.pow(y - location.pixelCoords.y, 2)
            );
            if (distance <= clickRadius) {
              setEditingLocation({
                type: "gatewayLocation",
                coords: location.pixelCoords,
                data: location,
              });
              setIsMetadataModalOpen(true);
              return;
            }
          }
        });
      });
    }
  };

  // Generate smooth bezier curve
  const generateSmoothCurve = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): string => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Control point 1: 1/3 along path, offset perpendicular
    const cp1x = start.x + dx * 0.33 + dy * 0.2;
    const cp1y = start.y + dy * 0.33 - dx * 0.2;

    // Control point 2: 2/3 along path, offset perpendicular
    const cp2x = start.x + dx * 0.66 - dy * 0.2;
    const cp2y = start.y + dy * 0.66 + dx * 0.2;

    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  };

  // Handle metadata form submission
  const handleMetadataSubmit = (formData: any) => {
    if (!editingLocation) return;

    // Mark that user has made changes
    setHasUserMadeChanges(true);

    // Map dimensions for coordinate conversion
    const mapDimensions: MapDimensions = { width: 800, height: 600 };

    if (editingLocation.type === "mainProject") {
      const newMainProject: MainProjectLocation = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        coords: editingLocation.coords!,
      };

      setMainProjectLocation(newMainProject);

      // Draw curves to existing gateway locations
      categories.forEach((category) => {
        category.locations.forEach((location) => {
          if (location.pixelCoords.x > 0 && location.pixelCoords.y > 0) {
            const svgPath = generateSmoothCurve(
              newMainProject.coords,
              location.pixelCoords
            );

            const curveId = `${category.title}-${location.name}-${Date.now()}`;
            const newCurve: CurveLine = {
              id: curveId,
              categoryId: category.title,
              locationId: location.name,
              svgPath,
              color: curveSettings.color,
              thickness: curveSettings.thickness,
              dashPattern: getDashPattern(curveSettings.lineStyle),
            };

            setCurveLines((prev) => [...prev, newCurve]);
          }
        });
      });
    } else if (editingLocation.type === "gatewayLocation") {
      // Convert pixel coordinates to percentage coordinates
      const percentageCoords = pixelToPercentage(
        editingLocation.coords!,
        mapDimensions
      );

      const newLocation: GatewayLocation = {
        name: formData.name,
        image: formData.image,
        coords: percentageCoords,
        icon: formData.icon,
        pixelCoords: editingLocation.coords!,
        categoryId: selectedCategory || "",
      };

      // Update categories
      setCategories((prev) => {
        const updated = prev.map((cat) => {
          if (cat.title === selectedCategory) {
            // Check if we're editing an existing location
            if (editingLocation.data) {
              // Update existing location
              return {
                ...cat,
                locations: cat.locations.map((loc) =>
                  loc.pixelCoords.x === editingLocation.coords!.x &&
                  loc.pixelCoords.y === editingLocation.coords!.y
                    ? newLocation
                    : loc
                ),
              };
            } else {
              // Add new location
              return {
                ...cat,
                locations: [...cat.locations, newLocation],
              };
            }
          }
          return cat;
        });
        return updated;
      });

      // Draw curve from main project to new location
      if (
        mainProjectLocation.coords.x > 0 &&
        mainProjectLocation.coords.y > 0
      ) {
        const svgPath = generateSmoothCurve(
          mainProjectLocation.coords,
          newLocation.pixelCoords
        );

        const curveId = `${selectedCategory}-${newLocation.name}-${Date.now()}`;
        const newCurve: CurveLine = {
          id: curveId,
          categoryId: selectedCategory,
          locationId: newLocation.name,
          svgPath,
          color: curveSettings.color,
          thickness: curveSettings.thickness,
          dashPattern: getDashPattern(curveSettings.lineStyle),
        };

        setCurveLines((prev) => [...prev, newCurve]);
      }
    }

    setIsMetadataModalOpen(false);
    setEditingLocation(null);
    setMode("view");

    // Redraw canvas to show the new/updated location
    setTimeout(() => {
      console.log("Redrawing canvas after metadata submit...");
      console.log("Current state:", {
        mainProjectLocation,
        categoriesCount: categories.length,
        curveLinesCount: curveLines.length,
        hasUserMadeChanges,
      });
      console.log("Main project location coords:", mainProjectLocation.coords);
      console.log(
        "Should draw main project:",
        mainProjectLocation.coords.x > 0 && mainProjectLocation.coords.y > 0
      );
      drawCanvas();
    }, 100);
  };

  // Save map configuration
  const handleSave = () => {
    console.log(
      "HandleSave called with main project location:",
      mainProjectLocation
    );

    // Validate that we have a main project location
    if (
      mainProjectLocation.coords.x <= 0 ||
      mainProjectLocation.coords.y <= 0
    ) {
      toast.error("Please add a main project location first");
      return;
    }

    // Note: Categories with locations are optional - user can save just the main project location
    console.log(
      "Validation passed - main project location exists:",
      mainProjectLocation
    );

    // Automatically regenerate all curve lines with current algorithm before saving
    const updatedCurveLines = curveLines.map((curve) => {
      const category = categories.find((cat) => cat.title === curve.categoryId);
      if (!category) return curve;
      const location = category.locations.find(
        (loc) => loc.name === curve.locationId
      );
      if (!location) return curve;

      const locationPixelCoords = {
        x: (parseFloat(location.coords.left.replace("%", "")) / 100) * 800,
        y: (parseFloat(location.coords.top.replace("%", "")) / 100) * 600,
      };

      const newSvgPath = generateBezierPath(
        mainProjectLocation.coords,
        locationPixelCoords
      );

      return { ...curve, svgPath: newSvgPath };
    });

    // Update curve lines with regenerated paths
    setCurveLines(updatedCurveLines);

    // Prepare the data to save with updated curve lines
    const mapData = {
      mainProjectLocation,
      curveLines: updatedCurveLines,
      categories,
    };

    console.log("Saving map data with regenerated curves:", mapData);

    // Call the onSave callback with the map data
    onSave(mapData);

    // Redraw the canvas to show updated data
    setTimeout(() => {
      console.log("Redrawing canvas after save...");
      console.log("Save state:", {
        mainProjectLocation,
        categoriesCount: categories.length,
        curveLinesCount: updatedCurveLines.length,
        hasUserMadeChanges,
      });
      drawCanvas();

      // Reset the flag AFTER the save is complete and canvas is redrawn
      setHasUserMadeChanges(false);
    }, 100);

    toast.success("Map configuration saved successfully with updated curves!");
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gateway Map Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Mode Selection */}
            <div className="flex items-center gap-2">
              <Label>Mode:</Label>
              <Select
                value={mode}
                onValueChange={(value: EditorMode) => setMode(value)}
              >
                <SelectTrigger className="w-40 font-poppins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-poppins">
                  <SelectItem value="view" className="cursor-pointer">
                    View
                  </SelectItem>
                  <SelectItem value="addMainProject">
                    Add Main Project
                  </SelectItem>
                  <SelectItem value="addGatewayLocation">
                    Add Gateway Location
                  </SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "addGatewayLocation" && (
              <div className="flex items-center gap-2">
                <Label>Category:</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.title} value={category.title}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Curve Settings */}
            <div className="flex items-center gap-2">
              <Label>Curve Color:</Label>
              <Input
                type="color"
                value={curveSettings.color}
                onChange={(e) =>
                  setCurveSettings((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
                className="w-16 h-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label>Thickness:</Label>
              <Slider
                value={[curveSettings.thickness]}
                onValueChange={([value]) =>
                  setCurveSettings((prev) => ({ ...prev, thickness: value }))
                }
                min={0.1}
                max={5}
                step={0.1}
                className="w-20"
              />
              <span className="text-sm">{curveSettings.thickness}px</span>
            </div>

            <div className="flex items-center gap-2">
              <Label>Line Style:</Label>
              <Select
                value={curveSettings.lineStyle}
                onValueChange={(value) =>
                  setCurveSettings((prev) => ({ ...prev, lineStyle: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="dash-dot">Dash-Dot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Manual canvas refresh triggered");
                  drawCanvas();
                }}
              >
                Refresh Canvas
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Map
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {mode === "addMainProject" &&
                "Click on the map to place the main project location"}
              {mode === "addGatewayLocation" &&
                "Select a category and click on the map to add gateway locations"}
              {mode === "view" && "View mode - click markers to select them"}
              {mode === "edit" &&
                "Edit mode - drag markers to reposition them or click to edit"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className={`border border-gray-300 rounded-lg shadow-sm ${
                mode === "edit" ? "cursor-move" : "cursor-crosshair"
              }`}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metadata Modal */}
      <Dialog open={isMetadataModalOpen} onOpenChange={setIsMetadataModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLocation?.type === "mainProject"
                ? "Main Project Location Details"
                : "Gateway Location Details"}
            </DialogTitle>
            <DialogDescription>
              {editingLocation?.type === "mainProject"
                ? "Add details for the main project location marker."
                : "Add details for the gateway location marker."}
            </DialogDescription>
          </DialogHeader>

          <MetadataForm
            type={editingLocation?.type || "mainProject"}
            onSubmit={handleMetadataSubmit}
            onCancel={() => {
              setIsMetadataModalOpen(false);
              setEditingLocation(null);
            }}
            existingData={editingLocation?.data}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Metadata Form Component
interface MetadataFormProps {
  type: "mainProject" | "gatewayLocation";
  onSubmit: (data: any) => void;
  onCancel: () => void;
  existingData?: any;
}

const MetadataForm: React.FC<MetadataFormProps> = ({
  type,
  onSubmit,
  onCancel,
  existingData,
}) => {
  const [formData, setFormData] = useState({
    title: existingData?.title || "",
    description: existingData?.description || "",
    icon: existingData?.icon || "/gateway-images/main-project-icon.svg",
    image: existingData?.image || "",
    name: existingData?.name || "",
  });

  // Update form data when existingData changes
  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title || "",
        description: existingData.description || "",
        icon: existingData.icon || "/gateway-images/main-project-icon.svg",
        image: existingData.image || "",
        name: existingData.name || "",
      });
    }
  }, [existingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent form submission
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "mainProject" ? (
        <>
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter project description"
              rows={3}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter location name"
              required
            />
          </div>

          <div>
            <Label>Location Image</Label>
            <MediaSelectButton
              value={formData.image}
              onSelect={(url) =>
                setFormData((prev) => ({ ...prev, image: url }))
              }
              mediaType="image"
              label="Select Location Image"
              placeholder="Select location image"
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="cursor-pointer bg-gray-300 hover:bg-gray-300/50 text-gray-800 hover:text-black"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="cursor-pointer bg-primary text-background"
        >
          Add Location
        </Button>
      </div>
    </form>
  );
};

export default GatewayMapEditor;
