import { Card, CardContent, Box, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

export default function DashboardCard({
  BackgroundColor = "blue",
  icon: Icon = ShoppingCartOutlinedIcon,
  CardHeader = "132 Likes",
  CardDesc = "21 today",
}) {
  return (
    <>
      <Card
        sx={{
          background: "white",
          width: "100%",
          padding: "16px",
          display: "flex",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            padding: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: BackgroundColor,
            borderRadius: "8px",
            marginRight: 2,
          }}
        >
          <Icon sx={{ width: 25, height: 25, color: "white" }} />
        </Box>

        <Box
          sx={{
            maxHeight: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontWeight={500} mb={0}>
            {CardHeader}
          </Typography>
          <Typography>{CardDesc}</Typography>
        </Box>
      </Card>
    </>
  );
}
