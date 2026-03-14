import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CoffreLyaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CoffreMode = "deposit" | "advice" | "help";

const modeConfig: Record<CoffreMode, { label: string; emoji: string; description: string; color: string }> = {
  deposit: {
    label: "Déposer",
    emoji: "📝",
    description: "Écris ce que tu ressens. Personne ne te jugera.",
    color: "bg-sentinel/10 text-sentinel border-sentinel/30",
  },
  advice: {
    label: "Un conseil",
    emoji: "💡",
    description: "Tu veux un avis ? Écris ta question ici.",
    color: "bg-[hsl(185,70%,50%)]/10 text-[hsl(185,70%,40%)] border-[hsl(185,70%,50%)]/30",
  },
  help: {
    label: "De l'aide",
    emoji: "🤝",
    description: "Tu as besoin d'aide ? On va trouver ensemble.",
    color: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

const quickEmojis = ["😰", "😢", "😠", "😶", "🤔", "💔", "😨", "🙁"];

const CoffreLya = ({ open, onOpenChange }: CoffreLyaProps) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<CoffreMode | null>(null);
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !selectedEmoji) return;
    if (!user) {
      toast({ title: "Connecte-toi d'abord", description: "Tu dois être connecté(e) pour utiliser le Coffre.", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("coffre_entries").insert({
        user_id: user.id,
        mode: mode || "deposit",
        content: content.trim() || selectedEmoji || "",
        emoji: selectedEmoji,
        sensitivity_level: mode === "help" ? 2 : mode === "advice" ? 1 : 0,
      });

      if (error) throw error;

      toast({ title: "C'est gardé en sécurité 🔒", description: "Ton message est bien dans ton Coffre." });
      setContent("");
      setSelectedEmoji(null);
      setMode(null);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Impossible de sauvegarder. Réessaie.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setMode(null);
    setContent("");
    setSelectedEmoji(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            🔒 Coffre L-Y-A
          </DialogTitle>
          <DialogDescription>
            Cet espace est à toi. Ce que tu y déposes reste privé et sécurisé.
          </DialogDescription>
        </DialogHeader>

        {/* Mode selection */}
        {!mode ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Que souhaites-tu faire ?</p>
            {(Object.entries(modeConfig) as [CoffreMode, typeof modeConfig.deposit][]).map(
              ([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors hover:shadow-sm ${cfg.color}`}
                >
                  <span className="text-2xl">{cfg.emoji}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">{cfg.label}</p>
                    <p className="text-xs opacity-70">{cfg.description}</p>
                  </div>
                </button>
              )
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={modeConfig[mode].color}>
                {modeConfig[mode].emoji} {modeConfig[mode].label}
              </Badge>
              <button onClick={() => setMode(null)} className="text-xs text-muted-foreground hover:text-foreground">
                ← Changer
              </button>
            </div>

            <p className="text-sm text-muted-foreground">{modeConfig[mode].description}</p>

            {/* Quick emojis */}
            <div className="flex flex-wrap gap-2">
              {quickEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEmoji(selectedEmoji === e ? null : e)}
                  className={`text-xl p-1 rounded-lg transition-all ${
                    selectedEmoji === e ? "bg-sentinel/20 scale-110" : "hover:bg-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Text input */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                mode === "deposit"
                  ? "Écris ce que tu veux…"
                  : mode === "advice"
                  ? "Pose ta question ici…"
                  : "Dis-moi ce qu'il se passe…"
              }
              className="min-h-[100px] resize-none"
              maxLength={2000}
            />

            {/* Help mode: show human relay options */}
            {mode === "help" && (
              <div className="bg-muted rounded-xl p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Tu peux aussi parler à quelqu'un directement :
                </p>
                <div className="space-y-1 text-xs">
                  <p>👤 Une personne de confiance</p>
                  <p>👫 Un(e) ami(e)</p>
                  <p>🏫 Un adulte à l'école</p>
                  <p>🏥 Un refuge Sentinel</p>
                  <p>📞 3020 (harcèlement) · 119 (enfance en danger) · 3114 (écoute)</p>
                  <p>🆘 SOS Sentinel</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { reset(); onOpenChange(false); }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={sending || (!content.trim() && !selectedEmoji)}
                className="flex-1 bg-sentinel hover:bg-sentinel/90"
              >
                {sending ? "…" : "Déposer 🔒"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CoffreLya;
