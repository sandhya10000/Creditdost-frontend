import React from "react";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Recharts lives in this module only, so the admin home loads it on demand.

export const MonthlyRevenueChart = ({ items }) => (
  <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={items.map((item) => ({
          month: new Date(
            item._id.year,
            item._id.month - 1,
            1,
          ).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),
          revenue: item.revenue,
        }))}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis
          tickFormatter={(value) =>
            value >= 1000
              ? `₹${(value / 1000).toFixed(0)}k`
              : `₹${value}`
          }
        />

        <Tooltip
          formatter={(value) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Revenue",
          ]}
        />

        <Legend />

        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="#6200ea"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
);

export const YearlyRevenueChart = ({ items }) => (
  <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={items.map((item) => ({
          year: String(item._id),
          revenue: item.revenue,
        }))}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="year" />

        <YAxis
          tickFormatter={(value) =>
            value >= 1000
              ? `₹${(value / 1000).toFixed(0)}k`
              : `₹${value}`
          }
        />

        <Tooltip
          formatter={(value) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Revenue",
          ]}
        />

        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="#4caf50"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
);

export const PerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
      {" "}
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          strokeOpacity={0.3}
        />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            value >= 1000
              ? `${(value / 1000).toFixed(1)}k`
              : value
          }
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "revenue") {
              return [
                `₹${Number(value).toLocaleString()}`,
                "Revenue",
              ];
            }
            return [
              value,
              name === "leads" ? "Leads" : "Franchises",
            ];
          }}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #eee",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#6200ea"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke="#03dac6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="franchises"
          name="New Franchises"
          stroke="#ff4081"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
);
