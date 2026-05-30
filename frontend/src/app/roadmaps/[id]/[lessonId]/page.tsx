'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import { apiClient } from '../../../../services/api';
import { Button } from '../../../../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { 
  ChevronLeft, 
  BookOpen, 
  HelpCircle, 
  Link as LinkIcon, 
  Award, 
  CheckCircle,
  Copy,
  Check,
  Flame,
  AlertCircle,
  Target,
  Layout,
  Bot,
  Shield,
  Compass,
  Send,
  Sparkles,
  ChevronRight,
  Circle,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface Resource {
  name: string;
  url: string;
}

interface LessonData {
  title: string;
  description: string;
  learningObjectives: string[];
  notes: string;
  resources: Resource[];
  quiz: QuizQuestion[];
}

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

// Custom interactive diagrams representing engineering concepts
const InteractiveDiagram: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const id = lessonId.toLowerCase();
  
  if (id.includes('arrays-basics')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Contiguous Memory Mapping</h4>
        <svg className="w-full h-32 max-w-md mx-auto" viewBox="0 0 300 100" fill="none">
          <rect x="20" y="20" width="50" height="40" rx="6" stroke="#3B82F6" strokeWidth="2" fill="rgba(59, 130, 246, 0.08)" />
          <rect x="75" y="20" width="50" height="40" rx="6" stroke="#1E293B" strokeWidth="2" fill="#0F172A" />
          <rect x="130" y="20" width="50" height="40" rx="6" stroke="#1E293B" strokeWidth="2" fill="#0F172A" />
          <rect x="185" y="20" width="50" height="40" rx="6" stroke="#1E293B" strokeWidth="2" fill="#0F172A" />
          
          <text x="40" y="45" fill="#60A5FA" fontSize="12" fontWeight="bold">arr[0]</text>
          <text x="95" y="45" fill="#94A3B8" fontSize="12" fontWeight="bold">arr[1]</text>
          <text x="150" y="45" fill="#94A3B8" fontSize="12" fontWeight="bold">arr[2]</text>
          <text x="205" y="45" fill="#94A3B8" fontSize="12" fontWeight="bold">arr[3]</text>
          
          <text x="32" y="75" fill="#3B82F6" fontSize="10" fontFamily="monospace">1000</text>
          <text x="87" y="75" fill="#94A3B8" fontSize="10" fontFamily="monospace">1004</text>
          <text x="142" y="75" fill="#94A3B8" fontSize="10" fontFamily="monospace">1008</text>
          <text x="197" y="75" fill="#94A3B8" fontSize="10" fontFamily="monospace">1012</text>
          
          <text x="20" y="95" fill="#94A3B8" fontSize="9" fontFamily="monospace">Address = Base (1000) + Index * 4 Bytes</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('arrays-rotations')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Reversal Algorithm: Left Rotate by 2</h4>
        <svg className="w-full h-40 max-w-md mx-auto" viewBox="0 0 300 130" fill="none">
          <text x="10" y="20" fill="#94A3B8" fontSize="9" fontFamily="monospace">Initial: [1, 2 | 3, 4, 5]</text>
          
          <text x="10" y="50" fill="#60A5FA" fontSize="9" fontFamily="monospace">Step 1: Reverse first 2 elements</text>
          <rect x="10" y="58" width="18" height="18" rx="3" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.08)" />
          <text x="16" y="70" fill="#60A5FA" fontSize="10">2</text>
          <rect x="32" y="58" width="18" height="18" rx="3" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.08)" />
          <text x="38" y="70" fill="#60A5FA" fontSize="10">1</text>
          <path d="M15 55 Q 23 48 36 55" stroke="#3B82F6" strokeWidth="1" fill="none" />
          
          <text x="140" y="50" fill="#A78BFA" fontSize="9" fontFamily="monospace">Step 2: Reverse remaining elements</text>
          <rect x="140" y="58" width="18" height="18" rx="3" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.08)" />
          <text x="146" y="70" fill="#A78BFA" fontSize="10">5</text>
          <rect x="162" y="58" width="18" height="18" rx="3" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.08)" />
          <text x="168" y="70" fill="#A78BFA" fontSize="10">4</text>
          <rect x="184" y="58" width="18" height="18" rx="3" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.08)" />
          <text x="190" y="70" fill="#A78BFA" fontSize="10">3</text>
          <path d="M148 55 Q 166 45 188 55" stroke="#8B5CF6" strokeWidth="1" fill="none" />
          
          <text x="10" y="100" fill="#10B981" fontSize="9" fontFamily="monospace">Step 3: Reverse the whole array</text>
          <text x="10" y="118" fill="#10B981" fontSize="11" fontWeight="bold" fontFamily="monospace">[3, 4, 5, 1, 2]</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('linked-lists-basics')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Linked List Reversal Pointer Shift</h4>
        <svg className="w-full h-32 max-w-md mx-auto" viewBox="0 0 300 100" fill="none">
          <rect x="10" y="30" width="40" height="30" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="22" y="49" fill="#94A3B8" fontSize="11" fontWeight="bold">10</text>
          <path d="M50 45 L75 45" stroke="#334155" strokeWidth="1.5" />
          
          <path d="M75 40 L50 40" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
          
          <rect x="85" y="30" width="40" height="30" rx="4" stroke="#3B82F6" strokeWidth="2" fill="rgba(59, 130, 246, 0.08)" />
          <text x="97" y="49" fill="#60A5FA" fontSize="11" fontWeight="bold">20</text>
          <path d="M125 45 L150 45" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="160" y="30" width="40" height="30" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="172" y="49" fill="#94A3B8" fontSize="11" fontWeight="bold">30</text>
          
          <text x="12" y="80" fill="#94A3B8" fontSize="9" fontFamily="monospace">prev</text>
          <text x="88" y="80" fill="#3B82F6" fontSize="9" fontFamily="monospace">curr</text>
          <text x="162" y="80" fill="#94A3B8" fontSize="9" fontFamily="monospace">next</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('linked-lists-operations')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Floyd's Cycle Finding (Tortoise & Hare)</h4>
        <svg className="w-full h-36 max-w-md mx-auto" viewBox="0 0 300 110" fill="none">
          <circle cx="30" cy="50" r="14" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="27" y="54" fill="#94A3B8" fontSize="11">1</text>
          <line x1="44" y1="50" x2="66" y2="50" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="80" cy="50" r="14" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="77" y="54" fill="#94A3B8" fontSize="11">2</text>
          <line x1="94" y1="50" x2="116" y2="50" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="130" cy="30" r="14" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <text x="127" y="34" fill="#34D399" fontSize="11">3</text>
          <path d="M144 30 Q 170 30 180 50" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="180" cy="65" r="14" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.08)" />
          <text x="177" y="69" fill="#60A5FA" fontSize="11">4</text>
          <path d="M166 65 Q 130 85 110 65" stroke="#334155" strokeWidth="1.5" />
          <path d="M110 65 L80 50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
          
          <text x="122" y="14" fill="#10B981" fontSize="9" fontWeight="bold">Slow (T)</text>
          <text x="174" y="90" fill="#3B82F6" fontSize="9" fontWeight="bold">Fast (H)</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('react-hooks')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">React Functional Render & Fiber Cycle</h4>
        <svg className="w-full h-36 max-w-md mx-auto" viewBox="0 0 300 110" fill="none">
          <rect x="10" y="40" width="55" height="25" rx="4" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.08)" />
          <text x="17" y="56" fill="#A78BFA" fontSize="9" fontWeight="bold">State Trigger</text>
          <path d="M65 52 L100 52" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="100" y="40" width="60" height="25" rx="4" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="107" y="56" fill="#94A3B8" fontSize="9">Reconciliation</text>
          <path d="M160 52 L195 52" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="195" y="40" width="60" height="25" rx="4" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <text x="206" y="56" fill="#34D399" fontSize="9" fontWeight="bold">DOM Commit</text>
          
          <path d="M225 65 C 225 90, 37 90, 37 65" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="110" y="86" fill="#94A3B8" fontSize="8" fontFamily="monospace">useEffect Trigger</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('react-context')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">React Context State Bypass vs Props Drilling</h4>
        <svg className="w-full h-32 max-w-md mx-auto" viewBox="0 0 300 100" fill="none">
          <circle cx="150" cy="15" r="10" stroke="#8B5CF6" strokeWidth="2" fill="rgba(139, 92, 246, 0.08)" />
          <text x="145" y="19" fill="#A78BFA" fontSize="8" fontWeight="bold">Provider</text>
          
          <line x1="140" y1="23" x2="90" y2="48" stroke="#334155" strokeWidth="1.5" />
          <line x1="160" y1="23" x2="210" y2="48" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="90" cy="55" r="10" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="86" y="58" fill="#94A3B8" fontSize="8">Node A</text>
          
          <circle cx="210" cy="55" r="10" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <text x="206" y="58" fill="#94A3B8" fontSize="8">Node B</text>
          
          <line x1="90" y1="65" x2="90" y2="80" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="90" cy="85" r="10" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <text x="83" y="88" fill="#34D399" fontSize="7" fontWeight="bold">Consumer</text>
          
          <path d="M140 15 C 60 15, 60 70, 80 85" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="65" y="44" fill="#34D399" fontSize="8" fontFamily="monospace">Bypass</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('node-express-foundations')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Express Middleware Request Pipeline</h4>
        <svg className="w-full h-32 max-w-md mx-auto" viewBox="0 0 320 90" fill="none">
          <text x="10" y="25" fill="#94A3B8" fontSize="8" fontFamily="monospace">Client Request</text>
          <line x1="10" y1="45" x2="45" y2="45" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="45" y="32" width="60" height="25" rx="4" stroke="#3B82F6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.08)" />
          <text x="56" y="48" fill="#60A5FA" fontSize="9" fontWeight="bold">Logger MW</text>
          <line x1="105" y1="45" x2="130" y2="45" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="130" y="32" width="60" height="25" rx="4" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139, 92, 246, 0.08)" />
          <text x="144" y="48" fill="#A78BFA" fontSize="9" fontWeight="bold">Auth MW</text>
          <line x1="190" y1="45" x2="215" y2="45" stroke="#334155" strokeWidth="1.5" />
          
          <rect x="215" y="32" width="65" height="25" rx="4" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <text x="221" y="48" fill="#34D399" fontSize="9" fontWeight="bold">Route Handler</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('numpy-foundations')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Vectorized Multi-Dimensional Strides</h4>
        <svg className="w-full h-32 max-w-md mx-auto" viewBox="0 0 300 100" fill="none">
          <rect x="30" y="20" width="30" height="20" rx="3" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <rect x="65" y="20" width="30" height="20" rx="3" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <rect x="100" y="20" width="30" height="20" rx="3" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          
          <rect x="30" y="45" width="30" height="20" rx="3" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <rect x="65" y="45" width="30" height="20" rx="3" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          <rect x="100" y="45" width="30" height="20" rx="3" stroke="#10B981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.08)" />
          
          <text x="150" y="35" fill="#34D399" fontSize="10" fontFamily="monospace">Shape: (2, 3)</text>
          <text x="150" y="55" fill="#94A3B8" fontSize="9" fontFamily="monospace">Strides: (12, 4) Bytes</text>
        </svg>
      </div>
    );
  }
  
  if (id.includes('pandas-dataframes')) {
    return (
      <div className="space-y-4 p-4 border border-border/40 rounded-xl bg-black/30 text-center">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Pandas DataFrame Imputing NaN</h4>
        <svg className="w-full h-36 max-w-md mx-auto" viewBox="0 0 300 110" fill="none">
          <rect x="20" y="10" width="220" height="80" rx="6" stroke="#1E293B" strokeWidth="1.5" fill="#0F172A" />
          <line x1="20" y1="30" x2="240" y2="30" stroke="#1E293B" strokeWidth="1.5" />
          
          <line x1="90" y1="10" x2="90" y2="90" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="160" y1="10" x2="160" y2="90" stroke="#1E293B" strokeWidth="1.5" />
          
          <text x="35" y="24" fill="#94A3B8" fontSize="10" fontWeight="bold">Name</text>
          <text x="105" y="24" fill="#94A3B8" fontSize="10" fontWeight="bold">Age</text>
          <text x="175" y="24" fill="#94A3B8" fontSize="10" fontWeight="bold">Department</text>
          
          <text x="30" y="48" fill="#F8FAFC" fontSize="9">Amit</text>
          <text x="105" y="48" fill="#F8FAFC" fontSize="9">21</text>
          <text x="175" y="48" fill="#94A3B8" fontSize="9">IT</text>
          <line x1="20" y1="56" x2="240" y2="56" stroke="#1E293B" strokeWidth="1" />
          
          <text x="30" y="74" fill="#F8FAFC" fontSize="9">Raman</text>
          <rect x="102" y="63" width="28" height="15" rx="3" stroke="#10B981" strokeWidth="1" fill="rgba(16, 185, 129, 0.08)" />
          <text x="105" y="74" fill="#34D399" fontSize="9" fontWeight="bold">21.5</text>
          <text x="175" y="74" fill="#94A3B8" fontSize="9">HR</text>
          
          <text x="100" y="103" fill="#34D399" fontSize="8" fontFamily="monospace">fillna(mean) applied</text>
        </svg>
      </div>
    );
  }
  
  return null;
};

