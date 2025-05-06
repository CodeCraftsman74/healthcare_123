'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard'; // Renamed to .jsx
import LoadingSpinner from '../ui/LoadingSpinner';

// Removed NewsArticle interface

const NewsFeed = () => {
  // Removed type annotations
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // We'll implement the actual API in src/app/api/news/route.js
        const response = await axios.get('/api/news');
        setArticles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch health news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Live Health News</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">No health news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed; 