"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_mkHigh from "@amcharts/amcharts5-geodata/northMacedoniaHigh";
import RegionCard from "@/components/ui/region-card";

interface MacedoniaMapProps {
  visitedRegions: Set<string>;
  onRegionToggle: (regionCode: string, isVisited: boolean) => void;
  regions?: Array<{
    id: number;
    code: string;
    name: string;
    image?: string | null;
    images?: string[] | null;
    description?: string | null;
    shortDescription?: string | null;
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
  const polygonSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const mkPatternRef = useRef<am5.PicturePattern | null>(null);

  // Store visited regions in a ref to access current value in event handlers
  const visitedRegionsRef = useRef<Set<string>>(visitedRegions);

  const onRegionToggleRef = useRef(onRegionToggle);

  // Keep regions in a ref so amCharts event handlers can read latest data without re-init
  const regionsRef = useRef<MacedoniaMapProps["regions"]>(regions);
  const regionsByNameRef = useRef<
    Map<string, NonNullable<MacedoniaMapProps["regions"]>[number]>
  >(new Map());

  const [hoveredRegion, setHoveredRegion] = useState<{
    name: string;
    image?: string | null;
    images?: string[] | null;
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
    onRegionToggleRef.current = onRegionToggle;
  }, [onRegionToggle]);

  useEffect(() => {
    regionsRef.current = regions;
    const next = new Map<
      string,
      NonNullable<MacedoniaMapProps["regions"]>[number]
    >();
    for (const region of regions) {
      next.set(region.name.trim().toLowerCase(), region);
    }
    regionsByNameRef.current = next;
  }, [regions]);

  const extractRegionName = useCallback(
    (dataItem: am5map.IMapPolygonSeriesDataItem): string | null => {
      const context = (dataItem as { dataContext?: Record<string, unknown> })
        .dataContext;
      if (!context || typeof context !== "object") return null;

      if (typeof context.name === "string") return context.name;

      const properties = context.properties as
        | Record<string, unknown>
        | undefined;
      if (properties && typeof properties.name === "string")
        return properties.name;

      if (typeof context.id === "string") return context.id;

      return null;
    },
    []
  );

  const syncVisitedStyles = useCallback(() => {
    const polygonSeries = polygonSeriesRef.current;
    const pattern = mkPatternRef.current;
    if (!polygonSeries || !pattern) return;

    polygonSeries.mapPolygons.each((polygon) => {
      const dataItem = polygon.dataItem as
        | am5map.IMapPolygonSeriesDataItem
        | undefined;
      if (!dataItem) return;

      const regionName = extractRegionName(dataItem);
      if (!regionName) return;

      const normalized = regionName.trim().toLowerCase();
      const region = regionsByNameRef.current.get(normalized);
      if (!region) return;

      if (visitedRegionsRef.current.has(region.code)) {
        polygon.set("fillPattern", pattern);
      } else {
        polygon.set("fill", am5.color(0x8ab7ff));
        polygon.set("fillPattern", undefined);
      }
    });
  }, [extractRegionName]);

  useEffect(() => {
    if (!chartDivRef.current) return;

    // Already initialized (can happen with re-renders) — don't recreate the map.
    if (chartRef.current) return;

    // Create root element
    const root = am5.Root.new(chartDivRef.current);
    chartRef.current = root;

    // Reusable visited pattern (avoid creating new am5 objects per polygon)
    mkPatternRef.current = am5.PicturePattern.new(root, {
      src: "/images/mkd.png",
      width: 100,
      height: 100,
      centered: true,
    });

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
    polygonSeriesRef.current = polygonSeries;

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
      const dataItem = ev.target.dataItem as
        | am5map.IMapPolygonSeriesDataItem
        | undefined;

      if (!dataItem) {
        setHoveredRegion(null);
        return;
      }

      const regionName = extractRegionName(dataItem);
      if (!regionName) {
        setHoveredRegion(null);
        return;
      }

      const normalized = regionName.trim().toLowerCase();
      // Match by name (normalized region name from geodata)
      const regionData = regionsByNameRef.current.get(normalized);

      // Get pointer position relative to the chart container
      const originalEvent = ev.originalEvent as PointerEvent | MouseEvent | undefined;
      const chartDiv = chartDivRef.current;
      
      let x = 0;
      let y = 0;
      
      if (originalEvent && chartDiv) {
        const rect = chartDiv.getBoundingClientRect();
        x = originalEvent.clientX - rect.left;
        y = originalEvent.clientY - rect.top;
      } else {
        // Fallback to ev.point if original event is not available
        const point = ev.point ?? { x: 0, y: 0 };
        x = point.x;
        y = point.y;
      }

      setHoveredRegion({
        name: regionData?.name ?? regionName,
        image: regionData?.image ?? null,
        images: regionData?.images ?? null,
        description: regionData?.shortDescription ?? null,
        placesToVisit: regionData?.placesToVisit ?? null,
        x,
        y,
      });
    });

    // Hide card when mouse leaves
    polygonSeries.mapPolygons.template.events.on("pointerout", function () {
      setHoveredRegion(null);
    });

    // Click event for "scratching" regions - update polygon directly
    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target.dataItem as
        | am5map.IMapPolygonSeriesDataItem
        | undefined;
      if (!dataItem) return;

      const polygon = ev.target;

      // Use the same extraction logic as hover
      const regionName = extractRegionName(dataItem);
      if (!regionName) return;

      const normalized = regionName.trim().toLowerCase();
      const region = regionsByNameRef.current.get(normalized);

      if (!region) {
        console.warn(`Region not found in database: ${regionName}`);
        return;
      }

      const regionCode = region.code;
      const isCurrentlyVisited = visitedRegionsRef.current.has(regionCode);

      if (isCurrentlyVisited) {
        // Unmark as visited - update polygon directly
        polygon.set("fill", am5.color(0x8ab7ff));
        polygon.set("fillPattern", undefined);
      } else {
        // Mark as visited - update polygon directly with reusable pattern
        const pattern = mkPatternRef.current;
        if (pattern) polygon.set("fillPattern", pattern);
      }

      // Notify parent of state change
      onRegionToggleRef.current(regionCode, !isCurrentlyVisited);
    });

    // Initial render of visited state after series is ready
    polygonSeries.events.on("datavalidated", () => {
      syncVisitedStyles();
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
      polygonSeriesRef.current = null;
      mkPatternRef.current = null;
    };
  }, [extractRegionName, syncVisitedStyles]);

  // Keep map polygons in sync when data changes (without recreating the map)
  useEffect(() => {
    syncVisitedStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions, visitedRegions]);

  return (
    <div className="relative" style={{ zIndex: 1 }}>
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
          className="pointer-events-none fixed"
          style={{
            left: hoveredRegion.x + 20,
            top: hoveredRegion.y - 100,
            zIndex: 9999,
          }}
        >
          <RegionCard region={hoveredRegion} />
        </div>
      )}
    </div>
  );
}
