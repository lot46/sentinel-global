import AppShell from "@/packages/ui/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Server,
  FileCheck,
  Users,
  AlertTriangle,
  Eye,
  Scale,
  Lock,
  MapPin,
  Database,
} from "lucide-react";

const hostingInfo = [
  { label: "Hébergement", value: "Infrastructure européenne (conformité RGPD)" },
  { label: "Données personnelles", value: "Chiffrées au repos et en transit (AES-256 / TLS 1.3)" },
  { label: "Géolocalisation", value: "Positions décalées, jamais de traçage continu" },
  { label: "Signalements", value: "Anonymisés à la source, expiration automatique 14 jours" },
  { label: "Logs serveur", value: "Durée de rétention minimale, pas d'exploitation commerciale" },
];

const partnerCharter = [
  "Vérification d'identité obligatoire (KYC, Kbis, casier judiciaire)",
  "Assurance responsabilité civile professionnelle exigée",
  "Engagement signé de respect de la charte d'accueil Sentinel",
  "Formation au protocole d'accueil d'urgence",
  "Possibilité de signalement du refuge par les utilisateurs",
  "Audit annuel de conformité par la Fondation",
  "Exclusion immédiate en cas de manquement grave",
];

const nonGuarantees = [
  { text: "Sentinel oriente vers des refuges partenaires mais ne garantit pas leur disponibilité permanente.", icon: MapPin },
  { text: "L'application réduit le temps d'isolement mais ne constitue pas un dispositif de sécurité certifié.", icon: Shield },
  { text: "Les signalements communautaires sont informatifs et ne constituent ni une accusation ni un diagnostic.", icon: Eye },
  { text: "L-Y-A est une aide à la décision, pas un substitut aux services d'urgence (112, 15, 17, 18).", icon: AlertTriangle },
  { text: "La présence communautaire affichée est approximative et ne reflète pas un comptage exact.", icon: Users },
];

const dataRights = [
  "Droit d'accès à vos données personnelles",
  "Droit de rectification et de suppression",
  "Droit à la portabilité de vos données",
  "Droit d'opposition au traitement",
  "Droit de retrait du consentement à tout moment",
  "Contact DPO : dpo@sentinel-protect.org (à venir)",
];

const SentinelTransparence = () => {
  return (
    <AppShell appName="Sentinel">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-sentinel/10 flex items-center justify-center">
            <Eye className="w-7 h-7 text-sentinel" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Transparence</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Ce que Sentinel fait, ce qu'il ne fait pas, et comment vos données sont protégées.
          </p>
        </header>

        <Separator />

        {/* Non-guarantees */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-sentinel" />
            Ce que Sentinel ne garantit pas
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Par honnêteté envers nos utilisateurs, nous listons explicitement les limites de Sentinel.
          </p>
          <div className="space-y-3">
            {nonGuarantees.map((item, i) => (
              <Card key={i} className="bg-muted/30">
                <CardContent className="py-3 px-4 flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Hosting & data */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-sentinel" />
            Hébergement & données
          </h2>
          <Card>
            <CardContent className="pt-4">
              <dl className="space-y-3">
                {hostingInfo.map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <dt className="text-sm font-medium min-w-[160px]">{item.label}</dt>
                    <dd className="text-sm text-muted-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Partner charter */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-sentinel" />
            Charte des partenaires refuges
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tout refuge partenaire (fixe ou mobile) est soumis aux obligations suivantes :
          </p>
          <ul className="space-y-2">
            {partnerCharter.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sentinel/10 text-sentinel flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Separator />

        {/* Signalement des refuges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-sentinel" />
            Signalement des refuges
          </h2>
          <Card className="bg-muted/30">
            <CardContent className="py-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tout utilisateur peut signaler un refuge partenaire en cas de :
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Fermeture non signalée</li>
                <li>Accueil inadapté ou refus de prise en charge</li>
                <li>Comportement inapproprié d'un membre du personnel</li>
                <li>Conditions d'accueil non conformes à la charte</li>
              </ul>
              <p className="text-xs text-muted-foreground/70">
                Chaque signalement est traité sous 48h par l'équipe de gouvernance.
                Un refuge peut être suspendu immédiatement en cas de manquement grave.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Ethical safeguards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-sentinel" />
            Garde-fous éthiques
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-2">
                <h3 className="text-sm font-semibold">Signalements communautaires</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Seuil minimum de 3 signalements avant affichage</li>
                  <li>• Expiration automatique après 14 jours</li>
                  <li>• Modération IA + humaine des motifs</li>
                  <li>• Aucune attribution à un individu</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-2">
                <h3 className="text-sm font-semibold">Présence communautaire</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Comptage volontairement flou</li>
                  <li>• Jamais de zone affichée comme « vide »</li>
                  <li>• Positions légèrement décalées (~50m)</li>
                  <li>• Pas de traçage individuel</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-2">
                <h3 className="text-sm font-semibold">Protection des mineurs</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Consentement parental obligatoire (-15 ans, RGPD)</li>
                  <li>• Droit de regard parental sur les signaux SOS</li>
                  <li>• Traçabilité du consentement</li>
                  <li>• L-Y-A adaptée par tranche d'âge</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-2">
                <h3 className="text-sm font-semibold">Mode discret</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Interface camouflée (calculatrice)</li>
                  <li>• SOS par geste invisible (code ou secousse)</li>
                  <li>• Historique masqué côté écran</li>
                  <li>• Alertes serveur maintenues</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* RGPD rights */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-sentinel" />
            Vos droits (RGPD)
          </h2>
          <ul className="space-y-2">
            {dataRights.map((right, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-sentinel flex-shrink-0" />
                {right}
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <div className="text-center pt-4">
          <Badge variant="outline" className="text-xs border-sentinel/20 text-muted-foreground">
            Dernière mise à jour : mars 2026
          </Badge>
        </div>
      </div>
    </AppShell>
  );
};

export default SentinelTransparence;
