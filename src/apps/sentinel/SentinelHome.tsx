import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/packages/ui/AppShell";
import SentinelMap from "./SentinelMap";
import MapLayerPanel from "./MapLayerPanel";
import MapContextCard from "./MapContextCard";
import { MAP_LAYERS } from "./map-data";
import type { MapLayer, MapZone } from "./map-data";
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
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(MAP_LAYERS);
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const threat = getThreatLevel(currentLevel);

  const toggleLayer = (layerId: string) => {
    setMapLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  return (
    <AppShell appName="Sentinel">
      {/* Threat level bar */}
      <div
        className={cn(
          "border-b px-4 sm:px-6 py-2 flex items-center justify-between text-sm transition-colors duration-500",
          threat.bgClass,
          threat.borderClass
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("inline-block w-2 h-2 rounded-full animate-pulse", threat.textClass)}
            style={{ backgroundColor: threat.color }}
          />
          <span className={cn("font-medium", threat.textClass)}>Niveau {threat.level}</span>
          <span className="text-muted-foreground hidden sm:inline">— {threat.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))} disabled={currentLevel <= 1}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentLevel((l) => Math.min(4, l + 1))} disabled={currentLevel >= 4}>
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Shield className={cn("w-7 h-7 transition-colors duration-500", threat.textClass)} />
              <h1 className="text-2xl font-bold tracking-tight">Sentinel</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
              Carte d'anticipation humaine et environnementale. Observer, comprendre, anticiper — sans fausse promesse.
            </p>
          </div>
          <Button variant="outline" size="sm" className="self-start sm:self-auto">
            Tableau de bord
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main column — map + context */}
          <div className="lg:col-span-3 space-y-4">
            {/* Interactive map */}
            <Card className={cn("overflow-hidden transition-colors duration-500", threat.borderClass)}>
              <SentinelMap
                className="h-[320px] sm:h-[480px]"
                layers={mapLayers}
                onZoneSelect={setSelectedZone}
              />
            </Card>

            {/* Contextual info card */}
            {selectedZone && (
              <MapContextCard
                zone={selectedZone}
                onClose={() => setSelectedZone(null)}
                threatLevel={currentLevel}
              />
            )}

            {/* Quick actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-sentinel/5 hover:border-sentinel/30">
                    <ShieldCheck className="w-5 h-5 text-sentinel" />
                    Je me sens en sécurité
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-level2/5 hover:border-level2/30">
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
                      <AlertTriangle className={cn("w-5 h-5 text-level4", currentLevel >= 3 && "animate-pulse")} />
                      Préparer un SOS
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Activity log */}
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

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Layer panel */}
            <MapLayerPanel layers={mapLayers} onToggle={toggleLayer} />

            {/* Current state */}
            <Card className={cn("transition-colors duration-500", threat.borderClass)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">État actuel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn("font-semibold px-3 py-1 transition-colors duration-500", threat.borderClass, threat.bgClass, threat.textClass)}
                  >
                    Niveau {threat.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{threat.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{threat.description}</p>
                <div className="flex gap-1.5 pt-1">
                  {THREAT_LEVELS.map((tl) => (
                    <button
                      key={tl.level}
                      onClick={() => setCurrentLevel(tl.level)}
                      className={cn("flex-1 h-2 rounded-full transition-all duration-500 cursor-pointer", currentLevel >= tl.level ? "opacity-100" : "opacity-20")}
                      style={{ backgroundColor: tl.color }}
                      title={`Niveau ${tl.level} — ${tl.label}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* L-Y-A */}
            <Card className={cn("transition-colors duration-500", threat.borderClass, currentLevel >= 3 ? threat.bgClass : "bg-sentinel/[0.02]")}>
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
                    : "L-Y-A peut vous guider selon votre position et le niveau de vigilance."
                  }
                </p>
                <Link to="/sentinel/lya">
                  <Button
                    variant={currentLevel >= 3 ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full transition-colors duration-500",
                      currentLevel < 3 && "border-sentinel/20 hover:bg-sentinel/5"
                    )}
                    style={currentLevel >= 3 ? { backgroundColor: threat.color, color: "white" } : undefined}
                  >
                    Parler à L-Y-A
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="bg-muted/50">
              <CardContent className="pt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Philosophie Sentinel
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Loyauté · Honnêteté · Transparence · Anticipation
                </p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  Sentinel ne promet pas de tout contrôler. Sentinel aide à mieux voir,
                  mieux comprendre et mieux réagir — ensemble.
                </p>
                <div className="flex gap-3 mt-1">
                  <Link to="/sentinel/charte" className="text-xs text-sentinel hover:underline">
                    Charte complète →
                  </Link>
                  <Link to="/sentinel/transparence" className="text-xs text-sentinel hover:underline">
                    Transparence →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SentinelHome;
