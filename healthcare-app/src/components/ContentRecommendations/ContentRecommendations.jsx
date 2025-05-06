'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBookReader, FaVideo, FaListAlt, FaBookmark, FaStar, FaYoutube } from 'react-icons/fa';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ContentRecommendations = ({ userPreferences = null }) => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const [preferredSources, setPreferredSources] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [showVideoSourcesModal, setShowVideoSourcesModal] = useState(false);

  // All available categories
  const allCategories = [
    'Fitness / General Physical Health',
    'Nutrition & Healthy Eating',
    'Mental Health & Stress Management',
    'Chronic Disease Management',
    'Sleep & Recovery',
    'Women\'s Health',
    'Men\'s Health',
    'Child & Teen Health',
    'Recently Read Articles'
  ];

  // Popular video sources by category
  const videoSourcesByCategory = {
    'Fitness / General Physical Health': ['MadFit', 'Yoga with Adriene', 'ATHLEAN-X', 'Roberta\'s Gym', 'Doctor Mike'],
    'Nutrition & Healthy Eating': ['Clean & Delicious', 'Abbey\'s Kitchen', 'Mind Over Munch', 'NutritionFacts.org', 'Mayo Clinic'],
    'Mental Health & Stress Management': ['Headspace', 'The Mindful Movement', 'Therapy in a Nutshell', 'Psych Hub', 'Kati Morton'],
    'Chronic Disease Management': ['Diabetes UK', 'Mayo Clinic', 'Cleveland Clinic', 'Dr. Eric Berg', 'American Diabetes Association'],
    'Sleep & Recovery': ['Matthew Walker', 'The Sleep Doctor', 'Jason Stephenson', 'Ted-Ed', 'Dr. Eric Berg'],
    'Women\'s Health': ['Mama Doctor Jones', 'North American Menopause Society', 'Johns Hopkins Medicine', 'Mayo Clinic', 'What to Expect'],
    'Men\'s Health': ['Movember Foundation', 'ATHLEAN-X', 'Doctor Mike', 'Cleveland Clinic', 'Johns Hopkins Medicine'],
    'Child & Teen Health': ['CDC', 'Johns Hopkins Medicine', 'PE With Joe', 'UNICEF', 'Mayo Clinic']
  };

  // Get user selected categories or default to first 3
  useEffect(() => {
    // Get user preferences from local storage if not provided via props
    const fetchPreferences = () => {
      if (userPreferences) {
        return userPreferences;
      }
      
      try {
        const storedPreferences = localStorage.getItem('userHealthPreferences');
        return storedPreferences ? JSON.parse(storedPreferences) : null;
      } catch (err) {
        console.error('Error reading preferences:', err);
        return null;
      }
    };

    const prefs = fetchPreferences();
    
    // Map user interests to content categories
    const mapInterestsToCategories = (interests) => {
      if (!interests || interests.length === 0) return [];
      
      const categoryMap = {
        'Fitness': 'Fitness / General Physical Health',
        'Nutrition': 'Nutrition & Healthy Eating',
        'Mental Health': 'Mental Health & Stress Management',
        'Heart Health': 'Chronic Disease Management',
        'Diabetes': 'Chronic Disease Management',
        'Sleep': 'Sleep & Recovery',
        'Women\'s Health': 'Women\'s Health',
        'Men\'s Health': 'Men\'s Health',
        'Pediatrics': 'Child & Teen Health'
      };
      
      return interests.map(interest => categoryMap[interest] || null).filter(Boolean);
    };
    
    // Set active categories based on user interests or default
    let initialCategories = [];
    if (prefs?.interests?.length > 0) {
      initialCategories = mapInterestsToCategories(prefs.interests);
    }
    
    // If no matching categories found, use defaults
    if (initialCategories.length === 0) {
      initialCategories = allCategories.slice(0, 2);
    }
    
    setActiveCategories(initialCategories);
    
    // Load preferred sources from localStorage
    try {
      const storedPreferredSources = localStorage.getItem('preferredVideoSources');
      if (storedPreferredSources) {
        setPreferredSources(JSON.parse(storedPreferredSources));
      }
    } catch (err) {
      console.error('Error loading preferred sources:', err);
    }
    
    // Load saved items from localStorage
    try {
      const storedSavedItems = localStorage.getItem('savedContentItems');
      if (storedSavedItems) {
        setSavedItems(JSON.parse(storedSavedItems));
      }
    } catch (err) {
      console.error('Error loading saved items:', err);
    }
  }, [userPreferences]);
  
  // Fetch recommendations when activeCategories change
  useEffect(() => {
    if (activeCategories.length === 0) return;
    
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/recommendations', {
          categories: activeCategories,
          preferredSources: preferredSources
        });
        setRecommendations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching content recommendations:', err);
        setError('Failed to fetch personalized content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activeCategories, preferredSources]);
  
  // Toggle category selection
  const toggleCategory = (category) => {
    setActiveCategories(prev => {
      if (prev.includes(category)) {
        // Remove the category
        return prev.filter(c => c !== category);
      } else {
        // Add the category (limit to 3 total)
        const newCategories = [...prev, category];
        return newCategories.slice(0, 3);
      }
    });
  };
  
  // Toggle video source preference
  const togglePreferredSource = (source) => {
    setPreferredSources(prev => {
      const newSources = prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source];
      
      // Store in localStorage
      localStorage.setItem('preferredVideoSources', JSON.stringify(newSources));
      return newSources;
    });
  };
  
  // Get all available sources for currently selected categories
  const getAvailableVideoSources = () => {
    const sources = new Set();
    activeCategories.forEach(category => {
      const categorySources = videoSourcesByCategory[category] || [];
      categorySources.forEach(source => sources.add(source));
    });
    return Array.from(sources);
  };
  
  // Toggle saving an item
  const toggleSaveItem = (item) => {
    setSavedItems(prev => {
      // Check if item is already saved by URL (unique identifier)
      const isAlreadySaved = prev.some(savedItem => savedItem.url === item.url);
      
      let newSavedItems;
      if (isAlreadySaved) {
        // Remove from saved items
        newSavedItems = prev.filter(savedItem => savedItem.url !== item.url);
      } else {
        // Add to saved items with timestamp
        newSavedItems = [...prev, {
          ...item,
          savedAt: new Date().toISOString()
        }];
      }
      
      // Store in localStorage
      localStorage.setItem('savedContentItems', JSON.stringify(newSavedItems));
      return newSavedItems;
    });
  };
  
  // Check if an item is saved
  const isItemSaved = (itemUrl) => {
    return savedItems.some(item => item.url === itemUrl);
  };
  
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
    <div className="space-y-8">
      {/* Recently Read Articles Section - Always at the top */}
      {recommendations['Recently Read Articles']?.length > 0 && (
        <div className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-2xl font-bold mb-2 text-blue-800">Recently Read Articles Recommended for You</h2>
          <p className="text-blue-600 mb-4">Based on your interests and learning history</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations['Recently Read Articles'].map((item) => (
              <a 
                key={item.title} 
                href={item.url}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                
                {item.type === 'quiz' && (
                  <div className="mt-2 text-sm text-gray-600">
                    Quiz • {item.quizQuestions} questions
                  </div>
                )}
                
                {item.type === 'flashcards' && (
                  <div className="mt-2 text-sm text-gray-600">
                    Flashcards • {item.cardCount} cards
                  </div>
                )}
                
                {item.type === 'article' && (
                  <div className="mt-2 text-sm text-gray-600">
                    Article • {item.readTime}
                  </div>
                )}
                
                <div className="mt-auto pt-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
                    {item.type === 'quiz' ? 'Start Quiz' : item.type === 'flashcards' ? 'Study Cards' : 'Read'}
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Category and Video Source selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customize Your Content</h2>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">Select up to 3 categories you're interested in:</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    activeCategories.includes(category)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setShowVideoSourcesModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FaYoutube size={16} /> Customize Video Sources
            </button>
          </div>
        </div>
        
        {/* Preferred Video Sources Modal */}
        {showVideoSourcesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Customize Video Sources</h3>
                <button
                  onClick={() => setShowVideoSourcesModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Select your preferred health content creators to customize video recommendations:
              </p>
              
              <div className="max-h-80 overflow-y-auto">
                {getAvailableVideoSources().map(source => (
                  <div key={source} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`source-${source}`}
                      checked={preferredSources.includes(source)}
                      onChange={() => togglePreferredSource(source)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <label htmlFor={`source-${source}`} className="text-gray-700">
                      {source}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowVideoSourcesModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display content for each active category */}
      {activeCategories.length === 0 ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          <p>Please select at least one category to see personalized recommendations.</p>
        </div>
      ) : (
        activeCategories.map(category => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            
            {recommendations[category]?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations[category].slice(0, 6).map((item) => (
                  <ContentCard
                    key={item.id || item.url}
                    item={item}
                    isSaved={isItemSaved(item.url)}
                    onSave={() => toggleSaveItem(item)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No content recommendations found for this category.</p>
            )}
          </div>
        ))
      )}
      
      {/* Saved items section */}
      {savedItems.length > 0 && (
        <div className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaBookmark className="mr-2 text-blue-600" /> Your Saved Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <ContentCard
                key={`saved-${item.id || item.url}`}
                item={item}
                isSaved={true}
                onSave={() => toggleSaveItem(item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentRecommendations; 