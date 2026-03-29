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
}

const SESSION_ID = `web-${Math.random().toString(36).slice(2, 10)}`;

const TelegramChatWidget = () => {
  const { lang } = useLanguage();
  const isHebrew = lang === "he";
  const [isMinimized, setIsMinimized] = useState(false);
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
    if (!isMinimized) inputRef.current?.focus();
  }, [isMinimized]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const visitorMessage: Message = {
      id: `visitor-${crypto.randomUUID()}`,
      sender: "visitor",
      text: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, visitorMessage]);
    setSending(true);
    setInput("");

    try {
      const { data, error } = await supabase.functions.invoke("telegram-send", {
        body: { text: trimmed, sessionId: SESSION_ID },
      });
      if (error) throw error;

      const reply = typeof data?.reply === "string"
        ? data.reply
        : isHebrew
          ? "מצטער, לא הצלחתי לעבד את הבקשה כרגע."
          : "Sorry, I couldn't process the request right now.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${crypto.randomUUID()}`,
          sender: "bot",
          text: reply,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to send:", err);
      setInput(trimmed);
    } finally {
      setSending(false);
    }
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


  return (
    <motion.div
      className="fixed bottom-8 start-8 z-[60]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
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
              className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 w-[380px] h-[520px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-48px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-primary/20 bg-background/80 backdrop-blur-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header - gradient */}
            <div className="relative flex items-center justify-between px-4 py-3 text-foreground overflow-hidden">
              <div className="absolute inset-0 bg-secondary" />
              <div className="absolute inset-0 border-b-2 border-primary/30" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight text-primary">{isHebrew ? "שליו אושר" : "Shalev Osher"}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{isHebrew ? "עוזר AI" : "AI Assistant"}</p>
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
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-card/50 backdrop-blur-sm">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-xs mt-8 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium">{isHebrew ? "👋 היי! מה תרצה לדעת על שליו אושר?" : "👋 Hi! What would you like to know about Shalev Osher?"}</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${
                      msg.sender === "visitor"
                        ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
                        : "bg-card text-foreground border border-border rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.sender === "visitor" ? (
                      <p className="break-words">{msg.text}</p>
                    ) : (
                      <div className="break-words prose prose-xs prose-neutral dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>ul]:ps-4 [&>ol]:ps-4 [&>ul]:list-disc [&>ol]:list-decimal [&>li]:my-0.5 [&>h1]:text-sm [&>h2]:text-xs [&>h3]:text-xs [&>h4]:text-xs [&>p]:text-xs [&>ul]:text-xs [&>ol]:text-xs [&>li]:text-xs [&_strong]:font-bold [&_em]:italic">
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
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-primary/10 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isHebrew ? "כתוב הודעה..." : "Type a message..."}
                  className={`flex-1 px-3 py-2 rounded-full bg-muted text-foreground text-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-shadow ${isHebrew ? "text-right" : "text-left"}`}
                  disabled={sending}
                  dir={isHebrew ? "rtl" : "ltr"}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
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
