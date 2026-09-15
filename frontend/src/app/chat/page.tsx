'use client';
import { useState, useEffect } from 'react';
import { api, ChatProjectCard } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import Link from 'next/link';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  projects?: ChatProjectCard[];
  suggestions?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    sender: 'bot',
    text: "Welcome to the **PAIMANA Natural-Language Infrastructure Risk Query Assistant**.\n\nYou can query the entire centrally-sponsored infrastructure dataset in plain English. Ask about:\n- At-risk projects across sectors (e.g. *Railways*, *Roads & Highways*, *Power*)\n- Agency performance (e.g. *NHAI*, *Indian Railways*, *NTPC*, *State PWD*)\n- Specific project diagnostics and explainable AI feature importance (e.g. *PRJ0010*, *PRJ0026*)\n- Portfolio statistics and cost/schedule overrun patterns.",
    suggestions: [
      "Which railway projects are most at risk?",
      "Show NHAI projects with high cost overrun",
      "What is the average overrun in Power?",
      "Explain PRJ0010",
      "Portfolio summary"
    ]
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('project_id');
      if (pid) {
        setActiveProjectId(pid);
        handleSend(`Why is ${pid} risky?`, pid);
      }
    }
  }, []);

  const handleSend = async (queryText?: string, explicitProjectId?: string) => {
    const text = queryText || input.trim();
    if (!text || loading) return;

    const pid = explicitProjectId || activeProjectId;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text, pid);
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
          text: `⚠️ Error processing query: ${err.message || 'Server error'}`,
          suggestions: ["Which railway projects are most at risk?", "Portfolio summary"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let formatted = line;
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-bold text-slate-900 text-base mt-3 mb-1.5" dangerouslySetInnerHTML={{ __html: formatted.replace('### ', '') }} />;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-slate-700 my-1 text-sm" dangerouslySetInnerHTML={{ __html: formatted.replace('- ', '') }} />
        );
      }
      return (
        <p key={idx} className="my-1.5 text-slate-800 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700 font-bold">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">AI Natural-Language Query Assistant</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Ask plain-English questions over the PAIMANA infrastructure monitoring dataset.
          </p>
        </div>
        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[650px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mt-1">
                  AI
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
              }`}>
                {m.sender === 'user' ? (
                  <p className="text-sm">{m.text}</p>
                ) : (
                  <div>
                    {renderFormattedText(m.text)}

                    {/* Identified Projects Cards */}
                    {m.projects && m.projects.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Flagged Projects</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {m.projects.map(p => (
                            <Link
                              key={p.project_id}
                              href={`/projects/${p.project_id}`}
                              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition block group"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 truncate">{p.project_name}</span>
                                <RiskBadge risk={p.risk_label} size="sm" />
                              </div>
                              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                                <span>{p.project_id} · {p.implementing_agency}</span>
                                <span className="font-semibold text-red-600 font-mono">+{p.cost_overrun_pct.toFixed(1)}%</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(s)}
                            className="text-xs bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 rounded-full border border-slate-200 transition"
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs pl-2">
              <Bot className="h-4 w-4 animate-spin text-blue-600" />
              <span>Analyzing infrastructure data and computing predictions...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="E.g., 'Which railway projects are most at risk?' or 'Why is PRJ0010 flagged?'"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
