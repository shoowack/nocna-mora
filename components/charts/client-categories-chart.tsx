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
import { useMemo } from "react";
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
  const chartData = data.map((category) => ({
    category: category.categoryName,
    videoCount: category.videoCount,
    fill: `hsl(var(--chart-${
      category.categoryName
        .toLowerCase()
        .normalize("NFD") // Normalize to decompose diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
    }))`,
  }));

  const totalVideos = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.videoCount, 0),
    [chartData]
  );

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
                        const getCategoryText = (count: number) => {
                          const lastDigit = count % 10;
                          const lastTwoDigits = count % 100;

                          if (lastDigit === 1 && lastTwoDigits !== 11) {
                            return "Kategorija";
                          } else if (
                            [2, 3, 4].includes(lastDigit) &&
                            ![12, 13, 14].includes(lastTwoDigits)
                          ) {
                            return "Kategorije";
                          } else {
                            return "Kategorija";
                          }
                        };

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
                              {totalVideos.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-red-500"
                            >
                              {getCategoryText(totalVideos)}
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
