'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizQuestion from './QuizQuestion'; // Renamed to .jsx
import LoadingSpinner from '../ui/LoadingSpinner';
import QuizResult from './QuizResult'; // Renamed to .jsx

// Removed QuizQuestionType interface
// Removed UserAnswer interface

const QuizComponent = () => {
  // Removed type annotations from state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNextButton, setShowNextButton] = useState(false);

  // Fetch quiz questions from API
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/quiz');
        setQuestions(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setError('Failed to fetch quiz questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(questions.map(q => q.category))];

  // Filter questions based on selected category
  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  // Handle starting the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setShowNextButton(false);
  };

  // Handle answer selection
  // Removed type annotation from selectedAnswer
  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Store user's answer
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect
      }
    ]);
    
    setShowNextButton(true);
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowNextButton(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Handle category change
  // Removed type annotation from category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setQuizStarted(false); // Reset quiz state when category changes
    setQuizCompleted(false);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
  };

  // Handle restarting the quiz
  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
    // Optionally, re-filter or re-fetch if questions change frequently
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple refresh, could fetch again
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show quiz results when completed
  if (quizCompleted) {
    return (
      <QuizResult
        userAnswers={userAnswers}
        questions={filteredQuestions}
        onRestartQuiz={handleRestartQuiz}
      />
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Medical Knowledge Quiz</h1>

      {/* Category selection */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3 text-gray-700">Select Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz container */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        {!quizStarted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Ready to test your medical knowledge?
            </h2>
            <p className="text-gray-600 mb-6">
              This quiz contains {filteredQuestions.length} questions about {selectedCategory === 'all' ? 'various medical topics' : selectedCategory}.
            </p>
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={filteredQuestions.length === 0}
            >
              {filteredQuestions.length === 0 ? 'No questions available' : 'Start Quiz'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </div>
              <div className="text-sm font-medium text-blue-600">
                Score: {userAnswers.filter(a => a.isCorrect).length} / {userAnswers.length}
              </div>
            </div>

            <QuizQuestion
              question={filteredQuestions[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              userAnswer={userAnswers.find(answer => answer.questionId === filteredQuestions[currentQuestionIndex].id)}
            />

            {showNextButton && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent; 