import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";

// Recharts lives in this module only, so the partner dashboard loads it on demand.

const EmptyChart = ({ message }) => (
  <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Credit scores of the latest reports, oldest first
export const ScoreTrendChart = ({ data }) => {
  if (!data.length) return <EmptyChart message="Scores appear here after your first credit report" />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis domain={[300, 900]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={36} />
        <Tooltip formatter={(value) => [value, "Score"]} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6200ea"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#6200ea", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Used against available, for credits and AI reports
export const UsageChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={6}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={36} allowDecimals={false} />
      <Tooltip />
      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      <Bar dataKey="used" name="Used" fill="#6200ea" radius={[6, 6, 0, 0]} maxBarSize={44} />
      <Bar dataKey="available" name="Available" fill="#d9dce3" radius={[6, 6, 0, 0]} maxBarSize={44} />
    </BarChart>
  </ResponsiveContainer>
);
