'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard'; // Renamed to .jsx
import LoadingSpinner from '../ui/LoadingSpinner';

// Removed FlashcardType interface

const FlashcardContainer = () => {
  // Removed type annotations from state
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Filter flashcards based on selected category
  const filteredFlashcards = currentCategory === 'all'
    ? flashcards
    : flashcards.filter(card => card.category === currentCategory);

  // Get unique categories for filter
  const categories = ['all', ...new Set(flashcards.map(card => card.category))];

  // Navigate to next flashcard
  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Navigate to previous flashcard
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle category change
  // Removed type annotation from category
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentIndex(0); // Reset to first card when changing category
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
    // ... rest of the component remains the same ...
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Medical Flashcards</h1>

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
      {filteredFlashcards.length === 0 ? (
        <p className="text-gray-600">No flashcards available for this category.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Flashcard
            question={filteredFlashcards[currentIndex].question}
            answer={filteredFlashcards[currentIndex].answer}
            category={filteredFlashcards[currentIndex].category}
          />

          {/* Navigation controls */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Previous
            </button>

            <div className="text-gray-600">
              {currentIndex + 1} of {filteredFlashcards.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredFlashcards.length - 1}
              className={`px-4 py-2 rounded-md ${
                currentIndex === filteredFlashcards.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardContainer; 