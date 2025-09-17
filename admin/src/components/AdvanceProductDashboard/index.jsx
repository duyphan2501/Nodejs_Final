import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { useState, useMemo } from "react";
import dayjs from "dayjs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdvanceProductDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);

  const [data, setData] = useState([
    {
      order_id: 1,
      revenue: 1500000,
      profit: 450000,
      date_created: "2024-01-15",
    },
    {
      order_id: 2,
      revenue: 2300000,
      profit: 690000,
      date_created: "2024-01-20",
    },
    {
      order_id: 3,
      revenue: 1800000,
      profit: 540000,
      date_created: "2024-02-05",
    },
    {
      order_id: 4,
      revenue: 3200000,
      profit: 960000,
      date_created: "2024-02-12",
    },
    {
      order_id: 5,
      revenue: 2800000,
      profit: 840000,
      date_created: "2024-02-25",
    },
    {
      order_id: 6,
      revenue: 4100000,
      profit: 1230000,
      date_created: "2024-03-08",
    },
    {
      order_id: 7,
      revenue: 1900000,
      profit: 570000,
      date_created: "2024-03-15",
    },
    {
      order_id: 8,
      revenue: 3500000,
      profit: 1050000,
      date_created: "2024-03-22",
    },
    {
      order_id: 9,
      revenue: 2600000,
      profit: 780000,
      date_created: "2024-04-03",
    },
    {
      order_id: 10,
      revenue: 4500000,
      profit: 1350000,
      date_created: "2024-04-18",
    },
  ]);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [view, setView] = useState("week");

  const calculatorDataByView = useMemo(() => {
    const getWeekRange = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);

      const monday = new Date(date);
      monday.setDate(diff);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // tính số ngày từ đầu năm đến Monday
      const startOfYear = dayjs(new Date(monday.getFullYear(), 0, 1));
      const daysPassed = dayjs(monday).diff(startOfYear, "day") + 1; // +1 để tính inclusive
      const weekNumber = Math.ceil(daysPassed / 7);

      return {
        start: monday,
        end: sunday,
        key: `${monday.getFullYear()}-W${weekNumber}`,
      };
    };

    const formatDate = (date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const quarterDetection = (dateStr) => {
      const date = new Date(dateStr);
      const month = date.getMonth();
      switch (month) {
        case 0:
        case 1:
        case 2:
          return 1; // Q1
        case 3:
        case 4:
        case 5:
          return 2; // Q2
        case 6:
        case 7:
        case 8:
          return 3; // Q3
        case 9:
        case 10:
        case 11:
          return 4; // Q4
        default:
          return null;
      }
    };

    switch (view) {
      case "week":
        const weeklyData = {};

        data.forEach((item) => {
          const weekRange = getWeekRange(item.date_created);
          const weekKey = weekRange.key;

          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
              orders: 0,
              revenue: 0,
              profit: 0,
              startDate: weekRange.start,
              endDate: weekRange.end,
              dateRange: `${formatDate(weekRange.start)} - ${formatDate(
                weekRange.end
              )}`,
            };
          }

          console.log(item.order_id + " " + weekKey);
          weeklyData[weekKey].orders += 1;
          weeklyData[weekKey].revenue += item.revenue;
          weeklyData[weekKey].profit += item.profit;
        });

        return Object.values(weeklyData).sort(
          (a, b) => a.startDate - b.startDate
        );
      case "month":
        const monthlyData = {};
        data.forEach((item) => {
          const date = new Date(item.date_created);
          const month = date.getMonth();

          if (!monthlyData[month]) {
            monthlyData[month] = {
              orders: 0,
              revenue: 0,
              profit: 0,
              dateRange: `Tháng ${month + 1}`,
            };
          }

          monthlyData[month].orders += 1;
          monthlyData[month].revenue += item.revenue;
          monthlyData[month].profit += item.profit;
        });
        return Object.values(monthlyData);
      case "quarter":
        const quarterlyData = {};
        data.forEach((item) => {
          const quarter = quarterDetection(item.date_created);
          if (!quarterlyData[quarter]) {
            quarterlyData[quarter] = {
              orders: 0,
              revenue: 0,
              profit: 0,
              dateRange: `Quý ${quarter}`,
            };
          }

          quarterlyData[quarter].orders += 1;
          quarterlyData[quarter].revenue += item.revenue;
          quarterlyData[quarter].profit += item.profit;
        });
        return Object.values(quarterlyData);
    }
  }, [data, view]);

  return (
    <>
      <Box
        boxShadow={1}
        padding={2}
        sx={{ background: "white", borderRadius: "16" }}
      >
        <Typography variant="h6">Product Sale</Typography>

        <div className="flex gap-4">
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 mt-2">
          {/* <ResponsiveContainer
            width={"100%"}
            height={"100%"}
          ></ResponsiveContainer> */}
          <h1>Test {view}</h1>
          <pre>{JSON.stringify(calculatorDataByView, null, 2)}</pre>
        </div>
      </Box>
    </>
  );
}
