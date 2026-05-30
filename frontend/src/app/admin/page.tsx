'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ShieldAlert, 
  Users, 
  Map, 
  FileText, 
  Award,
  Flame,
  UserCheck,
  Calendar,
  Settings
} from 'lucide-react';

interface SystemUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  xp: number;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalNotes: number;
  totalRoadmaps: number;
  totalXP: number;
  averageXP: number;
  activeStreaksCount: number;
  noteCategories: Array<{ _id: string; count: number }>;
  roles: {
    students: number;
    admins: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  const [usersList, setUsersList] = useState<SystemUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('users');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const loadAdminData = async () => {
    try {
      const usersRes = await apiClient('/admin/users');
      const analyticsRes = await apiClient('/admin/analytics');

      if (usersRes.success && usersRes.users) {
        setUsersList(usersRes.users);
      }
      if (analyticsRes.success && analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const handleUpdateRole = async (targetUserId: string, currentRole: 'student' | 'admin') => {
    const newRole = currentRole === 'student' ? 'admin' : 'student';
    if (!confirm(`Are you sure you want to change this user role to ${newRole}?`)) return;

    setUpdatingUserId(targetUserId);
    try {
      const res = await apiClient(`/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });

      if (res.success) {
        setUsersList(prev => prev.map(u => u._id === targetUserId ? { ...u, role: newRole } : u));
        // Refresh analytics count
        loadAdminData();
      }
    } catch (err) {
      console.error('Failed to swap user role:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading || fetching || !user || user.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Global Control Panel</h1>
            <p className="text-xs text-text-muted mt-0.5">Manage user profiles, promote credentials, and check system metrics.</p>
          </div>
        </div>

        {/* Analytics summary grid widgets */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex flex-col justify-between h-20">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Students</span>
              <span className="text-xl font-black text-foreground">{analytics.totalUsers}</span>
            </div>
            <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex flex-col justify-between h-20">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Note files</span>
              <span className="text-xl font-black text-foreground">{analytics.totalNotes}</span>
            </div>
            <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex flex-col justify-between h-20">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Roadmap tracks</span>
              <span className="text-xl font-black text-foreground">{analytics.totalRoadmaps}</span>
            </div>
            <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex flex-col justify-between h-20">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Average XP score</span>
              <span className="text-xl font-black text-foreground">{analytics.averageXP} XP</span>
            </div>
            <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex flex-col justify-between h-20 col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Streaks</span>
              <span className="text-xl font-black text-foreground">{analytics.activeStreaksCount}</span>
            </div>
          </div>
        )}

        {/* Tab triggers */}
        <div className="flex gap-2 border-b border-border/60 pb-px shrink-0 select-none">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-foreground'
            }`}
          >
            User Accounts List
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-foreground'
            }`}
          >
            System Metrics breakdown
          </button>
        </div>

        {/* Workspace views */}
        {activeTab === 'users' ? (
          <Card>
            <CardBody className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-card-bg/20 text-xs font-bold text-text-muted">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Earned XP</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs font-medium text-foreground/90">
                  {usersList.map((sysUser) => (
                    <tr key={sysUser._id} className="hover:bg-card-bg/10">
                      <td className="p-4 font-bold">{sysUser.name}</td>
                      <td className="p-4 text-text-muted font-normal">{sysUser.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          sysUser.role === 'admin' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {sysUser.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold">{sysUser.xp}</td>
                      <td className="p-4 text-text-muted">{new Date(sysUser.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-[10px] cursor-pointer"
                          onClick={() => handleUpdateRole(sysUser._id, sysUser.role)}
                          isLoading={updatingUserId === sysUser._id}
                          disabled={sysUser._id === user.id} // Cannot demote self
                        >
                          <Settings className="h-3 w-3" />
                          <span>Toggle Role</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Role Distributions</CardTitle>
                <CardDescription>Breakdown of administrator vs student profiles</CardDescription>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Student Accounts</span>
                  <span className="text-primary font-bold">{analytics?.roles.students}</span>
                </div>
                <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${analytics ? (analytics.roles.students / analytics.totalUsers) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-2">
                  <span>Administrator Accounts</span>
                  <span className="text-danger font-bold">{analytics?.roles.admins}</span>
                </div>
                <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-danger"
                    style={{ width: `${analytics ? (analytics.roles.admins / analytics.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Vault Categories</CardTitle>
                <CardDescription>Breakdown of student note counts grouped by categories</CardDescription>
              </CardHeader>
              <CardBody className="space-y-3">
                {analytics && analytics.noteCategories.length > 0 ? (
                  analytics.noteCategories.map((cat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-card-bg/20 border border-border/40">
                      <span className="font-bold text-foreground">{cat._id || 'General'}</span>
                      <span className="font-mono text-text-muted font-bold">{cat.count} files</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted font-normal text-center py-6">No categorizations recorded.</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
