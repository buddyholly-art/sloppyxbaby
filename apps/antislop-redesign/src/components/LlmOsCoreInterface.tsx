import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { Send, Bot, User, Sparkles, Loader2, Trash2, Brain, MessageSquare, Clock, Diamond, Shield, Zap } from "lucide-react";
import { Message } from "../lib/types";

interface LlmOsCoreInterfaceProps {
  thinkingMode: boolean;
  selectedModel: string;
}

export default function LlmOsCoreInterface({ thinkingMode, selectedModel }: LlmOsCoreInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "Hello! I am your **Prompting Companion**. I help you construct perfect, error-free instructions that get AI models to code exactly what you want on the very first try.\n\nTell me what app, script, or feature you are trying to build. I will structure your idea, set clean clear-cut code boundaries (to avoid empty files and buggy code), and write ready-to-copy directions. Let's make something amazing together!",
      timestamp: new Date().toLocaleTimeString(),
      modelUsed: "System Initialized",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Check key presence
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setIsApiKeyMissing(!data.hasApiKey);
      })
      .catch(() => {});
  }, []);

  const handlePresetSelect = (text: string) => {
    setInput(text);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `m-${Date.now()}-user`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          thinkingMode,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `m-${Date.now()}-assistant`,
        role: "model",
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
        modelUsed: data.modelUsed,
        thinking: data.thinking
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}-err`,
          role: "model",
          content: `**Connection Error**: ${err.message || "Failed to communicate with the Prompt Advocate. Please check your network or API Keys in Settings > Secrets."}`,
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "Error Handling Proxy",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "model",
          content: "Chat cleared. What can your AuDHD Prompt Advocate scaffold next?",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "System Refreshed",
        }
      ]);
    }
  };

  const presets = [
    {
      label: "Amnesia-Proof Sync",
      prompt: "A script that watches a folder and when I drop a PDF in it, it reads text and saves a summary to my obsidian notes, utilizing Baddeley's memory model.",
      sub: "Auto-saves task state to prevent forgetfulness",
      icon: Brain
    },
    {
      label: "Low-Arousal Board",
      prompt: "A slate-themed task board with dynamic countdown timelines, an organic memory restoration list, and automated error guardrails.",
      sub: "Calming visual style with zero-glare layout",
      icon: Diamond
    },
    {
      label: "PDA Note Checklist",
      prompt: "A secure terminal command line coordinator that structures and formats next recommended actions in YAML contracts",
      sub: "Low-pressure planner that suggests options instead of bossy commands",
      icon: Shield
    }
  ];

  return (
    <div className="card-shell flex flex-col h-[675px] overflow-hidden relative" id="chat-interface-root">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-3.5 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]" id="chat-header">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/15 text-[var(--color-sage)] rounded-xl">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-[var(--color-ink)] tracking-tight">Interactive Prompt Generation Chat</h3>
            <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
              Ask questions, refine feature plans, or outline code structures. This helper converts your thoughts into robust, precise instructions.
            </p>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={clearChat}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-[var(--color-muted)] hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-all"
          title="Clear History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset chat</span>
        </button>
      </div>

      {/* Message Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-canvas)]/30" id="chat-scroll-thread">
        {isApiKeyMissing && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs text-center flex items-center justify-center gap-1.5" id="api-key-warning">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong>API Setup Warning</strong>: Your LLM_API_KEY is not injected yet. Go to <strong>Settings &gt; Secrets</strong> to enter your API key for full capability.
            </span>
          </div>
        )}

        {/* Message Loop */}
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
            >
              <div className="flex items-center space-x-2 text-[10px] text-[var(--color-muted)] px-1">
                {isUser ? (
                  <>
                    <span>User Input</span>
                    <User className="w-3 h-3 text-[var(--color-sage)]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[var(--color-muted)]" />
                    <span>Prompt Advocate ({message.modelUsed || selectedModel})</span>
                  </>
                )}
                <span className="text-[var(--color-hairline-strong)]">|</span>
                <span className="text-[var(--color-muted)]">{message.timestamp}</span>
              </div>

              {/* Message Content Bubble */}
              <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed text-sm border shadow-sm ${
                isUser
                  ? "bg-[var(--color-sage)] text-white rounded-tr-sm border-transparent"
                  : "bg-[var(--color-surface-solid)] text-[var(--color-ink)] border-[var(--color-hairline)] rounded-tl-sm"
              }`}>
                {/* Thinking / Reasoning Accordion if model thought */}
                {!isUser && message.thinking && (
                  <div className="mb-3 p-2 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl text-xs font-[var(--font-mono)] text-[var(--color-sage)]">
                    <div className="flex items-center space-x-1.5 font-[var(--font-sans)] font-semibold text-[var(--color-muted)] mb-1">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Model Reasoning Path</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed opacity-90">{message.thinking}</p>
                  </div>
                )}

                <div className="markdown-body prose prose-sm max-w-none prose-p:my-1 prose-headings:text-[var(--color-ink)] prose-headings:font-semibold prose-a:text-[var(--color-sage)] prose-strong:text-[var(--color-ink)] prose-code:text-[var(--color-sage)] prose-code:bg-[var(--color-sage-soft)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pending state */}
        {loading && (
          <div className="flex flex-col items-start space-y-1.5" id="chat-loading-state">
            <div className="flex items-center space-x-2 text-[10px] text-[var(--color-muted)]">
              <Bot className="w-3 h-3" />
              <span>Helper is thinking...</span>
            </div>
            <div className="p-4 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-2xl rounded-tl-sm max-w-[85%] text-[var(--color-muted)] text-xs flex items-center space-x-3">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-sage)]" />
              <span>
                Structuring clear, simple prompt specifications...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Static quick queries when input is blank */}
      {input.trim() === "" && (
        <div className="p-3.5 border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]/25 flex flex-col space-y-2" id="presets-container">
          <div className="flex items-center space-x-1.5 px-0.5" id="presets-header">
            <span className="eyebrow">
              Quick presets
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" id="presets-list-grid">
            {presets.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  id={`preset-btn-${idx}`}
                  onClick={() => handlePresetSelect(preset.prompt)}
                  className="p-2.5 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-sage)]/30 text-[var(--color-muted)] hover:text-[var(--color-ink)] rounded-xl transition-all text-left flex flex-col justify-between space-y-1.5 cursor-pointer group"
                  title={preset.prompt}
                >
                  <span className="text-[11.5px] font-semibold text-[var(--color-ink)] flex items-center gap-1.5 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                    {preset.label}
                  </span>
                  <span className="text-[9.5px] text-[var(--color-muted)] block leading-normal">
                    {preset.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3.5 bg-[var(--color-surface-solid)] border-t border-[var(--color-hairline)] flex items-center space-x-2.5" id="chat-input-form">
        <input
          id="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your feature idea, paste buggy code, or ask for clear prompt help..."
          className="flex-1 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-sage)] transition-all"
          disabled={loading}
          autoComplete="off"
        />
        <button
          id="send-chat-btn"
          type="submit"
          className="btn-pill p-2.5"
          disabled={!input.trim() || loading}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
