import AppShell from "@/packages/ui/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Heart,
  Eye,
  Lock,
  Scale,
  Users,
  Ban,
  Fingerprint,
} from "lucide-react";

const principles = [
  { icon: Shield, title: "Protection", text: "Protéger les personnes vulnérables est notre seule raison d'exister." },
  { icon: Heart, title: "Honnêteté", text: "Aucune promesse impossible. Aucun mensonge. Jamais." },
  { icon: Eye, title: "Transparence", text: "Chiffres, salaires, gouvernance : tout est visible." },
  { icon: Lock, title: "Inaliénabilité", text: "Sentinel ne peut être vendu, racheté ni cédé. La Fondation est propriétaire à 100 %." },
  { icon: Scale, title: "Loyauté", text: "Envers les utilisateurs, les Sentinelles, les familles, les partenaires." },
  { icon: Users, title: "Humanité", text: "La technologie sert les gens. Pas l'inverse." },
  { icon: Ban, title: "Zéro exploitation", text: "Pas de publicité. Pas de revente de données. Pas d'enrichissement personnel." },
  { icon: Fingerprint, title: "Anticipation", text: "Comprendre avant de réagir. Observer avant de juger. Prévenir avant de subir." },
];

const commitments = [
  "Fondation propriétaire éternelle de la SAS.",
  "Clé d'Or de gouvernance inviolable.",
  "Président plafonné à 10 000 € maximum.",
  "Aucun investisseur, aucun actionnaire externe.",
  "Tous les bénéfices réinvestis dans la mission et la Fondation Enfance.",
  "Respect strict du RGPD et des lois FR/EU.",
  "Protection des enfants et adolescents comme priorité absolue.",
  "Kill switch multi-niveau en cas de dérive.",
];

const SentinelCharte = () => {
  return (
    <AppShell appName="Sentinel">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* En-tête */}
        <header className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-sentinel/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-sentinel" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Charte Sentinel Protect</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Ce que nous sommes. Ce que nous ne serons jamais. Ce à quoi nous nous engageons.
          </p>
        </header>

        <Separator />

        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Notre mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sentinel Protect n'est pas une entreprise. C'est une mission humaine. 
            Observer, comprendre, anticiper et protéger — sans contrôle, sans profit, 
            sans exploitation. Un bouclier universel qui appartient à tous et ne sert 
            que ceux qui en ont besoin.
          </p>
        </section>

        {/* Principes */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Principes fondateurs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <Card key={p.title} className="bg-muted/30">
                <CardContent className="pt-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <p.icon className="w-4 h-4 text-sentinel" />
                    <h3 className="font-semibold text-sm">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Engagements */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Engagements irréversibles</h2>
          <ul className="space-y-3">
            {commitments.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sentinel/10 text-sentinel flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <Separator />

        {/* Citation */}
        <blockquote className="text-center py-6">
          <p className="text-lg italic text-muted-foreground leading-relaxed">
            « Un empire sans cœur est un désert.<br />
            Un empire sans larmes est une machine.<br />
            Un empire sans mission est un produit. »
          </p>
        </blockquote>

      </div>
    </AppShell>
  );
};

export default SentinelCharte;
