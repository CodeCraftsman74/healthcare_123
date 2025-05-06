import { NextRequest, NextResponse } from 'next/server';

// Mock data for health recommendations
const allRecommendations = [
  {
    id: 'r1',
    title: 'Understanding Macronutrients: Protein, Carbs, and Fat',
    description: 'Learn the basics of macronutrients and how they contribute to a balanced diet.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?nutrition',
    category: 'Nutrition',
    url: 'https://example.com/nutrition/macronutrients'
  },
  {
    id: 'r2',
    title: 'The Role of Micronutrients in Your Diet',
    description: 'Discover the importance of vitamins and minerals for optimal health.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?vitamins',
    category: 'Nutrition',
    url: 'https://example.com/nutrition/micronutrients'
  },
  {
    id: 'r3',
    title: 'Beginner\'s Guide to High-Intensity Interval Training',
    description: 'Get started with HIIT workouts that maximize your time and results.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?workout',
    category: 'Fitness',
    url: 'https://example.com/fitness/hiit'
  },
  {
    id: 'r4',
    title: 'Strength Training for Beginners',
    description: 'Learn the fundamentals of strength training for building muscle and improving health.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?weights',
    category: 'Fitness',
    url: 'https://example.com/fitness/strength-training'
  },
  {
    id: 'r5',
    title: 'Mindfulness Meditation Techniques',
    description: 'Simple meditation practices to reduce stress and improve mental well-being.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?meditation',
    category: 'Mental Health',
    url: 'https://example.com/mental-health/meditation'
  },
  {
    id: 'r6',
    title: 'Understanding and Managing Anxiety',
    description: 'Learn about anxiety triggers and effective coping strategies.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?calm',
    category: 'Mental Health',
    url: 'https://example.com/mental-health/anxiety'
  },
  {
    id: 'r7',
    title: 'Heart-Healthy Diet Recommendations',
    description: 'Dietary guidelines to support cardiovascular health and prevent heart disease.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?heart',
    category: 'Heart Health',
    url: 'https://example.com/heart-health/diet'
  },
  {
    id: 'r8',
    title: 'Managing Blood Pressure Naturally',
    description: 'Lifestyle changes that can help control and reduce high blood pressure.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?blood-pressure',
    category: 'Heart Health',
    url: 'https://example.com/heart-health/blood-pressure'
  },
  {
    id: 'r9',
    title: 'Understanding Type 2 Diabetes',
    description: 'An overview of diabetes causes, symptoms, and management strategies.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?diabetes',
    category: 'Diabetes',
    url: 'https://example.com/diabetes/type-2'
  },
  {
    id: 'r10',
    title: 'Diabetic-Friendly Meal Planning',
    description: 'Meal ideas and nutrition tips for maintaining stable blood sugar levels.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?healthy-food',
    category: 'Diabetes',
    url: 'https://example.com/diabetes/meal-planning'
  },
  {
    id: 'r11',
    title: 'Improving Sleep Quality',
    description: 'Strategies for better sleep hygiene and overcoming common sleep problems.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?sleep',
    category: 'Sleep',
    url: 'https://example.com/sleep/quality'
  },
  {
    id: 'r12',
    title: 'Understanding Sleep Cycles',
    description: 'Learn about the science of sleep stages and how they affect your health.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?night',
    category: 'Sleep',
    url: 'https://example.com/sleep/cycles'
  },
  {
    id: 'r13',
    title: 'Essential Health Screenings by Age',
    description: 'Recommended preventive screenings for different life stages.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?doctor',
    category: 'Preventive Care',
    url: 'https://example.com/preventive-care/screenings'
  },
  {
    id: 'r14',
    title: 'Vaccination Schedule for Adults',
    description: 'Important vaccines and when to get them throughout adulthood.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?vaccine',
    category: 'Preventive Care',
    url: 'https://example.com/preventive-care/vaccines'
  },
  {
    id: 'r15',
    title: 'Women\'s Health: Understanding Hormonal Changes',
    description: 'A guide to hormonal fluctuations throughout a woman\'s life.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?woman-health',
    category: 'Women\'s Health',
    url: 'https://example.com/womens-health/hormones'
  },
  {
    id: 'r16',
    title: 'Men\'s Health: Prostate Health Guide',
    description: 'Understanding prostate health and preventive measures for men.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?man-health',
    category: 'Men\'s Health',
    url: 'https://example.com/mens-health/prostate'
  },
  {
    id: 'r17',
    title: 'Childhood Nutrition Guidelines',
    description: 'Nutritional requirements for growing children at different ages.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?child-eating',
    category: 'Pediatrics',
    url: 'https://example.com/pediatrics/nutrition'
  },
  {
    id: 'r18',
    title: 'Understanding Childhood Immunizations',
    description: 'A guide to vaccines recommended for children and their importance.',
    imageUrl: 'https://source.unsplash.com/random/800x600/?child-doctor',
    category: 'Pediatrics',
    url: 'https://example.com/pediatrics/vaccines'
  }
];

// Removed type annotation from request
export async function POST(request) {
  try {
    // Parse the request body to get the full user preferences object
    const preferences = await request.json();

    // Extract interests for basic filtering (can be expanded later)
    const userInterests = preferences?.interests || [];
    // Placeholder for using other preferences like ageRange, healthGoals, conditions
    // const ageRange = preferences?.ageRange;
    // const healthGoals = preferences?.healthGoals;
    // const conditions = preferences?.conditions;

    console.log("Received Preferences:", preferences); // Log received data for debugging

    let recommendations = [];

    // Basic filtering logic based on interests (same as before for now)
    if (userInterests.length > 0) {
      recommendations = allRecommendations.filter(
        recommendation => userInterests.includes(recommendation.category)
      );

      // If not enough recommendations match interests, supplement with general ones
      if (recommendations.length < 6) { // Aim for up to 6 recommendations
        const generalRecommendations = allRecommendations.filter(
          recommendation => !userInterests.includes(recommendation.category)
        );
        // Add shuffled general recommendations until we have 6 or run out
        const needed = 6 - recommendations.length;
        recommendations = [
          ...recommendations,
          ...generalRecommendations.sort(() => 0.5 - Math.random()).slice(0, needed)
        ];
      }
    } else {
      // If no specific interests, return a broader random selection
      recommendations = [...allRecommendations]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
    }

    // Future: Implement more sophisticated recommendation logic here
    // using ageRange, healthGoals, conditions, and potentially ML models.

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in personalized recommendations API:', error);
    // Check if the error is due to JSON parsing
    if (error instanceof SyntaxError) {
       return NextResponse.json(
        { error: 'Invalid request format.' },
        { status: 400 } // Bad Request
      );
    }
    return NextResponse.json(
      { error: 'Failed to get personalized recommendations' },
      { status: 500 }
    );
  }
} 