import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow,
  Book,
  Quiz,
} from '@mui/icons-material';
import axios from 'axios';

function Content() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/content');
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/content?query=${searchQuery}`);
      setContent(response.data);
    } catch (error) {
      console.error('Error searching content:', error);
    }
  };

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setDialogOpen(true);
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayArrow />;
      case 'text':
        return <Book />;
      case 'quiz':
        return <Quiz />;
      default:
        return <Book />;
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
        Learning Content
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {content.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.thumbnail && (
                <CardMedia
                  component="img"
                  height="140"
                  image={item.thumbnail}
                  alt={item.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {item.description}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    icon={getContentIcon(item.type)}
                    label={item.type}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={item.difficulty}
                    size="small"
                    color="primary"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleContentClick(item)}
                >
                  View Content
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle>{selectedContent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedContent.description}
              </Typography>
              {selectedContent.content && (
                <Box sx={{ mt: 2 }}>
                  {selectedContent.type === 'video' && (
                    <video
                      controls
                      width="100%"
                      src={selectedContent.content}
                    />
                  )}
                  {selectedContent.type === 'text' && (
                    <Typography variant="body1">
                      {selectedContent.content}
                    </Typography>
                  )}
                  {selectedContent.type === 'quiz' && (
                    <Box>
                      {/* Quiz component would go here */}
                      <Typography variant="body1">
                        Quiz content will be displayed here
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // Handle starting the content
                  setDialogOpen(false);
                }}
              >
                Start Learning
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Content; 