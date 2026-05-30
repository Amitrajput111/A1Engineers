'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { 
  Bot, 
  Send, 
  Trash2, 
  Terminal, 
  Check, 
  Copy,
  BookOpen,
  HelpCircle,
  Calendar,
  Compass,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export default function RedesignedAITutor() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [fetching, setFetching] = useState(true);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load chat history
  const loadHistory = async () => {
    try {
      const res = await apiClient('/ai/history');
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string, selectedMode = 'doubts') => {
    const promptText = textToSend || input;
    if (!promptText.trim() || sending) return;

    if (!textToSend) setInput('');
    setSending(true);

    const tempUserMsg: ChatMessage = {
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await apiClient('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: promptText,
          mode: selectedMode
        }),
      });

      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMsg: ChatMessage = {
        role: 'model',
        content: '**A1 Assistant Error**: Failed to establish connection with server.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your study assistant chat history?')) return;
    try {
      const res = await apiClient('/ai/history', { method: 'DELETE' });
      if (res.success) {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to purge chat logs:', err);
    }
  };

  const handleCopyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const assistantModes = [
    { 
      label: 'Explain Topic', 
      mode: 'explain', 
      prompt: 'Explain the core mechanics of Binary Search Trees. What are its space/time complexities?',
      icon: <BookOpen className="h-3.5 w-3.5" /> 
    },
    { 
      label: 'Generate Quiz', 
      mode: 'quiz', 
      prompt: 'Generate a short 3-question MCQ quiz on preventing SQL Injection vulnerabilities.',
      icon: <HelpCircle className="h-3.5 w-3.5" /> 
    },
    { 
      label: 'Create Study Plan', 
      mode: 'study-plan', 
      prompt: 'Create a structured study plan to learn React state & effect hooks in 3 days.',
      icon: <Calendar className="h-3.5 w-3.5" /> 
    },
    { 
      label: 'Suggest Next Topic', 
      mode: 'suggest-next', 
      prompt: 'I just completed NumPy foundations. Suggest what topic I should master next.',
      icon: <Compass className="h-3.5 w-3.5" /> 
    },
    { 
      label: 'Solve Doubts', 
      mode: 'doubts', 
      prompt: 'I am getting a "connect ECONNREFUSED 127.0.0.1:27017" error in Node.js. How do I fix it?',
      icon: <Terminal className="h-3.5 w-3.5" /> 
    }
  ];

  const renderMessageContent = (content: string, msgIdx: number) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim() || 'javascript';
        const code = lines.slice(1, lines.length - 1).join('\n');
        const codeBlockId = msgIdx * 1000 + index;

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-border bg-[#03070E]">
            <div className="flex items-center justify-between bg-card-bg/60 px-4 py-2 text-[10px] text-text-muted font-bold font-mono border-b border-border/60">
              <span className="flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5" />
                {language.toUpperCase()}
              </span>
              <button
                onClick={() => handleCopyCode(code, codeBlockId)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {copiedId === codeBlockId ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed whitespace-pre">{code}</pre>
          </div>
        );
      }

      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5 font-normal text-xs text-text-muted">
          {lines.map((line, lineIdx) => {
            if (line.startsWith('###')) {
              return <h3 key={lineIdx} className="text-sm font-bold text-white mt-4">{line.replace('###', '').trim()}</h3>;
            }
            if (line.startsWith('##')) {
              return <h2 key={lineIdx} className="text-base font-bold text-white mt-4">{line.replace('##', '').trim()}</h2>;
            }
            if (line.startsWith('*') || line.startsWith('-')) {
              return (
                <li key={lineIdx} className="ml-4 list-disc text-xs text-text-muted">
                  {line.substring(1).trim()}
                </li>
              );
            }
            return <p key={lineIdx} className="whitespace-pre-wrap">{line}</p>;
          })}
        </div>
      );
    });
  };

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Booting Study Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Assistant Action Buttons */}
        <div className="w-80 border-r border-border bg-[#0B0F19]/40 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-border space-y-1 shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Study Assistant</h3>
            <p className="text-[10px] text-text-muted font-semibold">Real-time developer revision tools</p>
          </div>
          
          <div className="p-4 flex-1 space-y-4 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Revision Shortcuts</span>
              <div className="mt-2.5 flex flex-col gap-2">
                {assistantModes.map((mode, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(mode.prompt, mode.mode)}
                    disabled={sending}
                    className="w-full text-left p-3 rounded-lg border border-border bg-card-bg/25 hover:bg-card-bg/50 hover:border-primary/30 transition-all text-xs font-semibold text-text-muted hover:text-white cursor-pointer flex flex-col gap-1"
                  >
                    <span className="text-primary flex items-center gap-1.5 font-bold">
                      {mode.icon}
                      {mode.label}
                    </span>
                    <span className="text-[10px] font-normal leading-normal text-text-muted/80">{mode.prompt.substring(0, 50)}...</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-danger border-danger/30 hover:bg-danger/10 gap-1.5 cursor-pointer justify-center"
              onClick={handleClearHistory}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Chat History</span>
            </Button>
          </div>
        </div>

        {/* Center Chat Panel */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
          
          {/* Chat thread list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isAI = msg.role === 'model';
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-4 max-w-3xl ${isAI ? 'mr-12' : 'ml-12 flex-row-reverse'}`}
                  >
                    <div className={`h-8 w-8 rounded border flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAI 
                        ? 'bg-primary/10 border-primary/20 text-primary' 
                        : 'bg-card-bg border-border text-text-muted'
                    }`}>
                      {isAI ? <Bot className="h-4.5 w-4.5" /> : <span>U</span>}
                    </div>

                    <div className={`rounded-lg border p-4 text-left ${
                      isAI 
                        ? 'bg-card-bg border-border/80' 
                        : 'bg-primary/10 border-primary/25'
                    }`}>
                      {renderMessageContent(msg.content, idx)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-text-muted gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg animate-pulse">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-sm font-bold text-white">Study Assistant initialized</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-normal">
                    I am ready to help you analyze compile codes and review technical interview paths. Select one of the revision shortcuts on the left or type your query below.
                  </p>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {sending && (
              <div className="flex gap-4 max-w-3xl mr-12 animate-pulse">
                <div className="h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="rounded-lg border border-border/80 bg-card-bg p-4 text-xs font-semibold text-text-muted flex items-center gap-2 select-none">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Study Assistant is reviewing your query...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom input area */}
          <div className="p-4 border-t border-border bg-background/50 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="max-w-3xl mx-auto flex gap-3"
            >
              <input
                type="text"
                placeholder="Ask Study Assistant to solve doubts, explain codes, or suggest next milestones..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                className="flex-1 bg-card-bg border border-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <Button type="submit" className="px-5 cursor-pointer rounded-lg h-9" disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
