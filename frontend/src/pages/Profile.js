import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  School,
  Timeline,
  Star,
  AccessTime,
} from '@mui/icons-material';
import axios from 'axios';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    learningStyle: '',
    proficiencyLevel: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile');
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          learningStyle: response.data.learningStyle,
          proficiencyLevel: response.data.proficiencyLevel,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8000/api/profile', formData);
      setEditMode(false);
      // Refresh profile data
      const response = await axios.get('http://localhost:8000/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

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
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {profile.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<School />}
                  label={profile.proficiencyLevel}
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<Timeline />}
                  label={profile.learningStyle}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Statistics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>
                    Average Score: {profile.averageScore}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>
                    Total Learning Time: {Math.round(profile.totalTimeSpent / 60)}h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                {editMode ? 'Edit Profile' : 'Profile Information'}
              </Typography>
              <Button
                variant={editMode ? 'outlined' : 'contained'}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Learning Style"
                      value={formData.learningStyle}
                      onChange={(e) =>
                        setFormData({ ...formData, learningStyle: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Proficiency Level"
                      value={formData.proficiencyLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          proficiencyLevel: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{profile.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{profile.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Learning Style
                  </Typography>
                  <Typography variant="body1">{profile.learningStyle}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Proficiency Level
                  </Typography>
                  <Typography variant="body1">
                    {profile.proficiencyLevel}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {profile.recentActivity?.map((activity, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{activity.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </Typography>
                {index < profile.recentActivity.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile; 