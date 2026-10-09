"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactIDR, formatIDR, formatNumber } from "@/lib/format";

const BRAND = "#e60026";
const COLORS = [
  "#e60026",
  "#f2584c",
  "#ff9daa",
  "#a3001b",
  "#86061c",
  "#78716c",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
];

const tooltipStyle = {
  borderRadius: 12,
  borderColor: "var(--color-border)",
  background: "var(--color-surface)",
  color: "var(--color-foreground)",
  fontSize: 12,
} as const;

export function Sparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={BRAND}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendAreaChart({
  data,
}: {
  data: { label: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={BRAND} stopOpacity={0.35} />
            <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
          tickFormatter={(v) => formatCompactIDR(Number(v))}
          width={80}
        />
        <Tooltip formatter={(v) => formatIDR(Number(v))} contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={BRAND}
          strokeWidth={2}
          fill="url(#rev)"
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RankBarChart({
  data,
}: {
  data: { label: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
          tickFormatter={(v) => formatCompactIDR(Number(v))}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
          width={150}
        />
        <Tooltip formatter={(v) => formatIDR(Number(v))} contentStyle={tooltipStyle} />
        <Bar
          dataKey="revenue"
          fill={BRAND}
          radius={[0, 6, 6, 0]}
          animationDuration={700}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonut({
  data,
}: {
  data: { label: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="label"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          animationDuration={700}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatIDR(Number(v))} contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function QtyBarChart({
  data,
}: {
  data: { label: string; qty: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          stroke="var(--color-border)"
          tickFormatter={(v) => formatNumber(Number(v))}
        />
        <Tooltip formatter={(v) => formatNumber(Number(v))} contentStyle={tooltipStyle} />
        <Bar
          dataKey="qty"
          fill={BRAND}
          radius={[6, 6, 0, 0]}
          animationDuration={700}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

