'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAward, FaFire, FaCalendarCheck, FaCheck, FaChartLine, FaTrophy, FaBookReader } from 'react-icons/fa';
import LoadingSpinner from '../ui/LoadingSpinner';
import PreferenceForm from './PreferenceForm';
import Link from 'next/link';

// Removed HealthRecommendation interface
// Removed UserPreferences interface

const PersonalizedLearningComponent = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);
  
  // Gamification state
  const [streak, setStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState(null);
  const [dailyTipCompleted, setDailyTipCompleted] = useState(false);
  const [badges, setBadges] = useState([]);
  const [healthPoints, setHealthPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dailyTip, setDailyTip] = useState('');

  // Available health interest categories
  const categories = [
    'Nutrition', 'Fitness', 'Mental Health', 'Heart Health', 'Diabetes',
    'Sleep', 'Preventive Care', 'Women\'s Health', 'Men\'s Health', 'Pediatrics'
  ];

  // Daily health tips by category
  const healthTips = {
    'Nutrition': [
      'Try to include at least 5 different colored fruits and vegetables in your diet today.',
      'Reduce sodium intake by using herbs and spices instead of salt for flavor.',
      'Drink water before meals to help with portion control and hydration.',
    ],
    'Fitness': [
      'Even a 10-minute walk can boost your energy and mood for up to 2 hours.',
      'Try incorporating bodyweight exercises like squats and push-ups into your daily routine.',
      'Stretching for 5 minutes in the morning can improve your flexibility and reduce injury risk.',
    ],
    'Mental Health': [
      'Practice the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8.',
      'Take a 5-minute break from screens every hour to reduce eye strain and mental fatigue.',
      'Write down three things you\'re grateful for today to improve your mood and perspective.',
    ],
    'Sleep': [
      'Try to go to bed and wake up at the same time daily, even on weekends.',
      'Limit caffeine after 2pm to improve sleep quality.',
      'Create a relaxing bedtime routine to signal to your body it\'s time to sleep.',
    ]
  };

  // Fetch user preferences, recommendations, and streak data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const storedPreferences = localStorage.getItem('userHealthPreferences');
        const parsedPreferences = storedPreferences ? JSON.parse(storedPreferences) : null;

        // Load streak and gamification data
        const storedStreak = localStorage.getItem('healthStreak');
        const storedLastVisit = localStorage.getItem('lastVisit');
        const storedBadges = localStorage.getItem('healthBadges');
        const storedPoints = localStorage.getItem('healthPoints');
        const storedDailyTipCompleted = localStorage.getItem('dailyTipCompleted');
        
        if (isMounted) {
          // Set user preferences
          setUserPreferences(parsedPreferences);
          
          // Set gamification data
          setStreak(storedStreak ? parseInt(storedStreak) : 0);
          setLastVisit(storedLastVisit ? new Date(storedLastVisit) : null);
          setBadges(storedBadges ? JSON.parse(storedBadges) : []);
          setHealthPoints(storedPoints ? parseInt(storedPoints) : 0);
          setDailyTipCompleted(storedDailyTipCompleted === 'true');
          
          // Update streak logic
          updateStreak();
          
          // Show preference form if no preferences exist
          if (!parsedPreferences) {
            setShowPreferenceForm(true);
          } else {
            try {
              const response = await axios.post('/api/personalized', parsedPreferences);
              if (isMounted) {
                setRecommendations(response.data);
                generateDailyTip(parsedPreferences.interests);
              }
            } catch (apiError) {
              console.error('Error fetching recommendations:', apiError);
              if (isMounted) {
                setError('Failed to load recommendations based on your preferences.');
              }
            }
          }
          setError(null);
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        if (isMounted) {
          setError('Failed to load your preferences. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  
  // Generate a daily tip based on user interests
  const generateDailyTip = (interests) => {
    if (!interests || interests.length === 0) return;
    
    // Filter to categories we have tips for
    const availableCategories = interests.filter(interest => 
      healthTips[interest] && healthTips[interest].length > 0
    );
    
    if (availableCategories.length === 0) {
      // Fallback to general categories if user interests don't match our tip categories
      availableCategories.push('Nutrition', 'Fitness', 'Mental Health', 'Sleep');
    }
    
    // Select a random category from the user's interests
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    
    // Select a random tip from that category
    const categoryTips = healthTips[randomCategory] || healthTips['Nutrition']; // Fallback
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    
    setDailyTip({
      category: randomCategory,
      tip: randomTip
    });
  };
  
  // Update streak based on user's last visit
  const updateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison
    
    const storedLastVisit = localStorage.getItem('lastVisit');
    if (storedLastVisit) {
      const lastVisitDate = new Date(storedLastVisit);
      lastVisitDate.setHours(0, 0, 0, 0);
      
      // Check if last visit was yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisitDate.getTime() === yesterday.getTime()) {
        // Increment streak if last visit was yesterday
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('healthStreak', newStreak.toString());
        
        // Give rewards for streak milestones
        if (newStreak === 3) {
          addBadge('Three-Day Streak', 'Completed three days in a row!');
        } else if (newStreak === 7) {
          addBadge('Week Warrior', 'Completed a full week streak!');
        } else if (newStreak === 30) {
          addBadge('Monthly Master', 'Completed a month-long streak!');
        }
      } else if (lastVisitDate.getTime() < yesterday.getTime()) {
        // Reset streak if more than a day has passed
        setStreak(1);
        localStorage.setItem('healthStreak', '1');
      }
      // If same day, do nothing (keep current streak)
    } else {
      // First visit
      setStreak(1);
      localStorage.setItem('healthStreak', '1');
    }
    
    // Update last visit to today
    localStorage.setItem('lastVisit', today.toISOString());
    setLastVisit(today);
    
    // Reset daily tip completion status
    localStorage.setItem('dailyTipCompleted', 'false');
    setDailyTipCompleted(false);
  };
  
  // Add a badge and health points
  const addBadge = (title, description) => {
    const newBadge = {
      id: Date.now(),
      title,
      description,
      dateEarned: new Date().toISOString()
    };
    
    const updatedBadges = [...badges, newBadge];
    setBadges(updatedBadges);
    localStorage.setItem('healthBadges', JSON.stringify(updatedBadges));
    
    // Add points
    const pointsToAdd = 50;
    const newPoints = healthPoints + pointsToAdd;
    setHealthPoints(newPoints);
    localStorage.setItem('healthPoints', newPoints.toString());
    
    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };
  
  // Complete daily tip
  const handleCompleteDailyTip = () => {
    if (dailyTipCompleted) return;
    
    setDailyTipCompleted(true);
    localStorage.setItem('dailyTipCompleted', 'true');
    
    // Add points
    const pointsToAdd = 10;
    const newPoints = healthPoints + pointsToAdd;
    setHealthPoints(newPoints);
    localStorage.setItem('healthPoints', newPoints.toString());
    
    // Check if this is the first completed tip
    if (badges.findIndex(badge => badge.title === 'First Step') === -1) {
      addBadge('First Step', 'Completed your first daily health tip!');
    }
  };

  // Toggle interest selection
  const toggleInterest = (category) => {
    setUserPreferences(prev => {
      const interests = prev.interests.includes(category)
        ? prev.interests.filter(item => item !== category)
        : [...prev.interests, category];

      return { ...prev, interests };
    });
  };

  // Handle form submission: save preferences and fetch new recommendations
  const handleSavePreferences = async (formData) => {
    try {
      setLoading(true);
      localStorage.setItem('userHealthPreferences', JSON.stringify(formData));
      setUserPreferences(formData);

      const response = await axios.post('/api/personalized', formData);
      setRecommendations(response.data);
      generateDailyTip(formData.interests);
      setShowPreferenceForm(false);
      setError(null);
      
      // Award first-time setup badge if this is the first time
      if (badges.findIndex(badge => badge.title === 'Profile Completed') === -1) {
        addBadge('Profile Completed', 'Set up your personalized health profile!');
      }
    } catch (err) {
      console.error('Error saving preferences/fetching recommendations:', err);
      setError('Failed to save preferences or update recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userPreferences) {
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
    <div className="container mx-auto">
      {showPreferenceForm || !userPreferences ? (
        <PreferenceForm
          initialPreferences={userPreferences || {}}
          onSubmit={handleSavePreferences}
        />
      ) : (
        <div>
          {/* Celebration overlay for badges and achievements */}
          {showCelebration && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md mx-auto transform animate-bounce-once">
                <div className="text-5xl text-yellow-500 mb-4">
                  <FaTrophy />
                </div>
                <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
                <p className="text-lg font-medium text-gray-700 mb-3">
                  {badges[badges.length - 1]?.title}
                </p>
                <p className="text-gray-600 mb-4">
                  {badges[badges.length - 1]?.description}
                </p>
                <p className="text-blue-600 font-semibold">+50 Health Points</p>
                <button 
                  onClick={() => setShowCelebration(false)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Personalized Health Journey</h2>
            <button
              onClick={() => setShowPreferenceForm(true)}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Update Preferences
            </button>
          </div>

          {/* Gamification Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <div className="text-3xl mb-2">
                  <FaFire className="text-orange-400" />
                </div>
                <p className="text-xl font-bold">{streak}</p>
                <p className="text-sm">Day Streak</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <div className="text-3xl mb-2">
                  <FaAward className="text-yellow-300" />
                </div>
                <p className="text-xl font-bold">{badges.length}</p>
                <p className="text-sm">Badges Earned</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <div className="text-3xl mb-2">
                  <FaChartLine className="text-green-300" />
                </div>
                <p className="text-xl font-bold">{healthPoints}</p>
                <p className="text-sm">Health Points</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <div className="text-3xl mb-2">
                  <FaCalendarCheck className="text-blue-200" />
                </div>
                <p className="text-xl font-bold">{dailyTipCompleted ? 'Complete' : 'Pending'}</p>
                <p className="text-sm">Today's Tip</p>
              </div>
            </div>
          </div>

          {/* Personalized Content Section - New Feature Highlight */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <FaBookReader className="mr-2" /> Personalized Health Content
                </h2>
                <p className="mb-4">
                  Discover articles, videos, and resources tailored to your health interests and goals.
                  We've curated content specifically based on your preferences.
                </p>
                <Link href="/personalized/content-recommendations" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  Explore Your Content
                </Link>
              </div>
              <div className="hidden md:block">
                <svg className="h-24 w-24 text-white/30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          {/* Daily Health Tip */}
          {dailyTip && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Daily Health Tip</h3>
                  <div className="mb-1 text-sm font-medium text-blue-600">{dailyTip.category}</div>
                  <p className="text-gray-700">{dailyTip.tip}</p>
                </div>
                <button
                  onClick={handleCompleteDailyTip}
                  disabled={dailyTipCompleted}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    dailyTipCompleted
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {dailyTipCompleted ? (
                    <>
                      <FaCheck className="mr-2" /> Completed
                    </>
                  ) : (
                    'Mark as Done (+10 pts)'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* User Preferences Summary */}
          <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Your Health Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Demographics</p>
                <div className="flex space-x-2">
                  {userPreferences.ageRange && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {userPreferences.ageRange}
                    </span>
                  )}
                  {userPreferences.gender && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {userPreferences.gender}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Goals</p>
                <div className="flex flex-wrap gap-1">
                  {userPreferences.healthGoals?.map(goal => (
                    <span key={goal} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Interests</p>
                <div className="flex flex-wrap gap-1">
                  {userPreferences.interests?.map(interest => (
                    <span key={interest} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Recommendations */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
          
          {loading ? (
            <LoadingSpinner />
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">No specific recommendations found based on your preferences.</p>
              <Link href="/knowledge-hub">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Explore Knowledge Hub
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {recommendations.map(recommendation => (
                <div key={recommendation.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform transition-transform hover:scale-105 hover:shadow-lg">
                  <div className="relative h-48 w-full">
                    <img
                      src={recommendation.imageUrl}
                      alt={recommendation.title}
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {recommendation.category}
                    </span>
                    {recommendation.format && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded flex items-center">
                        {recommendation.format === 'video' && '📹 Video'}
                        {recommendation.format === 'article' && '📄 Article'}
                        {recommendation.format === 'infographic' && '📊 Infographic'}
                        {recommendation.format === 'quiz' && '❓ Quiz'}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {recommendation.description}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <a
                        href={recommendation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Learn More →
                      </a>
                      {recommendation.readTime && (
                        <span className="text-xs text-gray-500">
                          {recommendation.readTime} min read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Recent Badges Section */}
          {badges.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Latest Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.slice(-4).reverse().map(badge => (
                  <div key={badge.id} className="bg-white rounded-lg shadow border border-yellow-100 p-4 flex flex-col items-center">
                    <div className="text-4xl mb-2 text-yellow-500">
                      <FaTrophy />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{badge.title}</h4>
                    <p className="text-sm text-gray-600 text-center mb-2">{badge.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(badge.dateEarned).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedLearningComponent; 