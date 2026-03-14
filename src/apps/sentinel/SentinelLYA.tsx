import { useState } from "react";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "lya" | "user";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "lya",
    content: "Bonjour. Je suis L-Y-A, votre assistante de protection. Comment puis-je vous aider ?",
  },
  {
    role: "lya",
    content: "Je peux vous informer sur le niveau actuel, vous guider vers un point d'appui ou vous aider à préparer un protocole de sécurité.",
  },
];

const quickReplies = [
  "Quel est le niveau actuel ?",
  "Où est le refuge le plus proche ?",
  "Comment fonctionne le SOS ?",
];

const autoResponses: Record<string, string> = {
  "niveau": "Le niveau de vigilance actuel est Niveau 1 — Situation calme. Aucun signal particulier détecté dans votre périmètre.",
  "refuge": "La fonctionnalité de géolocalisation des refuges sera disponible prochainement. En attendant, gardez toujours vos contacts de confiance à portée.",
  "sos": "Le protocole SOS se déclenche manuellement ou par geste. Un compte à rebours de 5 secondes permet d'annuler. Vos contacts et les services partenaires sont alertés simultanément.",
};

const SentinelLYA = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    
    // Simple keyword matching for demo
    const lower = text.toLowerCase();
    let response = "Je comprends votre question. Cette fonctionnalité sera enrichie à mesure que Sentinel évolue. Pour l'instant, je suis là pour vous écouter.";
    
    for (const [key, value] of Object.entries(autoResponses)) {
      if (lower.includes(key)) {
        response = value;
        break;
      }
    }

    const lyaMsg: Message = { role: "lya", content: response };
    setMessages((prev) => [...prev, userMsg, lyaMsg]);
    setInput("");
  };

  return (
    <AppShell appName="Sentinel">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sentinel/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-sentinel" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">L-Y-A</h1>
            <p className="text-xs text-muted-foreground">Assistante de protection adaptative — simulation</p>
          </div>
          <Badge variant="outline" className="ml-auto text-xs border-sentinel/30 text-sentinel">
            Démo
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "lya"
                  ? "bg-muted text-foreground self-start"
                  : "bg-sentinel text-white self-end ml-auto"
              )}
            >
              {msg.role === "lya" && (
                <span className="text-xs font-semibold text-sentinel block mb-1">L-Y-A</span>
              )}
              {msg.content}
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
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
          />
          <Button type="submit" size="icon" className="bg-sentinel hover:bg-sentinel/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
};

export default SentinelLYA;
