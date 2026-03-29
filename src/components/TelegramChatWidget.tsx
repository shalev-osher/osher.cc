import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
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

  // Load messages
  useEffect(() => {

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("telegram_messages")
        .select("id, sender, text, created_at")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("telegram-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "telegram_messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

    setSending(true);
    setInput("");

    try {
      const { error } = await supabase.functions.invoke("telegram-send", {
        body: { text: trimmed, sessionId: SESSION_ID },
      });
      if (error) throw error;
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
      className="fixed bottom-6 left-6 z-[150]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized bar */
          <motion.button
            key="minimized"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088cc] text-white shadow-lg hover:shadow-xl transition-shadow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Bot className="w-5 h-5" />
          </motion.button>
        ) : (
          /* Chat Window - compact */
          <motion.div
            key="chat"
            className="w-[380px] h-[500px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-background border border-border"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0088cc] text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs">{isHebrew ? "שליו אושר" : "Shalev Osher"}</p>
                  <p className="text-[10px] text-white/70">{isHebrew ? "עוזר AI" : "AI Assistant"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isHebrew ? "מזער צ'אט" : "Minimize chat"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/30">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-xs mt-6">
                  <p>{isHebrew ? "👋 היי! שלח הודעה ואחזור אליך" : "👋 Hi! Send a message and I'll get back to you"}</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}

                >
                  <div
                    className={`max-w-[80%] px-2.5 py-1.5 rounded-xl text-xs ${
                      msg.sender === "visitor"
                        ? "bg-[#0088cc] text-white rounded-br-sm"
                        : "bg-card text-foreground border border-border rounded-bl-sm"
                    }`}
                  >
                    {msg.sender === "visitor" ? (
                      <p className="break-words">{msg.text}</p>
                    ) : (
                      <div className="break-words prose prose-xs prose-neutral dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5 [&>h1]:text-sm [&>h2]:text-xs [&>h3]:text-xs [&>h4]:text-xs [&>p]:text-xs [&>ul]:text-xs [&>ol]:text-xs [&>li]:text-xs [&_strong]:font-bold [&_em]:italic">
                        <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                      </div>
                    )}
                    <p
                      className={`text-[9px] mt-0.5 ${
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
            <div className="p-2 border-t border-border bg-background">
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isHebrew ? "כתוב הודעה..." : "Type a message..."}
                  className="flex-1 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs outline-none placeholder:text-muted-foreground"
                  disabled={sending}
                  dir="auto"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-2 rounded-full bg-[#0088cc] text-white disabled:opacity-50 hover:bg-[#006fa1] transition-colors"
                  aria-label={isHebrew ? "שלח" : "Send"}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TelegramChatWidget;
