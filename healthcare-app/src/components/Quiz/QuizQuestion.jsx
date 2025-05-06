'use client';

import { useState, useEffect } from 'react';

const QuizQuestion = ({ question, onAnswerSelect, userAnswer }) => {
  // Removed type annotation
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const hasAnswered = userAnswer !== undefined || submitted;
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
  }, [question]);

  // Removed type annotation from option
  const handleSelectOption = (option) => {
    if (hasAnswered) return; // Prevent changing answer after submission
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption && !submitted) {
      setSubmitted(true);
      onAnswerSelect(selectedOption);
    }
  };

  // Removed type annotation from option
  const getOptionClassName = (option) => {
    const baseClasses = "block w-full p-4 my-2 rounded-md border text-left";

    if (!hasAnswered) {
      return `${baseClasses} ${selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'} cursor-pointer`;
    }

    if (option === question.correctAnswer) {
      return `${baseClasses} bg-green-50 border-green-600 text-green-800`;
    }

    if (selectedOption === option || (userAnswer && userAnswer.selectedAnswer === option)) {
      return option === question.correctAnswer
        ? `${baseClasses} bg-green-50 border-green-600 text-green-800`
        : `${baseClasses} bg-red-50 border-red-600 text-red-800`;
    }

    return `${baseClasses} border-gray-300 opacity-70`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{question.question}</h2>

      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectOption(option)}
            className={getOptionClassName(option)}
            disabled={hasAnswered}
          >
            {option}
          </button>
        ))}
      </div>

      {!hasAnswered && selectedOption && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmitAnswer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Answer
          </button>
        </div>
      )}

      {hasAnswered && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="font-semibold text-blue-800 mb-2">Explanation:</p>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion; 