'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { 
  Award, 
  Flame, 
  User as UserIcon, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  Lock,
  Unlock,
  Check
} from 'lucide-react';

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated, isLoading } = useAuthStore();
  
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSelectedAvatar(user.avatar || AVATARS[0]);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      const res = await apiClient('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, avatar: selectedAvatar }),
      });

      if (res.success && res.user) {
        setUser({
          ...user!,
          name: res.user.name,
          avatar: res.user.avatar,
        });
        setStatus('success');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Level calculations
  const currentLevel = Math.floor(user.xp / 1000) + 1;
  const xpInCurrentLevel = user.xp % 1000;
  const levelProgressPercent = Math.min((xpInCurrentLevel / 1000) * 100, 100);

  // Badges milestones checklist
  const developerBadges = [
    { name: 'Recursion Wizard', xpRequired: 100, description: 'Unlock by completing your first topic' },
    { name: 'Stack Ninja', xpRequired: 500, description: 'Unlock by scoring over 500 total XP points' },
    { name: 'AI Alchemist', xpRequired: 1000, description: 'Achieve level 2 engineer status' },
    { name: 'System Architect', xpRequired: 2500, description: 'Unlock by earning 2,500 total XP points' },
  ];

  return (
    <div className="flex-1 bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel: Avatar selector & name settings */}
          <div className="md:w-1/2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Customize your learning profile identification</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                
                {/* Status banner */}
                {status === 'success' && (
                  <div className="p-3.5 rounded-lg border border-success/25 bg-success/10 text-success text-xs font-semibold">
                    Profile details updated successfully!
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-3.5 rounded-lg border border-danger/25 bg-danger/10 text-danger text-xs font-semibold">
                    Failed to save details. Please try again.
                  </div>
                )}

                {/* Avatar select grid */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-text-muted">Select Avatar Icon</span>
                  <div className="flex gap-4 pt-1.5">
                    {AVATARS.map((avUrl, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedAvatar(avUrl)}
                        className={`relative h-12 w-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedAvatar === avUrl ? 'border-primary scale-110' : 'border-border hover:border-text-muted'
                        }`}
                      >
                        <img src={avUrl} alt="avatar option" className="h-full w-full object-cover" />
                        {selectedAvatar === avUrl && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Input
                  label="Display Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amit Rajput"
                  disabled={saving}
                />

                <Input
                  label="Email Address (Locked)"
                  type="email"
                  value={user.email}
                  disabled
                  helperText="Primary email cannot be changed."
                />

                <Button 
                  onClick={handleSaveProfile} 
                  isLoading={saving}
                  className="w-full justify-center pt-2.5 pb-2.5 font-semibold"
                >
                  Save Profile Settings
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Right panel: Gamified Statistics & Achievements Badges */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Level Progression</CardTitle>
                <CardDescription>Your gamified developer journey checkpoints</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                
                {/* Level Card metrics */}
                <div className="p-4 rounded-xl border border-border/80 bg-card-bg/25 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                      <Sparkles className="h-4 w-4" />
                      <span>CURRENT RANK</span>
                    </div>
                    <h3 className="text-xl font-black text-foreground">Level {currentLevel} Engineer</h3>
                    <p className="text-[10px] text-text-muted font-bold">Accumulated: {user.xp} Total XP</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-lg select-none">
                    L{currentLevel}
                  </div>
                </div>

                {/* Level XP Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-text-muted">
                    <span>XP Milestone</span>
                    <span>{xpInCurrentLevel} / 1000 XP</span>
                  </div>
                  <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${levelProgressPercent}%` }}
                    />
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Badges checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-foreground">Unlocked Badges</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {developerBadges.map((badge, idx) => {
                      const isUnlocked = user.xp >= badge.xpRequired;
                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border flex gap-3 items-center ${
                            isUnlocked 
                              ? 'border-secondary/30 bg-secondary/5 text-foreground' 
                              : 'border-border/50 bg-[#0B0F19]/20 text-text-muted/60'
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isUnlocked ? 'bg-secondary/15 text-secondary border border-secondary/20' : 'bg-border/30 border border-transparent'
                          }`}>
                            {isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold ${isUnlocked ? 'text-foreground' : 'text-text-muted/50'}`}>
                              {badge.name}
                            </h4>
                            <p className="text-[9px] text-text-muted truncate mt-0.5 font-semibold">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </CardBody>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
