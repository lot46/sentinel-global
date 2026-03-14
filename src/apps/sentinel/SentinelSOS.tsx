import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ShieldOff, Phone, Users, X, EyeOff, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation, blurPosition } from "@/hooks/use-geolocation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StealthMode from "./StealthMode";

type SOSState = "idle" | "armed" | "countdown" | "active" | "cancelled";

const SentinelSOS = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState<SOSState>("idle");
  const [countdown, setCountdown] = useState(5);
  const [stealthEnabled, setStealthEnabled] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { position, requestPosition } = useGeolocation();

  // Request position when arming
  const arm = () => {
    requestPosition();
    setState("armed");
  };

  const trigger = async () => {
    setState("countdown");
    setCountdown(5);

    // Create SOS event in DB
    if (user) {
      const blurred = position ? blurPosition(position) : null;
      const { data } = await supabase.from("sos_events").insert({
        user_id: user.id,
        status: "countdown" as const,
        threat_level: 3,
        latitude: blurred?.latitude ?? null,
        longitude: blurred?.longitude ?? null,
      }).select("id").single();

      if (data) setCurrentEventId(data.id);

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "sos_triggered",
        details: { latitude: blurred?.latitude, longitude: blurred?.longitude },
      });
    }

    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          activateSOS();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const activateSOS = async () => {
    setState("active");

    if (user && currentEventId) {
      await supabase.from("sos_events")
        .update({ status: "active" as const, contacts_notified: true })
        .eq("id", currentEventId);

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "sos_active",
        details: { event_id: currentEventId, contacts_notified: true },
      });

      toast({
        title: "SOS actif (simulation)",
        description: "En production, vos contacts de confiance seraient alertés.",
      });
    }

    // Vibrate if available
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  const requestCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowCancelForm(true);
  };

  const confirmCancel = async () => {
    if (!cancellationReason.trim()) {
      toast({ title: "Justification requise", description: "Indiquez la raison de l'annulation.", variant: "destructive" });
      return;
    }

    setState("cancelled");
    setShowCancelForm(false);

    if (user && currentEventId) {
      await supabase.from("sos_events")
        .update({
          status: "cancelled" as const,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason.trim(),
        })
        .eq("id", currentEventId);

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "sos_cancelled",
        details: { event_id: currentEventId, reason: cancellationReason.trim() },
      });
    }

    setCancellationReason("");
    setCurrentEventId(null);
    setTimeout(() => setState("idle"), 2000);
  };

  const resolve = async () => {
    if (user && currentEventId) {
      await supabase.from("sos_events")
        .update({ status: "resolved" as const, resolved_at: new Date().toISOString() })
        .eq("id", currentEventId);

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "sos_resolved",
        details: { event_id: currentEventId },
      });
    }
    setCurrentEventId(null);
    setState("idle");
  };

  const handleStealthSOS = () => {
    setStealthEnabled(false);
    trigger();
  };

  // Require auth
  if (!user) {
    return (
      <AppShell appName="Sentinel">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-sm text-center">
            <CardContent className="py-8 space-y-4">
              <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Connectez-vous pour accéder au protocole SOS.</p>
              <Button onClick={() => navigate("/sentinel/auth")} className="bg-sentinel hover:bg-sentinel/90">Se connecter</Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <>
      <StealthMode enabled={stealthEnabled} onSOSTriggered={handleStealthSOS} onExit={() => setStealthEnabled(false)} />

      <AppShell appName="Sentinel">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <header className="text-center space-y-2">
            <AlertTriangle className={cn("w-10 h-10 mx-auto", state === "active" ? "text-level4 animate-pulse" : "text-muted-foreground")} />
            <h1 className="text-2xl font-bold tracking-tight">Protocole SOS</h1>
            {position && (
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" /> Position détectée (précision ~{Math.round(position.accuracy)}m)
              </p>
            )}
          </header>

          {state === "idle" && (
            <Card className="text-center">
              <CardContent className="py-12 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Le protocole SOS alerte vos contacts de confiance, enregistre l'événement et active le guidage L-Y-A.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="outline" className="border-level4/30 hover:bg-level4/5" onClick={arm} aria-label="Préparer un signal SOS">
                    <AlertTriangle className="w-4 h-4 mr-2 text-level4" />
                    Préparer un SOS
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setStealthEnabled(true)}>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Mode discret
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state === "armed" && (
            <Card className="border-level3/40">
              <CardContent className="py-12 space-y-6 text-center">
                <Badge className="bg-level3/10 text-level3 border-level3/30">SOS armé — en attente de confirmation</Badge>
                <p className="text-sm text-muted-foreground">
                  Confirmez le déclenchement. Un compte à rebours de 5 secondes vous permettra d'annuler.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" className="bg-level4 hover:bg-level4/90 text-white" onClick={trigger} aria-label="Confirmer le SOS">
                    Confirmer le SOS
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setState("idle")} aria-label="Annuler">
                    <X className="w-4 h-4 mr-2" /> Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state === "countdown" && !showCancelForm && (
            <Card className="border-level4/50 bg-level4/5">
              <CardContent className="py-12 space-y-6 text-center">
                <div className="text-6xl font-bold text-level4 tabular-nums">{countdown}</div>
                <p className="text-sm text-muted-foreground">Le signal sera envoyé dans {countdown} seconde{countdown > 1 ? "s" : ""}.</p>
                <Button size="lg" variant="outline" className="border-level4/30" onClick={requestCancel} aria-label="Annuler le SOS">
                  <ShieldOff className="w-4 h-4 mr-2" /> Annuler le SOS
                </Button>
              </CardContent>
            </Card>
          )}

          {showCancelForm && (
            <Card className="border-level3/40">
              <CardContent className="py-8 space-y-4">
                <h3 className="text-sm font-semibold text-center">Justification d'annulation requise</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Pour votre sécurité, une justification est requise lors de l'annulation d'un SOS.
                </p>
                <Textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Pourquoi annulez-vous ce SOS ?"
                  maxLength={500}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={confirmCancel}>Confirmer l'annulation</Button>
                  <Button className="bg-level4 hover:bg-level4/90 text-white" onClick={() => { setShowCancelForm(false); activateSOS(); }}>
                    Maintenir le SOS
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state === "active" && (
            <Card className="border-level4 bg-level4/5">
              <CardContent className="py-12 space-y-6 text-center">
                <Badge className="bg-level4 text-white animate-pulse">SOS ACTIF</Badge>
                <p className="text-sm text-muted-foreground">
                  Vos contacts de confiance ont été alertés. L-Y-A est activée pour vous guider.
                </p>
                <div className="grid gap-3 sm:grid-cols-3 max-w-md mx-auto">
                  <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Contacts alertés</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Services notifiés</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">L-Y-A activée</span>
                  </div>
                </div>
                <Button variant="outline" onClick={resolve}>Situation résolue</Button>
              </CardContent>
            </Card>
          )}

          {state === "cancelled" && (
            <Card className="border-sentinel/30 bg-sentinel/5">
              <CardContent className="py-12 text-center space-y-3">
                <Badge className="bg-sentinel/10 text-sentinel border-sentinel/30">SOS annulé</Badge>
                <p className="text-sm text-muted-foreground">Le signal a été annulé. L'événement est enregistré.</p>
              </CardContent>
            </Card>
          )}

          {/* Stealth info */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <EyeOff className="w-4 h-4" /> Mode discret
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Le mode discret transforme Sentinel en calculatrice. Tapez <strong>911</strong> puis <strong>=</strong> pour déclencher un SOS invisible.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Protection anti-abus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L'usage abusif du SOS est détecté. Escalade : pédagogique → avertissement → rappel légal (articles 322-14, 434-26, 226-10 du Code pénal).
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </>
  );
};

export default SentinelSOS;
