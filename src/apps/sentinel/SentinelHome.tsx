import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ShieldCheck,
  HandHelping,
  AlertTriangle,
  MessageCircle,
  Map,
  Activity,
  Clock,
  Heart,
} from "lucide-react";

const activityLog = [
  { time: "14:32", label: "Signal de sécurité enregistré", icon: ShieldCheck },
  { time: "11:15", label: "Niveau de vigilance consulté", icon: Activity },
  { time: "08:00", label: "Retour au calme confirmé", icon: Heart },
];

const SentinelHome = () => {
  return (
    <AppShell appName="Sentinel">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* 1. En-tête */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-sentinel" />
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

        {/* Grille principale */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Colonne gauche — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* 2. Carte / Zone principale */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] text-center p-8">
                <div className="w-14 h-14 rounded-xl bg-sentinel/10 flex items-center justify-center mb-5">
                  <Map className="w-7 h-7 text-sentinel" />
                </div>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  Carte des zones éclairées et points d'appui — à venir.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Cette zone accueillera la visualisation en temps réel.
                </p>
              </CardContent>
            </Card>

            {/* 4. Actions rapides */}
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
                    className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-amber-500/5 hover:border-amber-500/30"
                  >
                    <HandHelping className="w-5 h-5 text-amber-600" />
                    J'ai besoin d'un appui
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-destructive/5 hover:border-destructive/30"
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Préparer un SOS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 6. Historique */}
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

          {/* Colonne droite — 1/3 */}
          <div className="space-y-6">

            {/* 3. État actuel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">État actuel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="border-sentinel/30 bg-sentinel/5 text-sentinel font-semibold px-3 py-1"
                  >
                    Niveau 1
                  </Badge>
                  <span className="text-sm text-muted-foreground">Situation calme</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aucun signal particulier détecté dans votre périmètre. Restez attentif, 
                  Sentinel veille avec vous.
                </p>
              </CardContent>
            </Card>

            {/* 5. L-Y-A */}
            <Card className="border-sentinel/20 bg-sentinel/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-sentinel" />
                  L-Y-A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  L-Y-A pourra vous guider selon le contexte, en fonction du niveau 
                  de vigilance et de votre situation.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-sentinel/20 hover:bg-sentinel/5"
                >
                  Parler à L-Y-A
                </Button>
              </CardContent>
            </Card>

            {/* 7. Philosophie */}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SentinelHome;
