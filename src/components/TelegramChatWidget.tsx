import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  sender: string;
  text: string | null;
  created_at: string;
  options?: string[];
}

const SESSION_ID = `web-${Math.random().toString(36).slice(2, 10)}`;

const TelegramChatWidget = () => {
  const { lang } = useLanguage();
  const isHebrew = lang === "he";
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
      // Add welcome message on first open
      if (messages.length === 0) {
        const welcomeOptions = isHebrew
          ? ["ניסיון", "כישורים", "טכנולוגיות", "תפקיד נוכחי", "יצירת קשר"]
          : ["Experience", "Skills", "Technologies", "Current Role", "Contact"];
        setMessages([
          {
            id: `bot-welcome`,
            sender: "bot",
            text: isHebrew
              ? "👋 היי! אני העוזר הדיגיטלי של שליו אושר.\nאיך אפשר לעזור?"
              : "👋 Hi! I'm Shalev Osher's AI assistant.\nHow can I help you?",
            created_at: new Date().toISOString(),
            options: welcomeOptions,
          },
        ]);
      }
    }
  }, [isMinimized]);

  const handleSend = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || sending) return;

    const visitorMessage: Message = {
      id: `visitor-${crypto.randomUUID()}`,
      sender: "visitor",
      text: trimmed,
      created_at: new Date().toISOString(),
    };

    // Clear options from the last bot message when user sends something
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.sender === "bot" ? { ...m, options: undefined } : m
      )
    );

    setMessages((prev) => [...prev, visitorMessage]);
    setSending(true);
    setInput("");

    try {
      const history = [...messages, visitorMessage].map((m) => ({
        role: m.sender === "visitor" ? ("user" as const) : ("assistant" as const),
        content: m.text || "",
      }));

      const { data, error } = await supabase.functions.invoke("telegram-send", {
        body: { text: trimmed, sessionId: SESSION_ID, history, lang },
      });
      if (error) throw error;

      const reply =
        typeof data?.reply === "string"
          ? data.reply
          : isHebrew
            ? "מצטער, לא הצלחתי לעבד את הבקשה כרגע."
            : "Sorry, I couldn't process the request right now.";

      const options = Array.isArray(data?.options) ? data.options : undefined;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${crypto.randomUUID()}`,
          sender: "bot",
          text: reply,
          created_at: new Date().toISOString(),
          options,
        },
      ]);
    } catch (err) {
      console.error("Failed to send:", err);
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  };

  const sendMessage = () => handleSend(input);

  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Find the last bot message index to know which one should show options
  const lastBotIdx = messages.reduce((acc, m, i) => (m.sender === "bot" ? i : acc), -1);
  const lastBotMsg = lastBotIdx >= 0 ? messages[lastBotIdx] : null;
  const hasOptions = !!(lastBotMsg?.options && lastBotMsg.options.length > 0);

  return (
    <motion.div
      className="fixed bottom-8 start-8 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.35 }}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center relative overflow-hidden group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot className="w-6 h-6 relative z-10" />
          </motion.button>
        ) : (
          <>
            {/* Click outside to close */}
            <motion.div
              key="overlay"
              className="fixed inset-0 z-[-1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMinimized(true)}
            />
            <motion.div
              key="chat"
              className="fixed bottom-20 inset-x-3 h-[min(520px,calc(100vh-112px))] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-primary/20 bg-background/80 backdrop-blur-xl sm:inset-x-auto sm:h-[600px] sm:w-[420px] sm:max-w-[420px] sm:start-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="relative flex items-center justify-between px-4 py-3 text-foreground overflow-hidden">
                <div className="absolute inset-0 bg-secondary" />
                <div className="absolute inset-0 border-b-2 border-primary/30" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base tracking-tight text-primary">
                      {isHebrew ? "שליו אושר" : "Shalev Osher"}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {isHebrew ? "עוזר AI" : "AI Assistant"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors relative z-10 text-muted-foreground"
                  aria-label={isHebrew ? "מזער צ'אט" : "Minimize chat"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-card/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50" style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary) / 0.3) transparent' }}>
                {messages.map((msg, idx) => (
                  <div key={msg.id}>
                    <div
                      className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs sm:text-sm ${
                          msg.sender === "visitor"
                            ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
                            : "bg-card text-foreground border border-border rounded-bl-sm shadow-sm"
                        }`}
                      >
                        {msg.sender === "visitor" ? (
                          <p className="break-words">{msg.text}</p>
                        ) : (
                          <div className="break-words prose prose-xs sm:prose-sm prose-neutral dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>ul]:ps-4 [&>ol]:ps-4 [&>ul]:list-disc [&>ol]:list-decimal [&>li]:my-0.5 [&>h1]:text-sm sm:[&>h1]:text-base [&>h2]:text-xs sm:[&>h2]:text-sm [&>h3]:text-xs sm:[&>h3]:text-sm [&>h4]:text-xs sm:[&>h4]:text-sm [&>p]:text-xs sm:[&>p]:text-sm [&>ul]:text-xs sm:[&>ul]:text-sm [&>ol]:text-xs sm:[&>ol]:text-sm [&>li]:text-xs sm:[&>li]:text-sm [&_strong]:font-bold [&_em]:italic">
                            <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                          </div>
                        )}
                        <p
                          className={`text-[9px] mt-1 ${
                            msg.sender === "visitor" ? "text-white/60" : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                    {/* WhatsApp-style stacked reply buttons – only on the last bot message */}
                    {msg.sender === "bot" &&
                      idx === lastBotIdx &&
                      msg.options &&
                      msg.options.length > 0 && (
                        <motion.div
                          className="flex flex-col gap-1.5 mt-2"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOptionClick(opt)}
                              disabled={sending}
                              className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-primary/20 text-primary bg-card hover:bg-primary/10 hover:border-primary/40 transition-all shadow-sm text-center disabled:opacity-50"
                            >
                              {opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    {/* Back to main menu button – on last bot message, after first exchange */}
                    {msg.sender === "bot" &&
                      idx === lastBotIdx &&
                      msg.id !== "bot-welcome" &&
                      !sending && (
                        <motion.div
                          className="mt-1.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.25 }}
                        >
                          <button
                            onClick={() =>
                              handleOptionClick(
                                isHebrew ? "תפריט ראשי" : "Main menu"
                              )
                            }
                            className="w-full px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center"
                          >
                            {isHebrew ? "↩ תפריט ראשי" : "↩ Main menu"}
                          </button>
                        </motion.div>
                      )}
                  </div>
                ))}
                {/* Typing indicator */}
                {sending && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-card border border-border shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input – disabled when reply options are showing */}
              <div className={`p-2.5 border-t border-primary/10 bg-background/60 backdrop-blur-sm transition-opacity ${hasOptions ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      hasOptions
                        ? isHebrew ? "בחר אפשרות מלמעלה..." : "Select an option above..."
                        : isHebrew ? "כתוב הודעה..." : "Type a message..."
                    }
                    className={`flex-1 px-3 py-2 rounded-full bg-muted text-foreground text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-shadow ${isHebrew ? "text-right" : "text-left"}`}
                    disabled={sending || hasOptions}
                    dir={isHebrew ? "rtl" : "ltr"}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending || hasOptions}
                    className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    aria-label={isHebrew ? "שלח" : "Send"}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TelegramChatWidget;
