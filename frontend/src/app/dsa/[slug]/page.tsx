'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { 
  ChevronLeft, 
  ChevronDown,
  BookOpen, 
  Compass, 
  HelpCircle, 
  Award,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Eye,
  AlertCircle,
  Layers,
  TrendingUp,
  Coins,
  Play,
  Download
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface PatternQuestion {
  name: string;
  leetcode: string;
}

interface PatternItem {
  name: string;
  keywords: string[];
  questions: PatternQuestion[];
  recognition: string;
}

interface AlgorithmItem {
  name: string;
  useWhen: string;
  complexity: string;
}

interface ChallengeQuestion {
  name: string;
  leetcode: string;
  pattern: string;
  algorithm: string;
  trace: string;
  solution: string;
}

interface DsaTopicData {
  slug: string;
  name: string;
  difficulty: string;
  sequenceOrder: number;
  understand: {
    explanation: string;
    analogy: string;
    visualExample: string;
  };
  visualize: {
    initialData: any[];
  };
  patterns: PatternItem[];
  algorithms: AlgorithmItem[];
  questions: ChallengeQuestion[];
  revise: {
    points: string[];
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DsaTopicPage({ params }: PageProps) {
  const router = useRouter();
  const { user, setUser, isAuthenticated, isLoading } = useAuthStore();
  
  // Unwrap params
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [topic, setTopic] = useState<DsaTopicData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [activeTab, setActiveTab] = useState<string>('understand');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // AI State Wrappers
  const [simplifying, setSimplifying] = useState(false);
  const [simplerExplanation, setSimplerExplanation] = useState<string | null>(null);
  
  const [generatingAnalogy, setGeneratingAnalogy] = useState(false);
  const [customAnalogy, setCustomAnalogy] = useState<string | null>(null);

  const [quizzing, setQuizzing] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Custom Arrays Module States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'java' | 'python'>('cpp');
  const [fundCodeLang, setFundCodeLang] = useState<'cpp' | 'java' | 'python' | 'js'>('cpp');
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const [activeAlgIndex, setActiveAlgIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  // Custom pattern pointer animation state (for Two Pointer)
  const [twoPointerL, setTwoPointerL] = useState(0);
  const [twoPointerR, setTwoPointerR] = useState(4);
  const [twoPointerSum, setTwoPointerSum] = useState(6);
  const [twoPointerTarget, setTwoPointerTarget] = useState(5);
  const [twoPointerStatus, setTwoPointerStatus] = useState('Click "Play Animation" to trace pointers.');
  const [twoPointerPlaying, setTwoPointerPlaying] = useState(false);

  // Custom sliding window animation state
  const [windowStart, setWindowStart] = useState(0);
  const [windowEnd, setWindowEnd] = useState(2);
  const [windowSum, setWindowSum] = useState(8);
  const [windowMax, setWindowMax] = useState(8);
  const [windowStatus, setWindowStatus] = useState('Click "Play Animation" to slide window.');
  const [windowPlaying, setWindowPlaying] = useState(false);

  // Visualize Panel Animation States
  const [animatingMode, setAnimatingMode] = useState<'none' | 'traversal' | 'insert' | 'delete' | 'access' | 'update'>('none');
  const [animationStep, setAnimationStep] = useState(0);
  const [arrayElements, setArrayElements] = useState<number[]>([10, 20, 30, 40]);
  const [activePointer, setActivePointer] = useState<number | null>(null);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [animationText, setAnimationText] = useState('Interactive Sandbox. Click an animation below to begin.');

  const loadTopicDetails = async () => {
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}`);
      if (res.success && res.topic) {
        setTopic(res.topic);
        setIsCompleted(res.isCompleted || false);
        setArrayElements(res.topic.visualize.initialData || [10, 20, 30, 40]);
      }
    } catch (err) {
      console.error('Failed to load DSA topic details:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && slug) {
      loadTopicDetails();
      if (slug === 'arrays') {
        setActiveTab('fundamentals');
      } else {
        setActiveTab('understand');
      }
    }
  }, [isAuthenticated, slug]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // AI Feature 1: Explain Simpler
  const handleExplainSimpler = async () => {
    if (!topic) return;
    setSimplifying(true);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'explain-simpler' })
      });
      if (res.success && res.result) {
        setSimplerExplanation(res.result);
      }
    } catch (err) {
      console.error('Explain Simpler AI failed:', err);
    } finally {
      setSimplifying(false);
    }
  };

  // AI Feature 2: Another Example
  const handleAnotherExample = async () => {
    if (!topic) return;
    setGeneratingAnalogy(true);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'another-example' })
      });
      if (res.success && res.result) {
        setCustomAnalogy(res.result);
      }
    } catch (err) {
      console.error('Another Analogy AI failed:', err);
    } finally {
      setGeneratingAnalogy(false);
    }
  };

  // AI Feature 3: Quiz Me
  const handleQuizMe = async () => {
    if (!topic) return;
    setQuizzing(true);
    setQuizError(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'quiz-me' })
      });
      if (res.success && res.result) {
        setQuizQuestions(res.result);
        setQuizOpen(true);
      }
    } catch (err) {
      console.error('Quiz Me AI failed:', err);
    } finally {
      setQuizzing(false);
    }
  };

  const handleVerifyQuiz = () => {
    if (!quizQuestions) return;
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      setQuizError('Please answer all 3 questions.');
      return;
    }

    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    if (score < quizQuestions.length) {
      setQuizError('Some answers are incorrect. Review the concept and try again!');
    } else {
      setQuizError(null);
    }
  };

  // Topic Completion Checkpoint
  const handleCompleteTopic = async () => {
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/complete`, {
        method: 'POST'
      });
      if (res.success) {
        setIsCompleted(true);
        if (user) {
          const updatedCompleted = user.completedLessons ? [...user.completedLessons] : [];
          const topicKey = `dsa-topic/${slug}`;
          if (!updatedCompleted.includes(topicKey)) {
            updatedCompleted.push(topicKey);
          }
          setUser({
            ...user,
            xp: res.xp,
            streak: res.streak,
            completedLessons: updatedCompleted
          });
        }
        router.push('/dsa');
      }
    } catch (err) {
      console.error('Failed to complete topic:', err);
    }
  };

