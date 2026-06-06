"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Loading } from "../loading";
import { toast } from "sonner";

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

export function ChartGraphic({ periode }: { periode: string }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stats?period=${periode}`);
        if (!res.ok)
          toast.error("Gagal mengambil data grafik, silakan memuat ulang", {
            className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
            position: "top-right",
          });
        const data = await res.json();
        setChartData(data.chart_data);
      } catch (err) {
        toast.error("Gagal mengambil data grafik, silakan memuat ulang", {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [periode]);

  if (loading) return <Loading />;

  const isEmpty = chartData.every(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) => d.lost === 0 && d.found === 0 && d.done === 0,
  );
  if (isEmpty)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-center text-body text-cream-darker">Tidak ada laporan dalam 7 hari terakhir</p>
      </div>
    );

  return (
    <ChartContainer config={chartConfig} className="font-jakarta">
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
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
