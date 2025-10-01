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

function Home() {
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
                  CardHeader="100 Orders"
                  CardDesc="10 is waiting"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="red"
                  CardHeader="100 Users"
                  CardDesc="10 is new"
                  icon={PermIdentityOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="#4F200D"
                  CardHeader="20 Access today"
                  CardDesc="2 is online"
                  icon={AdsClickOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                  BackgroundColor="gray"
                  CardHeader="100 Orders"
                  CardDesc="10 is waiting"
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
  return (
    <Card sx={{ width: "100%" }}>
      <Grid padding={2} borderRadius={40} container>
        <Grid
          size={{ xs: 6 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6" fontWeight={500}>
            Welcome back, Admin
          </Typography>
          <Typography variant="body2">{description}</Typography>

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
                  {growPercent}
                </Typography>
                {growRise ? (
                  <Typography
                    sx={{ color: "#2FB344" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {growDifference}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "#D63939" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {growDifference}
                  </Typography>
                )}

                {growRise ? (
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
                  {todayAmount}
                </Typography>
                {todayRise ? (
                  <Typography
                    sx={{ color: "#2FB344" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {todayPercent}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "#D63939" }}
                    padding={0}
                    variant="body2"
                    fontWeight={500}
                  >
                    {todayPercent}
                  </Typography>
                )}

                {todayRise ? (
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
  const sampleData = [
    { date: "2024-07-21", visits: 1250 },
    { date: "2024-07-22", visits: 1340 },
    { date: "2024-07-23", visits: 1420 },
    { date: "2024-07-24", visits: 1380 },
    { date: "2024-07-25", visits: 1465 },
    { date: "2024-07-26", visits: 1290 },
    { date: "2024-07-27", visits: 980 },
    { date: "2024-07-28", visits: 1180 },
    { date: "2024-07-29", visits: 1520 },
    { date: "2024-07-30", visits: 1680 },
    { date: "2024-07-31", visits: 1590 },
    { date: "2024-08-01", visits: 1720 },
    { date: "2024-08-02", visits: 1390 },
    { date: "2024-08-03", visits: 1050 },
    { date: "2024-08-04", visits: 1180 },
    { date: "2024-08-05", visits: 1450 },
    { date: "2024-08-06", visits: 1520 },
    { date: "2024-08-07", visits: 1480 },
    { date: "2024-08-08", visits: 1640 },
    { date: "2024-08-09", visits: 1390 },
    { date: "2024-08-10", visits: 1120 },
    { date: "2024-08-11", visits: 1280 },
    { date: "2024-08-12", visits: 1580 },
    { date: "2024-08-13", visits: 1640 },
    { date: "2024-08-14", visits: 1720 },
    { date: "2024-08-15", visits: 1890 },
    { date: "2024-08-16", visits: 1450 },
    { date: "2024-08-17", visits: 1280 },
    { date: "2024-08-18", visits: 1380 },
    { date: "2024-08-19", visits: 1520 },
    { date: "2024-08-20", visits: 1680 },
    { date: "2024-08-21", visits: 1750 },
    { date: "2024-08-22", visits: 1820 },
    { date: "2024-08-23", visits: 1890 },
    { date: "2024-08-24", visits: 1650 },
    { date: "2024-08-25", visits: 1480 },
    { date: "2024-08-26", visits: 1580 },
    { date: "2024-08-27", visits: 1720 },
    { date: "2024-08-28", visits: 1850 },
    { date: "2024-08-29", visits: 1950 },
    { date: "2024-08-30", visits: 2120 },
    { date: "2024-08-31", visits: 2050 },
    { date: "2024-09-01", visits: 1890 },
    { date: "2024-09-02", visits: 1950 },
    { date: "2024-09-03", visits: 1820 },
    { date: "2024-09-04", visits: 1720 },
    { date: "2024-09-05", visits: 1680 },
    { date: "2024-09-06", visits: 1780 },
    { date: "2024-09-07", visits: 1850 },
    { date: "2024-09-08", visits: 1590 },
    { date: "2024-09-09", visits: 1720 },
    { date: "2024-09-10", visits: 1890 },
    { date: "2024-09-11", visits: 1950 },
    { date: "2024-09-12", visits: 2020 },
    { date: "2024-09-13", visits: 2180 },
    { date: "2024-09-14", visits: 1850 },
    { date: "2024-09-15", visits: 1680 },
    { date: "2024-09-16", visits: 1780 },
    { date: "2024-09-17", visits: 1920 },
    { date: "2024-09-18", visits: 2050 },
    { date: "2024-09-19", visits: 2180 },
    { date: "2024-09-20", visits: 2250 },
  ];

  const calculateCycleTotal = (data, startDate, endDate) => {
    const cycleData = data.filter((item) => {
      const date = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return date >= startDate && date <= endDate;
    });

    return cycleData.reduce((sum, item) => sum + item.visits, 0);
  };

  const startDate = new Date(sampleData[0].date);
  const endDate = new Date(sampleData[sampleData.length - 1].date);

  const middleMonth = startDate.getMonth() + 1; // Tháng bắt đầu + 1
  const middleYear = startDate.getFullYear();

  const day20 = new Date(middleYear, middleMonth, 20); // Lưu ý: month = 0-indexed
  const day21 = new Date(middleYear, middleMonth, 21);

  const totalPreviousMonth = calculateCycleTotal(sampleData, startDate, day20);
  const totalAfterMonth = calculateCycleTotal(sampleData, day21, endDate);

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

  const transformedData = sampleData.map((item) => {
    const date = new Date(item.date);
    return {
      ...item,
      dayOnly: date.getDate(), // chỉ lấy ngày (1..31)
      formatted: formatWithSuffix(item.date), // hiển thị đẹp
    };
  });

  const transformCycleData = (sampleData) => {
    const cycle1 = sampleData.filter((d) => {
      const dt = new Date(d.date);
      return dt >= startDate && dt <= day20;
    });

    const cycle2 = sampleData.filter((d) => {
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

  const chartData = transformCycleData(sampleData); // array

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
              dataKey="visitsCycle1"
              name="Tháng này"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="visitsCycle2"
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
