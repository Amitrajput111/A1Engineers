'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowRight, 
  BookOpen, 
  Award, 
  Flame, 
  Clock, 
  FileText, 
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  modules: Array<{
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      xpReward: number;
    }>;
  }>;
}

interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  courses: Course[];
}

interface Note {
  _id: string;
  title: string;
  category: string;
  updatedAt: string;
}

export default function RedesignedDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(true);
  
  // Progression States derived from user
  const [currentCourse, setCurrentCourse] = useState<{ title: string; percent: number; path: string; lessonId: string } | null>(null);
  const [nextLesson, setNextLesson] = useState<{ title: string; url: string; category: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const getDashboardData = async () => {
        try {
          const roadmapsRes = await apiClient('/roadmaps');
          const notesRes = await apiClient('/notes');
          
          if (roadmapsRes.success && roadmapsRes.roadmaps) {
            const list: RoadmapItem[] = roadmapsRes.roadmaps;
            setRoadmaps(list);
            
            const completed = user.completedLessons || [];
            
            // Find current course progress
            let activeCourse: Course | null = null;
            let activePath = '';
            
            // Locate user's active/last-accessed course path
            if (user.currentCourseId) {
              const [catPath, lesId] = user.currentCourseId.split('/');
              activePath = catPath;
              const roadmap = list.find(r => r.id === catPath);
              if (roadmap && roadmap.courses.length > 0) {
                activeCourse = roadmap.courses[0];
              }
            } else if (list.length > 0 && list[0].courses.length > 0) {
              // Default to first roadmap
              activeCourse = list[0].courses[0];
              activePath = list[0].id;
            }

            if (activeCourse) {
              // Count lessons in active course
              const courseLessons = activeCourse.modules.reduce((acc, curr) => acc + curr.lessons.length, 0);
              const courseCompleted = activeCourse.modules.reduce((acc, mod) => {
                const completedInMod = mod.lessons.filter(l => completed.includes(`${activePath}/${l.id}`)).length;
                return acc + completedInMod;
              }, 0);

              const percent = courseLessons > 0 ? Math.round((courseCompleted / courseLessons) * 100) : 0;
              
              // Get active/last lesson ID
              const firstLessonId = activeCourse.modules[0]?.lessons[0]?.id || '';

              setCurrentCourse({
                title: activeCourse.title,
                percent,
                path: activePath,
                lessonId: firstLessonId
              });
            }

            // Find "What should I learn next?" (First incomplete lesson in paths)
            let recommendedNext: { title: string; url: string; category: string } | null = null;
            for (let rm of list) {
              for (let course of rm.courses) {
                for (let mod of course.modules) {
                  for (let les of mod.lessons) {
                    const fullLessonId = `${rm.id}/${les.id}`;
                    if (!completed.includes(fullLessonId)) {
                      recommendedNext = {
                        title: les.title,
                        url: `/roadmaps/${rm.id}/${les.id}`,
                        category: rm.title,
                      };
                      break;
                    }
                  }
                  if (recommendedNext) break;
                }
                if (recommendedNext) break;
              }
              if (recommendedNext) break;
            }

            // Fallback if all completed
            if (!recommendedNext && list.length > 0 && list[0].courses.length > 0) {
              recommendedNext = {
                title: list[0].courses[0].modules[0].lessons[0].title,
                url: `/roadmaps/${list[0].id}/${list[0].courses[0].modules[0].lessons[0].id}`,
                category: list[0].title,
              };
            }

            setNextLesson(recommendedNext);
          }

          if (notesRes.success && notesRes.notes) {
            setRecentNotes(notesRes.notes.slice(0, 3)); // show top 3 notes
          }
        } catch (err) {
          console.error('Error fetching dashboard info:', err);
        } finally {
          setFetching(false);
        }
      };

      getDashboardData();
    }
  }, [isAuthenticated, user]);

  if (isLoading || fetching || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completedCount = user.completedLessons?.length || 0;

  const studyGoals = [
    { label: 'Solve next curriculum topic', done: completedCount > 0 },
    { label: 'Synthesize details in study notes', done: recentNotes.length > 0 },
    { label: 'Validate concepts with quiz checks', done: user.xp > 100 }
  ];

  return (
    <div className="flex-1 bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Welcome Section */}
        <div className="border border-border bg-card-bg rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white">Welcome back, {user.name}</h1>
            <p className="text-xs text-text-muted">Rank Level {Math.floor(user.xp / 1000) + 1} Engineer  •  {user.xp} Total XP earned</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded bg-warning/10 border border-warning/20 text-warning text-xs font-bold font-mono">
              <Flame className="h-4 w-4 fill-warning" />
              <span>{user.streak} Days streak</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
              <Award className="h-4 w-4" />
              <span>{completedCount} Completed</span>
            </div>
          </div>
        </div>

        {/* Workspace details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Panel: What am I learning & What to learn next (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Continue Learning Course progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What am I learning?</CardTitle>
                <CardDescription>Current Active Course Track</CardDescription>
              </CardHeader>
              <CardBody className="space-y-4">
                {currentCourse ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white truncate max-w-[80%]">{currentCourse.title}</span>
                      <span className="text-primary font-mono">{currentCourse.percent}% completed</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${currentCourse.percent}%` }}
                      />
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <Link href={`/roadmaps/${currentCourse.path}/${currentCourse.lessonId}`}>
                        <Button size="sm" className="gap-1 cursor-pointer text-xs font-bold">
                          <span>Resume Course</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-text-muted">
                    No course started yet. Visit Roadmaps to choose a track.
                  </div>
                )}
              </CardBody>
            </Card>

            {/* What should I learn next recommendation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What should I learn next?</CardTitle>
                <CardDescription>Suggested Concept to Master</CardDescription>
              </CardHeader>
              <CardBody className="space-y-4">
                {nextLesson ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/80 bg-black/10">
                    <div className="min-w-0">
                      <span className="text-[9px] font-black text-primary tracking-wider uppercase font-mono">{nextLesson.category}</span>
                      <h4 className="font-bold text-white text-xs mt-1 truncate">{nextLesson.title}</h4>
                    </div>
                    <Link href={nextLesson.url} className="shrink-0 w-full sm:w-auto">
                      <Button size="sm" variant="primary" className="w-full sm:w-auto gap-1 cursor-pointer text-xs font-bold">
                        <span>Go to Lesson</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-text-muted">
                    All currently available courses have been successfully completed!
                  </div>
                )}
              </CardBody>
            </Card>

          </div>

          {/* Right Panel: Recent Notes & Study Goals (1 Col) */}
          <div className="space-y-6">
            
            {/* Recent Notes list */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-sm">Recent Notes</CardTitle>
                <Link href="/notes" className="text-[10px] font-bold text-primary hover:underline">View vault</Link>
              </CardHeader>
              <CardBody className="p-0 border-t border-border-color/60">
                <div className="divide-y divide-border/40 text-xs font-medium">
                  {recentNotes.length > 0 ? (
                    recentNotes.map((note) => (
                      <div 
                        key={note._id} 
                        className="p-3.5 flex items-center justify-between hover:bg-card-bg/50 cursor-pointer"
                        onClick={() => router.push('/notes')}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white truncate text-xs">{note.title}</h4>
                          <span className="text-[9px] text-text-muted font-bold font-mono uppercase mt-0.5 block">{note.category}</span>
                        </div>
                        <FileText className="h-3.5 w-3.5 text-text-muted ml-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-text-muted text-xs font-normal">
                      No study notes found.
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Study Goals checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Study Goals</CardTitle>
                <CardDescription>Daily consistency checklist</CardDescription>
              </CardHeader>
              <CardBody className="space-y-3">
                {studyGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                    <input 
                      type="checkbox" 
                      checked={goal.done} 
                      readOnly 
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary pointer-events-none accent-success"
                    />
                    <span className={goal.done ? 'text-text-muted line-through font-normal' : 'text-foreground'}>
                      {goal.label}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
