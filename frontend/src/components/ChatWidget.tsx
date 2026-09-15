'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { api, ChatProjectCard } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import Link from 'next/link';
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  projects?: ChatProjectCard[];
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  sender: 'bot',
  text: "Hello! I am the **PAIMANA AI Risk Assistant**. Ask me anything about the 800 centrally-sponsored infrastructure projects, sectors, agencies, or why specific projects are flagged at risk.",
  suggestions: [
    "Which railway projects are most at risk?",
    "Show NHAI high-risk projects",
    "What is the average overrun in Power?",
    "Why is PRJ0010 flagged?"
  ]
};

interface ChatWidgetProps {
  projectId?: string;
  projectName?: string;
}

export function ChatWidget({ projectId, projectName }: ChatWidgetProps = {}) {
  const pathname = usePathname();
  const pathMatch = pathname?.match(/^\/projects\/([^/]+)$/);
  const routeProjectId = pathMatch && pathMatch[1] !== 'new' ? pathMatch[1] : undefined;
  const activeProjectId = projectId || routeProjectId;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = useCallback(async (queryText?: string, explicitProjectId?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    const targetProject = explicitProjectId || activeProjectId;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend, targetProject);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        projects: res.projects,
        suggestions: res.suggestions,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `⚠️ Error communicating with AI assistant: ${err.message || 'Server unreachable'}`,
          suggestions: ["Show portfolio summary", "Which railway projects are most at risk?"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, activeProjectId]);

  useEffect(() => {
    const handleOpenChatEvent = (e: any) => {
      const detail = e.detail || {};
      setIsOpen(true);
      if (detail.initialPrompt) {
        handleSend(detail.initialPrompt, detail.projectId || activeProjectId);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [handleSend, activeProjectId]);

  // Auto-open with context hint when project context provided
  const handleOpen = () => {
    setIsOpen(true);
    if (activeProjectId && messages.length === 1) {
      const contextMsg: Message = {
        id: 'ctx-' + activeProjectId,
        sender: 'bot',
        text: `📌 **Project Context Loaded: ${projectName || activeProjectId}**\n\nI have active context for this project. You can ask:\n- "Why is this project risky?"\n- "Explain the risk factors"\n- "What interventions are recommended?"`,
        suggestions: [
          `Why is this project risky?`,
          'Explain the risk factors',
          'What are the recommended interventions?',
          'Compare with sector average',
        ],
      };
      setMessages([INITIAL_MESSAGE, contextMsg]);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let formatted = line;
      // Bold rendering
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-slate-900 mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace('### ', '') }} />;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5 text-xs" dangerouslySetInnerHTML={{ __html: formatted.replace('- ', '') }} />
        );
      }
      return (
        <p key={idx} className="my-1 text-slate-800 leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Ask AI Assistant</span>
          <span className="flex h-2 w-2 rounded-full bg-green-400" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[390px] sm:w-[440px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/50">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">PAIMANA AI Assistant</h3>
                <p className="text-[11px] text-blue-100 mt-0.5">Infra Risk Intelligence & Query Bot</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([INITIAL_MESSAGE])}
                title="Reset Chat"
                className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mt-1">
                    AI
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  {m.sender === 'user' ? (
                    <p>{m.text}</p>
                  ) : (
                    <div>
                      {renderFormattedText(m.text)}

                      {/* Project Cards inside chat */}
                      {m.projects && m.projects.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2">
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Identified Projects:</p>
                          {m.projects.map(p => (
                            <Link
                              key={p.project_id}
                              href={`/projects/${p.project_id}`}
                              onClick={() => setIsOpen(false)}
                              className="block p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-slate-900 group-hover:text-blue-600 truncate">{p.project_name}</span>
                                <RiskBadge risk={p.risk_label} size="sm" />
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                                <span>{p.project_id} · {p.implementing_agency}</span>
                                <span className="font-semibold text-red-600 font-mono">+{p.cost_overrun_pct.toFixed(1)}% overrun</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Follow-up suggestions */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1 border-t border-slate-100 pt-2">
                          {m.suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(s)}
                              className="text-[11px] bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-full border border-slate-200 transition text-left"
                            >
                              {s} →
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs mt-1">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
                <Bot className="h-4 w-4 animate-spin text-blue-600" />
                <span>Analyzing infrastructure data & ML models...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask: 'Which railway projects are most at risk?'"
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
