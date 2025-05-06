import { NextResponse } from 'next/server';

// Mock quiz data for demonstration
const mockQuizData = [
  {
    id: 'q1',
    question: 'Which of the following is a symptom of diabetes?',
    options: [
      'Increased thirst and urination',
      'Decreased appetite',
      'Reduced vision at night',
      'Joint pain'
    ],
    correctAnswer: 'Increased thirst and urination',
    explanation: 'Diabetes is characterized by increased thirst (polydipsia) and increased urination (polyuria) due to high blood glucose levels.',
    category: 'endocrine'
  },
  {
    id: 'q2',
    question: 'What is the main function of red blood cells?',
    options: [
      'Fighting infection',
      'Blood clotting',
      'Transporting oxygen',
      'Producing antibodies'
    ],
    correctAnswer: 'Transporting oxygen',
    explanation: 'Red blood cells (erythrocytes) contain hemoglobin, which binds to oxygen and transports it from the lungs to tissues throughout the body.',
    category: 'hematology'
  },
  {
    id: 'q3',
    question: 'Which of the following is NOT a risk factor for heart disease?',
    options: [
      'Smoking',
      'High blood pressure',
      'Regular exercise',
      'Obesity'
    ],
    correctAnswer: 'Regular exercise',
    explanation: 'Regular exercise is actually protective against heart disease. The other options (smoking, high blood pressure, and obesity) are all risk factors for heart disease.',
    category: 'cardiovascular'
  },
  {
    id: 'q4',
    question: 'Which vitamin is essential for blood clotting?',
    options: [
      'Vitamin A',
      'Vitamin C',
      'Vitamin D',
      'Vitamin K'
    ],
    correctAnswer: 'Vitamin K',
    explanation: 'Vitamin K is essential for the production of prothrombin and other clotting factors in the liver. Deficiency can lead to bleeding disorders.',
    category: 'nutrition'
  },
  {
    id: 'q5',
    question: 'What is the normal resting heart rate for adults?',
    options: [
      '40-50 beats per minute',
      '60-100 beats per minute',
      '100-120 beats per minute',
      '120-140 beats per minute'
    ],
    correctAnswer: '60-100 beats per minute',
    explanation: 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute. Well-trained athletes might have a resting heart rate closer to 40 beats per minute.',
    category: 'cardiovascular'
  },
  {
    id: 'q6',
    question: 'Which of the following conditions is caused by a bacterial infection?',
    options: [
      'Common cold',
      'Influenza',
      'Strep throat',
      'Chickenpox'
    ],
    correctAnswer: 'Strep throat',
    explanation: 'Strep throat is caused by the bacterium Streptococcus pyogenes. The common cold and influenza are caused by viruses, and chickenpox is caused by the varicella-zoster virus.',
    category: 'infectious disease'
  },
  {
    id: 'q7',
    question: 'What is the primary function of insulin?',
    options: [
      'Break down fats',
      'Reduce blood pressure',
      'Lower blood glucose levels',
      'Increase heart rate'
    ],
    correctAnswer: 'Lower blood glucose levels',
    explanation: 'Insulin is a hormone produced by the pancreas that helps cells absorb glucose from the bloodstream, thereby lowering blood glucose levels.',
    category: 'endocrine'
  },
  {
    id: 'q8',
    question: 'Which of the following is a function of the liver?',
    options: [
      'Filtering blood',
      'Producing insulin',
      'Absorbing nutrients from food',
      'Filtering air'
    ],
    correctAnswer: 'Filtering blood',
    explanation: 'The liver filters blood coming from the digestive tract, detoxifying chemicals and metabolizing drugs. It also makes proteins important for blood clotting and other functions.',
    category: 'gastroenterology'
  }
];

export async function GET() {
  try {
    // In a production app, you would fetch from a database
    // For now, return mock data
    return NextResponse.json(mockQuizData);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
} 