import { useState } from "react";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldOff, Phone, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SOSState = "idle" | "armed" | "countdown" | "active" | "cancelled";

const SentinelSOS = () => {
  const [state, setState] = useState<SOSState>("idle");
  const [countdown, setCountdown] = useState(5);

  const arm = () => setState("armed");

  const trigger = () => {
    setState("countdown");
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setState("active");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancel = () => {
    setState("cancelled");
    setTimeout(() => setState("idle"), 2000);
  };

  const reset = () => setState("idle");

  return (
    <AppShell appName="Sentinel">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        <header className="text-center space-y-2">
          <AlertTriangle className={cn(
            "w-10 h-10 mx-auto",
            state === "active" ? "text-level4 animate-pulse" : "text-muted-foreground"
          )} />
          <h1 className="text-2xl font-bold tracking-tight">Protocole SOS</h1>
          <p className="text-sm text-muted-foreground">
            Interface de simulation — aucun signal réel n'est envoyé.
          </p>
        </header>

        {/* État idle */}
        {state === "idle" && (
          <Card className="text-center">
            <CardContent className="py-12 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Le protocole SOS permet de signaler une situation de danger.
                Cette action alerte vos contacts de confiance, L-Y-A et les services partenaires.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-level4/30 hover:bg-level4/5 hover:border-level4/50"
                onClick={arm}
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-level4" />
                Préparer un SOS
              </Button>
            </CardContent>
          </Card>
        )}

        {/* État armé */}
        {state === "armed" && (
          <Card className="border-level3/40">
            <CardContent className="py-12 space-y-6 text-center">
              <Badge className="bg-level3/10 text-level3 border-level3/30">
                SOS armé — en attente de confirmation
              </Badge>
              <p className="text-sm text-muted-foreground">
                Confirmez le déclenchement. Un compte à rebours de 5 secondes vous 
                permettra d'annuler si c'est une erreur.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-level4 hover:bg-level4/90 text-white"
                  onClick={trigger}
                >
                  Confirmer le SOS
                </Button>
                <Button variant="outline" size="lg" onClick={reset}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compte à rebours */}
        {state === "countdown" && (
          <Card className="border-level4/50 bg-level4/5">
            <CardContent className="py-12 space-y-6 text-center">
              <div className="text-6xl font-bold text-level4 tabular-nums">
                {countdown}
              </div>
              <p className="text-sm text-muted-foreground">
                Le signal sera envoyé dans {countdown} seconde{countdown > 1 ? "s" : ""}.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-level4/30"
                onClick={cancel}
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Annuler le SOS
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SOS actif */}
        {state === "active" && (
          <Card className="border-level4 bg-level4/5">
            <CardContent className="py-12 space-y-6 text-center">
              <Badge className="bg-level4 text-white animate-pulse">
                SOS ACTIF — Simulation
              </Badge>
              <p className="text-sm text-muted-foreground">
                En situation réelle, vos contacts seraient alertés, L-Y-A activerait 
                le guidage et les services partenaires seraient notifiés.
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
              <Button variant="outline" onClick={reset}>
                Terminer la simulation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Annulé */}
        {state === "cancelled" && (
          <Card className="border-sentinel/30 bg-sentinel/5">
            <CardContent className="py-12 text-center space-y-3">
              <Badge className="bg-sentinel/10 text-sentinel border-sentinel/30">
                SOS annulé
              </Badge>
              <p className="text-sm text-muted-foreground">
                Le signal a été annulé avec succès.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Infos anti-abus */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Protection anti-abus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L'usage abusif du SOS est détecté et traité en 3 niveaux : 
              pédagogique, avertissement, puis rappel légal. 
              Les fausses alertes sont sanctionnées par les articles 322-14, 
              434-26 et 226-10 du Code pénal.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SentinelSOS;
