"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "January", hilang: 186, temuan: 100, selesai: 50 },
  { month: "February", hilang: 305, temuan: 200, selesai: 4 },
  { month: "March", hilang: 237, temuan: 120, selesai: 1 },
  { month: "April", hilang: 73, temuan: 300, selesai: 10 },
  { month: "May", hilang: 209, temuan: 260, selesai: 90 },
  { month: "June", hilang: 214, temuan: 140, selesai: 8 },
];

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
  return (
    <ChartContainer config={chartConfig} className="font-jakarta">
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
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
        <Area dataKey="hilang" type="linear" fill="url(#fillhilang)" fillOpacity={0.4} stroke="#FF6467" stackId="a" />
        <Area dataKey="temuan" type="linear" fill="url(#filltemuan)" fillOpacity={0.4} stroke="#FCC800" stackId="b" />
        <Area dataKey="selesai" type="linear" fill="url(#fillselesai)" fillOpacity={0.4} stroke="#05DF72" stackId="c" />
      </AreaChart>
    </ChartContainer>
  );
}
