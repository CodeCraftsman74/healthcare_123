'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../ui/LoadingSpinner';
import Image from 'next/image';

// Define interfaces for better type safety (optional but good practice)
// interface HealthArticle {
//   id: string;
//   title: string;
//   summary: string;
//   imageUrl: string;
// }

// interface HealthCategory {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   articles: HealthArticle[];
// }

// interface HealthKnowledgeData {
//   categories: HealthCategory[];
// }

const HealthKnowledgeHubComponent = () => {
  // State for the fetched data, loading, error, and search
  // Removed type annotations for broader compatibility
  const [healthData, setHealthData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch health knowledge data on component mount
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/health-knowledge');
        setHealthData(response.data); // Store the whole object { categories: [...] }
        setFilteredData(response.data); // Initialize filtered data
        setError(null);
      } catch (err) {
        console.error('Error fetching health knowledge data:', err);
        setError('Failed to fetch health knowledge. Please try again later.');
        setHealthData({ categories: [] }); // Set empty data on error
        setFilteredData({ categories: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (!healthData) return; // Don't filter if data isn't loaded

    if (searchQuery === '') {
      setFilteredData(healthData); // No query? Show all data
      return;
    }

    const query = searchQuery.toLowerCase();
    const result = {
      categories: healthData.categories
        .map(category => ({
          ...category,
          // Filter articles within each category
          articles: category.articles.filter(
            article =>
              article.title.toLowerCase().includes(query) ||
              article.summary.toLowerCase().includes(query)
          ),
        }))
        // Keep only categories that have matching articles after filtering
        .filter(category => category.articles.length > 0),
    };

    setFilteredData(result);

  }, [searchQuery, healthData]);

  // --- Render Logic ---

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple retry
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const categoriesToShow = filteredData?.categories || [];
  const hasResults = categoriesToShow.length > 0;

  return (
    <div className="container mx-auto space-y-12">
      {/* Search Bar */}
      <div className="mb-8 sticky top-0 bg-white dark:bg-gray-900 py-4 z-10">
         <div className="relative">
           <input
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search topics (e.g., nutrition, stress)..."
             className="w-full p-4 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
           />
           <svg
             className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
             />
           </svg>
         </div>
      </div>

      {/* Categories and Articles */}
      {hasResults ? (
        categoriesToShow.map(category => (
          <section key={category.id} aria-labelledby={category.id}>
            {/* Category Header */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 id={category.id} className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <span className="text-4xl">{category.icon}</span>
                {category.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{category.description}</p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.articles.map(article => (
                <a 
                  href={article.sourceUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col hover:shadow-xl group"
                >
                  <div className="relative h-56 w-full">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:opacity-90 transition duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {article.source && (
                      <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        {article.source}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow line-clamp-4">
                      {article.summary}
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                        Read full article
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))
      ) : (
        // No Results Message
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We couldn't find any health topics matching "{searchQuery}". Try searching for something else.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setSearchQuery('')} // Clear search
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthKnowledgeHubComponent; 