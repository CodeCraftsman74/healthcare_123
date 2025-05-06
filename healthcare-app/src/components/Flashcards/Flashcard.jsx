'use client';

import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const Flashcard = ({ question, answer, category }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Reset swipe animation when component updates with new props
  useEffect(() => {
    setSwipeDirection(null);
    setIsFlipped(false);
  }, [question, answer]);

  // Configure swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setSwipeDirection('left'),
    onSwipedRight: () => setSwipeDirection('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div
      {...swipeHandlers}
      className={`w-full h-64 perspective-1000 cursor-pointer relative transition-transform duration-300 ${swipeDirection === 'left' ? '-translate-x-full opacity-0' : swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''}`}
      onClick={handleFlip}
    >
      {/* Swipe indicators - only visible on hover */}
      <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <div className="bg-red-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <div className="bg-green-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
      
      <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front side - Question */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-md p-6 flex flex-col">
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded self-start mb-4">
            {category}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-xl font-semibold text-center text-gray-800">{question}</h3>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">Click to reveal answer</div>
          <div className="text-center text-gray-400 text-xs mt-1">Swipe right if you understand, left if you need to review</div>
        </div>

        {/* Back side - Answer */}
        <div className="absolute w-full h-full backface-hidden bg-blue-50 rounded-lg shadow-md p-6 rotate-y-180 flex flex-col">
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded self-start mb-4">
            {category}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-700">{answer}</p>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">Click to see question</div>
          <div className="text-center text-gray-400 text-xs mt-1">Swipe right if you understand, left if you need to review</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;