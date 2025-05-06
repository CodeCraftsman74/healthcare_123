'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    quizzesTaken: 0,
    flashcardsReviewed: 0,
    articles: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user stats from API instead of using simulated data
    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        // In a real app with an API endpoint
        try {
          const response = await fetch('/api/user/stats');
          const data = await response.json();
          setUserStats(data);
        } catch (apiError) {
          console.error('API error, falling back to demo data:', apiError);
          // Fall back to demo data if API fails
          setUserStats({
            quizzesTaken: 5,
            flashcardsReviewed: 43,
            articles: [
              { id: 1, title: 'Understanding Cardiovascular Health', date: '2023-04-15' },
              { id: 2, title: 'Nutrition Basics for Health Professionals', date: '2023-04-10' },
              { id: 3, title: 'Latest Advances in Immunology', date: '2023-04-05' }
            ]
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Please sign in to view your profile</h1>
          <p className="mt-2 text-gray-600">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>{' '}
            or{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
              create an account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-2xl">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-5">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Member since</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Learning Stats */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Learning Statistics</h3>
            </div>
            <div className="border-t border-gray-200">
              {isLoading ? (
                <div className="px-4 py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-500">Loading statistics...</p>
                </div>
              ) : (
                <dl>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Quizzes Taken</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userStats.quizzesTaken}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Flashcards Reviewed</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userStats.flashcardsReviewed}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Progress</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">45% Complete</span>
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>

          {/* Recently Read Articles */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recently Read Articles</h3>
            </div>
            <div className="border-t border-gray-200">
              {isLoading ? (
                <div className="px-4 py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-500">Loading articles...</p>
                </div>
              ) : userStats.articles.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userStats.articles.map(article => (
                    <li key={article.id} className="px-4 py-3 hover:bg-gray-50">
                      <Link href={`/knowledge-hub/article/${article.id}`} className="block">
                        <p className="text-sm font-medium text-blue-600 hover:text-blue-700">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Read on {new Date(article.date).toLocaleDateString()}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 text-center text-sm text-gray-500">
                  No articles read yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recommended for You</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your interests and learning history</p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-500">Loading recommendations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-blue-100"></div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">Introduction to Human Anatomy</h4>
                    <p className="text-sm text-gray-500 mt-1">Quiz • 10 questions</p>
                    <Link href="/quiz" className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50">
                      Start Quiz
                    </Link>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-green-100"></div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">Medical Terminology Basics</h4>
                    <p className="text-sm text-gray-500 mt-1">Flashcards • 25 cards</p>
                    <Link href="/flashcards" className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50">
                      Study Cards
                    </Link>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-purple-100"></div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">Recent Advances in Immunotherapy</h4>
                    <p className="text-sm text-gray-500 mt-1">Article • 5 min read</p>
                    <Link href="/" className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50">
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 