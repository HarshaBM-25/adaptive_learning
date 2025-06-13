import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedModules: 0,
    averageScore: 0,
    timeSpent: 0,
    progressData: [],
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API endpoint
        const response = await axios.get('http://localhost:8000/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Modules
              </Typography>
              <Typography variant="h3">
                {stats.completedModules}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h3">
                {stats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Time Spent
              </Typography>
              <Typography variant="h3">
                {Math.round(stats.timeSpent / 60)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    name="Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="timeSpent"
                    stroke="#82ca9d"
                    name="Time Spent (minutes)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Grid container spacing={2}>
              {stats.recentActivity?.map((activity, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{activity.title}</Typography>
                      <Typography color="textSecondary">
                        {activity.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        Continue
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 