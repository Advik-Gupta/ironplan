"use client";

import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { muscles as allMuscles } from "@/utils/contants";
import { Split, DaySplit, MuscleEntry } from "@/interface";

// Utility function (used in next step)
const getColors = (count: number) => {
  const baseColors = [
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#a78bfa",
    "#fb7185",
    "#38bdf8",
    "#facc15",
  ];
  return Array.from(
    { length: count },
    (_, i) => baseColors[i % baseColors.length]
  );
};

export default function PieChart({ split }: { split: Split }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Get primary muscle group distribution (e.g., Chest, Back)
  const groupData = Object.entries(split).reduce(
    (acc: Record<string, number>, [_, dayData]: [string, DaySplit]) => {
      dayData.muscleGroups?.forEach((group: string) => {
        acc[group] = (acc[group] || 0) + 1;
      });
      return acc;
    },
    {}
  );

  const groupLabels = Object.keys(groupData);
  const groupValues = Object.values(groupData);
  const groupColors = getColors(groupLabels.length);

  const groupPie = {
    labels: groupLabels,
    datasets: [
      {
        data: groupValues,
        backgroundColor: groupColors,
      },
    ],
  };

  // Get muscle breakdown for selected group
  const muscleData = selectedGroup
    ? Object.values(split).flatMap((day: DaySplit) => {
        return Object.entries(day.muscles || {})
          .map(([name, val]: [string, MuscleEntry]) => {
            const muscleInfo = allMuscles.find((m) => m.name === name);
            if (muscleInfo?.group === selectedGroup) {
              return { name, sets: val.sets };
            }
            return null;
          })
          .filter((m): m is { name: string; sets: number } => m !== null);
      })
    : [];

  const muscleMap: Record<string, number> = {};
  muscleData.forEach(({ name, sets }) => {
    muscleMap[name] = (muscleMap[name] || 0) + sets;
  });

  const muscleLabels = Object.keys(muscleMap);
  const muscleValues = Object.values(muscleMap);
  const muscleColors = getColors(muscleLabels.length);

  const musclePie = {
    labels: muscleLabels,
    datasets: [
      {
        data: muscleValues,
        backgroundColor: muscleColors,
      },
    ],
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-6">
      {/* Main Pie Chart */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-[400px] h-[400px]">
          <Pie
            data={groupPie}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || "";
                      const value = context.raw || 0;
                      return `${label}: ${value} times`;
                    },
                  },
                },
              },
              onClick: (_, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  setSelectedGroup(groupLabels[index]);
                }
              },
            }}
          />
        </div>
      </div>

      {selectedGroup && (
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="w-[400px] h-[400px]">
            <Pie
              data={musclePie}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  title: {
                    display: true,
                    text: selectedGroup + " Muscles",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value} sets`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
