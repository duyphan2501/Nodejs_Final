import { Box, capitalize } from "@mui/material";
import { Typography } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
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
import { style } from "@mui/system";

export default function AdvanceOverallDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);

  const [data, setData] = useState([
    {
      order_id: 1,
      revenue: 1500000,
      profit: 450000,
      date_created: "2025-01-15",
    },
    {
      order_id: 2,
      revenue: 2300000,
      profit: 690000,
      date_created: "2025-01-19",
    },
    {
      order_id: 3,
      revenue: 1800000,
      profit: 540000,
      date_created: "2025-01-19",
    },
    {
      order_id: 4,
      revenue: 3200000,
      profit: 960000,
      date_created: "2025-02-12",
    },
    {
      order_id: 5,
      revenue: 2800000,
      profit: 840000,
      date_created: "2025-02-25",
    },
    {
      order_id: 6,
      revenue: 4100000,
      profit: 1230000,
      date_created: "2025-03-08",
    },
    {
      order_id: 7,
      revenue: 1900000,
      profit: 570000,
      date_created: "2025-03-15",
    },
    {
      order_id: 8,
      revenue: 3500000,
      profit: 1050000,
      date_created: "2025-03-22",
    },
    {
      order_id: 9,
      revenue: 2600000,
      profit: 780000,
      date_created: "2025-04-03",
    },
    {
      order_id: 10,
      revenue: 4500000,
      profit: 1350000,
      date_created: "2025-04-18",
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

          if (
            new Date(item.date_created) >= startDate &&
            new Date(item.date_created) <= endDate
          ) {
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

            weeklyData[weekKey].orders += 1;
            weeklyData[weekKey].revenue += item.revenue;
            weeklyData[weekKey].profit += item.profit;
          }
        });

        return Object.values(weeklyData).sort(
          (a, b) => a.startDate - b.startDate
        );
      case "month":
        const monthlyData = {};
        data.forEach((item) => {
          const date = new Date(item.date_created);
          const month = date.getMonth();

          if (
            new Date(item.date_created) >= startDate &&
            new Date(item.date_created) <= endDate
          ) {
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
          }
        });
        return Object.values(monthlyData);
      case "quarter":
        const quarterlyData = {};

        data.forEach((item) => {
          const quarter = quarterDetection(item.date_created);

          if (
            new Date(item.date_created) >= startDate &&
            new Date(item.date_created) <= endDate
          ) {
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
          }
        });

        return Object.values(quarterlyData);
    }
  }, [data, view, startDate, endDate]);

  return (
    <>
      <Box
        boxShadow={1}
        padding={2}
        sx={{ background: "white", borderRadius: "10px" }}
      >
        <Typography variant="h6" textTransform={"capitalize"} mb={2}>
          Bảng dữ liệu tổng quát
        </Typography>

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={dayjs(startDate).format("YYYY-MM-DD")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={dayjs(endDate).format("YYYY-MM-DD")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 mt-2 flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculatorDataByView}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateRange" hide={true} />
              <YAxis yAxisId="left" orientation="left" allowDecimals={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${Math.round(value / 1000)}k VND`}
              />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="Đơn hàng"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#82ca9d"
                name="Doanh thu"
              />
              <Bar
                yAxisId="right"
                dataKey="profit"
                fill="#ffee00"
                name="Lợi nhuận"
              />

              <Tooltip
                formatter={(value, name) => {
                  if (name === "Doanh thu" || name === "Lợi nhuận") {
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(value);
                  }
                  return value; // giữ nguyên giá trị cho các cột khác
                }}
              />
            </BarChart>
          </ResponsiveContainer>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(event) => {
              setView(event.target.value);
            }}
            aria-label="Chọn kiểu xem"
          >
            <ToggleButton value="week" aria-label="Tuần">
              Tuần
            </ToggleButton>
            <ToggleButton value="month" aria-label="Tháng">
              Tháng
            </ToggleButton>
            <ToggleButton value="quarter" aria-label="Quý">
              Quý
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Box>
    </>
  );
}
