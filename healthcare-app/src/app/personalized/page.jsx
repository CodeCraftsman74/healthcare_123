'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalizedLearningComponent from '@/components/PersonalizedLearning/PersonalizedLearningComponent';
import { getCookie, deleteCookie } from 'cookies-next';
import axios from 'axios';

export default function PersonalizedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  
  // Check if the user is authenticated
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        // Check for cookie
        const authCookie = getCookie('auth-token');
        if (!authCookie) {
          console.log('No auth cookie found, redirecting to login');
          setAuthError('No authentication token found');
          window.location.href = '/auth/login?redirectTo=/personalized';
          return;
        }
        
        console.log('Auth cookie found, verifying with backend');
        // Verify with backend
        const response = await axios.get('/api/auth/me');
        console.log('User data received from backend:', response.data.user?.email);
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsLoading(false);
          setAuthError(null);
        } else {
          console.error('Invalid user data received');
          setAuthError('Authentication failed - invalid user data');
          deleteCookie('auth-token');
          window.location.href = '/auth/login?redirectTo=/personalized';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Clear invalid cookie
        deleteCookie('auth-token');
        setAuthError('Authentication failed - server error');
        window.location.href = '/auth/login?redirectTo=/personalized';
      }
    };

    verifyAuth();
  }, []);

  if (authError) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center bg-red-50 p-6 rounded-lg border border-red-100 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Authentication Error</h2>
          <p className="text-red-600 mb-4">{authError}</p>
          <button 
            onClick={() => window.location.href = '/auth/login?redirectTo=/personalized'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {user && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <p className="text-blue-800">
            Welcome back, <span className="font-medium">{user.username || user.email}</span>!
            <span className="block mt-2 text-sm">You have been successfully logged in.</span>
          </p>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Personalized Health Learning</h1>
      <p className="text-gray-600 mb-8">
        Get tailored health recommendations and resources based on your interests and preferences.
        Track your progress and earn rewards for consistent engagement.
      </p>
      {user && <PersonalizedLearningComponent user={user} />}
    </div>
  );
} 