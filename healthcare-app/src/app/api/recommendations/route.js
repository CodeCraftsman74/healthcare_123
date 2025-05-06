import { NextResponse } from 'next/server';
import axios from 'axios';

// Fetch API keys from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Predefined content categories with specific search queries for better results
const CONTENT_CATEGORIES = {
  'Fitness / General Physical Health': {
    query: 'workout OR exercise OR "physical health" OR fitness',
    videoSources: ['MadFit', 'Yoga with Adriene', 'ATHLEAN-X', 'Doctor Mike']
  },
  'Nutrition & Healthy Eating': {
    query: 'nutrition OR "healthy eating" OR diet OR "healthy food"',
    videoSources: ['Clean & Delicious', 'Abbey\'s Kitchen', 'Mind Over Munch', 'NutritionFacts.org']
  },
  'Mental Health & Stress Management': {
    query: '"mental health" OR stress OR anxiety OR meditation OR mindfulness',
    videoSources: ['Headspace', 'The Mindful Movement', 'Therapy in a Nutshell', 'Psych Hub']
  },
  'Chronic Disease Management': {
    query: 'diabetes OR hypertension OR "chronic disease" OR "blood pressure"',
    videoSources: ['Diabetes UK', 'Mayo Clinic', 'Cleveland Clinic', 'Dr. Eric Berg']
  },
  'Sleep & Recovery': {
    query: 'sleep OR insomnia OR "sleep quality" OR "sleep hygiene"',
    videoSources: ['Matthew Walker', 'The Sleep Doctor', 'Jason Stephenson', 'Ted-Ed']
  },
  'Women\'s Health': {
    query: '"women\'s health" OR menopause OR "breast health" OR "women wellness"',
    videoSources: ['Mama Doctor Jones', 'North American Menopause Society', 'Johns Hopkins Medicine']
  },
  'Men\'s Health': {
    query: '"men\'s health" OR testosterone OR prostate OR "men wellness"',
    videoSources: ['Movember Foundation', 'ATHLEAN-X', 'Doctor Mike', 'Cleveland Clinic']
  },
  'Child & Teen Health': {
    query: '"children\'s health" OR "teen health" OR "child development" OR pediatrics',
    videoSources: ['CDC', 'Johns Hopkins Medicine', 'PE With Joe', 'UNICEF']
  }
};

// Predefined content for each category that matches the example
const STATIC_RECOMMENDATIONS = {
  'Fitness / General Physical Health': [
    {
      title: '10-Minute Full Body Workout for Beginners – No Equipment',
      source: { name: 'MadFit' },
      url: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
      description: 'Quick beginner-friendly workout routine that requires no equipment',
      type: 'video'
    },
    {
      title: 'Beginner\'s Guide to Stretching',
      source: { name: 'Yoga with Adriene' },
      url: 'https://www.youtube.com/watch?v=qULTwquOuT4',
      description: 'Easy stretching routine to improve flexibility and prevent injuries',
      type: 'video'
    },
    {
      title: '30 Minute Fat Burning Home Workout for Beginners',
      source: { name: 'Roberta\'s Gym' },
      url: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
      description: 'Low-impact cardio workout suitable for beginner fitness levels',
      type: 'video'
    }
  ],
  'Nutrition & Healthy Eating': [
    {
      title: 'Healthy Eating – What You Need to Know',
      source: { name: 'NHS Choices' },
      url: 'https://www.nhs.uk/live-well/eat-well/',
      description: 'Essential nutrition basics from trusted healthcare professionals',
      type: 'article'
    },
    {
      title: 'How to Start Eating Healthy (for Beginners)',
      source: { name: 'Clean & Delicious' },
      url: 'https://www.youtube.com/watch?v=xUHc_Xc-oRg',
      description: 'Simple steps to transition to healthier eating patterns',
      type: 'video'
    },
    {
      title: 'Nutrition Basics | Macronutrients Explained',
      source: { name: 'Abbey\'s Kitchen' },
      url: 'https://www.youtube.com/watch?v=fdRFXGI_aSI',
      description: 'Learn about proteins, carbs, and fats and their role in your diet',
      type: 'video'
    }
  ],
  // Additional categories and their static recommendations would be here
  
  // Recently Read Articles section
  'Recently Read Articles': [
    {
      title: 'Introduction to Human Anatomy',
      source: { name: 'Healchar' },
      url: '/quiz',
      description: 'Test your knowledge with 10 questions on human anatomy basics',
      type: 'quiz',
      contentType: 'quiz',
      quizQuestions: 10
    },
    {
      title: 'Medical Terminology Basics',
      source: { name: 'Healchar' },
      url: '/flashcards',
      description: 'Study essential medical terms with these flashcards',
      type: 'flashcards',
      contentType: 'flashcards',
      cardCount: 25
    },
    {
      title: 'Recent Advances in Immunotherapy',
      source: { name: 'Healchar Journal' },
      url: '/',
      description: 'Learn about the latest breakthroughs in cancer immunotherapy research',
      type: 'article',
      readTime: '5 min read'
    }
  ]
};

