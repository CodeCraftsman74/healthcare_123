'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';

export default function DirectAccessPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const authCookie = getCookie('auth-token');
        console.log('Direct page - Auth cookie found:', authCookie ? 'yes' : 'no');
        
        // If no cookie, try to get it from localStorage as fallback
        if (!authCookie) {
          try {
            const localStorageAuth = localStorage.getItem('userId');
            if (localStorageAuth) {
              console.log('Found auth in localStorage, using it as fallback');
              setCookie('auth-token', localStorageAuth);
            }
          } catch (e) {
            console.error('Error accessing localStorage:', e);
          }
        }
        
        // Try getting user data regardless of cookie status
        try {
          console.log('Checking authentication with backend');
          const response = await axios.get('/api/auth/me');
          console.log('User data received:', response.data?.user?.email);
          
          if (response.data?.user) {
            setUser(response.data.user);
            setError(null);
            
            // Save user ID to localStorage as backup
            try {
              localStorage.setItem('userId', response.data.user._id);
              console.log('Saved user ID to localStorage as backup');
            } catch (e) {
              console.error('Error saving to localStorage:', e);
            }
          } else {
            throw new Error('Invalid user data received');
          }
        } catch (err) {
          console.error('Error verifying user:', err);
          setError('Authentication verification failed');
          // Don't redirect, just show error message
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  // Function to handle login directly from this page
  const handleLogin = () => {
    window.location.href = '/auth/login?redirectTo=/personalized/direct';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Personalized Learning Center</h1>
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Personalized Learning Center</h1>
        
        {error ? (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
            <p className="text-yellow-700">{error}</p>
            <button 
              onClick={handleLogin}
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        ) : user ? (
          <div>
            <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-6">
              <p className="text-green-700">
                Welcome back, <span className="font-semibold">{user.username || user.email}</span>!
                <span className="block mt-2 text-sm">You are successfully logged in.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link href="/personalized/content-recommendations" 
                className="p-6 border rounded-lg hover:shadow-md transition-shadow flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Content Recommendations</h2>
                <p className="text-gray-600 text-center">Discover health content personalized for your interests</p>
              </Link>
              
              <Link href="/profile" 
                className="p-6 border rounded-lg hover:shadow-md transition-shadow flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Profile</h2>
                <p className="text-gray-600 text-center">View and manage your profile settings</p>
              </Link>
            </div>
            
            <div className="mt-8 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Direct Access Links</h3>
              <p className="text-sm text-gray-600 mb-3">If you encounter navigation issues, use these direct links:</p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/personalized/content-recommendations" 
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Content Recommendations
                </a>
                <a 
                  href="/profile" 
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  User Profile
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
            <p className="text-yellow-700">You need to log in to access personalized features.</p>
            <button
              onClick={handleLogin}
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 