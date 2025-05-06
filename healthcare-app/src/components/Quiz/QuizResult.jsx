'use client';

// Removed QuizQuestionType interface
// Removed UserAnswer interface
// Removed QuizResultProps interface

// Removed type annotations from props
const QuizResult = ({ userAnswers, questions, onRestartQuiz }) => {
  // Calculate score
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Generate feedback based on score
  const getFeedback = () => {
    if (score >= 90) {
      return "Excellent! You have exceptional medical knowledge.";
    } else if (score >= 75) {
      return "Great job! You have strong medical knowledge.";
    } else if (score >= 60) {
      return "Good effort! You have decent medical knowledge.";
    } else if (score >= 40) {
      return "You're making progress! Keep learning to improve your medical knowledge.";
    } else {
      return "This is a good starting point. Continue learning to expand your medical knowledge.";
    }
  };

  return (
    // ... rest of the component remains the same ...
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Quiz Results</h1>

        {/* Score display */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-48 mb-4">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <div className="text-4xl font-bold text-blue-600">{score}%</div>
            </div>
            <svg className="absolute top-0 left-0" width="192" height="192" viewBox="0 0 192 192">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray="552.9"
                strokeDashoffset={552.9 - (552.9 * score) / 100}
                transform="rotate(-90 96 96)"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg mb-2">
              You scored <span className="font-bold">{correctAnswers}</span> out of <span className="font-bold">{totalQuestions}</span>
            </p>
            <p className="text-gray-600">{getFeedback()}</p>
          </div>
        </div>

        {/* Answer review */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Review Your Answers</h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(answer => answer.questionId === question.id);

              return (
                <div key={question.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <span className="font-medium text-gray-500">Question {index + 1}:</span>
                    <p className="font-medium text-gray-800 mt-1">{question.question}</p>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <p className="mb-1 text-sm text-gray-500">Your answer:</p>
                      <div className={`p-3 rounded-md ${userAnswer?.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {userAnswer?.selectedAnswer}
                      </div>
                    </div>

                    {!userAnswer?.isCorrect && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm text-gray-500">Correct answer:</p>
                        <div className="p-3 rounded-md bg-green-50 text-green-800">
                          {question.correctAnswer}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-sm text-gray-500">Explanation:</p>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restart button */}
        <div className="mt-8 text-center">
          <button
            onClick={onRestartQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 