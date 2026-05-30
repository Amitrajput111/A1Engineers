'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../services/api';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  ChevronLeft, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Target,
  Layout,
  Bot,
  Shield,
  Compass
} from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  xpReward: number;
}

interface Module {
  title: string;
  description?: string;
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

interface PageProps {
  params: Promise<{ id: string }>;
}

const getTrackStyles = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('dsa')) {
    return {
      text: 'text-blue-400',
      pill: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      border: 'hover:border-blue-500/30 hover:shadow-blue-500/5',
      glow: 'shadow-blue-500/5',
      bgGlow: 'bg-blue-500/5',
      icon: <Target className="h-4 w-4 text-blue-400" />
    };
  }
  if (cat.includes('web') || cat.includes('dev')) {
    return {
      text: 'text-purple-400',
      pill: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      border: 'hover:border-purple-500/30 hover:shadow-purple-500/5',
      glow: 'shadow-purple-500/5',
      bgGlow: 'bg-purple-500/5',
      icon: <Layout className="h-4 w-4 text-purple-400" />
    };
  }
  if (cat.includes('ai') || cat.includes('ml') || cat.includes('python')) {
    return {
      text: 'text-emerald-400',
      pill: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      border: 'hover:border-emerald-500/30 hover:shadow-emerald-500/5',
      glow: 'shadow-emerald-500/5',
      bgGlow: 'bg-emerald-500/5',
      icon: <Bot className="h-4 w-4 text-emerald-400" />
    };
  }
  if (cat.includes('cyber') || cat.includes('security')) {
    return {
      text: 'text-red-400',
      pill: 'bg-red-500/10 border-red-500/20 text-red-400',
      border: 'hover:border-red-500/30 hover:shadow-red-500/5',
      glow: 'shadow-red-500/5',
      bgGlow: 'bg-red-500/5',
      icon: <Shield className="h-4 w-4 text-red-400" />
    };
  }
  return {
    text: 'text-amber-400',
    pill: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    border: 'hover:border-amber-500/30 hover:shadow-amber-500/5',
    glow: 'shadow-amber-500/5',
    bgGlow: 'bg-amber-500/5',
    icon: <Award className="h-4 w-4 text-amber-400" />
  };
};

export default function PathDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [pathId, setPathId] = useState<string | null>(null);

  const [roadmap, setRoadmap] = useState<RoadmapItem | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);

  // Resolve params promise
  useEffect(() => {
    params.then(p => setPathId(p.id));
  }, [params]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && pathId) {
      const getPathData = async () => {
        try {
          const res = await apiClient('/roadmaps');
          if (res.success && res.roadmaps) {
            const list: RoadmapItem[] = res.roadmaps;
            const match = list.find(r => r.id === pathId);
            if (match) {
              setRoadmap(match);
            }
            setCompletedLessons(res.completedLessons || []);
          }
        } catch (err) {
          console.error('Error fetching path syllabus details:', err);
        } finally {
          setFetching(false);
        }
      };

      getPathData();
    }
  }, [isAuthenticated, pathId]);

  if (isLoading || fetching || !roadmap) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading syllabus...</p>
        </div>
      </div>
    );
  }

  // Calculate course completion progress
  const activeCourse = roadmap.courses[0];
  const totalLessons = activeCourse ? activeCourse.modules.reduce((acc, curr) => acc + curr.lessons.length, 0) : 0;
  const completedInPath = activeCourse ? activeCourse.modules.reduce((acc, mod) => {
    const completedCount = mod.lessons.filter(l => completedLessons.includes(`${roadmap.id}/${l.id}`)).length;
    return acc + completedCount;
  }, 0) : 0;

  const percent = totalLessons > 0 ? Math.round((completedInPath / totalLessons) * 100) : 0;
  const styles = getTrackStyles(roadmap.category);

  return (
    <div className="flex-1 bg-background p-6 relative">
      {/* Background glow for the pathway */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[250px] w-full max-w-4xl rounded-full ${styles.bgGlow} blur-3xl opacity-60`} />
      
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Back Link */}
        <Link href="/roadmaps" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white font-bold select-none cursor-pointer">
          <ChevronLeft className="h-4 w-4" />
          <span>All Learning Paths</span>
        </Link>

        {/* Path Header */}
        <div className="border-b border-border pb-6 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${styles.pill} font-mono flex items-center gap-1`}>
                {styles.icon}
                {roadmap.category}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mt-3.5">{roadmap.title}</h1>
            <p className="text-xs text-text-muted mt-2 max-w-2xl font-normal leading-relaxed">{roadmap.description}</p>
          </div>

          {activeCourse && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap text-xs text-text-muted font-bold font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-4.5 w-4.5 text-text-muted" />
                  <span>{activeCourse.duration}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4.5 w-4.5 text-text-muted" />
                  <span>{activeCourse.difficulty}</span>
                </span>
                <span className={`${styles.text}`}>{percent}% Completed ({completedInPath}/{totalLessons} lessons)</span>
              </div>
              
              {/* Dynamic progress and time completion bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl bg-black/25 border border-border/40 p-4 rounded-lg">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                    <span className="text-text-muted">Lessons Completed</span>
                    <span className={styles.text}>{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-primary transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                    <span className="text-text-muted font-bold">Completion Time Bar</span>
                    <span className={styles.text}>
                      {Math.round((percent / 100) * (parseInt(activeCourse.duration) || 10) * 10) / 10}h / {parseInt(activeCourse.duration) || 10}h
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-primary transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Syllabus outline */}
        {activeCourse ? (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Modules & Lessons</h2>
            
            <div className="space-y-4">
              {activeCourse.modules.map((mod, modIdx) => (
                <Card key={modIdx} className={`border border-border/40 hover:border-border/80 transition-all duration-300`}>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-black text-white">{mod.title}</CardTitle>
                    {mod.description && <CardDescription>{mod.description}</CardDescription>}
                  </CardHeader>
                  <CardBody className="p-0 divide-y divide-border/40 text-xs font-medium">
                    {mod.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(`${roadmap.id}/${lesson.id}`);
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => router.push(`/roadmaps/${roadmap.id}/${lesson.id}`)}
                          className="p-4 flex items-center justify-between hover:bg-card-bg/50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" />
                            ) : (
                              <Circle className="h-4.5 w-4.5 text-border shrink-0" />
                            )}
                            <span className="text-white font-bold group-hover:text-primary transition-colors truncate">{lesson.title}</span>
                          </div>
                          
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 cursor-pointer">
                            <span>Start</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted text-xs font-semibold">
            No courses configured under this learning path yet.
          </div>
        )}

      </div>
    </div>
  );
}
