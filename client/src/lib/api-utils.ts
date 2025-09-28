// API utility functions with retry logic and better error handling
import { warmupEndpoints } from './backend-warmup';

interface ApiCallOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export const apiCall = async (options: ApiCallOptions) => {
  const {
    url,
    method = 'POST',
    body,
    headers = { 'Content-Type': 'application/json' },
    timeout = 30000,
    retries = 2,
    retryDelay = 1000
  } = options;

  // Warm up backend before API call
  await warmupEndpoints();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`API call attempt ${attempt + 1}/${retries + 1} to:`, url);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Request timeout after ${timeout}ms on attempt ${attempt + 1}`);
        controller.abort();
      }, timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status} (attempt ${attempt + 1})`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`API call successful on attempt ${attempt + 1}`);
      return result;

    } catch (error: any) {
      lastError = error;
      console.error(`API call failed on attempt ${attempt + 1}:`, error.message);

      // Don't retry on certain errors
      if (error.name === 'AbortError' && attempt === retries) {
        throw new Error('Request timed out. Please check your connection and try again.');
      }

      if (error.name === 'AbortError' && attempt < retries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }

      // Don't retry on validation errors or client errors
      if (error.message?.includes('HTTP 4')) {
        throw error;
      }

      if (attempt < retries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error('API call failed after all retries');
};

// Specific API functions
export const submitProductInquiry = async (data: any) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';
  return apiCall({
    url: `${API_BASE_URL}/product-inquiries/submit`,
    method: 'POST',
    body: data,
    timeout: 30000,
    retries: 2
  });
};

export const submitNormalInquiry = async (data: any) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';
  return apiCall({
    url: `${API_BASE_URL}/normal-inquiries/submit`,
    method: 'POST',
    body: data,
    timeout: 30000,
    retries: 2
  });
};

export const subscribeNewsletter = async (data: any) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';
  return apiCall({
    url: `${API_BASE_URL}/newsletter/subscribe`,
    method: 'POST',
    body: data,
    timeout: 30000,
    retries: 2
  });
};
