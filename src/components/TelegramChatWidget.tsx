import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender: string;
  text: string | null;
  created_at: string;
}

const TelegramChatWidget = () => {
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
        body: { text: trimmed },
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
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <span className="text-sm font-medium">צ'אט</span>
          </motion.button>
        ) : (
          /* Chat Window - compact */
          <motion.div
            key="chat"
            className="w-[300px] h-[380px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-background border border-border"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0088cc] text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs">Shalev Osher</p>
                  <p className="text-[10px] text-white/70">Bot • Telegram</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="מזער צ'אט"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/30">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-xs mt-6">
                  <p>👋 היי! שלח הודעה ואחזור אליך</p>
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
                    <p className="break-words">{msg.text}</p>
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
                  placeholder="כתוב הודעה..."
                  className="flex-1 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs outline-none placeholder:text-muted-foreground"
                  disabled={sending}
                  dir="auto"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-2 rounded-full bg-[#0088cc] text-white disabled:opacity-50 hover:bg-[#006fa1] transition-colors"
                  aria-label="שלח"
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
