'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  Compass, 
  ArrowRight, 
  Flame,
  Award
} from 'lucide-react';

interface DsaTopic {
  slug: string;
  name: string;
  difficulty: string;
  sequenceOrder: number;
  completed: boolean;
}

export default function DsaRoadmapPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [topics, setTopics] = useState<DsaTopic[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchDsaRoadmap = async () => {
    try {
      const res = await apiClient('/roadmaps/dsa/topics');
      if (res.success && res.topics) {
        setTopics(res.topics);
      }
    } catch (err) {
      console.error('Failed to fetch DSA topics:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDsaRoadmap();
    }
  }, [isAuthenticated]);

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading DSA Roadmap...</p>
        </div>
      </div>
    );
  }

  // Determine unlock state sequentially
  const firstIncompleteIdx = topics.findIndex(t => !t.completed);
  
  const formattedTopics = topics.map((t, idx) => {
    let isLocked = false;
    if (firstIncompleteIdx !== -1 && idx > firstIncompleteIdx) {
      isLocked = true;
    }
    return {
      ...t,
      isLocked
    };
  });

  const completedCount = topics.filter(t => t.completed).length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
  
  const currentTopic = firstIncompleteIdx !== -1 ? topics[firstIncompleteIdx] : null;

  return (
    <div className="flex-1 bg-background text-foreground relative overflow-hidden p-6 pb-20">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative">
        
        {/* Navigation Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white font-bold select-none cursor-pointer">
          <ChevronLeft className="h-4 w-4" />
          <span>Home Dashboard</span>
        </Link>

        {/* Hero title block */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold select-none">
            <Compass className="h-3.5 w-3.5 animate-pulse" />
            <span>Redesigned Visual DSA Track</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            DSA & Problem Solving Roadmap
          </h1>
          <p className="text-xs text-text-muted max-w-xl font-normal leading-relaxed">
            No note walls. No 1000+ question grinds. Learn visually, map algorithms to key patterns, and understand concepts in under 5 minutes.
          </p>
        </div>

        {/* 1. Progress Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 to-indigo-500/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <CardBody className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2.5 flex-1">
                  <span className="text-[10px] font-black text-primary tracking-wider uppercase font-mono">Current Track Progress</span>
                  
                  {currentTopic ? (
                    <div>
                      <h4 className="text-lg font-black text-white">Active: {currentTopic.name}</h4>
                      <p className="text-xs text-text-muted font-normal mt-1">First incomplete topic in roadmap sequence.</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-black text-white">Roadmap Fully Mastered! 🎉</h4>
                      <p className="text-xs text-text-muted font-normal mt-1">Excellent work, you have completed all 14 DSA topics.</p>
                    </div>
                  )}

                  {/* Progress tracker bar */}
                  <div className="space-y-1.5 pt-2 max-w-md">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                      <span className="text-text-muted">Mastery Completed</span>
                      <span className="text-primary">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        style={{ 
                          width: `${progressPercent}%`,
                          background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs font-bold font-mono">
                    <Flame className="h-4 w-4 fill-warning" />
                    <span>{user?.streak || 0} Days</span>
                  </div>
                  {currentTopic && (
                    <Button 
                      size="lg" 
                      className="gap-2 cursor-pointer font-bold bg-gradient-to-r from-primary to-secondary text-white border-0 hover:opacity-90 shadow-xl shadow-primary/10"
                      onClick={() => router.push(`/dsa/${currentTopic.slug}`)}
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* 2. Learning Roadmap (Connected nodes view) */}
        <div className="space-y-6 pt-4">
          <div className="text-center md:text-left select-none pb-2 border-b border-border/40">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Roadmap Node Sequence</h2>
            <p className="text-xs text-text-muted mt-1">Complete each topic to unlock the next level.</p>
          </div>

          <div className="relative flex flex-col items-center py-6 space-y-12">
            {/* Draw vertical connecting SVG line between node nodes */}
            <div className="absolute top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary via-border/50 to-border/10 -z-10" />

            {formattedTopics.map((topic, index) => {
              const difficultyColor = 
                topic.difficulty === 'Beginner' ? 'text-blue-400' :
                topic.difficulty === 'Easy' ? 'text-teal-400' :
                topic.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400';

              return (
                <div 
                  key={topic.slug} 
                  className={`w-full max-w-md flex items-center gap-4 transition-all duration-300 ${
                    topic.isLocked ? 'opacity-40 pointer-events-none' : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Step Sequence Number Indicator */}
                  <span className="h-8 w-8 rounded-full border border-border bg-[#03070E] text-text-muted font-bold font-mono text-xs flex items-center justify-center shrink-0 select-none">
                    {index + 1}
                  </span>

                  {/* Connected Topic Node Card */}
                  <div 
                    onClick={() => {
                      if (!topic.isLocked) {
                        router.push(`/dsa/${topic.slug}`);
                      }
                    }}
                    className={`flex-1 p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 ${
                      topic.isLocked 
                        ? 'bg-[#1F2937] border-[#374151] cursor-not-allowed text-[#6B7280]'
                        : topic.completed 
                          ? 'bg-[#16A34A] border-[#22C55E] hover:opacity-95'
                          : 'bg-[#2563EB] border-[#60A5FA] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:scale-[1.01]'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <h4 className={`font-extrabold text-sm truncate ${topic.isLocked ? 'text-[#6B7280]' : 'text-white'}`}>{topic.name}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-bold font-mono uppercase">
                        <span className={topic.isLocked ? 'text-[#6B7280]' : difficultyColor}>{topic.difficulty}</span>
                        <span className={topic.isLocked ? 'text-[#6B7280]' : 'text-text-muted'}>•</span>
                        <span className={topic.isLocked ? 'text-[#6B7280]' : 'text-text-muted'}>Node {index + 1}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {topic.isLocked ? (
                        <div className="h-7 w-7 rounded-full bg-[#1F2937] flex items-center justify-center border border-[#374151] text-[#6B7280]">
                          <Lock className="h-3.5 w-3.5" />
                        </div>
                      ) : topic.completed ? (
                        <div className="h-7 w-7 rounded-full bg-black/25 flex items-center justify-center border border-[#22C55E] text-[#22C55E]">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-black/25 flex items-center justify-center border border-[#60A5FA] text-white">
                          <Circle className="h-4 w-4 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
