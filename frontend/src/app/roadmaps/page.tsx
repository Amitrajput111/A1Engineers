'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Bot, ChevronRight, Award, Compass, Flame, Shield, Layout, Target, BookOpen } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  xpReward: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  modules: Module[];
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  courses: Course[];
}

export default function RoadmapsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const getRoadmapsList = async () => {
        try {
          const res = await apiClient('/roadmaps');
          if (res.success && res.roadmaps) {
            setRoadmaps(res.roadmaps);
          }
        } catch (err) {
          console.error('Error fetching roadmaps:', err);
        } finally {
          setFetching(false);
        }
      };

      getRoadmapsList();
    }
  }, [isAuthenticated]);

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  // Get color styles and icons based on roadmap category
  const getTrackStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('dsa')) {
      return {
        bg: 'from-blue-600/10 to-indigo-600/5 hover:border-blue-500/40 border-blue-500/10',
        text: 'text-blue-400',
        pill: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        glow: 'hover:shadow-blue-500/5',
        button: 'hover:bg-blue-600 hover:text-white border-blue-500/30 text-blue-400 bg-transparent',
        icon: <Target className="h-5 w-5 text-blue-400" />
      };
    }
    if (cat.includes('web') || cat.includes('dev')) {
      return {
        bg: 'from-purple-600/10 to-pink-600/5 hover:border-purple-500/40 border-purple-500/10',
        text: 'text-purple-400',
        pill: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        glow: 'hover:shadow-purple-500/5',
        button: 'hover:bg-purple-600 hover:text-white border-purple-500/30 text-purple-400 bg-transparent',
        icon: <Layout className="h-5 w-5 text-purple-400" />
      };
    }
    if (cat.includes('ai') || cat.includes('ml') || cat.includes('python')) {
      return {
        bg: 'from-emerald-600/10 to-teal-600/5 hover:border-emerald-500/40 border-emerald-500/10',
        text: 'text-emerald-400',
        pill: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        glow: 'hover:shadow-emerald-500/5',
        button: 'hover:bg-emerald-600 hover:text-white border-emerald-500/30 text-emerald-400 bg-transparent',
        icon: <Bot className="h-5 w-5 text-emerald-400" />
      };
    }
    if (cat.includes('cyber') || cat.includes('security')) {
      return {
        bg: 'from-red-600/10 to-orange-600/5 hover:border-red-500/40 border-red-500/10',
        text: 'text-red-400',
        pill: 'bg-red-500/10 border-red-500/20 text-red-400',
        glow: 'hover:shadow-red-500/5',
        button: 'hover:bg-red-600 hover:text-white border-red-500/30 text-red-400 bg-transparent',
        icon: <Shield className="h-5 w-5 text-red-400" />
      };
    }
    // Placement
    return {
      bg: 'from-amber-600/10 to-yellow-600/5 hover:border-amber-500/40 border-amber-500/10',
      text: 'text-amber-400',
      pill: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      glow: 'hover:shadow-amber-500/5',
      button: 'hover:bg-amber-600 hover:text-white border-amber-500/30 text-amber-400 bg-transparent',
      icon: <Award className="h-5 w-5 text-amber-400" />
    };
  };

  return (
    <div className="flex-1 bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Banner header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold select-none">
            <Compass className="h-3.5 w-3.5 animate-pulse" />
            <span>Structured Path Syllabus</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Choose Your Learning Path
          </h1>
          <p className="text-sm text-text-muted leading-relaxed font-normal">
            Take control of your engineering education. Follow structured developer roadmaps, learn core subjects step-by-step with verified notes, review coding models, and earn XP.
          </p>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {roadmaps.map((rm) => {
            const styles = getTrackStyles(rm.category);
            const modulesCount = rm.courses.reduce((acc, c) => acc + c.modules.length, 0);
            const lessonsCount = rm.courses.reduce((acc, c) => acc + c.modules.reduce((acc2, m) => acc2 + m.lessons.length, 0), 0);

            return (
              <div 
                key={rm.id} 
                className={`flex flex-col justify-between rounded-xl border bg-gradient-to-br ${styles.bg} p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] ${styles.glow}`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${styles.pill}`}>
                      {rm.category}
                    </span>
                    {styles.icon}
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-white">{rm.title}</h3>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed font-normal line-clamp-3">
                    {rm.description}
                  </p>
                </div>
                
                <div className="border-t border-border/40 mt-6 pt-4 flex items-center justify-between">
                  <div className="flex gap-4 text-xs font-semibold text-text-muted font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-text-muted" />
                      {modulesCount} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-text-muted" />
                      {lessonsCount} Lessons
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`gap-1 cursor-pointer font-bold ${styles.button} border transition-colors`}
                    onClick={() => router.push(rm.id === 'dsa' ? '/dsa' : `/roadmaps/${rm.id}`)}
                  >
                    <span>Start Learning</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
