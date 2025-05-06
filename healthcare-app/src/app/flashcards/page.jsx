'use client';

import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import Flashcard from '@/components/Flashcards/Flashcard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [understood, setUnderstood] = useState([]);
  const [needReview, setNeedReview] = useState([]);
  const [activeCards, setActiveCards] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const MAX_CARDS = 10;
  const cardStackRef = useRef(null);

  // Fetch flashcards from API
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/flashcards');
        setFlashcards(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('Failed to fetch flashcards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  // Filter flashcards based on selected category and prepare active cards
  useEffect(() => {
    if (flashcards.length > 0) {
      const filtered = currentCategory === 'all'
        ? flashcards
        : flashcards.filter(card => card.category === currentCategory);
      
      // Limit to MAX_CARDS
      const initialCards = filtered.slice(0, MAX_CARDS);
      setActiveCards(initialCards);
      setCurrentIndex(0);
      setIsReviewMode(false);
      setCompleted(false);
      setUnderstood([]);
      setNeedReview([]);
    }
  }, [flashcards, currentCategory]);

  // Get unique categories for filter
  const categories = ['all', ...new Set(flashcards.map(card => card.category))];

  // Check if we need to switch to review mode or complete the session
  useEffect(() => {
    if (!isReviewMode && currentIndex >= activeCards.length && needReview.length > 0) {
      // Switch to review mode if there are cards to review
      setActiveCards([...needReview]);
      setCurrentIndex(0);
      setIsReviewMode(true);
      setNeedReview([]);
    } else if ((isReviewMode && currentIndex >= activeCards.length) || 
               (!isReviewMode && currentIndex >= activeCards.length && needReview.length === 0)) {
      // Complete the session when all cards are processed
      setCompleted(true);
    }
  }, [currentIndex, activeCards.length, needReview.length, isReviewMode]);

  // Handle swipe right (understood)
  const handleSwipeRight = () => {
    if (activeCards.length === 0 || currentIndex >= activeCards.length) return;
    
    const currentCard = activeCards[currentIndex];
    setUnderstood(prev => [...prev, currentCard]);
    setDirection('right');
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDirection('');
    }, 300);
  };

  // Handle swipe left (need review)
  const handleSwipeLeft = () => {
    if (activeCards.length === 0 || currentIndex >= activeCards.length) return;
    
    const currentCard = activeCards[currentIndex];
    setNeedReview(prev => [...prev, currentCard]);
    setDirection('left');
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDirection('');
    }, 300);
  };

  // Configure swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle category change
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    // The useEffect will handle resetting cards
  };
  
  // Reset the session
  const handleReset = () => {
    const filtered = currentCategory === 'all'
      ? flashcards
      : flashcards.filter(card => card.category === currentCategory);
    
    // Limit to MAX_CARDS
    const initialCards = filtered.slice(0, MAX_CARDS);
    setActiveCards(initialCards);
    setCurrentIndex(0);
    setIsReviewMode(false);
    setCompleted(false);
    setUnderstood([]);
    setNeedReview([]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Medical Flashcards</h1>

      {/* Swipe instructions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">How to use:</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <p className="text-gray-700">Swipe <span className="font-bold">LEFT</span> if you need to review again</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-700">Swipe <span className="font-bold">RIGHT</span> if you understand</p>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3 text-gray-700">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard display */}
      {completed ? (
        <div className="text-center p-8 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Session Complete!</h2>
          <p className="text-gray-700 mb-6">You've completed all flashcards in this session.</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start New Session
          </button>
        </div>
      ) : activeCards.length > 0 && currentIndex < activeCards.length ? (
        <div className="relative w-full max-w-md mx-auto h-80" ref={cardStackRef}>
          <div 
            {...swipeHandlers}
            className={`absolute w-full transition-transform duration-300 ${direction === 'left' ? '-translate-x-full opacity-0' : direction === 'right' ? 'translate-x-full opacity-0' : ''}`}
          >
            <Flashcard
              question={activeCards[currentIndex].question}
              answer={activeCards[currentIndex].answer}
              category={activeCards[currentIndex].category}
            />
          </div>
          
          {/* Session status */}
          <div className="mb-4 text-center">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {isReviewMode ? 'Review Mode' : 'Learning Mode'}
            </span>
          </div>
          
          {/* Swipe indicators */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2">
            <button 
              onClick={handleSwipeLeft}
              className="p-3 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-sm text-gray-500 self-center">
              {currentIndex + 1} of {Math.min(activeCards.length, MAX_CARDS)}
            </div>
            <button 
              onClick={handleSwipeRight}
              className="p-3 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No flashcards available for this category.</p>
        </div>
      )}

      {/* Progress summary */}
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Understood</h3>
          <p className="text-2xl font-bold text-green-600">{understood.length}</p>
          <p className="text-xs text-green-700 mt-1">out of {Math.min(flashcards.length, MAX_CARDS)}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Need Review</h3>
          <p className="text-2xl font-bold text-red-600">{needReview.length}</p>
          <p className="text-xs text-red-700 mt-1">{isReviewMode ? 'Currently reviewing' : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;