import { useState, useRef, useEffect } from "react";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lya-chat`;

const SentinelLYA = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour 💙 Je suis L-Y-A, ton assistante de protection. Je suis là pour t'écouter, te rassurer et t'aider à trouver les bonnes personnes. Que souhaites-tu me dire ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ageGroup = profile?.age_group || "adult";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickReplies = [
    "J'ai peur",
    "Je me sens seul(e)",
    "Quelqu'un me fait du mal",
    "Je veux parler à quelqu'un",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          ageGroup,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Erreur de connexion");
      }

      if (!resp.body) throw new Error("Pas de réponse");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erreur", description: e.message || "Impossible de contacter L-Y-A", variant: "destructive" });
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Désolée, je n'arrive pas à me connecter pour l'instant. Si tu as besoin d'aide urgente, appelle le 119 (enfance en danger) ou le 3114 (écoute). 💙",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell appName="Sentinel">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(185,70%,50%)] to-sentinel flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.3s" }} />
              </div>
              <div className="w-3 h-1 rounded-full bg-white/80 mt-0.5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">L-Y-A</h1>
            <p className="text-xs text-muted-foreground">
              Assistante de protection · {ageGroup === "adult" ? "mode adulte" : `${ageGroup} ans`}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto text-xs border-sentinel/30 text-sentinel">
            Confidentiel
          </Badge>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-muted text-foreground"
                  : "bg-sentinel text-sentinel-foreground ml-auto"
              )}
            >
              {msg.role === "assistant" && (
                <span className="text-xs font-semibold text-sentinel block mb-1">L-Y-A 💙</span>
              )}
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-1.5 [&>ul]:mb-1.5">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm px-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              L-Y-A réfléchit…
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrire à L-Y-A…"
            className="flex-1"
            disabled={isLoading}
            maxLength={1000}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-sentinel hover:bg-sentinel/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
};

export default SentinelLYA;
