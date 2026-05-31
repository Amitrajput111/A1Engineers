'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  GitBranch,
  Activity,
  Cpu
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
        badgeColor: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
        textColor: 'text-[#3B82F6]',
        textHoverColor: 'group-hover:text-[#60A5FA]',
        barColor: 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]',
        icon: <Target className="h-7 w-7 text-[#3B82F6]" />,
        iconColor: '#3B82F6',
        difficulty: 'Beginner to Hard',
        hours: '20 Hours',
        topics: '20 Topics',
        buttonTheme: 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:brightness-115',
        diagram: (
          <div className="w-full h-full relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/[0.04] p-3 select-none">
            {/* Animated Array memory diagram */}
            <div className="flex gap-2 items-center justify-center w-full z-10">
              {[12, 24, 48, 96].map((val, idx) => (
                <motion.div
                  key={idx}
                  className={`h-11 w-11 rounded-lg border flex flex-col items-center justify-center ${
                    idx === 2 
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'border-white/[0.08] bg-[#0F172A]'
                  }`}
                  animate={{
                    borderColor: idx === 2 ? ['#3B82F6', '#8B5CF6', '#3B82F6'] : 'rgba(255, 255, 255, 0.08)'
                  }}
                  transition={{ repeat: Infinity, duration: 4, delay: idx * 0.5 }}
                >
                  <span className="text-[10px] font-mono text-[#94A3B8]">[{idx}]</span>
                  <span className={`text-xs font-mono font-bold ${idx === 2 ? 'text-[#60A5FA]' : 'text-[#F8FAFC]'}`}>{val}</span>
                </motion.div>
              ))}
            </div>
            {/* Moving Pointer animation */}
            <motion.div 
              className="absolute bottom-2 left-6 flex flex-col items-center"
              animate={{ x: [0, 48, 96, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#60A5FA]" />
              <span className="text-[8px] font-mono font-bold text-[#60A5FA] mt-0.5">ptr</span>
            </motion.div>
          </div>
        )
      };
    }
    if (cat.includes('web') || cat.includes('dev')) {
      return {
        badgeColor: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20',
        textColor: 'text-[#8B5CF6]',
        textHoverColor: 'group-hover:text-[#A78BFA]',
        barColor: 'bg-gradient-to-r from-[#8B5CF6] to-[#EF4444]',
        icon: <Layout className="h-7 w-7 text-[#8B5CF6]" />,
        iconColor: '#8B5CF6',
        difficulty: 'Medium',
        hours: '15 Hours',
        topics: '18 Topics',
        buttonTheme: 'bg-gradient-to-r from-[#8B5CF6] to-[#EF4444] text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:brightness-115',
        diagram: (
          <div className="w-full h-full relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/[0.04] p-3 select-none">
            {/* Frontend -> Backend -> Database schema */}
            <div className="flex justify-between items-center w-full px-2 z-10 text-[9px] font-mono">
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-12 rounded bg-[#0F172A] border border-white/[0.08] flex items-center justify-center text-[#F8FAFC] font-bold shadow-[0_0_10px_rgba(0,0,0,0.5)]">UI</div>
                <span className="text-[#94A3B8] scale-90">Client</span>
              </div>
              
              <div className="flex-1 h-[2px] bg-white/[0.06] mx-1 relative overflow-hidden">
                <motion.div 
                  className="absolute h-full w-4 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent"
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-12 rounded bg-[#0F172A] border border-[#8B5CF6]/40 flex items-center justify-center text-[#A78BFA] font-bold shadow-[0_0_15px_rgba(139,92,246,0.1)]">API</div>
                <span className="text-[#94A3B8] scale-90">Server</span>
              </div>

              <div className="flex-1 h-[2px] bg-white/[0.06] mx-1 relative overflow-hidden">
                <motion.div 
                  className="absolute h-full w-4 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent"
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1.2 }}
                />
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-12 rounded bg-[#0F172A] border border-white/[0.08] flex items-center justify-center text-[#F8FAFC] font-bold shadow-[0_0_10px_rgba(0,0,0,0.5)]">DB</div>
                <span className="text-[#94A3B8] scale-90">SQL/No</span>
              </div>
            </div>
          </div>
        )
      };
    }
    if (cat.includes('cyber') || cat.includes('security')) {
      return {
        badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20',
        textColor: 'text-[#EF4444]',
        textHoverColor: 'group-hover:text-[#F87171]',
        barColor: 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B]',
        icon: <Shield className="h-7 w-7 text-[#EF4444]" />,
        iconColor: '#EF4444',
        difficulty: 'Medium',
        hours: '10 Hours',
        topics: '12 Topics',
        buttonTheme: 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:brightness-115',
        diagram: (
          <div className="w-full h-full relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/[0.04] p-3 select-none">
            {/* Animated Shield / Radar lock */}
            <div className="relative flex items-center justify-center h-14 w-14">
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#EF4444]/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full border border-dashed border-[#EF4444]/50"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
              <Shield className="h-7 w-7 text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] z-10" />
            </div>
            <span className="absolute bottom-2 right-4 text-[7px] font-mono text-[#EF4444]/70">AES_256 SECURED</span>
          </div>
        )
      };
    }
    // AI/ML Default
    return {
      badgeColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
      textColor: 'text-[#10B981]',
      textHoverColor: 'group-hover:text-[#34D399]',
      barColor: 'bg-gradient-to-r from-[#10B981] to-[#3B82F6]',
      icon: <Bot className="h-7 w-7 text-[#10B981]" />,
      iconColor: '#10B981',
      difficulty: 'Easy',
      hours: '8 Hours',
      topics: '10 Topics',
      buttonTheme: 'bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:brightness-115',
      diagram: (
        <div className="w-full h-full relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/[0.04] p-3 select-none">
          {/* Animated neural net nodes */}
          <div className="relative flex justify-between w-full max-w-[140px] h-12 items-center">
            {/* Input layer (2 nodes) */}
            <div className="flex flex-col justify-between h-full py-1">
              <div className="h-2 w-2 rounded-full bg-[#10B981]" />
              <div className="h-2 w-2 rounded-full bg-[#10B981]" />
            </div>

            {/* Hidden layer (3 nodes) */}
            <div className="flex flex-col justify-between h-full">
              <motion.div animate={{ backgroundColor: ['#0F172A', '#34D399', '#0F172A'] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }} className="h-2.5 w-2.5 rounded-full border border-[#10B981]/60" />
              <motion.div animate={{ backgroundColor: ['#0F172A', '#34D399', '#0F172A'] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} className="h-2.5 w-2.5 rounded-full border border-[#10B981]/60" />
              <motion.div animate={{ backgroundColor: ['#0F172A', '#34D399', '#0F172A'] }} transition={{ repeat: Infinity, duration: 2, delay: 1.2 }} className="h-2.5 w-2.5 rounded-full border border-[#10B981]/60" />
            </div>

            {/* Output layer (1 node) */}
            <div className="flex items-center justify-center h-full">
              <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Matrix background math decoration */}
            <span className="absolute left-[35%] top-[12%] text-[6px] font-mono text-[#94A3B8]/30">w1=0.74</span>
            <span className="absolute left-[35%] bottom-[12%] text-[6px] font-mono text-[#94A3B8]/30">w2=0.29</span>
          </div>
        </div>
      )
    };
  };

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#020817]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent" />
          <p className="text-sm font-semibold text-[#94A3B8] select-none">Initializing learning workspace...</p>
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
    <div className="flex-1 flex flex-col bg-[#020817] text-[#F8FAFC] relative overflow-hidden font-sans select-none">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-[1100px] rounded-full bg-radial-gradient from-[#3B82F6]/10 to-transparent blur-[120px] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)' }} />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/5 blur-[150px] pointer-events-none" />

      {/* 1. Hero / Header Introduction */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-[1100px] mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#CBD5E1] text-xs font-medium select-none shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
          <span>India's Best Personal Curriculum Workspace</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-[-0.04em] text-[#F8FAFC] leading-[1.1] max-w-[900px] mb-6"
        >
          Master Engineering Subjects <br />
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">Structured Notes & Diagrams</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-[18px] text-[#94A3B8] max-w-[700px] mx-auto leading-[1.8] mb-10"
        >
          Skip social media noise. Focus strictly on learning key subjects: DSA, Development, AI/ML, and Security. Read detailed notes, trace code blueprints with custom vector diagrams, and verify with dynamic quizzes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto"
        >
          <Button 
            size="lg" 
            className="h-14 px-8 gap-2 cursor-pointer font-semibold text-white bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-[14px] border-0 hover:brightness-110 shadow-[0_4px_25px_rgba(59,130,246,0.3)] transition-all"
            onClick={() => {
              document.getElementById('syllabus-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Tracks</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
          <Link href="/notes">
            <Button variant="outline" size="lg" className="h-14 px-8 cursor-pointer font-semibold border-white/15 text-[#F8FAFC] hover:bg-white/[0.03] bg-transparent rounded-[14px] transition-all">
              Study Note Vault
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* 2. Structured Learning Paths (Exactly 4 Cards) */}
      <section id="syllabus-section" className="py-[120px] bg-[#071120] w-full border-y border-white/[0.04] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight text-[#F8FAFC]">Syllabus Pathways</h2>
            <p className="text-base md:text-[18px] text-[#94A3B8] mt-3 max-w-[600px] mx-auto">
              Clear learning paths for placement preparation and career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {activePathsList.map((rm, idx) => {
              const theme = getTrackTheme(rm.category);
              const activeCourse = rm.courses[0];
              
              // Calculate progress percent from completed lessons (or defaults)
              const completed = user?.completedLessons || [];
              const courseLessons = activeCourse ? activeCourse.modules.reduce((acc, curr) => acc + (curr.lessons?.length || 0), 0) : 0;
              const courseCompleted = activeCourse ? activeCourse.modules.reduce((acc, mod) => {
                const comp = mod.lessons ? mod.lessons.filter(l => completed.includes(`${rm.id}/${l.id}`)).length : 0;
                return acc + comp;
              }, 0) : 0;
              const percent = courseLessons > 0 ? Math.round((courseCompleted / courseLessons) * 100) : 0;

              return (
                <motion.div 
                  key={rm.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="w-full max-w-[380px] h-[540px] rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-[#1E293B]/90 to-[#111827]/95 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] shadow-[0_25px_60px_rgba(0,0,0,0.25)] hover:border-white/[0.15] group"
                >
                  <div className="space-y-5 flex-1 flex flex-col">
                    {/* Top Area: Badge & Icon */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${theme.badgeColor} font-mono`}>
                        {rm.category.includes('DSA') ? 'DSA' : rm.category.includes('Full') ? 'Full Stack' : rm.category.includes('AI') ? 'AI' : 'Cybersecurity'}
                      </span>
                      <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                        {theme.icon}
                      </div>
                    </div>

                    {/* Middle Area: Title & Description */}
                    <div>
                      <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{rm.title}</h3>
                      <p className="text-[13px] text-[#CBD5E1] mt-2 leading-[1.6] line-clamp-2 font-normal">
                        {rm.description}
                      </p>
                    </div>

                    {/* Animated Diagram Area */}
                    <div className="flex-1 min-h-[120px] max-h-[140px] w-full rounded-xl overflow-hidden">
                      {theme.diagram}
                    </div>

                    {/* Meta stats capsules */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#CBD5E1] font-mono">
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <BookOpen className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>{theme.topics}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>{theme.hours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] col-span-2">
                        <Award className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>Certificate & Placement Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Area: Progress & Action Button */}
                  <div className="pt-4 border-t border-white/[0.06] mt-5 space-y-4">
                    {/* Progress tracker */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold font-mono text-[#94A3B8]">
                        <span>Progress Tracker</span>
                        <span className={theme.textColor}>{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${theme.barColor} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <Button 
                      className={`w-full h-11 justify-center gap-2 font-semibold rounded-xl text-sm transition-all ${theme.buttonTheme}`}
                      onClick={() => router.push(rm.id === 'dsa' ? '/dsa' : `/roadmaps/${rm.id}`)}
                    >
                      <span>Launch Path</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Study Vault Banner */}
      <section className="py-[120px] max-w-[1100px] mx-auto px-6 text-center space-y-8">
        <div className="p-10 rounded-[24px] border border-white/[0.06] bg-[#0F172A]/40 backdrop-blur-md relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-[#3B82F6]/5 blur-[70px] pointer-events-none" />
          <div className="max-w-[700px] mx-auto space-y-6">
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight text-[#F8FAFC]">Looking for the Personal Notes Workspace?</h2>
            <p className="text-base text-[#94A3B8] leading-[1.8] max-w-xl mx-auto">
              Create, edit, and auto-save custom study templates. Split-screen live preview, markdown compiling, and notes category sorting is fully functional in the vault.
            </p>
            <Link href="/notes">
              <Button className="h-12 px-8 cursor-pointer font-semibold bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white rounded-xl border-0 hover:brightness-110 shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all">
                Open Study Vault
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Redesigned Footer */}
      <footer className="py-20 border-t border-white/[0.06] bg-[#020617] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Tagline & Logo */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] font-black text-white text-lg">
                  A1
                </span>
                <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">A1 Learning</span>
              </div>
              <p className="text-sm text-[#94A3B8] max-w-sm leading-[1.7]">
                A premium, modern curriculum framework built to support engineering placement preparation, interactive data visualization, and AI tutors.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><Link href="/" className="hover:text-[#60A5FA] transition-colors">Home</Link></li>
                <li><Link href="/notes" className="hover:text-[#60A5FA] transition-colors">Study Vault</Link></li>
                <li><Link href="/dsa" className="hover:text-[#60A5FA] transition-colors">DSA Roadmap</Link></li>
                <li><Link href="/profile" className="hover:text-[#60A5FA] transition-colors">Profile Details</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><span className="cursor-not-allowed hover:text-white transition-colors">Linear Systems</span></li>
                <li><span className="cursor-not-allowed hover:text-white transition-colors">Stripe API References</span></li>
                <li><span className="cursor-not-allowed hover:text-white transition-colors">Vercel Serverless</span></li>
                <li><span className="cursor-not-allowed hover:text-white transition-colors">Notion Workspaces</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <p>© {new Date().getFullYear()} A1 Learning. All rights reserved. Created for Amit Rajput.</p>
            <div className="flex gap-6">
              <span className="cursor-not-allowed hover:text-white transition-colors">Privacy Policy</span>
              <span className="cursor-not-allowed hover:text-white transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
