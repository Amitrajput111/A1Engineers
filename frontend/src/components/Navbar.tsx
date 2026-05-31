'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';
import { Flame, ShieldAlert, Award, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { apiClient } from '../services/api';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logoutSuccess } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API failed:', err);
    } finally {
      logoutSuccess();
      router.push('/');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Study Vault', href: '/notes' },
    { name: 'Tracks', href: '/#syllabus-section' },
    { name: 'Progress', href: '/dsa' },
    { name: 'Profile', href: '/profile' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/#syllabus-section') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] border-b border-white/[0.06] bg-[#020817]/80 backdrop-blur-lg flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left - Logo Area */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] font-black text-white text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                A1
              </span>
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                A1 Learning
              </span>
            </Link>
          </div>

          {/* Center - Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 pb-1 group ${
                  isActive(link.href)
                    ? 'text-[#60A5FA]'
                    : 'text-[#94A3B8] hover:text-[#60A5FA]'
                }`}
              >
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#60A5FA] transform origin-left transition-transform duration-300 ${
                  isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right - Profile & CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {/* Streak Counter */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold font-mono">
                  <Flame className="h-4 w-4 fill-warning" />
                  <span>{user.streak} Days</span>
                </div>

                {/* XP Count */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                  <Award className="h-4 w-4" />
                  <span>{user.xp} XP</span>
                </div>

                {/* Admin dashboard quicklink */}
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-1.5 border border-danger/30 text-danger hover:bg-danger/10">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}

                {/* Profile Avatar & dropdown click */}
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#1E293B]/50 border border-transparent hover:border-white/[0.08] transition-all cursor-pointer">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-white uppercase">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#CBD5E1] max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm font-semibold text-[#CBD5E1] hover:text-[#60A5FA]">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white hover:brightness-110 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] font-semibold border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-border/30 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-border px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-muted hover:bg-border/30 hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <hr className="border-border/50" />

          <div className="flex flex-col gap-2 pt-1">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-card-bg/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-warning font-bold text-sm">
                    <Flame className="h-4 w-4 fill-warning" />
                    <span>{user.streak} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
                    <Award className="h-4 w-4" />
                    <span>{user.xp} XP</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-danger border-danger/30 hover:bg-danger/10 gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}

                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-1.5">
                    <UserIcon className="h-4 w-4" />
                    View Profile
                  </Button>
                </Link>

                <Button variant="danger" className="w-full gap-1.5" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
