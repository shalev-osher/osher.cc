import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, Trash2, Download } from "lucide-react";
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
const MAX_MESSAGES_PER_SESSION = 30;
const MAX_FREE_TEXT_PER_SESSION = 5;

const TelegramChatWidget = () => {
  const { lang } = useLanguage();
  const isHebrew = lang === "he";
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [optionsHistory, setOptionsHistory] = useState<{ text: string; options: string[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messageCount, setMessageCount] = useState(0);
  const [freeTextCount, setFreeTextCount] = useState(0);
  const [freeTextMode, setFreeTextMode] = useState(false);

  const getMenuOptions = useCallback(
    () =>
      isHebrew
        ? ["תפקיד ותחומי אחריות", "סטאק טכנולוגי", "יצירת קשר", "ניסיון מקצועי", "השכלה והסמכות", "פרויקטים"]
        : ["Role & responsibilities", "Tech stack", "Get in touch", "Professional experience", "Education & certifications", "Projects"],
    [isHebrew]
  );

  const getWelcomeText = useCallback(
    () =>
      isHebrew
        ? "👋 היי! מה תרצה/י לדעת על שליו אושר?"
        : "👋 Hi! What would you like to know about Shalev Osher?",
    [isHebrew]
  );

  const getMainMenuPrompt = useCallback(
    () => (isHebrew ? "👋 מה עוד מעניין אותך?" : "👋 What else interests you?"),
    [isHebrew]
  );

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setOptionsHistory([]);
    setMessageCount(0);
    setFreeTextCount(0);
    setFreeTextMode(false);
    // Re-show welcome on next render
    setTimeout(() => {
      setMessages([
        {
          id: "bot-welcome",
          sender: "bot",
          text: getWelcomeText(),
          created_at: new Date().toISOString(),
          options: getMenuOptions(),
        },
      ]);
    }, 100);
  }, [getWelcomeText, getMenuOptions]);

  const handleExportPDF = useCallback(() => {
    if (messages.length === 0) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    const title = isHebrew ? "Chat Export - Shalev Osher" : "Chat Export - Shalev Osher";
    doc.text(title, pageWidth / 2, y, { align: "center" });
    y += 6;

    // Date line
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), pageWidth / 2, y, { align: "center" });
    y += 4;

    // Divider
    doc.setDrawColor(200, 180, 120);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    messages.forEach((m) => {
      if (!m.text) return;
      const time = new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const isBot = m.sender === "bot";
      const sender = isBot ? "AI Assistant" : "Visitor";

      // Check page break
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }

      // Sender label with time
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(isBot ? 100 : 50, isBot ? 100 : 50, isBot ? 100 : 50);
      doc.text(`${sender}  •  ${time}`, margin, y);
      y += 5;

      // Message bubble background
      const lines = doc.setFontSize(10).setFont("helvetica", "normal").splitTextToSize(m.text, contentWidth - 10);
      const blockHeight = lines.length * 5 + 6;

      if (y + blockHeight > pageHeight - 20) {
        doc.addPage();
        y = margin;
      }

      // Background rect
      doc.setFillColor(isBot ? 245 : 235, isBot ? 245 : 240, isBot ? 250 : 220);
      doc.roundedRect(margin, y - 2, contentWidth, blockHeight, 2, 2, "F");

      // Text
      doc.setTextColor(30, 30, 30);
      doc.text(lines, margin + 5, y + 3);
      y += blockHeight + 4;
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text("osher.cc", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save("shalev-osher-chat.pdf");
  }, [messages, isHebrew]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
      if (messages.length === 0) {
        setMessages([
          {
            id: "bot-welcome",
            sender: "bot",
            text: getWelcomeText(),
            created_at: new Date().toISOString(),
            options: getMenuOptions(),
          },
        ]);
      }
    }
  }, [getMenuOptions, getWelcomeText, isMinimized, messages.length]);

  const handleSend = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || sending) return;

    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      const limitMsg: Message = {
        id: `bot-limit-${crypto.randomUUID()}`,
        sender: "bot",
        text: isHebrew
          ? "⏳ הגעת למגבלת ההודעות בשיחה זו. ניתן ליצור קשר ישירות דרך טופס יצירת הקשר באתר."
          : "⏳ You've reached the message limit for this session. You can reach out directly via the contact form on the site.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, limitMsg]);
      return;
    }

    setMessageCount((c) => c + 1);
    if (freeTextMode) {
      setFreeTextCount((c) => c + 1);
      setFreeTextMode(false);
    }

    const visitorMessage: Message = {
      id: `visitor-${crypto.randomUUID()}`,
      sender: "visitor",
      text: trimmed,
      created_at: new Date().toISOString(),
    };

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
    const isMainMenu = option === "Main menu" || option === "תפריט ראשי";
    const isBack = option === "Back" || option === "חזרה";
    const isFreeText = option === "שאלה אחרת" || option === "Other question";

    if (isFreeText) {
      if (freeTextCount >= MAX_FREE_TEXT_PER_SESSION) {
        const limitMsg: Message = {
          id: `bot-limit-free-${crypto.randomUUID()}`,
          sender: "bot",
          text: isHebrew
            ? "⏳ הגעת למגבלת השאלות החופשיות. ניתן להמשיך עם הכפתורים או ליצור קשר דרך הטופס באתר."
            : "⏳ You've reached the free question limit. You can continue with the buttons or use the contact form.",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, limitMsg]);
        return;
      }
      setFreeTextMode(true);
      // Remove options from last bot message to unlock input
      setMessages((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].sender === "bot") {
            updated[i] = { ...updated[i], options: undefined };
            break;
          }
        }
        return updated;
      });
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    if (isBack && optionsHistory.length > 0) {
      const prev = optionsHistory[optionsHistory.length - 1];
      setOptionsHistory((h) => h.slice(0, -1));
      // Just restore previous options on the last bot message without adding a new message
      setMessages((prev_msgs) => {
        const updated = [...prev_msgs];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].sender === "bot") {
            updated[i] = { ...updated[i], options: prev.options };
            break;
          }
        }
        return updated;
      });
      return;
    }

    if (isMainMenu) {
      setOptionsHistory([]);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const alreadyOnMainMenu =
          lastMessage?.sender === "bot" &&
          (lastMessage.id === "bot-welcome" || lastMessage.id.startsWith("bot-menu-"));

        if (alreadyOnMainMenu) return prev;

        return [
          ...prev.map((m, i) =>
            i === prev.length - 1 && m.sender === "bot" ? { ...m, options: undefined } : m
          ),
          {
            id: `bot-menu-${crypto.randomUUID()}`,
            sender: "bot",
            text: getMainMenuPrompt(),
            created_at: new Date().toISOString(),
            options: getMenuOptions(),
          },
        ];
      });
      return;
    }

    // Save current options to history before navigating away
    if (lastBotMsg?.options && lastBotMsg.options.length > 0) {
      setOptionsHistory((h) => [...h, { text: lastBotMsg.text || "", options: lastBotMsg.options! }]);
    }

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
              <div className="relative flex items-center justify-between px-4 py-3 text-foreground overflow-hidden">
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
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
                <div className="flex items-center gap-1 relative z-10">
                  <button
                    onClick={handleExportPDF}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    aria-label={isHebrew ? "ייצוא שיחה" : "Export chat"}
                    title={isHebrew ? "ייצוא PDF" : "Export PDF"}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    aria-label={isHebrew ? "נקה צ'אט" : "Clear chat"}
                    title={isHebrew ? "נקה צ'אט" : "Clear chat"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    aria-label={isHebrew ? "מזער צ'אט" : "Minimize chat"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-card/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50"
                style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--primary) / 0.3) transparent" }}
              >
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

                  </div>
                ))}

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

              {/* Pinned option buttons above input */}
              {hasOptions && lastBotMsg?.options && (
                <div className="px-2.5 py-1.5 border-t border-primary/10 bg-background/60 backdrop-blur-sm flex flex-col items-center gap-0.5">
                  {lastBotMsg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      disabled={sending}
                      className="w-auto min-w-[60%] max-w-[85%] px-3 py-1.5 text-[11px] sm:text-xs leading-snug font-bold font-display rounded-md border border-primary/30 text-primary-foreground bg-primary/80 hover:bg-primary hover:border-primary/50 transition-all text-center disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                  <div className="flex gap-1 mt-0.5">
                    {lastBotMsg.id !== "bot-welcome" && !lastBotMsg.id.startsWith("bot-menu-") && optionsHistory.length > 0 && (
                      <button
                        onClick={() => handleOptionClick(isHebrew ? "חזרה" : "Back")}
                        className="flex-1 px-2 py-1.5 text-[11px] sm:text-xs leading-snug font-medium rounded-md border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center whitespace-nowrap"
                      >
                        {isHebrew ? "← חזרה" : "← Back"}
                      </button>
                    )}
                    {freeTextCount < MAX_FREE_TEXT_PER_SESSION && (
                      <button
                        onClick={() => handleOptionClick(isHebrew ? "שאלה אחרת" : "Other question")}
                        className="flex-1 px-2 py-1.5 text-[11px] sm:text-xs leading-snug font-medium rounded-md border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center whitespace-nowrap"
                      >
                        {isHebrew ? "✏️ שאלה אחרת" : "✏️ Other question"}
                      </button>
                    )}
                    <button
                      onClick={() => handleOptionClick(isHebrew ? "תפריט ראשי" : "Main menu")}
                      className="flex-1 px-2 py-1.5 text-[11px] sm:text-xs leading-snug font-medium rounded-md border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center whitespace-nowrap"
                    >
                      {isHebrew ? "↩ תפריט ראשי" : "↩ Main menu"}
                    </button>
                  </div>
                </div>
              )}
              {!hasOptions && lastBotMsg && lastBotMsg.id !== "bot-welcome" && !lastBotMsg.id.startsWith("bot-menu-") && !sending && (
                <div className="px-2.5 py-1.5 border-t border-primary/10 bg-background/60 backdrop-blur-sm flex gap-1">
                  {optionsHistory.length > 0 && (
                    <button
                      onClick={() => handleOptionClick(isHebrew ? "חזרה" : "Back")}
                      className="flex-1 px-2 py-1.5 text-[11px] sm:text-xs leading-snug font-medium rounded-md border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center whitespace-nowrap"
                    >
                      {isHebrew ? "← חזרה" : "← Back"}
                    </button>
                  )}
                  <button
                    onClick={() => handleOptionClick(isHebrew ? "תפריט ראשי" : "Main menu")}
                    className="flex-1 px-2 py-1.5 text-[11px] sm:text-xs leading-snug font-medium rounded-md border border-muted-foreground/20 text-muted-foreground bg-muted/30 hover:bg-muted hover:border-muted-foreground/40 transition-all text-center whitespace-nowrap"
                  >
                    {isHebrew ? "↩ תפריט ראשי" : "↩ Main menu"}
                  </button>
                </div>
              )}

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
                        ? isHebrew
                          ? "בחר אפשרות מלמעלה..."
                          : "Select an option above..."
                        : isHebrew
                          ? "כתוב הודעה..."
                          : "Type a message..."
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
