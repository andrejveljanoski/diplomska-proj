"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_mkHigh from "@amcharts/amcharts5-geodata/northMacedoniaHigh";
import RegionCard from "@/components/ui/region-card";

interface MacedoniaMapProps {
  visitedRegions: Set<string>;
  onRegionToggle: (regionId: string, isVisited: boolean) => void;
  regions?: Array<{
    id: number;
    name: string;
    image?: string | null;
    description?: string | null;
    placesToVisit?: string | null;
  }>;
}

export default function MacedoniaMap({
  visitedRegions,
  onRegionToggle,
  regions = [],
}: MacedoniaMapProps) {
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);
  // Store visited regions in a ref to access current value in event handlers
  const visitedRegionsRef = useRef<Set<string>>(visitedRegions);

  const [hoveredRegion, setHoveredRegion] = useState<{
    name: string;
    image?: string | null;
    description?: string | null;
    placesToVisit?: string | null;
    x: number;
    y: number;
  } | null>(null);

  // Keep ref in sync with prop
  useEffect(() => {
    visitedRegionsRef.current = visitedRegions;
  }, [visitedRegions]);

  useEffect(() => {
    if (!chartDivRef.current) return;
    // Dispose of existing chart if any
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    // Create root element
    const root = am5.Root.new(chartDivRef.current);
    chartRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        maxZoomLevel: 1,
        minZoomLevel: 1,
        maxPanOut: 0, // Prevents panning outside the map bounds
      })
    );

    // Create polygon series for regions
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_mkHigh,
        valueField: "value",
      })
    );

    // Configure polygon appearance
    polygonSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0x8ab7ff),
      strokeWidth: 1,
      stroke: am5.color(0xffffff),
    });

    // Hover state
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xd4af37), // Gold color on hover
    });

    // Hover event for showing region card
    polygonSeries.mapPolygons.template.events.on("pointerover", function (ev) {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regionName = (dataItem as any).get("name") as string;

        // Find matching region data
        const regionData = regions.find(
          (r) => r.name.toLowerCase() === regionName.toLowerCase()
        );

        if (regionData && chartDivRef.current) {
          const rect = chartDivRef.current.getBoundingClientRect();
          const point = ev.point;

          setHoveredRegion({
            name: regionData.name,
            image: regionData.image,
            description: regionData.description,
            placesToVisit: regionData.placesToVisit,
            x: point.x,
            y: point.y,
          });
        }
      }
    });

    // Hide card when mouse leaves
    polygonSeries.mapPolygons.template.events.on("pointerout", function () {
      setHoveredRegion(null);
    });

    // Click event for "scratching" regions - update polygon directly
    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const polygon = ev.target;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regionId = (dataItem as any).get("id") as string;
        const isCurrentlyVisited = visitedRegionsRef.current.has(regionId);

        if (isCurrentlyVisited) {
          // Unmark as visited - update polygon directly
          polygon.set("fill", am5.color(0x8ab7ff));
          polygon.set("fillPattern", undefined);
        } else {
          // Mark as visited - update polygon directly with pattern
          polygon.set(
            "fillPattern",
            am5.PicturePattern.new(root, {
              src: "/images/mkd.png",
              width: 100,
              height: 100,
              centered: true,
            })
          );
        }

        // Notify parent of state change
        onRegionToggle(regionId, !isCurrentlyVisited);
      }
    });

    // Initial render of visited state after series is ready
    polygonSeries.events.once("datavalidated", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const dataItem = polygon.dataItem;
        if (dataItem) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const regionId = (dataItem as any).get("id") as string;
          if (visitedRegionsRef.current.has(regionId)) {
            polygon.set(
              "fillPattern",
              am5.PicturePattern.new(root, {
                src: "/images/mkd.png",
                width: 100,
                height: 100,
                centered: true,
              })
            );
          }
        }
      });
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions]);

  return (
    <div className="relative">
      <div
        ref={chartDivRef}
        className="rounded-lg"
        style={{
          width: "100%",
          height: "500px",
        }}
      />

      {hoveredRegion && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: hoveredRegion.x + 20,
            top: hoveredRegion.y - 100,
          }}
        >
          <RegionCard region={hoveredRegion} />
        </div>
      )}
    </div>
  );
}
