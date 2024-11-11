"use client";

import * as React from "react";
// import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Container } from "@/components/container";

export const description = "A donut chart with text";

type CategoryChartData = {
  categoryName: string;
  videoCount: number;
};

export const ClientCategoriesChart = ({
  data,
}: {
  data: CategoryChartData[];
}) => {
  if (!data.length) {
    return null;
  }

  const chartData = data.map((category, index) => {
    // Use index to generate somewhat unique hue for each category
    const hue = (Math.floor(Math.random() * 350) + index * 30) % 360;
    const saturation = 70 + Math.random() * 20;
    const lightness = 50 + Math.random() * 30;

    return {
      category: category.categoryName,
      videoCount: category.videoCount,
      fill: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    };
  });

  return (
    <div className="bg-stone-100">
      <Container>
        <div className="flex flex-col justify-center">
          <div className="pb-0">
            <h4 className="flex justify-center text-xl font-bold">
              Analiza kategorija videozapisa
            </h4>
            <div className="flex justify-center">
              Broj videozapisa po kategoriji
            </div>
          </div>
          <div className="flex-1 pb-0">
            <ChartContainer
              config={{
                visitors: { label: "Videos" },
                ...chartData.reduce((acc, curr) => {
                  acc[curr.category] = {
                    label: curr.category,
                  };

                  return acc;
                }, {} as ChartConfig),
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="videoCount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {data.length}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-stone-500"
                            >
                              Kategorija
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          {/* <div className="flex flex-col gap-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2 font-medium leading-none ">
            Trending up by 5.2% this month <TrendingUp className="size-4" />
          </div>
          <div className="flex justify-center leading-none text-red-500 ">
            Showing total visitors for the last 6 months
          </div>
        </div> */}
        </div>
      </Container>
    </div>
  );
};