export default function LessonDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user, setUser, isAuthenticated, isLoading } = useAuthStore();
  
  // Unwrap parameters
  const resolvedParams = use(params);
  const pathId = resolvedParams.id;
  const lessonId = resolvedParams.lessonId;

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'notes' | 'diagram' | 'quiz' | 'resources'>('notes');
  const [copied, setCopied] = useState(false);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Table of Contents (TOC) State
  const [toc, setToc] = useState<Array<{ text: string; id: string; level: number }>>([]);

  // Local AI Study Assistant State
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    { role: 'model', content: "Hello! I'm your AI Study Assistant. Ask me anything about today's lesson, code syntax, or complexities, and I'll explain it instantly." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Quiz States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  
  const [completing, setCompleting] = useState(false);
  const [xpRewardMsg, setXpRewardMsg] = useState<string | null>(null);

  // Reading/scroll progress tracking
  const [scrollProgress, setScrollProgress] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadLessonDetails = async () => {
    try {
      // 1. Fetch current lesson data
      const res = await apiClient(`/roadmaps/${pathId}/${lessonId}`);
      if (res.success && res.lesson) {
        setLesson(res.lesson);
        setIsCompleted(res.isCompleted || false);
        
        // Generate Table of Contents from notes markdown headings
        generateTOC(res.lesson.notes);
      }
      
      // 2. Fetch full path syllabus structure for Left Sidebar navigation
      const rRes = await apiClient('/roadmaps');
      if (rRes.success && rRes.roadmaps) {
        const match = rRes.roadmaps.find((r: any) => r.id === pathId);
        if (match) {
          setRoadmap(match);
        }
      }
    } catch (err) {
      console.error('Error fetching lesson details:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && pathId && lessonId) {
      loadLessonDetails();
    }
  }, [isAuthenticated, pathId, lessonId]);

  // Generate Table of Contents list
  const generateTOC = (notesText: string) => {
    const lines = notesText.split('\n');
    const headersList: Array<{ text: string; id: string; level: number }> = [];
    
    lines.forEach((line) => {
      if (line.startsWith('#')) {
        const match = line.match(/^(#{1,3})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].trim();
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          headersList.push({ text, id, level });
        }
      }
    });
    setToc(headersList);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Submit Quiz verification check
  const handleSubmitQuiz = async () => {
    if (!lesson) return;
    
    setQuizError(null);
    const questions = lesson.quiz;

    if (Object.keys(selectedAnswers).length < questions.length) {
      setQuizError('Please answer all multiple choice questions before submitting.');
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);

    if (correctCount === questions.length) {
      if (!isCompleted) {
        setCompleting(true);
        try {
          const res = await apiClient('/roadmaps/complete-topic', {
            method: 'POST',
            body: JSON.stringify({
              lessonId: `${pathId}/${lessonId}`,
              xpReward: 100
            })
          });

          if (res.success) {
            setIsCompleted(true);
            setXpRewardMsg(`Topic completed! Earned +100 XP!`);
            
            // Sync user data
            if (user) {
              const updatedCompleted = user.completedLessons ? [...user.completedLessons] : [];
              if (!updatedCompleted.includes(`${pathId}/${lessonId}`)) {
                updatedCompleted.push(`${pathId}/${lessonId}`);
              }
              setUser({
                ...user,
                xp: res.xp,
                streak: res.streak,
                completedLessons: updatedCompleted
              });
            }
          }
        } catch (err) {
          console.error('Failed to complete lesson:', err);
        } finally {
          setCompleting(false);
        }
      }
    } else {
      setQuizError('Some answers were incorrect. Please review the notes and retry.');
    }
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError(null);
  };

  // Send message to local AI Study Assistant
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !lesson) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setSendingChat(true);

    try {
      // Build a contextual prompt injecting active lesson notes as background
      const promptContext = `Lesson: "${lesson.title}"\nNotes Context:\n${lesson.notes.substring(0, 1000)}\n\nStudent Doubt: "${userMsg}"`;
      
      const res = await apiClient('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: promptContext,
          mode: 'doubts'
        })
      });

      if (res.success && res.reply) {
        setChatMessages(prev => [...prev, { role: 'model', content: res.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'model', content: 'Apologies, I encountered an issue querying the model. Please retry.' }]);
      }
    } catch (err) {
      console.error('AI tutor query failed:', err);
      setChatMessages(prev => [...prev, { role: 'model', content: 'Network error. The local tutor engine is serving offline backups.' }]);
    } finally {
      setSendingChat(false);
    }
  };

  // Helper for inline Markdown token parses (bold, inline codes, equations)
  const parseInlineMarkdown = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\$\$.*?\$\$)/g);
    return tokens.map((token, idx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={idx} className="text-white font-black">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={idx} className="bg-black/30 border border-border px-1.5 py-0.5 rounded text-[10px] font-mono text-primary font-bold">{token.slice(1, -1)}</code>;
      }
      if (token.startsWith('$$') && token.endsWith('$$')) {
        return (
          <div key={idx} className="my-3 p-3 bg-black/40 border border-border/60 rounded text-center text-xs font-mono text-secondary font-bold select-all">
            {token.slice(2, -2)}
          </div>
        );
      }
      return token;
    });
  };

  // Render Markdown formatting dynamically
  const renderMarkdownNotes = (markdown: string) => {
    const sections = markdown.split(/(```[\s\S]*?```)/g);

    return sections.map((section, idx) => {
      if (section.startsWith('```')) {
        const lines = section.split('\n');
        const code = lines.slice(1, lines.length - 1).join('\n');
        return (
          <div key={idx} className="my-4 rounded-lg overflow-hidden border border-border bg-[#03070E]">
            <div className="flex justify-between items-center bg-card-bg/60 px-4 py-2 text-[10px] text-text-muted font-bold font-mono border-b border-border/60">
              <span>Code Blueprint</span>
              <button 
                onClick={() => handleCopyCode(code)} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-foreground/90 overflow-x-auto whitespace-pre">{code}</pre>
          </div>
        );
      }

      const lines = section.split('\n');
      return (
        <div key={idx} className="space-y-3 font-normal text-xs leading-relaxed text-text-muted">
          {lines.map((line, lIdx) => {
            if (line.startsWith('###')) {
              const text = line.replace('###', '').trim();
              const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h3 key={lIdx} id={headingId} className="text-sm font-bold text-white mt-4">{text}</h3>;
            }
            if (line.startsWith('##')) {
              const text = line.replace('##', '').trim();
              const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h2 key={lIdx} id={headingId} className="text-base font-bold text-white mt-4">{text}</h2>;
            }
            if (line.startsWith('#')) {
              const text = line.replace('#', '').trim();
              const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return <h1 key={lIdx} id={headingId} className="text-lg font-black text-white mt-6 border-b border-border/40 pb-1">{text}</h1>;
            }
            if (line.startsWith('*') || line.startsWith('-')) {
              return (
                <li key={lIdx} className="ml-4 list-disc text-xs text-text-muted">
                  {parseInlineMarkdown(line.substring(1).trim())}
                </li>
              );
            }
            return <p key={lIdx} className="whitespace-pre-wrap">{parseInlineMarkdown(line)}</p>;
          })}
        </div>
      );
    });
  };

  if (isLoading || fetching || !lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  // Calculate course completion progress for Sidebar
  const activeCourse = roadmap?.courses[0];
  const completedLessonsList = user?.completedLessons || [];
  const totalLessons = activeCourse ? activeCourse.modules.reduce((acc: number, curr: any) => acc + curr.lessons.length, 0) : 0;
  const completedInPath = activeCourse ? activeCourse.modules.reduce((acc: number, mod: any) => {
    const completedCount = mod.lessons.filter((l: any) => completedLessonsList.includes(`${pathId}/${l.id}`)).length;
    return acc + completedCount;
  }, 0) : 0;
  const percent = totalLessons > 0 ? Math.round((completedInPath / totalLessons) * 100) : 0;

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
      
      {/* LEFT PANEL: Collapsible Curriculum Sidebar Browser */}
      {sidebarOpen && (
        <aside className="w-72 border-r border-border/80 bg-[#0B0F19]/40 flex flex-col shrink-0 overflow-y-auto">
          {/* Progress panel */}
          <div className="p-4 border-b border-border/60 space-y-2 select-none">
            <div className="flex justify-between items-center text-xs font-bold font-mono">
              <span className="text-text-muted uppercase">Course Progress</span>
              <span className="text-primary">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted text-right font-semibold">{completedInPath}/{totalLessons} lessons completed</p>
          </div>

          {/* Module lists */}
          {activeCourse && (
            <div className="p-4 space-y-6">
              {activeCourse.modules.map((mod: any, modIdx: number) => (
                <div key={modIdx} className="space-y-2 select-none">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider font-mono">{mod.title}</h4>
                  
                  <div className="space-y-1">
                    {mod.lessons.map((les: any) => {
                      const isActive = les.id === lessonId;
                      const isLesCompleted = completedLessonsList.includes(`${pathId}/${les.id}`);
                      return (
                        <Link 
                          key={les.id}
                          href={`/roadmaps/${pathId}/${les.id}`}
                          className={`p-2 rounded-lg flex items-center justify-between gap-2 border transition-all text-xs font-semibold ${
                            isActive 
                              ? 'bg-primary/10 border-primary/20 text-primary font-bold' 
                              : 'border-transparent hover:bg-card-bg/30 text-text-muted'
                          }`}
                        >
                          <span className="truncate max-w-[80%]">{les.title}</span>
                          {isLesCompleted ? (
                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-border shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* CENTER WORKSPACE: Notes / Tab controlled content */}
      <main 
        onScroll={handleScroll}
        className="flex-1 flex flex-col overflow-y-auto bg-background p-6 relative"
      >
        {/* Toggle sidebar button */}
        <div className="flex justify-between items-center gap-4 border-b border-border pb-4 select-none mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-border/80 text-text-muted hover:text-white bg-card-bg/20 cursor-pointer"
              title={sidebarOpen ? "Collapse Curriculum" : "Expand Curriculum"}
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href={`/roadmaps/${pathId}`} className="text-xs text-text-muted hover:text-white font-bold inline-flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Syllabus</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-border" />
            <h1 className="text-sm font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">{lesson.title}</h1>
          </div>

          <div className="flex gap-2">
            {isCompleted ? (
              <span className="px-2.5 py-1 rounded bg-success/15 border border-success/30 text-success text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 select-none">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-border/60 border border-border/80 text-text-muted text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Award className="h-3.5 w-3.5 animate-pulse" /> Locked (+100 XP)
              </span>
            )}
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2 border-b border-border/60 pb-px select-none shrink-0 mb-6">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Notes & Code
            </span>
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'diagram' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" /> Vector Diagram
            </span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'quiz' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" /> Quiz Check
            </span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" /> Resources
            </span>
          </button>
        </div>

        {/* Scroll reading progress bar */}
        {activeTab === 'notes' && (
          <div className="h-0.5 w-full bg-border/20 shrink-0 mb-6 -mt-6 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}

        {/* Workspace views */}
        <div className="flex-1">
          {activeTab === 'notes' && (
            <div className="space-y-6 max-w-3xl">
              {renderMarkdownNotes(lesson.notes)}
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="space-y-6 max-w-2xl py-4">
              <InteractiveDiagram lessonId={lessonId} />
              <div className="p-4 rounded-xl border border-border/40 bg-card-bg/25 space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Visual Takeaway</h4>
                <p className="text-xs text-text-muted leading-relaxed font-normal">
                  Our interactive vector diagrams outline complex pointers displacements, memory mappings, and lifecycles. Trace structural updates visually to reinforce coding models.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="text-sm">Knowledge Verification</CardTitle>
                <CardDescription>Submit 100% correct answers to unlock this lesson and score +100 XP.</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                {xpRewardMsg && (
                  <div className="p-3.5 rounded-lg border border-success/25 bg-success/10 text-success text-xs font-bold flex items-center justify-between select-none animate-pulse">
                    <span>{xpRewardMsg}</span>
                    <Flame className="h-4 w-4 fill-success/20 animate-bounce" />
                  </div>
                )}

                {quizError && (
                  <div className="p-3.5 rounded-lg border border-warning/25 bg-warning/10 text-warning text-xs font-bold flex items-center gap-2 select-none">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {lesson.quiz.map((q, idx) => (
                    <div key={idx} className="space-y-2 text-xs font-semibold">
                      <p className="text-white text-xs font-bold">{idx + 1}. {q.question}</p>
                      <div className="flex flex-col gap-2 pt-1 font-semibold">
                        {q.options.map((opt) => {
                          const isChecked = selectedAnswers[idx] === opt;
                          return (
                            <label 
                              key={opt}
                              className={`p-3 rounded-lg border flex items-center gap-3 transition-colors cursor-pointer ${
                                isChecked ? 'border-primary bg-primary/5 text-white' : 'border-border/60 hover:bg-card-bg/30 text-text-muted'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`q-${idx}`}
                                value={opt}
                                checked={isChecked}
                                onChange={() => setSelectedAnswers(prev => ({ ...prev, [idx]: opt }))}
                                disabled={quizSubmitted}
                                className="h-4 w-4 border-border text-primary focus:ring-primary accent-primary"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  {quizSubmitted ? (
                    <Button variant="outline" size="sm" onClick={handleRetryQuiz} className="cursor-pointer">
                      Retry Questions
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmitQuiz} 
                      isLoading={completing} 
                      disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                      className="cursor-pointer"
                    >
                      Submit Answers
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4 max-w-2xl">
              {lesson.resources.length > 0 ? (
                lesson.resources.map((res, idx) => (
                  <a 
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-border bg-card-bg hover:border-slate-500 rounded-lg flex items-center justify-between group cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{res.name}</span>
                    <LinkIcon className="h-4 w-4 text-text-muted" />
                  </a>
                ))
              ) : (
                <div className="text-center py-6 text-text-muted text-xs font-normal">
                  No additional references provided.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* RIGHT PANEL: Collapsible Table of Contents & Integrated AI Study Assistant */}
      {chatOpen && (
        <aside className="w-80 border-l border-border/80 bg-[#0B0F19]/40 flex flex-col shrink-0">
          {/* Table of Contents (TOC) */}
          {activeTab === 'notes' && toc.length > 0 && (
            <div className="p-4 border-b border-border/60 space-y-3 select-none">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider font-mono">Table of Contents</h4>
              <nav className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`block text-[10px] font-semibold text-text-muted hover:text-white transition-colors truncate ${
                      item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-2' : 'pl-4'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* AI Study Assistant Chatbox */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span>AI Lesson Assistant</span>
              </div>
              <button 
                onClick={() => setChatMessages([{ role: 'model', content: 'Chat history cleared. Ask me a question regarding this lesson.' }])}
                className="text-[9px] font-bold text-text-muted hover:text-white"
              >
                Clear
              </button>
            </div>

            {/* Message lists */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary/20 text-white rounded-br-none border border-primary/20' 
                      : 'bg-card-bg/80 text-text-muted rounded-bl-none border border-border/60'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex items-center gap-2 text-text-muted text-[10px] font-semibold font-mono animate-pulse">
                  <Bot className="h-4.5 w-4.5 animate-spin" />
                  <span>Assistant is thinking...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <div className="p-4 border-t border-border/60 bg-[#0B0F19]/25 flex gap-2">
              <input
                type="text"
                placeholder="Ask a doubt about code/theory..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                disabled={sendingChat}
                className="flex-1 bg-background border border-border/80 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder-border/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button 
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer shrink-0" 
                onClick={handleSendChatMessage}
                disabled={sendingChat || !chatInput.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}
