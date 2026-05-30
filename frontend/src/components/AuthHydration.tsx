'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../services/api';

export const AuthHydration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loginSuccess, logoutSuccess, setLoading } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        const defaultMockUser = {
          id: '60d5ec49f83c2c1a403d12f3',
          name: 'Amit Rajput',
          email: 'amit.rajput.oauth@gmail.com',
          role: 'student' as const,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120',
          xp: 150,
          streak: 3,
          completedLessons: [],
          currentCourseId: 'dsa/arrays-basics'
        };

        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            loginSuccess(parsedUser, token);
            
            // Background verification request to sync profile XP/streak
            const response = await apiClient('/auth/profile');
            if (response.success && response.user) {
              const freshUser = {
                id: response.user._id || response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role as 'student' | 'admin',
                avatar: response.user.avatar,
                xp: response.user.xp,
                streak: response.user.streak,
                completedLessons: response.user.completedLessons || [],
                currentCourseId: response.user.currentCourseId || '',
              };
              loginSuccess(freshUser, token);
            }
          } catch (err) {
            console.error('Session validation failed:', err);
          }
        } else {
          localStorage.setItem('accessToken', 'mock-auth-token-key-2026');
          localStorage.setItem('user', JSON.stringify(defaultMockUser));
          loginSuccess(defaultMockUser, 'mock-auth-token-key-2026');
        }
      }
      setLoading(false);
      setHydrated(true);
    };

    hydrateAuth();
  }, [loginSuccess, logoutSuccess, setLoading]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Initializing A1 Learner...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
