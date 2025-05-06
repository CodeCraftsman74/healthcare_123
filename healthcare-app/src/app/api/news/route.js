import { NextResponse } from 'next/server';
import axios from 'axios';

// Fetch the API key from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function GET() {
  // Check if the API key is configured
  if (!NEWS_API_KEY) {
    console.error('News API key not configured. Please set NEWS_API_KEY environment variable.');
    // Return an error response or potentially mock data if you prefer for development
    return NextResponse.json(
      { error: 'News service is not configured.' },
      { status: 500 }
    );
  }

  const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=health&language=en&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await axios.get(newsApiUrl);

    // Map the response articles to include a unique ID if necessary
    // NewsAPI usually provides enough unique data, but adding an ID can be safer
    const articlesWithId = response.data.articles.map((article, index) => ({
      ...article,
      // Use url as a fallback ID, or generate one if needed
      id: article.url || `news-${index}-${Date.now()}`,
    }));

    return NextResponse.json(articlesWithId);

  } catch (error) {
    // Log the specific error from NewsAPI if available
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching news from NewsAPI:', error.response.data);
      return NextResponse.json(
        { error: `Failed to fetch health news: ${error.response.data.message || 'API error'}` },
        { status: error.response.status || 500 }
      );
    } else {
      // Log general errors
      console.error('Error fetching news:', error);
      return NextResponse.json(
        { error: 'Failed to fetch health news due to an internal error' },
        { status: 500 }
      );
    }
  }
} 