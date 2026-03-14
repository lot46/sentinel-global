export interface ThreatLevel {
  level: number;
  label: string;
  description: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
}

export const THREAT_LEVELS: ThreatLevel[] = [
  {
    level: 1,
    label: "Situation calme",
    description: "Aucun signal particulier. Restez attentif, Sentinel veille avec vous.",
    color: "hsl(var(--app-sentinel))",
    bgClass: "bg-sentinel/5",
    borderClass: "border-sentinel/30",
    textClass: "text-sentinel",
    badgeBg: "bg-sentinel/10",
  },
  {
    level: 2,
    label: "Vigilance active",
    description: "Des signaux faibles ont été relevés. Restez informé et prêt à adapter votre comportement.",
    color: "hsl(var(--level-2))",
    bgClass: "bg-level2/5",
    borderClass: "border-level2/30",
    textClass: "text-level2",
    badgeBg: "bg-level2/10",
  },
  {
    level: 3,
    label: "Tension confirmée",
    description: "La situation nécessite une attention soutenue. Préparez vos options et restez en lien avec vos proches.",
    color: "hsl(var(--level-3))",
    bgClass: "bg-level3/5",
    borderClass: "border-level3/30",
    textClass: "text-level3",
    badgeBg: "bg-level3/10",
  },
  {
    level: 4,
    label: "Urgence déclarée",
    description: "Situation critique. Activez vos protocoles de sécurité. L-Y-A est disponible pour vous guider.",
    color: "hsl(var(--level-4))",
    bgClass: "bg-level4/5",
    borderClass: "border-level4/30",
    textClass: "text-level4",
    badgeBg: "bg-level4/10",
  },
];

export const getThreatLevel = (level: number): ThreatLevel => {
  return THREAT_LEVELS[Math.min(Math.max(level - 1, 0), 3)];
};
