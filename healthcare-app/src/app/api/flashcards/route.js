import { NextResponse } from 'next/server';

// Mock flashcard data for demonstration
const mockFlashcards = [
  {
    id: '1',
    question: 'What is the medical term for high blood pressure?',
    answer: 'Hypertension',
    category: 'cardiovascular'
  },
  {
    id: '2',
    question: 'Which hormone regulates blood glucose levels?',
    answer: 'Insulin',
    category: 'endocrine'
  },
  {
    id: '3',
    question: 'What is the medical term for inflammation of the liver?',
    answer: 'Hepatitis',
    category: 'gastroenterology'
  },
  {
    id: '4',
    question: 'What are the four chambers of the heart?',
    answer: 'Left atrium, left ventricle, right atrium, and right ventricle',
    category: 'cardiovascular'
  },
  {
    id: '5',
    question: 'What is the function of red blood cells?',
    answer: 'To transport oxygen throughout the body',
    category: 'hematology'
  },
  {
    id: '6',
    question: 'What is the medical term for a heart attack?',
    answer: 'Myocardial infarction',
    category: 'cardiovascular'
  },
  {
    id: '7',
    question: 'Which gland produces insulin?',
    answer: 'Pancreas',
    category: 'endocrine'
  },
  {
    id: '8',
    question: 'What is the largest organ in the human body?',
    answer: 'Skin',
    category: 'anatomy'
  },
  {
    id: '9',
    question: 'What is the medical term for low blood sugar?',
    answer: 'Hypoglycemia',
    category: 'endocrine'
  },
  {
    id: '10',
    question: 'Which vitamin is produced when skin is exposed to sunlight?',
    answer: 'Vitamin D',
    category: 'nutrition'
  }
];

export async function GET() {
  try {
    // In a production app, you would fetch from MongoDB or another database
    // For now, return mock data
    return NextResponse.json(mockFlashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
} 