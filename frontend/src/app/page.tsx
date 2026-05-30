'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../services/api';
import { 
  ArrowRight, 
  Target, 
  Layout, 
  Bot, 
  Compass, 
  BookOpen, 
  Flame, 
  CheckCircle,
  Clock,
  Award,
  Shield
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  courses: Array<{
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
  }>;
}

export default function PersonalLearningHub() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [fetching, setFetching] = useState(true);

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
    } else {
      setFetching(false);
    }
  }, [isAuthenticated]);

  // Track-specific card theme styling
  const getTrackTheme = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('dsa')) {
      return {
        bg: 'from-blue-600/10 to-indigo-600/5 hover:border-blue-500/40 border-blue-500/10 shadow-blue-500/5',
        text: 'text-blue-400',
        pill: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        bar: 'bg-blue-500',
        button: 'hover:bg-blue-600 hover:text-white border-blue-500/30 text-blue-400 bg-transparent',
        icon: <Target className="h-6 w-6 text-blue-400" />,
        diagram: (
          <svg className="w-full h-16 opacity-85" viewBox="0 0 200 60" fill="none">
            {/* Contiguous memory grid */}
            <rect x="10" y="15" width="30" height="30" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
            <rect x="45" y="15" width="30" height="30" rx="4" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.15)" />
            <rect x="80" y="15" width="30" height="30" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
            <rect x="115" y="15" width="30" height="30" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
            {/* Arrow showing swap or offset */}
            <path d="M25 48 L25 52 L130 52 L130 48" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="77" y="48" fill="#60A5FA" fontSize="8" fontFamily="monospace">O(1) offset</text>
            {/* Data values inside */}
            <text x="21" y="33" fill="#94A3B8" fontSize="10" fontWeight="bold">10</text>
            <text x="56" y="33" fill="#60A5FA" fontSize="10" fontWeight="bold">20</text>
            <text x="91" y="33" fill="#94A3B8" fontSize="10" fontWeight="bold">30</text>
            <text x="126" y="33" fill="#94A3B8" fontSize="10" fontWeight="bold">40</text>
          </svg>
        )
      };
    }
    if (cat.includes('web') || cat.includes('dev')) {
      return {
        bg: 'from-purple-600/10 to-pink-600/5 hover:border-purple-500/40 border-purple-500/10 shadow-purple-500/5',
        text: 'text-purple-400',
        pill: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        bar: 'bg-purple-500',
        button: 'hover:bg-purple-600 hover:text-white border-purple-500/30 text-purple-400 bg-transparent',
        icon: <Layout className="h-6 w-6 text-purple-400" />,
        diagram: (
          <svg className="w-full h-16 opacity-85" viewBox="0 0 200 60" fill="none">
            {/* Context/DOM distribution tree */}
            <circle cx="100" cy="12" r="8" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.15)" />
            <line x1="100" y1="20" x2="60" y2="35" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="140" y2="35" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="60" cy="40" r="8" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
            <circle cx="140" cy="40" r="8" stroke="#A78BFA" strokeWidth="1.5" fill="rgba(167, 139, 250, 0.15)" />
            {/* Direct state bypass flow */}
            <path d="M108 12 C 150 15, 155 30, 148 38" stroke="#A78BFA" strokeWidth="1.5" />
            <text x="125" y="24" fill="#A78BFA" fontSize="8" fontFamily="monospace">Direct State</text>
          </svg>
        )
      };
    }
    if (cat.includes('cyber') || cat.includes('security')) {
      return {
        bg: 'from-rose-600/10 to-red-600/5 hover:border-rose-500/40 border-rose-500/10 shadow-rose-500/5',
        text: 'text-rose-400',
        pill: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        bar: 'bg-rose-500',
        button: 'hover:bg-rose-600 hover:text-white border-rose-500/30 text-rose-400 bg-transparent',
        icon: <Shield className="h-6 w-6 text-rose-400" />,
        diagram: (
          <svg className="w-full h-16 opacity-85" viewBox="0 0 200 60" fill="none">
            <rect x="85" y="22" width="30" height="22" rx="3" stroke="#F43F5E" strokeWidth="1.5" fill="rgba(244, 63, 94, 0.15)" />
            <path d="M92 22 L92 15 C 92 9, 108 9, 108 15 L 108 22" stroke="#F43F5E" strokeWidth="1.5" fill="none" />
            <circle cx="100" cy="30" r="2.5" fill="#F43F5E" />
            <line x1="100" y1="33" x2="100" y2="39" stroke="#F43F5E" strokeWidth="1.5" />
            <text x="125" y="34" fill="#F43F5E" fontSize="8" fontFamily="monospace">AES 256</text>
          </svg>
        )
      };
    }
    // AI/ML
    return {
      bg: 'from-emerald-600/10 to-teal-600/5 hover:border-emerald-500/40 border-emerald-500/10 shadow-emerald-500/5',
      text: 'text-emerald-400',
      pill: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      bar: 'bg-emerald-500',
      button: 'hover:bg-emerald-600 hover:text-white border-emerald-500/30 text-emerald-400 bg-transparent',
      icon: <Bot className="h-6 w-6 text-emerald-400" />,
      diagram: (
        <svg className="w-full h-16 opacity-85" viewBox="0 0 200 60" fill="none">
          {/* Vector strides / matrix grid */}
          <rect x="40" y="5" width="24" height="24" rx="2" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.15)" />
          <rect x="70" y="5" width="24" height="24" rx="2" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.15)" />
          <rect x="100" y="5" width="24" height="24" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          
          <rect x="40" y="32" width="24" height="24" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <rect x="70" y="32" width="24" height="24" rx="2" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.15)" />
          <rect x="100" y="32" width="24" height="24" rx="2" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.15)" />
          <text x="135" y="33" fill="#34D399" fontSize="8" fontFamily="monospace">Slicing strides</text>
        </svg>
      )
    };
  };

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Initializing learning workspace...</p>
        </div>
      </div>
    );
  }

  // Pre-seed mock paths in case API response is still compiling
  const defaultPaths = [
    {
      id: 'dsa',
      title: 'DSA & Problem Solving',
      description: 'Master arrays, strings, binary search, sorting, recursion, trees, and dynamic programming in a highly visual environment.',
      category: 'DSA & Problem Solving',
      courses: [
        {
          id: 'dsa-visual',
          title: 'Visual Data Structures & Algorithms',
          duration: '20 hours',
          difficulty: 'Beginner to Hard',
          modules: [
            { title: 'Arrays & Vectors', lessons: [] },
            { title: 'Linked Lists', lessons: [] }
          ]
        }
      ]
    },
    {
      id: 'web-development',
      title: 'Full Stack Development',
      description: 'Build complete high-scale responsive systems using the React MERN Stack.',
      category: 'Full Stack Development',
      courses: [
        {
          id: 'react-mastery',
          title: 'Modern Front-End Mastery with React',
          duration: '15 hours',
          difficulty: 'Medium',
          modules: [
            { title: 'Functional Components & Hooks', lessons: [] },
            { title: 'Express Backend APIs', lessons: [] }
          ]
        }
      ]
    },
    {
      id: 'ai-ml',
      title: 'AI Engineering',
      description: 'Master Python vector calculations, data models, and neural networks.',
      category: 'AI Engineering',
      courses: [
        {
          id: 'data-analytics',
          title: 'Vector Calculations & Data Cleanups',
          duration: '8 hours',
          difficulty: 'Easy',
          modules: [
            { title: 'Data Foundations stack', lessons: [] }
          ]
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect applications, study SQL injections, and understand network security.',
      category: 'Cybersecurity',
      courses: [
        {
          id: 'security-fundamentals',
          title: 'Application & Network Security',
          duration: '10 hours',
          difficulty: 'Medium',
          modules: [
            { title: 'Web Application Security', lessons: [] }
          ]
        }
      ]
    }
  ];

  const activePathsList = roadmaps.length > 0 ? roadmaps : defaultPaths;

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[150px]" />

      {/* 1. Hero / Header Introduction */}
      <section className="pt-20 pb-12 max-w-5xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold select-none">
          <Compass className="h-3.5 w-3.5 animate-pulse" />
          <span>India's Best Personal Curriculum Workspace</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Master Engineering Subjects <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">With Structured Notes & Diagrams</span>
        </h1>
        <p className="text-sm md:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
          Skip social media noise. Focus strictly on learning key subjects: DSA, Development, and AI/ML. Read detailed notes, trace code blueprints with custom vector diagrams, and verify with quizzes.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <Button 
            size="lg" 
            className="gap-2 cursor-pointer font-bold bg-gradient-to-r from-primary to-secondary text-white border-0 hover:opacity-90"
            onClick={() => {
              document.getElementById('syllabus-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Tracks</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
          <Link href="/notes">
            <Button variant="outline" size="lg" className="cursor-pointer font-bold border-border/80 text-foreground hover:bg-card-bg/50">
              Study Note Vault
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Structured Learning Paths (Exactly 4 Cards) */}
      <section id="syllabus-section" className="py-12 max-w-7xl mx-auto px-6 w-full scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white">Syllabus Pathways</h2>
          <p className="text-xs text-text-muted mt-1.5">Follow our curated courses to unlock concepts and earn XP.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePathsList.map((rm) => {
            const theme = getTrackTheme(rm.category);
            const activeCourse = rm.courses[0];
            const modulesCount = activeCourse ? activeCourse.modules.length : 0;
            
            // Calculate progress percent from completed lessons (or defaults)
            const completed = user?.completedLessons || [];
            const courseLessons = activeCourse ? activeCourse.modules.reduce((acc, curr) => acc + (curr.lessons?.length || 0), 0) : 0;
            const courseCompleted = activeCourse ? activeCourse.modules.reduce((acc, mod) => {
              const comp = mod.lessons ? mod.lessons.filter(l => completed.includes(`${rm.id}/${l.id}`)).length : 0;
              return acc + comp;
            }, 0) : 0;
            const percent = courseLessons > 0 ? Math.round((courseCompleted / courseLessons) * 100) : 0;

            // Completion Time Bar calculations
            const totalHours = activeCourse ? parseInt(activeCourse.duration) || 10 : 10;
            const completedHours = Math.round((percent / 100) * totalHours * 10) / 10;
            const remainingHours = Math.max(0, Math.round((totalHours - completedHours) * 10) / 10);

            return (
              <div 
                key={rm.id} 
                className={`rounded-xl border bg-gradient-to-br ${theme.bg} p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${theme.pill} font-mono`}>
                      {rm.category}
                    </span>
                    {theme.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">{rm.title}</h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed font-normal line-clamp-3">
                      {rm.description}
                    </p>
                  </div>

                  {/* SVG Diagram Preview inside Card */}
                  <div className="border border-border/40 rounded-lg p-2 bg-black/20 flex items-center justify-center">
                    {theme.diagram}
                  </div>

                  {/* Curriculum Details */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted font-mono">
                      <span>{modulesCount} Modules</span>
                      {activeCourse && <span>{activeCourse.duration}</span>}
                    </div>
                    
                    {/* Lesson Completion Progress tracker bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                        <span className="text-text-muted">Lessons Completed</span>
                        <span className={theme.text}>{percent}%</span>
                      </div>
                      <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${theme.bar} transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Completion Time Bar */}
                    <div className="space-y-1 pt-1 border-t border-border/20">
                      <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                        <span className="text-text-muted">Completion Time Bar</span>
                        <span className={theme.text}>{completedHours}h / {totalHours}h</span>
                      </div>
                      <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${theme.bar} opacity-85 transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[8px] text-text-muted font-bold font-mono">
                        <span>Time Spent</span>
                        <span>{remainingHours === 0 ? 'Completed' : `${remainingHours}h remaining`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30 mt-6">
                  <Button 
                    variant="outline" 
                    className={`w-full justify-center font-bold ${theme.button} border transition-colors`}
                    onClick={() => router.push(rm.id === 'dsa' ? '/dsa' : `/roadmaps/${rm.id}`)}
                  >
                    <span>Launch Path</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Simplified Workspace Banner */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center border-t border-border/40 mt-12 space-y-6">
        <h2 className="text-2xl font-black text-white">Looking for the Personal Notes Workspace?</h2>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          Create, edit, and auto-save custom study templates. Split-screen live preview, markdown compiling, and notes category sorting is fully functional in the vault.
        </p>
        <Link href="/notes">
          <Button className="px-6 cursor-pointer font-bold bg-primary text-white border-0 hover:bg-primary-hover">
            Open Study Vault
          </Button>
        </Link>
      </section>

      {/* 4. Simple Footer */}
      <footer className="py-8 border-t border-border/40 bg-black/10 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-primary font-black text-white text-sm select-none">A1</span>
            <span className="text-sm font-bold text-white">A1 Learner</span>
          </div>
          <p className="text-[10px] text-text-muted">© {new Date().getFullYear()} A1 Learner. Structured Personal Curriculum for Amit Rajput.</p>
        </div>
      </footer>
    </div>
  );
}
