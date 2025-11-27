"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_mkHigh from "@amcharts/amcharts5-geodata/northMacedoniaHigh";

export default function MacedoniaMap() {
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);

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
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0x8ab7ff),
      strokeWidth: 1,
      stroke: am5.color(0xffffff),
    });

    // Hover state
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xd4af37), // Gold color on hover
    });

    // Track visited state
    const visitedRegions = new Set<string>();

    // Click event for "scratching" regions
    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const polygon = ev.target;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regionId = (dataItem as any).get("id") as string;

        if (visitedRegions.has(regionId)) {
          // Unmark as visited
          visitedRegions.delete(regionId);
          polygon.set("fill", am5.color(0x8ab7ff));
          polygon.setAll({ fillPattern: undefined });
        } else {
          // Mark as visited (image pattern)
          visitedRegions.add(regionId);
          polygon.setAll({
            fillPattern: am5.PicturePattern.new(root, {
              src: "/images/mkd.png",
              width: 100,
              height: 100,
              centered: true,
            }),
          });
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartDivRef}
      className="rounded-lg"
      style={{
        width: "100%",
        height: "500px",
      }}
    />
  );
}
