"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig = {
  hilang: {
    label: "Hilang",
    color: "#FF6467",
  },
  temuan: {
    label: "Temuan",
    color: "#FCC800",
  },
  selesai: {
    label: "Selesai",
    color: "#05DF72",
  },
} satisfies ChartConfig;

export function ChartGraphic() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {setChartData(data.chart_data); 
      })
      .catch((err) => console.error("Gagal load reports:", err));
  }, []);

  return (
    <ChartContainer config={chartConfig} className="font-jakarta">
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} 
        tickFormatter={(value) => value.slice(0, 3)
        } />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} domain={["auto", "auto"]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillhilang" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6467" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF6467" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="filltemuan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCC800" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FCC800" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillselesai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#05DF72" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#05DF72" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area dataKey="lost" type="linear" fill="url(#fillhilang)" fillOpacity={0.4} stroke="#FF6467" stackId="a" />
        <Area dataKey="found" type="linear" fill="url(#filltemuan)" fillOpacity={0.4} stroke="#FCC800" stackId="b" />
        <Area dataKey="done" type="linear" fill="url(#fillselesai)" fillOpacity={0.4} stroke="#05DF72" stackId="c" />
      </AreaChart>
    </ChartContainer>
  );
}
