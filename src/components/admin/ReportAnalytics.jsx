// ReportAnalytics.jsx

import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
} from "@mui/material";
import { adminAPI } from "../../services/api";

const ReportAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (message) => {
    alert(message);
  };
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getDownloadStats();

      setStats(response.data);
    } catch (error) {
      showNotification("Error fetching download stats", "error");

      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // No Data State
  if (!stats) {
    return <Typography>No data found</Typography>;
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today Downloads</Typography>

              <Typography variant="h4">{stats.todayCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Weekly Downloads</Typography>

              <Typography variant="h4">{stats.weeklyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Monthly Downloads</Typography>

              <Typography variant="h4">{stats.monthlyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Yearly Downloads</Typography>

              <Typography variant="h4">{stats.yearlyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TABLE */}

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Latest Downloads
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Report Type</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Downloaded At</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stats.latestDownloads.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.userName}</TableCell>

                  <TableCell>{item.reportType}</TableCell>

                  <TableCell>{item.fileName}</TableCell>

                  <TableCell>
                    {new Date(item.downloadedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportAnalytics;