  // Traversal Animation Execution Loop
  const playTraversal = () => {
    setAnimatingMode('traversal');
    setAnimationStep(0);
    setActivePointer(0);
    setHighlightedIndices([]);
    setAnimationText('Traversal Init: Pointer starts at index 0.');

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < arrayElements.length) {
        setActivePointer(idx);
        setAnimationText(`Reading element at index ${idx}. Value = ${arrayElements[idx]}.`);
      } else {
        clearInterval(interval);
        setActivePointer(null);
        setAnimatingMode('none');
        setAnimationText('Traversal Complete! Checked all elements sequentially.');
      }
    }, 1200);
  };

  // Insertion Animation Execution Loop
  const playInsertion = () => {
    setAnimatingMode('insert');
    setArrayElements([10, 20, 40]);
    setHighlightedIndices([]);
    setActivePointer(null);
    setAnimationText('Inserting 30 at index 2. Initial Array: [10, 20, 40].');

    setTimeout(() => {
      // Step 1: Highlight elements to shift
      setHighlightedIndices([2]);
      setAnimationText('Step 1: Element at index 2 (value 40) must be shifted right to create room.');
    }, 1500);

    setTimeout(() => {
      // Step 2: Show empty slot / shift representation
      setArrayElements([10, 20, 40, 40]);
      setHighlightedIndices([3]);
      setAnimationText('Step 2: Element 40 shifted to index 3.');
    }, 3200);

    setTimeout(() => {
      // Step 3: Insert value
      setArrayElements([10, 20, 30, 40]);
      setHighlightedIndices([2]);
      setAnimationText('Step 3: Inserted value 30 into index 2. Complete!');
    }, 4800);

    setTimeout(() => {
      setHighlightedIndices([]);
      setAnimatingMode('none');
    }, 6000);
  };

  // Deletion Animation Execution Loop
  const playDeletion = () => {
    setAnimatingMode('delete');
    setArrayElements([10, 20, 30, 40]);
    setHighlightedIndices([]);
    setActivePointer(null);
    setAnimationText('Deleting 20 at index 1. Initial Array: [10, 20, 30, 40].');

    setTimeout(() => {
      // Step 1: Highlight deletion cell
      setHighlightedIndices([1]);
      setAnimationText('Step 1: Locate index 1 (value 20) and clear it.');
    }, 1500);

    setTimeout(() => {
      // Step 2: Show shifting of remaining
      setArrayElements([10, 30, 30, 40]);
      setHighlightedIndices([1, 2]);
      setAnimationText('Step 2: Shift element 30 from index 2 left to index 1.');
    }, 3200);

    setTimeout(() => {
      // Step 3: Shift remaining
      setArrayElements([10, 30, 40, 40]);
      setHighlightedIndices([2, 3]);
      setAnimationText('Step 3: Shift element 40 from index 3 left to index 2.');
    }, 4800);

    setTimeout(() => {
      // Step 4: Finalize
      setArrayElements([10, 30, 40]);
      setHighlightedIndices([]);
      setAnimationText('Step 4: Truncate array length to 3. Deletion Complete!');
    }, 6400);

    setTimeout(() => {
      setAnimatingMode('none');
    }, 7600);
  };

  // Access by Index Animation Loop
  const playAccess = (targetIdx: number) => {
    if (animatingMode !== 'none') return;
    setAnimatingMode('access');
    setActivePointer(null);
    setHighlightedIndices([]);
    setAnimationText(`Accessing index ${targetIdx}. Math: Address = BaseAddress + index (${targetIdx}) * ElementSize.`);
    
    setTimeout(() => {
      setActivePointer(targetIdx);
      setHighlightedIndices([targetIdx]);
      setAnimationText(`Index ${targetIdx} accessed directly in O(1) time! Value = ${arrayElements[targetIdx]}.`);
    }, 1200);

    setTimeout(() => {
      setAnimatingMode('none');
    }, 3000);
  };

  // Direct Update Animation Loop
  const playUpdate = (targetIdx: number, newValue: number) => {
    if (animatingMode !== 'none') return;
    setAnimatingMode('update');
    setActivePointer(targetIdx);
    setHighlightedIndices([targetIdx]);
    setAnimationText(`Updating element at index ${targetIdx} to ${newValue}. Direct index overwrite.`);
    
    setTimeout(() => {
      const copy = [...arrayElements];
      copy[targetIdx] = newValue;
      setArrayElements(copy);
      setAnimationText(`Update complete! Array[index ${targetIdx}] is now ${newValue}. Time Complexity: O(1).`);
    }, 1500);

    setTimeout(() => {
      setActivePointer(null);
      setHighlightedIndices([]);
      setAnimatingMode('none');
    }, 3200);
  };

  // Two Pointer Simulation loop
  const playTwoPointer = () => {
    if (twoPointerPlaying) return;
    setTwoPointerPlaying(true);
    setTwoPointerL(0);
    setTwoPointerR(4);
    setTwoPointerSum(6);
    setTwoPointerStatus('L starts at index 0 (val 1), R starts at index 4 (val 5). Sum = 1 + 5 = 6. Target = 5.');

    setTimeout(() => {
      setTwoPointerStatus('Sum (6) > Target (5). Decreasing sum by moving Right pointer left: R = index 3 (val 4).');
      setTwoPointerR(3);
      setTwoPointerSum(5);
    }, 2500);

    setTimeout(() => {
      setTwoPointerStatus('Sum (5) matches Target (5)! Pair found at indices [0, 3] (values 1, 4).');
      setTwoPointerPlaying(false);
    }, 5000);
  };

  // Sliding Window Simulation loop
  const playSlidingWindow = () => {
    if (windowPlaying) return;
    setWindowPlaying(true);
    setWindowStart(0);
    setWindowEnd(2);
    setWindowSum(8);
    setWindowMax(8);
    setWindowStatus('Initial window [0..2] over [2, 1, 5]: Sum = 8. Max Sum = 8.');

    setTimeout(() => {
      setWindowStart(1);
      setWindowEnd(3);
      setWindowSum(7);
      setWindowStatus('Slide window to [1..3] over [1, 5, 1]: Sum = 7. Max Sum remains 8.');
    }, 2200);

    setTimeout(() => {
      setWindowStart(2);
      setWindowEnd(4);
      setWindowSum(9);
      setWindowMax(9);
      setWindowStatus('Slide window to [2..4] over [5, 1, 3]: Sum = 9. Max Sum updated to 9!');
    }, 4400);

    setTimeout(() => {
      setWindowStart(3);
      setWindowEnd(5);
      setWindowSum(6);
      setWindowStatus('Slide window to [3..5] over [1, 3, 2]: Sum = 6. Slide complete. Max Sum = 9!');
      setWindowPlaying(false);
    }, 6600);
  };

  if (isLoading || fetching || !topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Retrieving subject details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground p-6 relative overflow-hidden font-geist">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:wght@100..900&display=swap');
        .font-geist {
          font-family: 'Geist', 'Inter', sans-serif;
        }
      `}} />
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[250px] w-full max-w-[1000px] rounded-full bg-primary/5 blur-3xl opacity-60" />

      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center gap-4 border-b border-border/40 pb-4 select-none">
          <Link href="/dsa" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white font-bold cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            <span>Connected Roadmap</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="px-2.5 py-1 rounded bg-success/15 border border-success/30 text-success text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </span>
            ) : (
              <button 
                onClick={handleCompleteTopic}
                className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Award className="h-3.5 w-3.5 animate-pulse" /> Mark Completed (+100 XP)
              </button>
            )}
          </div>
        </div>

        {/* Header Topic Title & AI actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <span className="text-[10px] font-black text-primary tracking-wider uppercase font-mono">{topic.difficulty} Concept</span>
            <h1 className="text-3xl font-black text-white mt-1">{topic.name}</h1>
          </div>

          {/* Core AI prompt triggers (No chatbot overlay) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-[10px] h-8 gap-1.5 font-bold border border-border/80 text-foreground hover:bg-card-bg/50 cursor-pointer"
              onClick={handleExplainSimpler}
              isLoading={simplifying}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Explain Simpler</span>
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-[10px] h-8 gap-1.5 font-bold border border-border/80 text-foreground hover:bg-card-bg/50 cursor-pointer"
              onClick={handleAnotherExample}
              isLoading={generatingAnalogy}
            >
              <RefreshCw className="h-3.5 w-3.5 text-secondary" />
              <span>Another Example</span>
            </Button>
            <Button 
              size="sm" 
              className="text-[10px] h-8 gap-1.5 font-bold bg-primary text-white hover:bg-primary-hover cursor-pointer"
              onClick={handleQuizMe}
              isLoading={quizzing}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Quiz Me</span>
            </Button>
          </div>
        </div>

        {/* Workspace Tab Controls */}
        <div className="flex gap-1 border-b border-border/40 pb-px overflow-x-auto select-none shrink-0 scrollbar-none">
          {(slug === 'arrays'
            ? [
                { id: 'fundamentals', label: '1. Fundamentals', colorClass: 'border-[#3B82F6] text-[#3B82F6]' },
                { id: 'visualize', label: '2. Visualize', colorClass: 'border-[#8B5CF6] text-[#8B5CF6]' },
                { id: 'patterns', label: '3. Patterns', colorClass: 'border-[#F59E0B] text-[#F59E0B]' },
                { id: 'algorithms', label: '4. Algorithms', colorClass: 'border-[#10B981] text-[#10B981]' },
                { id: 'questions', label: '5. Interview Questions', colorClass: 'border-[#EF4444] text-[#EF4444]' },
                { id: 'revision', label: '6. Revision Notes', colorClass: 'border-[#06B6D4] text-[#06B6D4]' },
              ]
            : [
                { id: 'understand', label: '1. Understand', colorClass: 'border-primary text-primary' },
                { id: 'visualize', label: '2. Visualize', colorClass: 'border-primary text-primary' },
                { id: 'patterns', label: '3. Patterns & Algorithms', colorClass: 'border-primary text-primary' },
                { id: 'questions', label: '4. Questions', colorClass: 'border-primary text-primary' },
                { id: 'revise', label: '5. Revise', colorClass: 'border-primary text-primary' },
              ]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setQuizOpen(false);
              }}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id && !quizOpen
                  ? tab.colorClass
                  : 'border-transparent text-text-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Display Area */}
        <div className="min-h-[300px]">
          
          {/* AI QUIZ OVERLAY TAB STATE */}
          {quizOpen && quizQuestions && (
            <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="flex justify-between items-center flex-row">
                <div>
                  <CardTitle className="text-sm font-black text-white">AI Concept Check</CardTitle>
                  <CardDescription>Answer these 3 custom questions to test your knowledge.</CardDescription>
                </div>
                <button 
                  onClick={() => setQuizOpen(false)}
                  className="text-xs text-text-muted hover:text-white font-bold"
                >
                  Close Quiz
                </button>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {quizError && (
                  <div className="p-3.5 rounded-lg border border-warning/20 bg-warning/10 text-warning text-xs font-semibold flex items-center gap-2 select-none">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2.5 text-xs font-semibold">
                      <p className="text-white text-xs font-bold">{qIdx + 1}. {q.question}</p>
                      <div className="flex flex-col gap-2 pt-1">
                        {q.options.map((opt) => {
                          const isChecked = selectedAnswers[qIdx] === opt;
                          return (
                            <label 
                              key={opt}
                              className={`p-3 rounded-lg border flex items-center gap-3 transition-colors cursor-pointer ${
                                isChecked ? 'border-primary bg-primary/5 text-white' : 'border-border/60 hover:bg-card-bg/30 text-text-muted'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`dsa-q-${qIdx}`}
                                value={opt}
                                checked={isChecked}
                                onChange={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                                disabled={quizSubmitted}
                                className="h-4 w-4 border-border text-primary accent-primary"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {quizSubmitted ? (
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-white">Score: {quizScore} / 3 Correct</span>
                      <Button variant="outline" size="sm" onClick={handleQuizMe}>
                        Try Another
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleVerifyQuiz}>
                      Submit Answers
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {!quizOpen && (
            slug === 'arrays' ? (
              <>
                {/* SECTION 1: FUNDAMENTALS */}
                {activeTab === 'fundamentals' && (
                  <div className="space-y-16 py-2 animate-fadeIn border-l-4 border-l-[#3B82F6] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <BookOpen className="h-3 w-3" />
                        <span>Section 1: Fundamentals</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Array Fundamentals</h3>
                      <p className="text-xs text-text-muted font-normal">Learn the standard definition, logical scaling necessity, structural characteristics, and code templates.</p>
                    </div>

                    {/* SECTION 1: WHAT IS AN ARRAY? */}
                    <div className="space-y-8">
                      <Card className="bg-gradient-to-br from-[#1E293B] to-[#111827] border border-[#334155] rounded-[20px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
                        <CardBody className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Definition */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                  <Layers className="h-4.5 w-4.5" />
                                </div>
                                <h4 className="text-base font-black text-white tracking-tight">What is an Array?</h4>
                              </div>
                              <div className="space-y-3 text-xs text-text-muted leading-relaxed font-normal">
                                <p className="text-white font-bold text-sm">
                                  An Array is a linear data structure used to store multiple elements of the same data type in a contiguous sequence of memory locations. Each element is identified by an index, allowing fast and direct access to the stored data.
                                </p>
                                <p>
                                  Arrays are one of the most fundamental data structures in computer science and are widely used in software development, competitive programming, and technical interviews.
                                </p>
                              </div>
                            </div>

                            {/* Right Side: Visual Diagram with Floating Animation */}
                            <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-black/30 border border-[#334155]/60 min-h-[140px]">
                              <motion.div 
                                className="space-y-3 w-full flex flex-col items-center"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                              >
                                <span className="text-[10px] font-mono font-black text-primary tracking-wider uppercase">Visual Diagram</span>
                                <div className="flex items-center gap-2 select-none">
                                  {[10, 20, 30, 40].map((val, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary flex items-center justify-center text-white font-mono font-black text-xs shadow-md shadow-primary/5">
                                        {val}
                                      </div>
                                      <span className="text-[9px] font-mono text-text-muted mt-1.5 font-bold">{idx}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 2: WHY DO WE NEED ARRAYS? */}
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-[#EF4444] uppercase font-mono tracking-wider">Why Do We Need Arrays?</h4>
                        <p className="text-xs text-text-muted font-normal">A side-by-side logical comparison of managing variables manually vs. grouping them inside an Array.</p>
                      </div>
                      
                      <Card className="border border-border-color bg-card-bg rounded-[20px] overflow-hidden">
                        <CardBody className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Side: Without Array (Red Theme) */}
                            <motion.div 
                              className="p-5 rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 flex flex-col justify-between min-h-[180px] hover:border-[#EF4444]/40 transition-all duration-300"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[#EF4444]">
                                  <AlertCircle className="h-4.5 w-4.5" />
                                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Without Array</span>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                  Declaring individual variables scales poorly. If you need to store marks for 10,000 students, you would have to write 10,000 unique variable names:
                                </p>
                                <pre className="p-3 bg-black/40 rounded-lg border border-[#EF4444]/10 text-xs font-mono text-text-muted/90 select-none">
{`student1 = 80
student2 = 90
student3 = 75
student4 = 60
student5 = 85`}
                                </pre>
                              </div>
                              <span className="text-[9px] text-[#EF4444]/80 font-mono mt-3 block">✕ Tedious, static, and impossible to traverse dynamically.</span>
                            </motion.div>

                            {/* Right Side: Using Array (Green Theme) */}
                            <motion.div 
                              className="p-5 rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/5 flex flex-col justify-between min-h-[180px] hover:border-[#22C55E]/40 transition-all duration-300"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[#22C55E]">
                                  <CheckCircle className="h-4.5 w-4.5" />
                                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Using Array</span>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                  Storing similar values under a single identifier provides unified tracking. You can allocate, update, and search items instantly in a structured format:
                                </p>
                                <pre className="p-3 bg-black/40 rounded-lg border border-[#22C55E]/10 text-xs font-mono text-[#22C55E] font-bold select-none">
{`marks = [80, 90, 75, 60, 85]`}
                                </pre>
                              </div>
                              <span className="text-[9px] text-[#22C55E]/80 font-mono mt-3 block">✓ Logical grouping, loops-compatible, and dynamically scalable.</span>
                            </motion.div>

                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 4: CODE EXAMPLES */}
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-primary uppercase font-mono tracking-wider">Creating & Accessing Arrays</h4>
                        <p className="text-xs text-text-muted font-normal">Explore syntax configurations and element access examples across multiple programming environments.</p>
                      </div>

                      <Card className="bg-[#0F172A] border border-[#334155] rounded-[20px] overflow-hidden shadow-2xl">
                        <div className="bg-[#030712] px-5 py-3 border-b border-[#334155]/60 flex items-center justify-between gap-4 flex-wrap select-none">
                          {/* VS Code title dots */}
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
                            <span className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
                            <span className="h-3 w-3 rounded-full bg-[#22C55E]/80" />
                            <span className="text-[10px] text-text-muted font-mono font-bold ml-2">ArrayController.ts</span>
                          </div>

                          {/* Language Switcher Tabs */}
                          <div className="flex rounded border border-[#334155]/80 overflow-hidden bg-black/30">
                            {[
                              { id: 'cpp', label: 'C++' },
                              { id: 'java', label: 'Java' },
                              { id: 'python', label: 'Python' },
                              { id: 'js', label: 'JavaScript' }
                            ].map((l) => {
                              const isActive = fundCodeLang === l.id;
                              return (
                                <button
                                  key={l.id}
                                  onClick={() => setFundCodeLang(l.id as any)}
                                  className={`px-3.5 py-1.5 text-[10px] font-mono font-bold cursor-pointer transition-all ${
                                    isActive 
                                      ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow font-black' 
                                      : 'text-text-muted hover:text-white hover:bg-slate-800/40'
                                  }`}
                                >
                                  {l.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <CardBody className="p-0 relative font-mono">
                          {/* Copy Button */}
                          <div className="absolute top-4 right-4 z-10 select-none">
                            <button
                              onClick={() => {
                                const codes: Record<string, string> = {
                                  cpp: `// Create an integer array of size 5\nint arr[5];\n\n// Create and initialize an array\nint arr[5] = {10, 20, 30, 40, 50};\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[5] = {10, 20, 30, 40, 50};\n    cout << arr[2];\n    return 0;\n}`,
                                  java: `// Create an integer array of size 5\nint[] arr = new int[5];\n\n// Create and initialize an array\nint[] arr = {10, 20, 30, 40, 50};\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        System.out.println(arr[2]);\n    }\n}`,
                                  python: `# Create and initialize an array-like list\narr = [10, 20, 30, 40, 50]\n\n# Access element at index 2\nprint(arr[2])`,
                                  js: `// Create and initialize an array\nlet arr = [10, 20, 30, 40, 50];\n\n// Access element at index 2\nconsole.log(arr[2]);`
                                };
                                handleCopyCode(codes[fundCodeLang]);
                              }}
                              className="p-1.5 rounded border border-[#334155] bg-[#0F172A] hover:bg-[#1E293B] text-text-muted hover:text-white transition-colors cursor-pointer"
                              title="Copy code"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <pre className="p-6 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre leading-relaxed bg-transparent">
                            {fundCodeLang === 'cpp' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Declaration</span>
                                <span className="text-emerald-500">// Create an integer array of size 5</span>{"\n"}
                                <span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>] = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-purple-400">#include</span> <span className="text-orange-400">&lt;iostream&gt;</span>{"\n"}
                                <span className="text-purple-400">using namespace</span> std;{"\n\n"}
                                <span className="text-blue-400">int</span> <span className="text-yellow-400">main</span>() &#123;{"\n"}
                                <span className="text-emerald-500">    // Array initialization</span>{"\n"}
                                {"    "}<span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>] = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-emerald-500">    // Access element at index 2</span>{"\n"}
                                {"    "}cout &lt;&lt; arr[<span className="text-amber-500">2</span>];{"\n"}
                                {"    "}<span className="text-purple-400">return</span> <span className="text-amber-500">0</span>;{"\n"}
                                &#125;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'java' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Declaration</span>
                                <span className="text-emerald-500">// Create an integer array of size 5</span>{"\n"}
                                <span className="text-blue-400">int</span>[] arr = <span className="text-purple-400">new int</span>[<span className="text-amber-500">5</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">int</span>[] arr = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-purple-400">public class</span> <span className="text-yellow-400">Main</span> &#123;{"\n"}
                                {"    "}<span className="text-purple-400">public static void</span> <span className="text-yellow-400">main</span>(String[] args) &#123;{"\n"}
                                <span className="text-emerald-500">        // Array initialization</span>{"\n"}
                                {"        "}<span className="text-blue-400">int</span>[] arr = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-emerald-500">        // Access element at index 2</span>{"\n"}
                                {"        "}System.out.println(arr[<span className="text-amber-500">2</span>]);{"\n"}
                                {"    "}&#125;{"\n"}
                                &#125;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'python' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500"># Create and initialize an array-like list</span>{"\n"}
                                arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>]{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-emerald-500"># Array initialization</span>{"\n"}
                                arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>]{"\n\n"}
                                <span className="text-emerald-500"># Access element at index 2</span>{"\n"}
                                <span className="text-blue-400">print</span>(arr[<span className="text-amber-500">2</span>]){"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'js' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">let</span> arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-emerald-500">// Array initialization</span>{"\n"}
                                <span className="text-blue-400">let</span> arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>];{"\n\n"}
                                <span className="text-emerald-500">// Access element at index 2</span>{"\n"}
                                console.log(arr[<span className="text-amber-500">2</span>]);{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                          </pre>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 5: KEY CHARACTERISTICS */}
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-primary uppercase font-mono tracking-wider">Key Characteristics</h4>
                        <p className="text-xs text-text-muted font-normal">Fundamental behaviors and physical constraints that define array data structures.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { title: 'Fast Access', desc: 'Accessing any element via index is O(1). Simple memory offset arithmetic provides immediate access, bypassing loops.', icon: <Zap className="h-4.5 w-4.5" /> },
                          { title: 'Indexed Structure', desc: 'Offsets map directly to elements. Position references are unique integer keys (0 to n-1) pointing to stored data.', icon: <Target className="h-4.5 w-4.5" /> },
                          { title: 'Contiguous Memory', desc: 'Elements sit directly adjacent in physical RAM (|10|20|30|40|50|). Maximizes CPU cache performance.', icon: <Layers className="h-4.5 w-4.5" /> },
                          { title: 'Easy Traversal', desc: 'Iterating through elements sequentially is natural. Easily loops from start index 0 to end index n-1 in O(n) runtime.', icon: <Compass className="h-4.5 w-4.5" /> }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="p-6 rounded-[20px] border border-border-color bg-[#111827] flex flex-col gap-3 hover:border-primary/40 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                {item.icon}
                              </div>
                              <span className="text-sm font-black text-white">{item.title}</span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed font-normal">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 6: WHEN SHOULD WE USE ARRAYS? */}
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-success uppercase font-mono tracking-wider">When Should We Use Arrays?</h4>
                        <p className="text-xs text-text-muted font-normal">Standard software development scenarios suited for array sequential groups.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { title: 'Student Marks', desc: 'Aggregating classroom scores sequentially.', icon: <Award className="h-4 w-4" /> },
                          { title: 'Product Prices', desc: 'Listing item prices in checkout catalogs.', icon: <Coins className="h-4 w-4" /> },
                          { title: 'Monthly Sales', desc: 'Tracking monthly revenue metrics.', icon: <TrendingUp className="h-4 w-4" /> },
                          { title: 'Game Scores', desc: 'Recording top player levels.', icon: <Zap className="h-4 w-4" /> }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="p-5 rounded-[20px] border border-border-color bg-[#111827] flex flex-col gap-2.5 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                              {item.icon}
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-black text-white block">{item.title}</span>
                              <p className="text-[10px] text-text-muted leading-relaxed font-normal">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation control */}
                    <div className="flex justify-end max-w-3xl pt-4 select-none">
                      <Button
                        variant="primary"
                        size="sm"
                        className="cursor-pointer text-[10px] font-bold bg-primary text-white hover:bg-primary-hover"
                        onClick={() => {
                          setActiveTab('visualize');
                        }}
                      >
                        Go to Visualizer
                      </Button>
                    </div>
                  </div>
                )}

                {/* SECTION 2: VISUALIZE */}
                {activeTab === 'visualize' && (
                  <div className="space-y-6 max-w-3xl py-2 animate-fadeIn border-l-4 border-l-[#8B5CF6] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <Play className="h-3 w-3" />
                        <span>Section 2: Interactive Sandbox</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Interactive Playground</h3>
                      <p className="text-xs text-text-muted font-normal">Click on the array blocks to highlight indices, trace memory offsets, and inspect cell data values.</p>
                    </div>

                    {/* Array blocks representation (Rounded, Gradient, Hover effects) */}
                    <Card className="border border-border-color bg-card-bg rounded-[20px]">
                      <CardBody className="p-6 flex flex-col items-center justify-center gap-6 select-none relative">
                        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                          {arrayElements.map((val, idx) => {
                            const isSelected = clickedIndex === idx;
                            return (
                              <motion.div 
                                key={idx} 
                                className="flex flex-col items-center gap-2 cursor-pointer"
                                onClick={() => setClickedIndex(isSelected ? null : idx)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {/* Array block element (Gradient, Rounded) */}
                                <div 
                                  className={`h-14 w-14 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                                    isSelected 
                                      ? 'border-[#8B5CF6] bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/20 font-black'
                                      : 'border-border-color bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold'
                                  }`}
                                >
                                  <span className="text-[10px]">Value</span>
                                  <span className="text-sm font-black mt-0.5">{val}</span>
                                </div>
                                <span className={`text-[9px] font-mono font-black ${isSelected ? 'text-[#8B5CF6]' : 'text-text-muted'}`}>Index {idx}</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Playground Selection Display Details */}
                        {clickedIndex !== null && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md p-4 rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 flex flex-col gap-2.5 text-xs text-text-muted font-mono"
                          >
                            <div className="flex justify-between items-center pb-1 border-b border-[#8B5CF6]/10 text-white font-black">
                              <span>Block details:</span>
                              <span className="text-[#8B5CF6] uppercase text-[10px]">Active Node</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Selected Index:</span>
                              <span className="text-white font-bold">{clickedIndex}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stored Value:</span>
                              <span className="text-[#8B5CF6] font-bold">{arrayElements[clickedIndex]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>RAM Memory Address:</span>
                              <span className="text-white font-bold">BaseAddress + {clickedIndex} * 4 bytes</span>
                            </div>
                            <div className="text-[10px] text-text-muted leading-relaxed font-normal border-t border-[#8B5CF6]/10 pt-2 italic">
                              Notice how RAM offsets are computed instantly. Lookups are O(1) time complexity!
                            </div>
                          </motion.div>
                        )}
                      </CardBody>
                    </Card>

                    {/* Shifting Animations Sandbox console */}
                    <div className="space-y-4 pt-4 border-t border-border-color/30">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-[#8B5CF6] uppercase tracking-wider block">Animation Sandbox</span>
                        <p className="text-[11px] text-text-muted font-normal">Play shift-animations: Insertion, Deletion, Traversal sweeps inside contiguous cells.</p>
                      </div>

                      <div className="p-4 border border-[#334155]/60 bg-black/30 rounded-[20px] text-[11px] font-mono text-text-muted text-center">
                        {animationText}
                      </div>

                      <div className="flex flex-wrap gap-2.5 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={() => playAccess(2)}
                          disabled={animatingMode !== 'none'}
                        >
                          Access Index [2]
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playTraversal}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Traversal
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playInsertion}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Insertion
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playDeletion}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Deletion
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={() => playUpdate(1, 99)}
                          disabled={animatingMode !== 'none'}
                        >
                          Update Index [1] to 99
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: PATTERNS */}
                {activeTab === 'patterns' && (
                  <div className="space-y-6 max-w-3xl py-2 animate-fadeIn border-l-4 border-l-[#F59E0B] pl-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. Array Coding Patterns</h3>
                      <p className="text-xs text-text-muted">Mastering standard arrays patterns enables you to solve unseen interview challenges instantly.</p>
                    </div>

                    {/* Pattern Switch tabs */}
                    <div className="flex gap-1 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {['Traversal', 'Two Pointer', 'Sliding Window', 'Prefix Sum'].map((name, idx) => (
                        <button
                          key={name}
                          onClick={() => setActivePatternIndex(idx)}
                          className={`px-3.5 py-2 text-[11px] font-mono font-bold cursor-pointer border-b-2 transition-all shrink-0 ${
                            activePatternIndex === idx 
                              ? 'border-secondary text-secondary font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    {/* Pattern Details Panel */}
                    <Card className="border border-border/40">
                      <CardBody className="p-5 space-y-4 text-xs font-medium">
                        {activePatternIndex === 0 && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-white">Traversal Pattern</h4>
                              <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                                Scanning the array from beginning to end to process elements one-by-one. It is the most natural base pattern.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Recognition Keywords:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Find', 'Count', 'Maximum', 'Minimum', 'Sum'].map((kw) => (
                                    <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Real-World Usage:</span>
                                <p className="text-[11px] text-text-muted font-normal">Calculating transaction totals, finding highest grades, counting instances.</p>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-secondary/5 border border-secondary/15 rounded-lg">
                              <span className="text-[9px] font-bold text-secondary uppercase font-mono block mb-1">Concept Diagram:</span>
                              <div className="flex items-center gap-1.5 font-mono text-[10px] text-white py-1">
                                <span className="text-secondary font-bold mr-1">Scanning:</span>
                                <div className="flex gap-1">
                                  <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center text-secondary font-black scale-105 border-secondary">10</div>
                                  <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">20</div>
                                  <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">30</div>
                                  <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">40</div>
                                </div>
                                <span className="text-secondary animate-pulse ml-2">&lt;── Pointer hops sequentially</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                              <div className="flex flex-col gap-1 text-[11px] text-primary font-bold">
                                <span>• Find Maximum element in Array</span>
                                <span>• Sum of elements in Array</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activePatternIndex === 1 && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-white">Two Pointer Pattern</h4>
                              <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                                Using two references starting at boundaries (often Left = 0, Right = n-1) moving inwards to locate pair items matching a constraint in $O(n)$ time.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Recognition Keywords:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Pair', 'Target Sum', 'Sorted Array', 'Two pointers'].map((kw) => (
                                    <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Real-World Usage:</span>
                                <p className="text-[11px] text-text-muted font-normal">Finding two target weights that sum to an absolute capacity on scale.</p>
                              </div>
                            </div>

                            {/* Pointer interactive trace */}
                            <div className="p-4 bg-black/20 border border-border/40 rounded-xl space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-secondary uppercase font-mono">Two Pointer Simulation: Target sum = 5</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-[9px] font-bold border border-border"
                                  onClick={playTwoPointer}
                                  disabled={twoPointerPlaying}
                                >
                                  {twoPointerPlaying ? 'Running...' : 'Play Animation'}
                                </Button>
                              </div>

                              <div className="flex justify-center items-center gap-3 select-none">
                                {[1, 2, 3, 4, 5].map((val, idx) => {
                                  const isL = twoPointerL === idx;
                                  const isR = twoPointerR === idx;
                                  return (
                                    <div key={idx} className="flex flex-col items-center gap-1.5">
                                      {/* Pointer label top */}
                                      <div className="h-4 text-[9px] font-black text-secondary font-mono">
                                        {isL && isR ? 'L,R' : isL ? 'L' : isR ? 'R' : ''}
                                      </div>
                                      <div className={`h-8 w-10 rounded border flex items-center justify-center font-mono font-black text-xs transition-colors duration-300 ${
                                        isL || isR ? 'border-secondary bg-secondary/10 text-white' : 'border-border bg-card-bg/40 text-text-muted'
                                      }`}>
                                        {val}
                                      </div>
                                      <div className="text-[8px] font-mono text-text-muted">idx {idx}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-[10px] font-mono text-text-muted text-center italic">{twoPointerStatus}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                              <div className="flex flex-col gap-1 text-[11px] text-primary font-bold">
                                <span>• Two Sum II (Sorted input array)</span>
                                <span>• Container with Most Water</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activePatternIndex === 2 && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-white">Sliding Window Pattern</h4>
                              <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                                Maintaining a contiguous subsegment (the window) that slides from left to right, updating aggregate values incrementally in $O(1)$ per step.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Recognition Keywords:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Subarray', 'Window', 'Maximum Sum', 'Consecutive values'].map((kw) => (
                                    <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Real-World Usage:</span>
                                <p className="text-[11px] text-text-muted font-normal">Streaming stock values, tracking moving averages over specific hourly windows.</p>
                              </div>
                            </div>

                            {/* Sliding window interactive trace */}
                            <div className="p-4 bg-black/20 border border-border/40 rounded-xl space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-secondary uppercase font-mono">Sliding Window: Subarray of size 3</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-[9px] font-bold border border-border"
                                  onClick={playSlidingWindow}
                                  disabled={windowPlaying}
                                >
                                  {windowPlaying ? 'Sliding...' : 'Play Animation'}
                                </Button>
                              </div>

                              <div className="flex justify-center items-center gap-3 select-none">
                                {[2, 1, 5, 1, 3, 2].map((val, idx) => {
                                  const isInWindow = idx >= windowStart && idx <= windowEnd;
                                  return (
                                    <div key={idx} className="flex flex-col items-center gap-1.5">
                                      <div className={`h-8 w-10 rounded border flex items-center justify-center font-mono font-black text-xs transition-all duration-300 ${
                                        isInWindow 
                                          ? 'border-secondary bg-secondary/15 text-white scale-105 shadow shadow-secondary/20' 
                                          : 'border-border bg-card-bg/40 text-text-muted'
                                      }`}>
                                        {val}
                                      </div>
                                      <div className="text-[8px] font-mono text-text-muted">idx {idx}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex justify-around items-center text-[10px] font-mono text-text-muted border-t border-border/20 pt-2 font-bold">
                                <span>Current Sum: <span className="text-secondary">{windowSum}</span></span>
                                <span>Max Sum: <span className="text-white">{windowMax}</span></span>
                              </div>
                              <p className="text-[10px] font-mono text-text-muted text-center italic">{windowStatus}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                              <div className="flex flex-col gap-1 text-[11px] text-primary font-bold">
                                <span>• Maximum Sum Subarray of size K</span>
                                <span>• Minimum Size Subarray Sum</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activePatternIndex === 3 && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-white">Prefix Sum Pattern</h4>
                              <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                                Pre-computing cumulative array values `Prefix[i] = Prefix[i-1] + Array[i]` to answer range sum queries dynamically in $O(1)$ time.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Recognition Keywords:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Range Sum', 'Cumulative Sum', 'Subarray sum queries'].map((kw) => (
                                    <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Real-World Usage:</span>
                                <p className="text-[11px] text-text-muted font-normal">Databases fetching transactional logs within specific timestamps instantly.</p>
                              </div>
                            </div>

                            <div className="p-3 bg-secondary/5 border border-secondary/15 rounded-lg space-y-2">
                              <span className="text-[9px] font-bold text-secondary uppercase font-mono block">Prefix Sum Mapping:</span>
                              <div className="flex items-center gap-3 font-mono text-[10px] py-1 select-none">
                                <div className="space-y-1">
                                  <span className="text-text-muted">Array:</span>
                                  <div className="flex gap-1 text-white font-bold">
                                    <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">1</div>
                                    <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">2</div>
                                    <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">3</div>
                                    <div className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">4</div>
                                  </div>
                                </div>
                                <div className="text-secondary font-black text-base self-center pt-3">↓</div>
                                <div className="space-y-1">
                                  <span className="text-text-muted">Prefix Sum:</span>
                                  <div className="flex gap-1 text-secondary font-black">
                                    <div className="h-6 w-8 rounded border border-secondary bg-secondary/10 flex items-center justify-center">1</div>
                                    <div className="h-6 w-8 rounded border border-secondary bg-secondary/10 flex items-center justify-center">3</div>
                                    <div className="h-6 w-8 rounded border border-secondary bg-secondary/10 flex items-center justify-center">6</div>
                                    <div className="h-6 w-8 rounded border border-secondary bg-secondary/10 flex items-center justify-center">10</div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-[9px] text-text-muted font-medium italic">Lookup sum of Range [1..3] as: Prefix[3] - Prefix[0] = 10 - 1 = 9.</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                              <div className="flex flex-col gap-1 text-[11px] text-primary font-bold">
                                <span>• Range Sum Query (Immutable)</span>
                                <span>• Subarray Sum Equals K</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* SECTION 4: ALGORITHMS */}
                {activeTab === 'algorithms' && (
                  <div className="space-y-6 max-w-3xl py-2 animate-fadeIn border-l-4 border-l-[#10B981] pl-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. Array Selection Algorithms</h3>
                      <p className="text-xs text-text-muted">Mastering sorting, binary searches, and linear sweeps makes optimal coding choices intuitive.</p>
                    </div>

                    {/* Alg Switch tabs */}
                    <div className="flex gap-1 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {['Linear Search', 'Binary Search', 'Kadane\'s', 'Dutch National Flag', 'Prefix Sum Tech'].map((name, idx) => (
                        <button
                          key={name}
                          onClick={() => setActiveAlgIndex(idx)}
                          className={`px-3 py-2 text-[10px] font-mono font-bold cursor-pointer border-b-2 transition-all shrink-0 ${
                            activeAlgIndex === idx 
                              ? 'border-primary text-primary font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    <Card className="border border-border/40">
                      <CardBody className="p-5 space-y-4 text-xs font-medium">
                        {activeAlgIndex === 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-black text-white">Linear Search</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">What it solves:</span>
                                <p className="text-[11px] text-text-muted font-normal">Checks if target item exists inside an unsorted sequence.</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">When to use:</span>
                                <p className="text-[11px] text-text-muted font-normal">Small size input datasets or whenever items are completely unsorted.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 border border-border/20 rounded-lg flex justify-between items-center text-[10px] font-mono select-none">
                              <span className="text-text-muted">Complexity:</span>
                              <span className="text-primary font-black">Time: O(n) | Space: O(1)</span>
                            </div>
                          </div>
                        )}

                        {activeAlgIndex === 1 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-black text-white">Binary Search</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">What it solves:</span>
                                <p className="text-[11px] text-text-muted font-normal">Finds index of target item in logarithmic steps by splitting intervals.</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">When to use:</span>
                                <p className="text-[11px] text-text-muted font-normal">Must be sorted. Invaluable for cutting runtime bounds down from linear O(n).</p>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 border border-border/20 rounded-lg flex justify-between items-center text-[10px] font-mono select-none">
                              <span className="text-text-muted">Complexity:</span>
                              <span className="text-primary font-black">Time: O(log n) | Space: O(1)</span>
                            </div>
                          </div>
                        )}

                        {activeAlgIndex === 2 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-black text-white">Kadane's Algorithm</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">What it solves:</span>
                                <p className="text-[11px] text-text-muted font-normal">Finds the maximum sum contiguous subarray within a flat 1D array.</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">When to use:</span>
                                <p className="text-[11px] text-text-muted font-normal">Subarray sum optimization that includes both positive and negative values.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 border border-border/20 rounded-lg flex justify-between items-center text-[10px] font-mono select-none">
                              <span className="text-text-muted">Complexity:</span>
                              <span className="text-primary font-black">Time: O(n) | Space: O(1)</span>
                            </div>
                          </div>
                        )}

                        {activeAlgIndex === 3 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-black text-white">Dutch National Flag Algorithm</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">What it solves:</span>
                                <p className="text-[11px] text-text-muted font-normal">Sorts an array containing three distinct elements (like 0s, 1s, 2s) in a single pass.</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">When to use:</span>
                                <p className="text-[11px] text-text-muted font-normal">Three-way partition sorting limits where auxiliary storage is disallowed.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 border border-border/20 rounded-lg flex justify-between items-center text-[10px] font-mono select-none">
                              <span className="text-text-muted">Complexity:</span>
                              <span className="text-primary font-black">Time: O(n) | Space: O(1)</span>
                            </div>
                          </div>
                        )}

                        {activeAlgIndex === 4 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-black text-white">Prefix Sum Technique</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">What it solves:</span>
                                <p className="text-[11px] text-text-muted font-normal">Allows retrieving subarray ranges totals without performing loops at query time.</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">When to use:</span>
                                <p className="text-[11px] text-text-muted font-normal">Static arrays expecting high frequency range summation query lookups.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 border border-border/20 rounded-lg flex justify-between items-center text-[10px] font-mono select-none">
                              <span className="text-text-muted">Complexity:</span>
                              <span className="text-primary font-black">Time: O(1) per lookup (after O(n) pre-computation)</span>
                            </div>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* SECTION 5: INTERVIEW QUESTIONS */}
                {activeTab === 'questions' && (
                  <div className="space-y-6 max-w-3xl py-2 animate-fadeIn border-l-4 border-l-[#EF4444] pl-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">5. Interview Questions Workspace</h3>
                      <p className="text-xs text-text-muted font-normal">Learn logical problem breakdowns step-by-step. Select a focus question to start.</p>
                    </div>

                    {/* Questions select switcher */}
                    <div className="flex gap-1.5 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {[
                        'Find Maximum',
                        'Two Sum',
                        'Max Subarray Sum',
                        'Range Sum Query',
                        'Search in Sorted'
                      ].map((name, idx) => (
                        <button
                          key={name}
                          onClick={() => setActiveQuestionIndex(idx)}
                          className={`px-3 py-2 text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer border-b-2 ${
                            activeQuestionIndex === idx 
                              ? 'border-primary text-primary font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          Q{idx + 1}: {name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering 6-step accordion details for active question */}
                    {(() => {
                      const questionsData = [
                        {
                          title: 'Find Maximum Element',
                          pattern: 'Traversal',
                          algorithm: 'Sequential Scan',
                          leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/',
                          understand: 'Scan the array from index 0 to n-1, maintaining a variable for the highest value found so far.',
                          thinking: 'The interviewer wants to see how you track variables sequentially. If the array is unsorted, we must check every cell, so a single pass is the best possible runtime.',
                          brute: 'Initialize `maxVal = -Infinity`. Inspect each element. If `Array[i] > maxVal`, update `maxVal`.',
                          optimal: 'Same as brute force. An unsorted array requires checking all elements, so O(n) is optimal.',
                          cpp: `int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for(int i = 1; i < n; i++) {
        if(arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
                          java: `public int findMax(int[] arr) {
    int maxVal = arr[0];
    for(int i = 1; i < arr.length; i++) {
        if(arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
                          python: `def find_max(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val`,
                          complexity: 'Time Complexity: O(n) (one full traversal pass). Space Complexity: O(1) (requires only a single tracking variable).'
                        },
                        {
                          title: 'Two Sum',
                          pattern: 'Two Pointer',
                          algorithm: 'Inward Pointers',
                          leetcode: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                          understand: 'Given a sorted array, locate two distinct values whose sum equals a target number.',
                          thinking: 'Instead of searching all pairs using nested loops O(n^2), we exploit the sorted order. Pointers L and R start at edges. Sum calculation indicates which boundary must shrink.',
                          brute: 'Check every possible pair using nested loops: `for i from 0..n` and `for j from i+1..n`. Returns when sum is matching. Complexity: O(n^2).',
                          optimal: 'Position Left=0 and Right=n-1. If sum is target, return indices. If sum is smaller, increase sum by shifting L right. Else, decrease sum by shifting R left.',
                          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while(left < right) {
        int sum = numbers[left] + numbers[right];
        if(sum == target) return {left + 1, right + 1};
        if(sum < target) left++;
        else right--;
    }
    return {};
}`,
                          java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while(left < right) {
        int sum = numbers[left] + numbers[right];
        if(sum == target) return new int[]{left + 1, right + 1};
        if(sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
                          python: `def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        if current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
                          complexity: 'Time Complexity: O(n) (pointers sweep elements once). Space Complexity: O(1) (only local pointer offsets stored).'
                        },
                        {
                          title: 'Maximum Sum Subarray',
                          pattern: 'Sliding Window / Kadane',
                          algorithm: 'Kadane\'s Algorithm',
                          leetcode: 'https://leetcode.com/problems/maximum-subarray/',
                          understand: 'Locate a contiguous subarray slice having the largest sum of values.',
                          thinking: 'Kadane algorithm accumulates totals. If the current subtotal drops below zero, we discard it and restart the window at the next index, because a negative prefix only hurts subsequent totals.',
                          brute: 'Calculate the sum of all possible subarrays: loops starting at `i` and ending at `j`, adding elements. Complexity: O(n^2).',
                          optimal: 'Accumulate prefix sum. If prefix drops below 0, reset prefix to current element. Track max prefix found so far.',
                          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], currentMax = nums[0];
    for(size_t i = 1; i < nums.size(); i++) {
        currentMax = max(nums[i], currentMax + nums[i]);
        maxSoFar = max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
                          java: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0], currentMax = nums[0];
    for(int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
                          python: `def max_sub_array(nums):
    max_so_far = current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    return max_so_far`,
                          complexity: 'Time Complexity: O(n) (scans the array sequentially in a single pass). Space Complexity: O(1) (requires only local sum cache trackers).'
                        },
                        {
                          title: 'Range Sum Query',
                          pattern: 'Prefix Sum',
                          algorithm: 'Cumulative Array pre-lookup',
                          leetcode: 'https://leetcode.com/problems/range-sum-query-immutable/',
                          understand: 'Retrieve the sum of elements between indices L and R inclusive multiple times.',
                          thinking: 'Loops for every query yield bad complexities if query count is high. Precompute prefix running totals. Sum of index interval L to R is Prefix[R] - Prefix[L-1] instantly.',
                          brute: 'Loop from index L to R for every query: `for i from L..R` adding elements. Complexity: O(n) per query.',
                          optimal: 'Calculate a prefix sum array in O(n) setup time. Retrieve range sums dynamically as: `Prefix[R] - Prefix[L-1]` in O(1) time.',
                          cpp: `class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        int sum = 0;
        for(int num : nums) {
            sum += num;
            prefix.push_back(sum);
        }
    }
    int sumRange(int left, int right) {
        if(left == 0) return prefix[right];
        return prefix[right] - prefix[left - 1];
    }
};`,
                          java: `class NumArray {
    private int[] prefix;
    public NumArray(int[] nums) {
        prefix = new int[nums.length];
        int sum = 0;
        for(int i = 0; i < nums.length; i++) {
            sum += nums[i];
            prefix[i] = sum;
        }
    }
    public int sumRange(int left, int right) {
        if(left == 0) return prefix[right];
        return prefix[right] - prefix[left - 1];
    }
}`,
                          python: `class NumArray:
    def __init__(self, nums: List[int]):
        self.prefix = []
        running_sum = 0
        for num in nums:
            running_sum += num
            self.prefix.append(running_sum)

    def sum_range(self, left: int, right: int) -> int:
        if left == 0:
            return self.prefix[right]
        return self.prefix[right] - self.prefix[left - 1]`,
                          complexity: 'Setup Complexity: O(n) time and space. Query Complexity: O(1) runtime (subtraction lookup).'
                        },
                        {
                          title: 'Search in Sorted Array',
                          pattern: 'Binary Search',
                          algorithm: 'Interval Halving',
                          leetcode: 'https://leetcode.com/problems/binary-search/',
                          understand: 'Determine if target element exists in a sorted array and return its index.',
                          thinking: 'The interviewer is testing if you recognize sorting as a hint to halve boundaries, cutting search spaces in half each iteration.',
                          brute: 'Perform linear search scan from beginning to end. Complexity: O(n).',
                          optimal: 'Initialize `low = 0` and `high = n-1`. Loop while `low <= high`. Find `mid = low + (high-low)/2`. If value is mid, return mid. If smaller, high = mid-1. Else, low = mid+1.',
                          cpp: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while(low <= high) {
        int mid = low + (high - low) / 2;
        if(nums[mid] == target) return mid;
        if(nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
                          java: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while(low <= high) {
        int mid = low + (high - low) / 2;
        if(nums[mid] == target) return mid;
        if(nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
                          python: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
                          complexity: 'Time Complexity: O(log n) (halves index range at every step). Space Complexity: O(1) (requires only local limits).'
                        }
                      ];

                      const currentQ = questionsData[activeQuestionIndex];
                      return (
                        <div className="flex flex-col items-center w-full space-y-3">
                          
                          {/* Flowchart step 1: Title & problem statement */}
                          <div className="w-full max-w-xl rounded-xl border border-border/40 bg-card-bg/40 hover:border-primary/40 transition-colors shadow-md">
                            <div className="p-4 flex justify-between items-center gap-4">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[10px] font-mono font-black text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20 shrink-0">
                                  Q{activeQuestionIndex + 1}
                                </span>
                                <h4 className="text-sm font-black text-white truncate">{currentQ.title}</h4>
                              </div>
                              <a 
                                href={currentQ.leetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline font-bold shrink-0"
                              >
                                Solve on Leetcode
                              </a>
                            </div>
                          </div>

                          <ChevronDown className="h-5 w-5 text-primary/40 animate-pulse" />

                          {/* Flowchart step 2: Understand */}
                          <div className="w-full max-w-xl rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-wider font-mono block mb-1">Step 1: Understand the Question</span>
                            <p className="text-xs text-text-muted font-normal leading-relaxed">{currentQ.understand}</p>
                          </div>

                          <ChevronDown className="h-5 w-5 text-secondary/40 animate-pulse" />

                          {/* Flowchart step 3: Thinking process */}
                          <div className="w-full max-w-xl rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <span className="text-[9px] font-black text-primary uppercase tracking-wider font-mono block mb-1">Step 2: Thinking Process</span>
                            <p className="text-xs text-text-muted font-normal leading-relaxed">{currentQ.thinking}</p>
                          </div>

                          <ChevronDown className="h-5 w-5 text-primary/40 animate-pulse" />

                          {/* Flowchart step 4: Brute Force */}
                          <div className="w-full max-w-xl rounded-xl border border-border/40 bg-black/20 p-4">
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-wider font-mono block mb-1">Step 3: Brute Force Approach</span>
                            <p className="text-xs text-text-muted font-normal leading-relaxed">{currentQ.brute}</p>
                          </div>

                          <ChevronDown className="h-5 w-5 text-text-muted/40 animate-pulse" />

                          {/* Flowchart step 5: Optimal */}
                          <div className="w-full max-w-xl rounded-xl border border-success/20 bg-success/5 p-4">
                            <span className="text-[9px] font-black text-success uppercase tracking-wider font-mono block mb-1">Step 4: Optimal Approach</span>
                            <p className="text-xs text-text-muted font-normal leading-relaxed">{currentQ.optimal}</p>
                          </div>

                          <ChevronDown className="h-5 w-5 text-success/40 animate-pulse" />

                          {/* Flowchart step 6: Code switcher */}
                          <div className="w-full max-w-xl rounded-xl overflow-hidden border border-border bg-[#03070E] shadow-xl">
                            <div className="flex justify-between items-center bg-card-bg/60 px-4 py-2 border-b border-border/60">
                              <span className="text-[9px] font-mono font-black text-text-muted">Step 5: Code Solution</span>
                              {/* Lang Switch */}
                              <div className="flex rounded border border-border overflow-hidden select-none">
                                {['cpp', 'java', 'python'].map((l) => (
                                  <button
                                    key={l}
                                    onClick={() => setSelectedLang(l as any)}
                                    className={`px-2 py-0.5 text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                                      selectedLang === l 
                                        ? 'bg-primary text-white font-black' 
                                        : 'bg-card-bg text-text-muted hover:text-white'
                                    }`}
                                  >
                                    {l === 'cpp' ? 'C++' : l === 'java' ? 'Java' : 'Python'}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <pre className="p-4 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre">
                              {selectedLang === 'cpp' ? currentQ.cpp : selectedLang === 'java' ? currentQ.java : currentQ.python}
                            </pre>
                            <div className="bg-card-bg/30 px-4 py-2 text-[10px] text-text-muted font-bold font-mono border-t border-border/40 select-none flex justify-between">
                              <span>Copy Code</span>
                              <button 
                                onClick={() => handleCopyCode(selectedLang === 'cpp' ? currentQ.cpp : selectedLang === 'java' ? currentQ.java : currentQ.python)} 
                                className="hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedCode === (selectedLang === 'cpp' ? currentQ.cpp : selectedLang === 'java' ? currentQ.java : currentQ.python) ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>

                          <ChevronDown className="h-5 w-5 text-text-muted/40 animate-pulse" />

                          {/* Flowchart step 7: Complexity */}
                          <div className="w-full max-w-xl rounded-xl border border-border/40 bg-slate-900/50 p-4">
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-wider font-mono block mb-1">Step 6: Complexity Analysis</span>
                            <p className="text-xs text-text-muted font-normal leading-relaxed">{currentQ.complexity}</p>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* SECTION 7: QUICK REVISION */}
                {activeTab === 'revision' && (
                  <div className="space-y-6 max-w-4xl py-2 animate-fadeIn select-none border-l-4 border-l-[#06B6D4] pl-6 font-geist">
                    <div className="flex items-center gap-3 p-4 bg-cyan-950/40 border border-cyan-800/40 rounded-2xl select-none">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Arrays Module Complete!</h4>
                        <p className="text-[11px] text-cyan-200/70 font-medium">You have unlocked the premium revision sheet below. Practice and keep it handy for interviews.</p>
                      </div>
                    </div>

                    {/* Print CSS Injection */}
                    <style dangerouslySetInnerHTML={{__html: `
                      @media print {
                        body * {
                          visibility: hidden;
                        }
                        #a1-printable-worksheet, #a1-printable-worksheet * {
                          visibility: visible;
                        }
                        #a1-printable-worksheet {
                          position: absolute;
                          left: 0;
                          top: 0;
                          width: 100%;
                          color: #000 !important;
                          background: #fff !important;
                          padding: 40px !important;
                          box-shadow: none !important;
                          border: none !important;
                        }
                        #a1-printable-worksheet * {
                          color: #000 !important;
                          border-color: #ddd !important;
                          background: transparent !important;
                          box-shadow: none !important;
                          text-shadow: none !important;
                        }
                        #a1-printable-worksheet .no-print {
                          display: none !important;
                        }
                      }
                    `}} />

                    {/* Revision sheet layout */}
                    <div id="a1-printable-worksheet" className="rounded-[20px] bg-gradient-to-br from-[#0891B2] to-[#2563EB] p-6 text-white shadow-[0_20px_50px_rgba(8,145,178,0.3)] border border-[#06B6D4]/30 relative overflow-hidden flex flex-col gap-6">
                      {/* Blur effects for premium screen visual depth */}
                      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl -mr-12 -mt-12 no-print pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl no-print pointer-events-none" />

                      {/* Title Header with download button */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/20">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-black text-cyan-200 uppercase tracking-widest">Revision Sheet</span>
                          <h2 className="text-xl font-black tracking-tight">ARRAYS QUICK REVISION</h2>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="bg-white hover:bg-cyan-50 text-[#0891B2] font-black text-xs px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer no-print self-start sm:self-center font-sans active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Notes</span>
                        </button>
                      </div>

                      {/* Section 1: Definition */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">I. Definition</h3>
                        <p className="text-sm font-medium leading-relaxed text-white/90">
                          An <strong className="text-white underline decoration-cyan-200 decoration-2">Array</strong> is a linear data structure that stores a collection of homogeneous elements sequentially in contiguous memory locations. It allows direct, random access in <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">O(1)</code> time using index-based address arithmetic.
                        </p>
                      </div>

                      {/* Grid of properties & complexities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Properties */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">II. Key Properties</h3>
                          <div className="grid grid-cols-1 gap-2.5">
                            {[
                              { name: "Contiguous Layout", desc: "Elements are placed side-by-side in RAM." },
                              { name: "Homogeneous Types", desc: "All elements occupy identical byte sizing." },
                              { name: "Constant Access", desc: "Address = BaseAddress + index * ElementWidth." },
                              { name: "Static Capacity", desc: "Fixed size allocation at compilation time." }
                            ].map((prop, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start bg-white/5 border border-white/10 rounded-xl p-3">
                                <span className="h-5 w-5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="text-xs font-bold block">{prop.name}</span>
                                  <span className="text-[11px] text-white/70 font-normal leading-relaxed">{prop.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Complexities Table */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">III. Time & Space Complexities</h3>
                          <div className="bg-white/10 border border-white/20 rounded-[20px] p-4 space-y-3 font-mono text-xs">
                            <div className="flex justify-between pb-2 border-b border-white/10">
                              <span className="font-bold">Operation</span>
                              <span className="font-bold text-cyan-200">Time Complexity</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Access / Update</span>
                              <span className="font-bold text-green-300">O(1)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Search (Linear)</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Insertion</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Deletion</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10 text-cyan-100 font-bold">
                              <span>Space Complexity</span>
                              <span className="text-cyan-200">O(n)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Example */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">IV. Continuous Memory Representation</h3>
                        <div className="bg-black/20 border border-white/10 rounded-[20px] p-6 flex flex-col items-center justify-center gap-3">
                          <div className="flex items-center gap-2 select-none flex-wrap justify-center">
                            {[10, 20, 30, 40].map((val, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-mono font-black text-sm text-white">
                                  {val}
                                </div>
                                <div className="text-[9px] font-mono text-cyan-200/90 font-black">idx {idx}</div>
                                <div className="text-[8px] font-mono text-white/50">{`0x${(2000 + idx * 4).toString(16).toUpperCase()}`}</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] font-mono text-white/70 italic text-center">
                            Formula: Address of Index 2 = 0x7D0 (Base) + 2 * 4 bytes = 0x7D8. Instant lookups!
                          </div>
                        </div>
                      </div>

                      {/* Interview Tip Banner */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                        <span className="text-[9px] font-black text-cyan-200 uppercase font-mono tracking-wider block">Pro Interview Tip</span>
                        <p className="text-xs text-white/90 leading-relaxed font-normal italic">
                          If an arrays question specifies that inputs are sorted, always consider using <strong className="text-white">Two Pointers</strong> (sweeping inwards) or <strong className="text-white">Binary Search</strong> (reducing search space by half) to meet the optimal time complexity target.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* SECTION 1: UNDERSTAND */}
                {activeTab === 'understand' && (
                  <div className="space-y-6 max-w-2xl py-2">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Simple Explanation</h3>
                      <p className="text-xs leading-relaxed text-text-muted font-normal">
                        {simplerExplanation || topic.understand.explanation}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card-bg/30 space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Compass className="h-4.5 w-4.5 text-secondary" />
                        <span>Real-World Analogy</span>
                      </h3>
                      <p className="text-xs leading-relaxed text-text-muted font-normal italic">
                        {customAnalogy || topic.understand.analogy}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Visual Example</h3>
                      <div className="p-4 rounded-lg border border-border/40 bg-black/35 flex items-center justify-center font-mono text-xs text-primary font-bold">
                        {topic.understand.visualExample}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: VISUALIZE */}
                {activeTab === 'visualize' && (
                  <div className="space-y-6 max-w-2xl py-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Interactive Visual Sandbox</h3>
                      <p className="text-xs text-text-muted">Trace algorithm mechanics visually. Click an operation to start element-shifting animations.</p>
                    </div>

                    {/* Render Visual Array Cells */}
                    <div className="p-6 rounded-xl border border-border bg-black/30 flex flex-col items-center justify-center gap-6 min-h-[140px] select-none">
                      <div className="flex items-center gap-3">
                        {arrayElements.map((val, idx) => {
                          const isPointerActive = activePointer === idx;
                          const isHighlighted = highlightedIndices.includes(idx);
                          return (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              {/* Array Cell */}
                              <div 
                                className={`h-12 w-12 rounded-lg border flex items-center justify-center font-mono text-xs font-black transition-all duration-300 ${
                                  isPointerActive 
                                    ? 'border-primary bg-primary/20 text-white scale-110 shadow-lg shadow-primary/20'
                                    : isHighlighted
                                      ? 'border-secondary bg-secondary/15 text-white scale-105'
                                      : 'border-border bg-card-bg/40 text-text-muted'
                                }`}
                              >
                                {val}
                              </div>
                              
                              {/* Index and Pointer indicator */}
                              <div className="text-[10px] font-bold font-mono text-text-muted">
                                idx {idx}
                              </div>
                              {isPointerActive && (
                                <div className="text-primary font-black animate-bounce">
                                  ^
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Animation status box */}
                    <div className="p-3.5 border border-border/40 bg-card-bg/20 rounded-lg text-xs font-mono text-text-muted text-center leading-relaxed">
                      {animationText}
                    </div>

                    {/* Interactive Trigger Buttons */}
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playTraversal}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Traversal
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playInsertion}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Insertion
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playDeletion}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Deletion
                      </Button>
                    </div>
                  </div>
                )}

                {/* SECTION 3: PATTERNS & ALGORITHMS */}
                {activeTab === 'patterns' && (
                  <div className="space-y-8 max-w-2xl py-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recognizable Coding Patterns</h3>
                        <p className="text-xs text-text-muted">Mastering patterns prepares you to instantly solve dynamic problems under unseen constraints.</p>
                      </div>

                      <div className="space-y-4">
                        {topic.patterns.map((pat, idx) => (
                          <Card key={idx} className="border border-border/40">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-black text-white">{pat.name} Pattern</CardTitle>
                            </CardHeader>
                            <CardBody className="p-4 pt-0 space-y-4 text-xs font-medium">
                              
                              {/* Recognition Block */}
                              <div className="p-3 bg-secondary/5 border border-secondary/15 rounded-lg space-y-1">
                                <span className="text-[9px] font-black text-secondary uppercase tracking-wider font-mono">How do I identify this pattern?</span>
                                <p className="text-xs text-text-muted font-normal leading-relaxed">{pat.recognition}</p>
                              </div>

                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono mr-1.5">Keywords:</span>
                                {pat.keywords.map(kw => (
                                  <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">
                                    {kw}
                                  </span>
                                ))}
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                                <div className="flex flex-col gap-1">
                                  {pat.questions.map(q => (
                                    <a 
                                      key={q.name}
                                      href={q.leetcode}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline font-bold inline-flex items-center gap-1"
                                    >
                                      <span>• {q.name}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>

                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-border/40 pt-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Selection Guideline</h3>
                        <p className="text-xs text-text-muted">Compare algorithms to understand when each model is optimal.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topic.algorithms.map((alg, idx) => (
                          <Card key={idx} className="border border-border/40">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xs font-extrabold text-white">{alg.name}</CardTitle>
                            </CardHeader>
                            <CardBody className="p-4 pt-0 space-y-3 text-xs font-medium">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-primary uppercase font-mono">Use When</span>
                                <p className="text-xs text-text-muted font-normal leading-relaxed">{alg.useWhen}</p>
                              </div>
                              <div className="pt-2 border-t border-border/20 text-[9px] font-bold font-mono text-text-muted uppercase flex justify-between">
                                <span>Complexity</span>
                                <span className="text-primary">{alg.complexity}</span>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 4: QUESTIONS */}
                {activeTab === 'questions' && (
                  <div className="space-y-6 max-w-3xl py-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Focus Problems</h3>
                      <p className="text-xs text-text-muted">Mastering these 2-3 handpicked questions maps out 90% of array interviews.</p>
                    </div>

                    <div className="space-y-12">
                      {topic.questions.map((q, idx) => (
                        <div key={idx} className="flex flex-col items-center w-full">
                          
                          {/* Node 1: Question Title Card */}
                          <div className="w-full max-w-xl rounded-xl border border-border/40 bg-card-bg/40 hover:border-primary/40 transition-colors shadow-md">
                            <div className="p-4 flex justify-between items-center gap-4">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[10px] font-mono font-black text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20 shrink-0">
                                  PROBLEM
                                </span>
                                <h4 className="text-sm font-black text-white truncate">{q.name}</h4>
                              </div>
                              <a 
                                href={q.leetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline font-bold shrink-0"
                              >
                                Solve on Leetcode
                              </a>
                            </div>
                          </div>

                          {/* Down Chevron Connection */}
                          <div className="py-2.5 flex items-center justify-center">
                            <ChevronDown className="h-5 w-5 text-primary/40 animate-pulse" />
                          </div>

                          {/* Node 2: Pattern Used Card */}
                          <div className="w-full max-w-xl rounded-xl border border-secondary/20 bg-secondary/5 hover:border-secondary/30 transition-colors shadow-sm">
                            <div className="p-4">
                              <span className="text-[9px] font-black text-secondary uppercase tracking-wider font-mono block mb-1">Pattern Used</span>
                              <span className="text-xs font-bold text-white leading-normal">{q.pattern}</span>
                            </div>
                          </div>

                          {/* Down Chevron Connection */}
                          <div className="py-2.5 flex items-center justify-center">
                            <ChevronDown className="h-5 w-5 text-secondary/40 animate-pulse" />
                          </div>

                          {/* Node 3: Algorithm Used Card */}
                          <div className="w-full max-w-xl rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/30 transition-colors shadow-sm">
                            <div className="p-4">
                              <span className="text-[9px] font-black text-primary uppercase tracking-wider font-mono block mb-1">Algorithm Used</span>
                              <span className="text-xs font-bold text-white leading-normal">{q.algorithm}</span>
                            </div>
                          </div>

                          {/* Down Chevron Connection */}
                          <div className="py-2.5 flex items-center justify-center">
                            <ChevronDown className="h-5 w-5 text-primary/40 animate-pulse" />
                          </div>

                          {/* Node 4: Trace Description Card */}
                          <div className="w-full max-w-xl rounded-xl border border-border/40 bg-black/20 hover:border-border/60 transition-colors shadow-sm">
                            <div className="p-4">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider font-mono block mb-1.5">Logic Trace</span>
                              <p className="text-xs text-text-muted font-normal leading-relaxed">{q.trace}</p>
                            </div>
                          </div>

                          {/* Down Chevron Connection */}
                          <div className="py-2.5 flex items-center justify-center">
                            <ChevronDown className="h-5 w-5 text-text-muted/40 animate-pulse" />
                          </div>

                          {/* Node 5: Code Solution Box */}
                          <div className="w-full max-w-xl rounded-xl overflow-hidden border border-border bg-[#03070E] shadow-xl">
                            <div className="flex justify-between items-center bg-card-bg/60 px-4 py-2 text-[10px] text-text-muted font-bold font-mono border-b border-border/60 select-none">
                              <span>Optimal JavaScript Blueprint</span>
                              <button 
                                onClick={() => handleCopyCode(q.solution)} 
                                className="hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedCode === q.solution ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                            <pre className="p-4 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre">{q.solution}</pre>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 5: REVISE */}
                {activeTab === 'revise' && (
                  <div className="space-y-6 max-w-2xl py-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">30-Second Quick Cheat Sheet</h3>
                      <p className="text-xs text-text-muted">A quick high-density scan before entering an interview.</p>
                    </div>

                    <Card className="border border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
                      <CardBody className="p-6">
                        <div className="space-y-4">
                          {topic.revise.points.map((point, idx) => (
                            <div key={idx} className="flex gap-3 text-xs font-semibold text-text-muted">
                              <span className="h-5 w-5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black font-mono flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <p className="leading-relaxed pt-0.5">{point}</p>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </>
            )
          )}

        </div>

      </div>
    </div>
  );
}
