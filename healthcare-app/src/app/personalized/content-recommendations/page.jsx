'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentRecommendations from '@/components/ContentRecommendations/ContentRecommendations';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';

export default function ContentRecommendationsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if the user is authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        // Try cookie first
        const authCookie = getCookie('auth-token');
        console.log('Content page - Auth cookie found:', authCookie ? 'yes' : 'no');
        
        // If no cookie, try localStorage
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
        
        // Verify with backend
        try {
          const response = await axios.get('/api/auth/me');
          console.log('User data received:', response.data?.user?.email);
          setUser(response.data.user);
          setLoading(false);
        } catch (err) {
          console.error('Auth verification failed:', err);
          // Redirect to login on auth failure
          router.push('/auth/login?redirectTo=/personalized/content-recommendations');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login?redirectTo=/personalized/content-recommendations');
      }
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading your personalized content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Personalized Health Content</h1>
        <p className="text-gray-600">
          Curated health content personalized to your interests and health goals.
          Browse articles, videos, and resources tailored specifically for you.
        </p>
      </div>
      
      {user && <ContentRecommendations user={user} />}
    </div>
  );
} 