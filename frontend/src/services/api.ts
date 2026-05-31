import { useAuthStore } from '../store/authStore';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

interface RequestOptions extends RequestInit {
  token?: string;
}

export const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
  const { headers, token, ...customOptions } = options;
  
  // Try to retrieve token from Zustand or localStorage
  let activeToken = token;
  if (!activeToken && typeof window !== 'undefined') {
    activeToken = localStorage.getItem('accessToken') || undefined;
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (activeToken) {
    defaultHeaders['Authorization'] = `Bearer ${activeToken}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Important to pass secure cookies back & forth
    ...customOptions,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If unauthorized, attempt to run refresh token
  if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.token;
        
        if (newAccessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
          useAuthStore.getState().setToken(newAccessToken);
          
          // Re-run original request with new token
          defaultHeaders['Authorization'] = `Bearer ${newAccessToken}`;
          const retryConfig = { ...config, headers: defaultHeaders };
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, retryConfig);
          return await handleResponse(retryResponse);
        }
      } else {
        // Refresh token failed, force logout
        useAuthStore.getState().logoutSuccess();
      }
    } catch (refreshErr) {
      console.error('Failed to auto-refresh token:', refreshErr);
      useAuthStore.getState().logoutSuccess();
    }
  }

  return handleResponse(response);
};

const handleResponse = async (response: Response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (response.ok) {
    return data;
  }

  const errorMessage = data?.error || data?.message || response.statusText || 'API execution error';
  const error = new Error(errorMessage) as any;
  error.status = response.status;
  error.data = data;
  throw error;
};
