import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

function Assessment() {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/assessment');
        setAssessment(response.data);
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/assessment/submit', {
        assessmentId: assessment.id,
        answers,
      });
      setScore(response.data.score);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!assessment) {
    return (
      <Alert severity="error">
        No assessment available at the moment.
      </Alert>
    );
  }

  if (submitted) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Assessment Results
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Score: {score}%
            </Typography>
            <Typography variant="body1" paragraph>
              {score >= 70
                ? 'Congratulations! You have passed the assessment.'
                : 'You need to review the material and try again.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSubmitted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setScore(null);
              }}
            >
              Retake Assessment
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assessment
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1 }}
          />
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend">
            <Typography variant="h6" gutterBottom>
              {question.text}
            </Typography>
          </FormLabel>
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion === assessment.questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {assessment.questions.map((q, index) => (
          <Grid item xs={2} key={q.id}>
            <Button
              variant={answers[q.id] ? 'contained' : 'outlined'}
              color={answers[q.id] ? 'primary' : 'default'}
              onClick={() => setCurrentQuestion(index)}
              fullWidth
            >
              {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Assessment; 