// YouTube API integration for video recommendations
async function getYouTubeRecommendations(category, preferredSources = []) {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key not configured');
    return [];
  }

  const categoryInfo = CONTENT_CATEGORIES[category];
  if (!categoryInfo) {
    return [];
  }

  try {
    // Build search query combining category query with preferred sources
    let searchQuery = categoryInfo.query;
    
    // Include preferred channels if they match this category's known sources
    const channelFilters = [];
    if (preferredSources && preferredSources.length > 0) {
      categoryInfo.videoSources.forEach(source => {
        if (preferredSources.includes(source)) {
          channelFilters.push(source);
        }
      });
    }
    
    // If specific sources requested, include them in query
    if (channelFilters.length > 0) {
      const sourceQuery = channelFilters.join(' OR ');
      searchQuery = `(${searchQuery}) (${sourceQuery})`;
    }

    // Make API request to YouTube
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(searchQuery)}&type=video&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(youtubeApiUrl);
    
    // Process and format results
    return response.data.items.map((item, index) => ({
      id: `youtube-${category.replace(/\s+/g, '-')}-${index}`,
      title: item.snippet.title,
      description: item.snippet.description,
      source: { name: item.snippet.channelTitle },
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      urlToImage: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      type: 'video'
    }));
  } catch (error) {
    console.error(`Error fetching YouTube videos for ${category}:`, error);
    return [];
  }
}

// Dynamic content recommendation function using the News API
async function getNewsApiRecommendations(category) {
  if (!NEWS_API_KEY) {
    console.error('News API key not configured');
    return [];
  }

  const categoryInfo = CONTENT_CATEGORIES[category];
  if (!categoryInfo) {
    return [];
  }

  try {
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoryInfo.query)}&language=en&sortBy=relevancy&pageSize=10&apiKey=${NEWS_API_KEY}`;
    const response = await axios.get(newsApiUrl);
    
    // Filter and enhance results
    return response.data.articles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        ...article,
        id: `news-${category.replace(/\s+/g, '-')}-${index}`,
        type: 'article'
      }));
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
}

// Combine static, YouTube and API-fetched recommendations
async function getRecommendationsForCategory(category, preferredSources = []) {
  try {
    // Get videos from YouTube API
    const youtubeVideos = await getYouTubeRecommendations(category, preferredSources);
    
    // Get articles from News API
    const newsArticles = await getNewsApiRecommendations(category);
    
    // Combine with static recommendations if available
    const staticContent = STATIC_RECOMMENDATIONS[category] || [];
    
    // We'll prioritize YouTube videos for the categories that match user selections
    const allContent = [...youtubeVideos, ...staticContent, ...newsArticles];
    
    // Ensure videos are distributed prominently
    const videos = allContent.filter(item => item.type === 'video' || item.url?.includes('youtube.com'));
    const articles = allContent.filter(item => item.type === 'article' && !item.url?.includes('youtube.com'));
    
    // Mix videos and articles, prioritizing videos at the top
    // Ensure we always have some content
    return allContent.length > 0
      ? [...videos.slice(0, 5), ...articles.slice(0, 5)].slice(0, 10)
      : staticContent;
  } catch (error) {
    console.error(`Error getting recommendations for ${category}:`, error);
    return STATIC_RECOMMENDATIONS[category] || [];
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { categories = [], preferredSources = [] } = requestData;
    
    // Validate categories
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories must be an array' }, { status: 400 });
    }
    
    // Recommendations object to return
    const recommendations = {};
    
    // Always include Recently Read Articles
    recommendations['Recently Read Articles'] = STATIC_RECOMMENDATIONS['Recently Read Articles'] || [];
    
    // Process each requested category
    for (const category of categories) {
      if (CONTENT_CATEGORIES[category]) {
        // Get recommendations for the category
        recommendations[category] = await getRecommendationsForCategory(category, preferredSources);
      }
    }
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error processing content recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content recommendations' },
      { status: 500 }
    );
  }
}

// GET method for simple testing purposes
export async function GET() {
  // Return a subset of static recommendations for quick testing
  const testData = {};
  const categories = Object.keys(CONTENT_CATEGORIES).slice(0, 2);
  
  for (const category of categories) {
    testData[category] = STATIC_RECOMMENDATIONS[category] || [];
  }
  
  return NextResponse.json(testData);
} 