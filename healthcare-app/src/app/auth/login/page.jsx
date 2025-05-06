'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { deleteCookie, setCookie } from 'cookies-next';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/personalized/direct';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  // Set a message when redirected from protected routes
  useEffect(() => {
    if (redirectTo && redirectTo.startsWith('/personalized')) {
      setLoginMessage('Please sign in to access personalized learning features.');
    } else if (redirectTo && redirectTo.startsWith('/profile')) {
      setLoginMessage('Please sign in to access your profile.');
    }
    
    // Clear any existing authentication tokens
    deleteCookie('auth-token');
    
    console.log('Login page loaded with redirectTo:', redirectTo);
  }, [redirectTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLoginSuccess(false);

    try {
      console.log('Submitting login form with email:', formData.email);
      console.log('Will redirect to:', redirectTo);
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login response received:', response.status);

      // The response data just needs to be successful
      if (response.data && response.data.message === 'Login successful') {
        console.log('Login successful, will navigate to:', redirectTo);
        setLoginSuccess(true);
        
        if (response.data.user?._id) {
          console.log('Setting user ID cookie on client side as backup');
          setUserId(response.data.user._id);
          setCookie('auth-token', response.data.user._id);
          
          // Also save to localStorage as a backup
          try {
            localStorage.setItem('userId', response.data.user._id);
            console.log('User ID saved to localStorage as backup');
          } catch (e) {
            console.error('Error saving to localStorage:', e);
          }
        }
        
        // Create a short timeout to ensure cookie is set before redirect
        setTimeout(() => {
          // Use the most direct navigation approach possible
          try {
            // Try opening in same tab first
            window.location.replace('/personalized/direct');
          } catch (e) {
            console.error('Error with replace navigation:', e);
            try {
              // Fallback to href
              window.location.href = '/personalized/direct';
            } catch (e2) {
              console.error('Error with href navigation:', e2);
              // Final fallback - create and click a link
              try {
                const link = document.createElement('a');
                link.href = '/personalized/direct';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
              } catch (e3) {
                console.error('All navigation methods failed:', e3);
              }
            }
          }
        }, 300); // Increased timeout to ensure cookie is set
      } else {
        console.error('Invalid login response format:', response.data);
        setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Error details:', err.response.status, err.response.data);
        setError(err.response.data?.error || `Login failed with status ${err.response.status}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Login failed - no response from server. Check your connection.');
      } else {
        console.error('Request setup error:', err.message);
        setError(`Login request failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle manual navigation if auto-redirect fails
  const handleManualRedirect = () => {
    // Always go to the direct page to avoid middleware issues
    window.location.href = '/personalized/direct';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-blue-600">MediLearn</h1>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          {loginMessage && !loginSuccess && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-700 text-center">{loginMessage}</p>
            </div>
          )}
          {loginSuccess && (
            <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm text-green-700 text-center">Login successful!</p>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600 mb-2">If you're not redirected automatically:</p>
                <button
                  onClick={handleManualRedirect}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  Go to Personalized Page
                </button>
                <div className="mt-2">
                  <a 
                    href="/personalized/direct" 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Access direct page
                  </a>
                </div>
              </div>
            </div>
          )}
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {!loginSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Processing...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        )}
          
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 