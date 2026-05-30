'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { 
  Plus, 
  Search, 
  Trash2, 
  Save, 
  FileText,
  AlertCircle,
  Eye,
  Edit3,
  Columns,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

const CATEGORIES = ['All', 'DSA', 'Web Development', 'AI/ML'];

export default function NotesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Note Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DSA');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [copied, setCopied] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load all notes
  const fetchNotes = async (selectFirst = false) => {
    try {
      const res = await apiClient('/notes');
      if (res.success && res.notes) {
        setNotes(res.notes);
        if (selectFirst && res.notes.length > 0) {
          handleSelectNote(res.notes[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes(true);
    }
  }, [isAuthenticated]);

  // Filter notes on search/category change
  useEffect(() => {
    let result = notes;
    if (activeCategory !== 'All') {
      result = result.filter(n => n.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredNotes(result);
  }, [notes, activeCategory, search]);

  const handleSelectNote = (note: Note) => {
    // Clear any pending auto-saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSelectedNote(note);
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);
    setSaveStatus('saved');
  };

  const handleCreateNote = async () => {
    try {
      const defaultCategory = activeCategory !== 'All' ? activeCategory : 'DSA';
      const res = await apiClient('/notes', {
        method: 'POST',
        body: JSON.stringify({
          title: `Untitled ${defaultCategory} Note`,
          category: defaultCategory,
        }),
      });

      if (res.success && res.note) {
        setNotes(prev => [res.note, ...prev]);
        handleSelectNote(res.note);
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await apiClient(`/notes/${id}`, { method: 'DELETE' });
      if (res.success) {
        setNotes(prev => prev.filter(n => n._id !== id));
        if (selectedNote?._id === id) {
          setSelectedNote(null);
          setTitle('');
          setContent('');
        }
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  // Debounced auto-save handler
  const triggerAutoSave = (updatedFields: { title?: string; content?: string; category?: string }) => {
    if (!selectedNote) return;

    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const body = {
          title: updatedFields.title ?? title,
          content: updatedFields.content ?? content,
          category: updatedFields.category ?? category,
        };

        const res = await apiClient(`/notes/${selectedNote._id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        if (res.success && res.note) {
          setNotes(prev => prev.map(n => n._id === res.note._id ? res.note : n));
          setSaveStatus('saved');
        }
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('error');
      }
    }, 1500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Inline markdown compilation for preview
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
          <div key={idx} className="my-2.5 p-3 bg-black/40 border border-border/60 rounded text-center text-xs font-mono text-secondary font-bold">
            {token.slice(2, -2)}
          </div>
        );
      }
      return token;
    });
  };

  const renderMarkdownNotes = (markdown: string) => {
    if (!markdown) return <p className="text-xs text-text-muted italic">Empty note contents.</p>;
    
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
              return <h3 key={lIdx} className="text-sm font-bold text-white mt-4">{line.replace('###', '').trim()}</h3>;
            }
            if (line.startsWith('##')) {
              return <h2 key={lIdx} className="text-base font-bold text-white mt-4">{line.replace('##', '').trim()}</h2>;
            }
            if (line.startsWith('#')) {
              return <h1 key={lIdx} className="text-lg font-black text-white mt-6 border-b border-border/40 pb-1">{line.replace('#', '').trim()}</h1>;
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

  if (isLoading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Loading study vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Notes Sidebar panel */}
        <div className="w-80 border-r border-border bg-[#0B0F19]/40 flex flex-col shrink-0">
          <div className="p-4 border-b border-border space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Study Notes</h3>
              <Button size="sm" className="h-7 w-7 p-0 flex items-center justify-center rounded-md cursor-pointer" onClick={handleCreateNote}>
                <Plus className="h-4.5 w-4.5" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="px-4 py-2 border-b border-border/50 flex gap-1.5 overflow-x-auto shrink-0 select-none scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-card-bg/30 border-border/80 text-text-muted hover:text-foreground'
                }`}
              >
                {cat === 'Web Development' ? 'Web' : cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const isActive = selectedNote?._id === note._id;
                return (
                  <div
                    key={note._id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-lg flex items-start justify-between group cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-primary/10 border border-primary/25' 
                        : 'border border-transparent hover:bg-card-bg/30'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {note.title || 'Untitled Note'}
                      </h4>
                      <p className="text-[10px] text-text-muted truncate mt-1">
                        {note.content ? note.content.replace(/[#*`]/g, '') : 'No additional content.'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note._id, e)}
                      className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-text-muted text-xs font-semibold">
                No notes found.
              </div>
            )}
          </div>
        </div>

        {/* Right Note Editor / Preview workspace */}
        {selectedNote ? (
          <div className="flex-1 flex flex-col bg-background overflow-hidden">
            
            {/* Editor Workspace Top Bar Controls */}
            <div className="h-14 border-b border-border bg-card-bg/25 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    triggerAutoSave({ category: e.target.value });
                  }}
                  className="bg-card-bg border border-border text-xs font-semibold text-foreground px-2.5 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="text-[10px] font-bold font-mono">
                  {saveStatus === 'saved' && <span className="text-success flex items-center gap-1"><Save className="h-3 w-3" /> Saved</span>}
                  {saveStatus === 'saving' && <span className="text-primary animate-pulse">Saving...</span>}
                  {saveStatus === 'error' && <span className="text-danger flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Save Error</span>}
                </div>
              </div>

              {/* View layout mode buttons */}
              <div className="flex rounded-md border border-border bg-card-bg/50 p-1 select-none">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'edit' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white'
                  }`}
                  title="Editor Only"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Write</span>
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'preview' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white'
                  }`}
                  title="Preview Only"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'split' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white'
                  }`}
                  title="Split Pane"
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Split</span>
                </button>
              </div>
            </div>

            {/* Split layout workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Pane: Editor */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={`h-full flex flex-col p-6 gap-4 overflow-y-auto ${viewMode === 'split' ? 'w-1/2 border-r border-border' : 'w-full'}`}>
                  <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      triggerAutoSave({ title: e.target.value });
                    }}
                    className="text-2xl font-black text-white bg-transparent focus:outline-none placeholder-border/60 border-b border-transparent focus:border-border/40 pb-2 shrink-0"
                  />
                  <textarea
                    placeholder="Write your study notes using markdown syntax... e.g. # Topic details \n * key takeaways"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      triggerAutoSave({ content: e.target.value });
                    }}
                    className="flex-1 bg-transparent text-sm leading-relaxed text-foreground/90 resize-none focus:outline-none placeholder-border/60 min-h-[200px] font-mono text-xs"
                  />
                </div>
              )}

              {/* Right Pane: Markdown live preview */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`h-full p-6 overflow-y-auto bg-black/10 prose prose-invert max-w-none ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                  <h1 className="text-2xl font-black text-white border-b border-border/80 pb-2 mb-6">{title || 'Untitled Note'}</h1>
                  <div className="space-y-4">
                    {renderMarkdownNotes(content)}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-background text-text-muted gap-3 p-6 text-center select-none">
            <FileText className="h-12 w-12 text-border" />
            <div>
              <h3 className="font-bold text-foreground">No Note Selected</h3>
              <p className="text-xs text-text-muted mt-1 max-w-xs font-normal">Select an existing note from the sidebar, or create a new note to start building your study vault.</p>
            </div>
            <Button size="sm" className="mt-2 cursor-pointer" onClick={handleCreateNote}>
              Create New Note
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
