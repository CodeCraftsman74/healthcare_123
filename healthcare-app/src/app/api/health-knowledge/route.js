import { NextResponse } from 'next/server';
import axios from 'axios';

// Fetch real data from health sources
async function fetchRealHealthData() {
  try {
    // Initialize our structured data
    const healthData = {
      categories: [
        {
          id: 'nutrition',
          name: 'Balanced Nutrition',
          description: 'Fueling your body with the right nutrients.',
          icon: '🥗',
          articles: []
        },
        {
          id: 'exercise',
          name: 'Regular Exercise',
          description: 'Moving your body for physical and mental well-being.',
          icon: '🏃',
          articles: []
        },
        {
          id: 'sleep',
          name: 'Quality Sleep',
          description: 'Rest and recovery are crucial for overall health.',
          icon: '😴',
          articles: []
        },
        {
          id: 'mental-health',
          name: 'Mental Well-being',
          description: 'Caring for your mind is as important as caring for your body.',
          icon: '🧠',
          articles: []
        },
        {
          id: 'prevention',
          name: 'Preventive Care',
          description: 'Taking proactive steps for long-term health.',
          icon: '🛡️',
          articles: []
        }
      ]
    };

    // Fetch nutrition articles from Harvard Health
    const nutritionResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'nutrition health diet',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    // Fetch exercise articles
    const exerciseResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'exercise fitness workout',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    // Fetch sleep articles
    const sleepResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'sleep health rest',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    // Fetch mental health articles
    const mentalHealthResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'mental health wellness stress',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    // Fetch preventive care articles
    const preventionResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'preventive healthcare screening',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    // Process nutrition articles
    healthData.categories[0].articles = nutritionResponse.data.articles.map((article, index) => ({
      id: `nut-${index}`,
      title: article.title,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://source.unsplash.com/random/800x600/?nutrition',
      sourceUrl: article.url,
      source: article.source.name
    }));

    // Process exercise articles
    healthData.categories[1].articles = exerciseResponse.data.articles.map((article, index) => ({
      id: `ex-${index}`,
      title: article.title,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://source.unsplash.com/random/800x600/?exercise',
      sourceUrl: article.url,
      source: article.source.name
    }));

    // Process sleep articles
    healthData.categories[2].articles = sleepResponse.data.articles.map((article, index) => ({
      id: `slp-${index}`,
      title: article.title,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://source.unsplash.com/random/800x600/?sleep',
      sourceUrl: article.url,
      source: article.source.name
    }));

    // Process mental health articles
    healthData.categories[3].articles = mentalHealthResponse.data.articles.map((article, index) => ({
      id: `mh-${index}`,
      title: article.title,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://source.unsplash.com/random/800x600/?mental-health',
      sourceUrl: article.url,
      source: article.source.name
    }));

    // Process prevention articles
    healthData.categories[4].articles = preventionResponse.data.articles.map((article, index) => ({
      id: `prev-${index}`,
      title: article.title,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://source.unsplash.com/random/800x600/?healthcare',
      sourceUrl: article.url,
      source: article.source.name
    }));

    return healthData;
  } catch (error) {
    console.error('Error fetching real health data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Attempt to fetch real data
    const healthData = await fetchRealHealthData();
    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Error in health knowledge API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health knowledge data' },
      { status: 500 }
    );
  }
} 