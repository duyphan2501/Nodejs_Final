import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DashboardCard } from "../../components/DashboardCard";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { Card, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import WelcomeSVG from "../../assets/welcome_back_board.svg";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownSharpIcon from "@mui/icons-material/TrendingDownSharp";
import { height, justifyContent } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdvanceOverallDashboard from "../../components/AdvanceOverallDashboard";
import AdvanceProductDashboard from "../../components/AdvanceProductDashboard";
import useUserStore from "../../../stores/useUserStore";
import useOrderStore from "../../../stores/useOrderStore";
import { useEffect } from "react";
import dayjs from "dayjs";
import useVisitStore from "../../../stores/useVisitStore";

function Home() {
  const getOrders = useOrderStore((s) => s.getOrders);
  const orders = useOrderStore((s) => s.orders);
  const getUsers = useUserStore((s) => s.getUsers);
  const users = useUserStore((s) => s.users);
  const visits = useVisitStore((s) => s.visits);
  const getDashboardData = useOrderStore((s) => s.getDashboardData);

  useEffect(() => {
    getOrders();
    getUsers();
    getDashboardData();
  }, []);

  const currentMonthVisits = visits
    .filter((v) => dayjs(v.date).isSame(dayjs(), "month"))
    .reduce((sum, v) => sum + v.visits, 0); // Cộng dồn trường visits

  const todayVisits = visits
    .filter((v) => dayjs(v.date).isSame(dayjs(), "day"))
    .reduce((sum, v) => sum + v.visits, 0); // Cộng dồn trường visits

  return (
    <>
      <Box sx={{ background: "#F9FAFB" }}>
        <Navbar active="home" />

        <Container
          disableGutters
          sx={{
            paddingLeft: "38px",
            paddingRight: "64px",
          }}
        >
          <Box mt={3}>
            <Typography variant="body1" color="text.primary">
              OVERVIEW
            </Typography>
            <Typography variant="h4" fontSize={26} fontWeight={500}>
              Dashboard
            </Typography>
          </Box>

          <Grid mt={3} container spacing={2} height={"100%"}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <WelcomeBoard />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TrendingUserBoard />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="green"
                  CardHeader={`${orders.length} Đơn Hàng`}
                  CardDesc={`${
                    orders.filter((o) => o.status === "pending").length
                  } chờ xử lý`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="red"
                  CardHeader={`${users.length} Người Dùng`}
                  CardDesc={`${
                    users.filter((u) =>
                      dayjs(u.createdAt).isSame(dayjs(), "day")
                    ).length
                  } được tạo hôm nay`}
                  icon={PermIdentityOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="#4F200D"
                  CardHeader={`${currentMonthVisits} Truy Cập`}
                  CardDesc={`${todayVisits} truy cập hôm nay`}
                  icon={AdsClickOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="gray"
                  CardHeader={`${orders.length} Đơn Hàng`}
                  CardDesc={`${
                    orders.filter((o) => o.status === "delivered").length
                  } đã giao`}
                  icon={AttachMoneyOutlinedIcon}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={3}>
            <AdvanceOverallDashboard />
          </Box>

          <Box mt={3} mb={3}>
            <AdvanceProductDashboard />
          </Box>
        </Container>
      </Box>
    </>
  );
}

function WelcomeBoard({
  description = "You have 5 new messages and 2 new notifications.",
  todayAmount = "6,782",
  todayPercent = "7%",
  todayRise = true,
  growPercent = "78,4%",
  growDifference = "-1%",
  growRise = false,
}) {
  const user = useUserStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const dashboard = useOrderStore((s) => s.dashboard);

  return (
    <Card sx={{ width: "100%" }}>
      <Grid padding={2} borderRadius={40} container>
        <Grid
          size={{ xs: 6 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6" fontWeight={500}>
            Chào mừng, {user?.name}
          </Typography>
          <Typography variant="body2">
            Bạn có {orders.filter((o) => o.status === "pending").length} đơn
            hàng đang chờ xử lý và{" "}
            {orders.filter((o) => o.status === "cancelled").length} hóa đơn bị
            hủy
          </Typography>

          <Box flexGrow={1}></Box>

          <Box mt={10} display={"flex"} gap={3}>
            <Box>
              <Typography variant="body2">GROWTH RATE</Typography>
              <Box
                padding={0}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
              >
                <Typography
                  sx={{ padding: 0 }}
                  padding={0}
                  variant="h6"
                  fontWeight={500}
                >
                  {`${dashboard?.growthDataMonth?.rate.toFixed(2)}%` || "0%"}
                </Typography>
                {dashboard?.growthDataMonth?.variance ? (
                  <Typography
                    sx={{ color: "#2FB344" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {dashboard?.growthDataMonth?.variance.toFixed(2) || "0%"}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "#D63939" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {dashboard?.growthDataMonth?.variance || "0%"}
                  </Typography>
                )}

                {dashboard?.growthDataMonth?.variance ? (
                  <TrendingUpOutlinedIcon sx={{ color: "#2FB344" }} />
                ) : (
                  <TrendingDownSharpIcon sx={{ color: "#D63939" }} />
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="body2">TODAY'S SALE</Typography>
              <Box
                padding={0}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
              >
                <Typography
                  sx={{ padding: 0 }}
                  padding={0}
                  variant="h6"
                  fontWeight={500}
                >
                  {`${dashboard?.growthDataDaily?.today.toLocaleString()}đ` ||
                    "0đ"}
                </Typography>
                {dashboard?.growthDataDaily?.variance > 0 ? (
                  <Typography
                    sx={{ color: "#2FB344" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {`${dashboard?.growthDataDaily?.variance}%` || "0%"}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "#D63939" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {`${dashboard?.growthDataDaily?.variance}%` || "0%"}
                  </Typography>
                )}

                {dashboard?.growthDataDaily?.variance > 0 ? (
                  <TrendingUpOutlinedIcon sx={{ color: "#2FB344" }} />
                ) : (
                  <TrendingDownSharpIcon sx={{ color: "#D63939" }} />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <img width={"100%"} height={"100%"} src={WelcomeSVG} alt="" />
        </Grid>
      </Grid>
    </Card>
  );
}

function TrendingUserBoard() {
  const visits = useVisitStore((s) => s.visits);
  const loading = useVisitStore((s) => s.loading);
  const getVisits = useVisitStore((s) => s.getVisits);

  // const visits = [
  //   { date: "2024-07-21", visits: 1250 },
  //   { date: "2024-07-22", visits: 1340 },
  //   { date: "2024-07-23", visits: 1420 },
  //   { date: "2024-07-24", visits: 1380 },
  //   { date: "2024-07-25", visits: 1465 },
  //   { date: "2024-07-26", visits: 1290 },
  //   { date: "2024-07-27", visits: 980 },
  //   { date: "2024-07-28", visits: 1180 },
  //   { date: "2024-07-29", visits: 1520 },
  //   { date: "2024-07-30", visits: 1680 },
  //   { date: "2024-07-31", visits: 1590 },
  //   { date: "2024-08-01", visits: 1720 },
  //   { date: "2024-08-02", visits: 1390 },
  //   { date: "2024-08-03", visits: 1050 },
  //   { date: "2024-08-04", visits: 1180 },
  //   { date: "2024-08-05", visits: 1450 },
  //   { date: "2024-08-06", visits: 1520 },
  //   { date: "2024-08-07", visits: 1480 },
  //   { date: "2024-08-08", visits: 1640 },
  //   { date: "2024-08-09", visits: 1390 },
  //   { date: "2024-08-10", visits: 1120 },
  //   { date: "2024-08-11", visits: 1280 },
  //   { date: "2024-08-12", visits: 1580 },
  //   { date: "2024-08-13", visits: 1640 },
  //   { date: "2024-08-14", visits: 1720 },
  //   { date: "2024-08-15", visits: 1890 },
  //   { date: "2024-08-16", visits: 1450 },
  //   { date: "2024-08-17", visits: 1280 },
  //   { date: "2024-08-18", visits: 1380 },
  //   { date: "2024-08-19", visits: 1520 },
  //   { date: "2024-08-20", visits: 1680 },
  //   { date: "2024-08-21", visits: 1750 },
  //   { date: "2024-08-22", visits: 1820 },
  //   { date: "2024-08-23", visits: 1890 },
  //   { date: "2024-08-24", visits: 1650 },
  //   { date: "2024-08-25", visits: 1480 },
  //   { date: "2024-08-26", visits: 1580 },
  //   { date: "2024-08-27", visits: 1720 },
  //   { date: "2024-08-28", visits: 1850 },
  //   { date: "2024-08-29", visits: 1950 },
  //   { date: "2024-08-30", visits: 2120 },
  //   { date: "2024-08-31", visits: 2050 },
  //   { date: "2024-09-01", visits: 1890 },
  //   { date: "2024-09-02", visits: 1950 },
  //   { date: "2024-09-03", visits: 1820 },
  //   { date: "2024-09-04", visits: 1720 },
  //   { date: "2024-09-05", visits: 1680 },
  //   { date: "2024-09-06", visits: 1780 },
  //   { date: "2024-09-07", visits: 1850 },
  //   { date: "2024-09-08", visits: 1590 },
  //   { date: "2024-09-09", visits: 1720 },
  //   { date: "2024-09-10", visits: 1890 },
  //   { date: "2024-09-11", visits: 1950 },
  //   { date: "2024-09-12", visits: 2020 },
  //   { date: "2024-09-13", visits: 2180 },
  //   { date: "2024-09-14", visits: 1850 },
  //   { date: "2024-09-15", visits: 1680 },
  //   { date: "2024-09-16", visits: 1780 },
  //   { date: "2024-09-17", visits: 1920 },
  //   { date: "2024-09-18", visits: 2050 },
  //   { date: "2024-09-19", visits: 2180 },
  //   { date: "2024-09-20", visits: 2250 },
  // ];

  useEffect(() => {
    getVisits();
  }, []);

  const calculateCycleTotal = (data, startDate, endDate) => {
    const cycleData = data.filter((item) => {
      const date = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return date >= startDate && date <= endDate;
    });

    return cycleData.reduce((sum, item) => sum + item.visits, 0);
  };

  const startDate = visits.length > 0 ? new Date(visits[0].date) : new Date();
  const endDate =
    visits.length > 0 ? new Date(visits[visits.length - 1].date) : new Date();

  const middleMonth = startDate.getMonth(); // Tháng bắt đầu + 1
  const middleYear = startDate.getFullYear();

  const day20 = new Date(middleYear, middleMonth, 30); // Lưu ý: month = 0-indexed
  const day21 = new Date(middleYear, middleMonth + 1, 1);

  const totalPreviousMonth = calculateCycleTotal(visits, startDate, day20);
  const totalAfterMonth = calculateCycleTotal(visits, day21, endDate);

  const formatWithSuffix = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${month} ${day}${suffix}`;
  };

  const transformedData = visits.map((item) => {
    const date = new Date(item.date);
    return {
      ...item,
      dayOnly: date.getDate(), // chỉ lấy ngày (1..31)
      formatted: formatWithSuffix(item.date), // hiển thị đẹp
    };
  });

  const transformCycleData = (visits) => {
    const cycle1 = visits.filter((d) => {
      const dt = new Date(d.date);
      return dt >= startDate && dt <= day20;
    });

    const cycle2 = visits.filter((d) => {
      const dt = new Date(d.date);
      return dt >= day21 && dt <= endDate;
    });

    const maxLen = Math.max(cycle1.length, cycle2.length);
    const result = [];

    for (let i = 0; i < maxLen; i++) {
      result.push({
        dayInCycle: i + 21 <= 31 ? i + 21 : i - 10, // 21→31 rồi 1→20
        visitsCycle1: cycle1[i] ? cycle1[i].visits : null,
        visitsCycle2: cycle2[i] ? cycle2[i].visits : null,
        labelCycle2: cycle2[i] ? formatWithSuffix(cycle2[i].date) : "",
      });
    }

    return result;
  };

  const chartData = transformCycleData(visits); // array

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          padding: 2,
        }}
      >
        <Typography color="#37415C" variant="subtitle2" fontWeight={300}>
          TOTAL USER
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography variant="h6" fontWeight={600}>
            {totalAfterMonth.toLocaleString("en-US")}
          </Typography>
          {(totalAfterMonth / totalPreviousMonth) * 100 - 100 < 0 ? (
            <>
              <Typography variant="subtitle2" fontWeight={300} color="#D63939">
                -
                {Math.abs(
                  (totalAfterMonth / totalPreviousMonth) * 100 - 100
                ).toFixed(2)}
                %
              </Typography>
              <TrendingDownSharpIcon sx={{ color: "#D63939" }} />
            </>
          ) : (
            <>
              <Typography variant="subtitle2" fontWeight={300} color="#2FB344">
                {((totalAfterMonth / totalPreviousMonth) * 100 - 100).toFixed(
                  2
                )}
                %
              </Typography>
              <TrendingUpOutlinedIcon sx={{ color: "#2FB344" }} />
            </>
          )}
        </Box>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="labelCycle2" />
            <YAxis tick={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visitsCycle2"
              name="Tháng này"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="visitsCycle1"
              name="Tháng trước"
              stroke="#D63939"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

export default Home;
