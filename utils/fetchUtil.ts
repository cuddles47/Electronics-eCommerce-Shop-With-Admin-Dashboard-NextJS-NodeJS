/**
 * Utility for safe data fetching with error handling and fallbacks
 */

/**
 * Fetches data with error handling and fallbacks for build time
 */
export async function safeFetch(url: any, options = {}) {
  // During build time, return empty data to prevent failures
  // Check both production build and explicit build time flag
  const isBuildTime = 
    (process.env.NODE_ENV === 'production' && typeof window === 'undefined') || 
    process.env.IS_BUILD_TIME === 'true';

  if (isBuildTime) {
    // Return appropriate empty data structure based on the endpoint
    if (url.includes('/api/wishlist')) {
      return [];
    }
    if (url.includes('/api/users')) {
      return { id: '', email: '', role: 'user' };
    }
    if (url.includes('/api/products')) {
      return [];
    }
    return null;
  }

  try {
    // Use environment variable for API URL if possible
    let finalUrl = url;
    if (process.env.NEXT_PUBLIC_API_URL && url.includes('http://localhost:3001')) {
      finalUrl = url.replace('http://localhost:3001', process.env.NEXT_PUBLIC_API_URL);
    }

    const response = await fetch(finalUrl, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    // Return appropriate fallback data
    if (url.includes('/api/wishlist')) {
      return [];
    }
    if (url.includes('/api/users')) {
      return { id: '', email: '', role: 'user' };
    }
    if (url.includes('/api/products')) {
      return [];
    }
    return null;
  }
}
