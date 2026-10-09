"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactIDR, formatIDR, formatNumber } from "@/lib/format";

const COLORS = [
  "#3366ff",
  "#1f47e6",
  "#598dff",
  "#8eb6ff",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

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
            <stop offset="5%" stopColor="#3366ff" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
          tickFormatter={(v) => formatCompactIDR(Number(v))}
          width={80}
        />
        <Tooltip
          formatter={(v) => formatIDR(Number(v))}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3366ff"
          strokeWidth={2}
          fill="url(#rev)"
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
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickFormatter={(v) => formatCompactIDR(Number(v))}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          width={150}
        />
        <Tooltip
          formatter={(v) => formatIDR(Number(v))}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
        />
        <Bar dataKey="revenue" fill="#3366ff" radius={[0, 6, 6, 0]} />
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
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => formatIDR(Number(v))}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
        />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickFormatter={(v) => formatNumber(Number(v))}
        />
        <Tooltip
          formatter={(v) => formatNumber(Number(v))}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
        />
        <Bar dataKey="qty" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
