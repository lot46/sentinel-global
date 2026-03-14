import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/packages/ui/AppShell";
import SentinelMap from "./SentinelMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ShieldCheck,
  HandHelping,
  AlertTriangle,
  MessageCircle,
  
  Activity,
  Clock,
  Heart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { THREAT_LEVELS, getThreatLevel } from "./threat-levels";
import { cn } from "@/lib/utils";

const activityLog = [
  { time: "14:32", label: "Signal de sécurité enregistré", icon: ShieldCheck },
  { time: "11:15", label: "Niveau de vigilance consulté", icon: Activity },
  { time: "08:00", label: "Retour au calme confirmé", icon: Heart },
];

const SentinelHome = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const threat = getThreatLevel(currentLevel);

  return (
    <AppShell appName="Sentinel">
      {/* Bande de niveau en haut */}
      <div
        className={cn(
          "border-b px-4 sm:px-6 py-2 flex items-center justify-between text-sm transition-colors duration-500",
          threat.bgClass,
          threat.borderClass
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("inline-block w-2 h-2 rounded-full animate-pulse", threat.textClass, threat.badgeBg)} 
            style={{ backgroundColor: threat.color }} />
          <span className={cn("font-medium", threat.textClass)}>
            Niveau {threat.level}
          </span>
          <span className="text-muted-foreground hidden sm:inline">— {threat.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))}
            disabled={currentLevel <= 1}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentLevel((l) => Math.min(4, l + 1))}
            disabled={currentLevel >= 4}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* En-tête */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Shield className={cn("w-7 h-7 transition-colors duration-500", threat.textClass)} />
              <h1 className="text-2xl font-bold tracking-tight">Sentinel</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Observer, comprendre, anticiper. Sans fausse promesse.
            </p>
          </div>
          <Button variant="outline" size="sm" className="self-start sm:self-auto">
            Tableau de bord
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">

            {/* Carte interactive */}
            <Card className={cn("overflow-hidden transition-colors duration-500", threat.borderClass)}>
              <SentinelMap className="h-[280px] sm:h-[340px]" />
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-sentinel/5 hover:border-sentinel/30"
                  >
                    <ShieldCheck className="w-5 h-5 text-sentinel" />
                    Je me sens en sécurité
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-level2/5 hover:border-level2/30"
                  >
                    <HandHelping className="w-5 h-5 text-level2" />
                    J'ai besoin d'un appui
                  </Button>
                  <Link to="/sentinel/sos">
                    <Button
                      variant="outline"
                      className={cn(
                        "h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-level4/5 hover:border-level4/30 w-full",
                        currentLevel >= 3 && "border-level4/30 bg-level4/5"
                      )}
                    >
                      <AlertTriangle className={cn(
                        "w-5 h-5 text-level4",
                        currentLevel >= 3 && "animate-pulse"
                      )} />
                      Préparer un SOS
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {activityLog.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </span>
                      <span className="flex-1 text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">

            {/* État actuel */}
            <Card className={cn("transition-colors duration-500", threat.borderClass)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">État actuel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-semibold px-3 py-1 transition-colors duration-500",
                      threat.borderClass,
                      threat.bgClass,
                      threat.textClass
                    )}
                  >
                    Niveau {threat.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{threat.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {threat.description}
                </p>

                {/* Indicateur visuel des 4 niveaux */}
                <div className="flex gap-1.5 pt-1">
                  {THREAT_LEVELS.map((tl) => (
                    <button
                      key={tl.level}
                      onClick={() => setCurrentLevel(tl.level)}
                      className={cn(
                        "flex-1 h-2 rounded-full transition-all duration-500 cursor-pointer",
                        currentLevel >= tl.level
                          ? "opacity-100"
                          : "opacity-20"
                      )}
                      style={{ backgroundColor: tl.color }}
                      title={`Niveau ${tl.level} — ${tl.label}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* L-Y-A */}
            <Card className={cn(
              "transition-colors duration-500",
              threat.borderClass,
              currentLevel >= 3 ? threat.bgClass : "bg-sentinel/[0.02]"
            )}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className={cn("w-4 h-4 transition-colors duration-500", threat.textClass)} />
                  L-Y-A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentLevel >= 3
                    ? "L-Y-A est prêt à vous assister. Activez-le pour obtenir un guidage adapté à la situation."
                    : "L-Y-A pourra vous guider selon le contexte, en fonction du niveau de vigilance et de votre situation."
                  }
                </p>
                <Link to="/sentinel/lya">
                  <Button
                    variant={currentLevel >= 3 ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full transition-colors duration-500",
                      currentLevel >= 3
                        ? cn(threat.textClass, "bg-current text-white hover:opacity-90")
                        : "border-sentinel/20 hover:bg-sentinel/5"
                    )}
                    style={currentLevel >= 3 ? { backgroundColor: threat.color, color: "white" } : undefined}
                  >
                    Parler à L-Y-A
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Philosophie */}
            <Card className="bg-muted/50">
              <CardContent className="pt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Philosophie Sentinel
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Honnêteté. Loyauté. Transparence. Anticipation.
                </p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  Sentinel ne promet pas de tout contrôler. Sentinel aide à mieux voir,
                  mieux comprendre et mieux réagir — ensemble.
                </p>
                <Link
                  to="/sentinel/charte"
                  className="inline-block text-xs text-sentinel hover:underline mt-1"
                >
                  Lire la charte complète →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SentinelHome;
