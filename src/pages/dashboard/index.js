import React, { useCallback, useState } from "react";
import axios from "axios";
// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// project import
import OrdersTable from "./OrdersTable";
import IncomeAreaChart from "./IncomeAreaChart";
import MonthlyBarChart from "./MonthlyBarChart";
import SalesColumnChart from "./SalesColumnChart";
import MainCard from "components/MainCard";
import AnalyticEcommerce from "components/cards/statistics/AnalyticEcommerce";

// assets
import {
  GiftOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import avatar1 from "assets/images/users/avatar-1.png";
import avatar2 from "assets/images/users/avatar-2.png";
import avatar3 from "assets/images/users/avatar-3.png";
import avatar4 from "assets/images/users/avatar-4.png";
import Access from "./Access";

// avatar style

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// sales report status
const status = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];
const roleAttributes = [
  {
    read: "true",
    attributename: "dashboard",
    write: "true",
  },

  {
    read: "false",
    attributename: "stats",
    write: "true",
  },

  {
    read: "false",
    attributename: "recentOrders",
    write: "true",
  },
  {
    read: "false",
    attributename: "salesReport",
    write: "true",
  },
  {
    read: "true",
    attributename: "trades",
    write: "true",
  },
  {
    read: "true",
    attributename: "transactionHistory",
    write: "true",
  },
  {
    read: "true",
    attributename: "profit",
    write: "true",
  },
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const storedData = sessionStorage.getItem("attributeData");
  const initialData = storedData
    ? JSON.parse(storedData)?.assignedAttributes
    : [];
  const [menuItems, setMenuItems] = React.useState(initialData);
  console.log({ menuItems });
  console.log("menuItems:", menuItems);
  console.log("Initial data:", initialData);

  const [value, setValue] = useState("today");
  const [slot, setSlot] = useState("week");

  const hasDashboardAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Dashboard" && attribute.read === "true"
    );
  console.log("hasDashboardAccess", hasDashboardAccess);
  const hasStatsAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Stats" && attribute.read === "true"
    );
  const hasTradeAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Trades" && attribute.read === "true"
    );
  const hasRecentAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Recent Orders" && attribute.read === "true"
    );
  const hasSalesAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Sales Report" && attribute.read === "true"
    );
  const hasTransactionAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Transaction History" &&
        attribute.read === "true"
    );
  const hasProfitAccess =
    menuItems &&
    menuItems?.some(
      (attribute) =>
        attribute.attributename === "Profit" && attribute.read === "true"
    );

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const [userId, setUserId] = useState(
    sessionStorage.getItem("userId") ?? null
  );
  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId") ?? null
  );
  console.log({ code });
  const fetchData = useCallback(async (codeValue) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/oidc/getToken?code=${codeValue}&clientId=${process.env.REACT_APP_OIDC_CLIENT_ID}`,
        {},
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
          },
        }
      );
      console.log({ data: response.data });
      if (response.data?.resultData) {
        const data = JSON.parse(response.data?.resultData);
        setUserId(data?.userid);
        setAccountId(data?.accountid);
        sessionStorage.setItem("userId", data?.userid);
        sessionStorage.setItem("accountId", data?.accountid);
        await getRbacResources(data?.userid, data?.accountid);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, []);
  const [prevCode, setPrevCode] = useState('');

  React.useLayoutEffect(() => {
    if (code && code?.length > 0 && code !== prevCode) {
      setPrevCode(code);
      // fetchData(code);
    }
  }, [code, fetchData]);
  const getRbacResources = async (userId, accountId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/rbacController/getAllAttributesForRole?appId=${process.env.REACT_APP_APPLICATION_ID}&userId=${userId}&accountid=${accountId}`,
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
          },
        }
      );
      console.log("getAllAttributesForRole:", response?.data);
      setMenuItems(response.data?.resultData?.assignedAttributes);
      sessionStorage.setItem(
        "attributeData",
        JSON.stringify(response.data?.resultData)
      );
    } catch (error) {
      console.log("Error fetching attributes for role:", error);
    }
  };

  console.log("Rendering...");
  return (
    <>
      {hasDashboardAccess ? (
        <>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">Dashboard</Typography>
            </Grid>
            {hasStatsAccess ? (
              <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <AnalyticEcommerce
                    title="Total Order Placed"
                    count="30"
                    percentage={5.3}
                    extra="3"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <AnalyticEcommerce
                    title="Today's Profit"
                    count="7008"
                    percentage={30.5}
                    extra="3000"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <AnalyticEcommerce
                    title="Succesfull Order"
                    count="20"
                    percentage={27.4}
                    extra="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <AnalyticEcommerce
                    title="Net Loss"
                    count="$1000"
                    percentage={27.4}
                    isLoss
                    color="warning"
                    extra="$500"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                  <Access />
                </Grid>
              </>
            )}

            <Grid
              item
              md={8}
              sx={{ display: { sm: "none", md: "block", lg: "none" } }}
            />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={8}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">Trades</Typography>
                </Grid>

                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={0}>
                    <Button
                      size="small"
                      onClick={() => setSlot("month")}
                      color={slot === "month" ? "primary" : "secondary"}
                      variant={slot === "month" ? "outlined" : "text"}
                    >
                      Month
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSlot("week")}
                      color={slot === "week" ? "primary" : "secondary"}
                      variant={slot === "week" ? "outlined" : "text"}
                    >
                      Week
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {hasTradeAccess ? (
                <>
                  <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <IncomeAreaChart slot={slot} />
                    </Box>
                  </MainCard>
                </>
              ) : (
                <Access />
              )}
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">Profit</Typography>
                </Grid>
                <Grid item />
              </Grid>
              {hasProfitAccess ? (
                <>
                  <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <Stack spacing={2}>
                        <Typography variant="h6" color="textSecondary">
                          This Week Statistics
                        </Typography>
                        <Typography variant="h3">$7,650</Typography>
                      </Stack>
                    </Box>
                    <MonthlyBarChart />
                  </MainCard>
                </>
              ) : (
                <Access />
              )}
            </Grid>

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">Recent Orders</Typography>
                </Grid>

                <Grid item />
              </Grid>
              {hasRecentAccess ? (
                <MainCard sx={{ mt: 2 }} content={false}>
                  <OrdersTable />
                </MainCard>
              ) : (
                <Access />
              )}
            </Grid>

            {/* row 4 */}
            <Grid item xs={12} md={7} lg={8}>
              <Grid item>
                <Typography variant="h5">Sales Report</Typography>
              </Grid>
              {hasSalesAccess ? (
                <>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <TextField
                        id="standard-select-currency"
                        size="small"
                        select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        sx={{
                          "& .MuiInputBase-input": {
                            py: 0.5,
                            fontSize: "0.875rem",
                          },
                        }}
                      >
                        {status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <MainCard sx={{ mt: 1.75 }}>
                    <Stack spacing={1.5} sx={{ mb: -12 }}>
                      <Typography variant="h6" color="secondary">
                        Net Profit
                      </Typography>
                      <Typography variant="h4">$1560</Typography>
                    </Stack>
                    <SalesColumnChart />
                  </MainCard>
                </>
              ) : (
                <Access />
              )}
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">Transaction History</Typography>
                </Grid>
                <Grid item />
              </Grid>

              {hasTransactionAccess ? (
                <>
                  <MainCard sx={{ mt: 2 }} content={false}>
                    <List
                      component="nav"
                      sx={{
                        px: 0,
                        py: 0,
                        "& .MuiListItemButton-root": {
                          py: 1.5,
                          "& .MuiAvatar-root": avatarSX,
                          "& .MuiListItemSecondaryAction-root": {
                            ...actionSX,
                            position: "relative",
                          },
                        },
                      }}
                    >
                      <ListItemButton divider>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              color: "success.main",
                              bgcolor: "success.lighter",
                            }}
                          >
                            <GiftOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Order #002434
                            </Typography>
                          }
                          secondary="Today, 2:00 AM"
                        />
                        <ListItemSecondaryAction>
                          <Stack alignItems="flex-end">
                            <Typography variant="subtitle1" noWrap>
                              + $1,430
                            </Typography>
                            <Typography variant="h6" color="secondary" noWrap>
                              78%
                            </Typography>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                      <ListItemButton divider>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              color: "primary.main",
                              bgcolor: "primary.lighter",
                            }}
                          >
                            <MessageOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Order #984947
                            </Typography>
                          }
                          secondary="5 August, 1:45 PM"
                        />
                        <ListItemSecondaryAction>
                          <Stack alignItems="flex-end">
                            <Typography variant="subtitle1" noWrap>
                              + $302
                            </Typography>
                            <Typography variant="h6" color="secondary" noWrap>
                              8%
                            </Typography>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              color: "error.main",
                              bgcolor: "error.lighter",
                            }}
                          >
                            <SettingOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Order #988784
                            </Typography>
                          }
                          secondary="7 hours ago"
                        />
                        <ListItemSecondaryAction>
                          <Stack alignItems="flex-end">
                            <Typography variant="subtitle1" noWrap>
                              + $682
                            </Typography>
                            <Typography variant="h6" color="secondary" noWrap>
                              16%
                            </Typography>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    </List>
                  </MainCard>
                </>
              ) : (
                <Access />
              )}
              <MainCard sx={{ mt: 2 }}>
                <Stack spacing={3}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Stack>
                        <Typography variant="h5" noWrap>
                          Help & Support Chat
                        </Typography>
                        <Typography variant="caption" color="secondary" noWrap>
                          Typical replay within 5 min
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item>
                      <AvatarGroup
                        sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
                      >
                        <Avatar alt="Remy Sharp" src={avatar1} />
                        <Avatar alt="Travis Howard" src={avatar2} />
                        <Avatar alt="Cindy Baker" src={avatar3} />
                        <Avatar alt="Agnes Walker" src={avatar4} />
                      </AvatarGroup>
                    </Grid>
                  </Grid>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Need Help?
                  </Button>
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <h1>You do not have access</h1>
        </>
      )}
    </>
  );
};

export default DashboardDefault;
