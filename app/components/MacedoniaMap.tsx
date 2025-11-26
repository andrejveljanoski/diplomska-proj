"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_mkHigh from "@amcharts/amcharts5-geodata/northMacedoniaHigh";

// Use useLayoutEffect on client, useEffect on server (avoids hydration warning)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function MacedoniaMap() {
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
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
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoMercator(),
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

    // Click event for "scratching" regions
    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const polygon = ev.target;
        // Toggle visited state
        const currentFill = polygon.get("fill");
        if (currentFill?.toString() === am5.color(0x4caf50).toString()) {
          // Unmark as visited
          polygon.set("fill", am5.color(0x8ab7ff));
        } else {
          // Mark as visited (green)
          polygon.set("fill", am5.color(0x4caf50));
        }
      }
    });

    // Add zoom control
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

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
