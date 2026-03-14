import type { LatLngExpression } from "leaflet";

// --- Ethical safeguards ---

/** Minimum number of reports before a vigilance zone is displayed */
export const MIN_REPORTS_THRESHOLD = 3;

/** Days after which a community report expires */
export const REPORT_EXPIRY_DAYS = 14;

/** Blur community presence: never show exact count, never show 0 */
export function blurPresenceCount(count: number): string {
  if (count <= 0) return "Présence détectée";
  if (count < 5) return "Quelques sentinelles actives";
  if (count < 20) return "Plusieurs sentinelles actives";
  if (count < 50) return "Communauté active";
  return "Forte présence communautaire";
}

/** Slightly offset a position for privacy (±~50m) */
export function offsetPosition(pos: LatLngExpression): LatLngExpression {
  const arr = pos as [number, number];
  const offset = () => (Math.random() - 0.5) * 0.001;
  return [arr[0] + offset(), arr[1] + offset()];
}

// Layer definitions
export interface MapLayer {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  visible: boolean;
  category: "eclairees" | "risques" | "vigilance" | "communaute" | "itineraires" | "assistance";
}

export const MAP_LAYERS: MapLayer[] = [
  // --- Zones éclairées ---
  {
    id: "refuges-fixed",
    label: "Refuges fixes",
    description: "Commerces partenaires, mairies, pharmacies — orientation, pas de garantie",
    color: "hsl(220, 70%, 50%)",
    icon: "Home",
    visible: true,
    category: "eclairees",
  },
  {
    id: "refuges-mobile",
    label: "Refuges mobiles",
    description: "Taxis partenaires, ambulances — disponibilité non garantie",
    color: "hsl(200, 70%, 50%)",
    icon: "Car",
    visible: false,
    category: "eclairees",
  },
  {
    id: "support-points",
    label: "Points d'appui humains",
    description: "Relais communautaires, associations, centres d'accueil",
    color: "hsl(180, 55%, 45%)",
    icon: "HandHelping",
    visible: true,
    category: "eclairees",
  },

  // --- Risques environnementaux ---
  {
    id: "env-flood",
    label: "Inondations & submersion",
    description: "Zones de crue, submersion marine (Géorisques)",
    color: "hsl(210, 80%, 55%)",
    icon: "Waves",
    visible: true,
    category: "risques",
  },
  {
    id: "env-fire",
    label: "Incendies",
    description: "Zones de vigilance feux de forêt, risque pyroclastique",
    color: "hsl(15, 90%, 55%)",
    icon: "Flame",
    visible: false,
    category: "risques",
  },
  {
    id: "env-storm",
    label: "Tempêtes & séismes",
    description: "Alertes Météo-France, zones sismiques historiques",
    color: "hsl(25, 95%, 53%)",
    icon: "CloudLightning",
    visible: false,
    category: "risques",
  },
  {
    id: "env-pollution",
    label: "Pollution",
    description: "Qualité de l'air, installations classées (SEVESO, ICPE)",
    color: "hsl(45, 70%, 50%)",
    icon: "Wind",
    visible: false,
    category: "risques",
  },
  {
    id: "env-noise",
    label: "Bruit & inconfort sonore",
    description: "Cartes de bruit urbain, zones de nuisance",
    color: "hsl(280, 60%, 55%)",
    icon: "Volume2",
    visible: false,
    category: "risques",
  },
  {
    id: "env-lighting",
    label: "Faible éclairage",
    description: "Zones peu éclairées (données municipales)",
    color: "hsl(50, 30%, 35%)",
    icon: "Moon",
    visible: false,
    category: "risques",
  },

  // --- Zones d'attention et de vigilance ---
  {
    id: "vigilance",
    label: "Vigilance communautaire",
    description: "Signalements anonymisés recoupés (min. 3, expiration 14 jours)",
    color: "hsl(38, 92%, 50%)",
    icon: "Eye",
    visible: true,
    category: "vigilance",
  },
  {
    id: "attention",
    label: "Zones d'attention",
    description: "Facteurs contextuels croisés — données open data publiques",
    color: "hsl(0, 60%, 50%)",
    icon: "AlertTriangle",
    visible: false,
    category: "vigilance",
  },
  {
    id: "temp-critical",
    label: "Zones critiques temporaires",
    description: "Événements ponctuels, manifestations, travaux majeurs",
    color: "hsl(350, 70%, 50%)",
    icon: "Clock",
    visible: false,
    category: "vigilance",
  },

  // --- Présence communautaire ---
  {
    id: "community",
    label: "Sentinelles actives",
    description: "Indicateur flou de présence — jamais de comptage exact, positions décalées",
    color: "hsl(160, 55%, 40%)",
    icon: "Users",
    visible: false,
    category: "communaute",
  },

  // --- Itinéraires ---
  {
    id: "itineraires",
    label: "Itinéraires de réassurance",
    description: "Trajets passant par des zones éclairées et des refuges proches",
    color: "hsl(170, 60%, 45%)",
    icon: "Route",
    visible: false,
    category: "itineraires",
  },
];

// Zone types
export interface MapZone {
  id: string;
  layerId: string;
  name: string;
  position: LatLngExpression;
  radius: number;
  detail?: string;
  source?: string;
  reportCount?: number;
  expiresAt?: string;
}

export interface MapMarker {
  id: string;
  layerId: string;
  name: string;
  position: LatLngExpression;
  type: string;
  detail?: string;
}

export interface MapRoute {
  id: string;
  layerId: string;
  name: string;
  points: LatLngExpression[];
  detail?: string;
}

// Demo data — Paris area
export const DEMO_ZONES: MapZone[] = [
  // Inondations & submersion
  { id: "fl-1", layerId: "env-flood", name: "Zone d'attention inondation — Berges de Seine", position: [48.8566, 2.3422], radius: 500, detail: "Risque de crue historique", source: "Géorisques" },
  { id: "fl-2", layerId: "env-flood", name: "Zone d'attention — Submersion berges", position: [48.8480, 2.3280], radius: 350, detail: "Zone basse inondable en cas de crue centennale", source: "Géorisques" },

  // Incendies
  { id: "fi-1", layerId: "env-fire", name: "Zone d'attention — Risque incendie", position: [48.8650, 2.4000], radius: 300, detail: "Proximité zone boisée, vigilance sécheresse", source: "SDIS Paris" },

  // Tempêtes & séismes
  { id: "st-1", layerId: "env-storm", name: "Zone d'attention — Mouvement de terrain", position: [48.8750, 2.3600], radius: 300, detail: "Retrait-gonflement des argiles", source: "Géorisques" },

  // Pollution
  { id: "po-1", layerId: "env-pollution", name: "Zone d'attention — Installation classée", position: [48.8450, 2.3200], radius: 350, detail: "Installation classée SEVESO seuil bas", source: "data.gouv.fr" },
  { id: "po-2", layerId: "env-pollution", name: "Zone d'attention — Qualité de l'air dégradée", position: [48.8700, 2.3100], radius: 450, detail: "Indice ATMO régulièrement élevé", source: "Airparif" },

  // Bruit
  { id: "no-1", layerId: "env-noise", name: "Zone d'inconfort sonore — Gare du Nord", position: [48.8809, 2.3553], radius: 350, detail: "Niveau sonore élevé en journée" },
  { id: "no-2", layerId: "env-noise", name: "Zone d'inconfort — Densité sonore", position: [48.8620, 2.3380], radius: 400, detail: "Densité piétonne et trafic importants" },

  // Faible éclairage
  { id: "li-1", layerId: "env-lighting", name: "Zone d'attention — Éclairage insuffisant", position: [48.8530, 2.3700], radius: 250, detail: "Éclairage public faible, voies secondaires" },
  { id: "li-2", layerId: "env-lighting", name: "Zone d'attention — Passage peu éclairé", position: [48.8680, 2.3850], radius: 180, detail: "Passage souterrain, éclairage limité" },

  // Vigilance communautaire
  { id: "vig-1", layerId: "vigilance", name: "Zone de vigilance communautaire", position: [48.8840, 2.3495], radius: 250, detail: "Plusieurs signalements anonymisés recoupés cette semaine", reportCount: 5, expiresAt: "2026-03-28" },
  { id: "vig-2", layerId: "vigilance", name: "Zone de signalements recoupés", position: [48.8490, 2.3800], radius: 200, detail: "Signalements anonymisés récents", reportCount: 3, expiresAt: "2026-03-25" },

  // Zones d'attention (open data croisées)
  { id: "att-1", layerId: "attention", name: "Zone d'attention — Facteurs croisés", position: [48.8550, 2.3900], radius: 300, detail: "Croisement : faible éclairage + isolement + signalements", source: "Analyse contextuelle" },

  // Zones critiques temporaires
  { id: "tc-1", layerId: "temp-critical", name: "Zone critique temporaire — Manifestation", position: [48.8690, 2.3470], radius: 400, detail: "Manifestation déclarée — perturbations possibles", expiresAt: "2026-03-15" },

  // Community presence — blurred counts, offset positions
  { id: "com-1", layerId: "community", name: "Présence communautaire", position: [48.8566, 2.3522], radius: 600, detail: blurPresenceCount(47) },
  { id: "com-2", layerId: "community", name: "Présence communautaire", position: [48.8700, 2.3400], radius: 400, detail: blurPresenceCount(12) },
  { id: "com-3", layerId: "community", name: "Présence communautaire", position: [48.8450, 2.3600], radius: 500, detail: blurPresenceCount(2) },
];

export const DEMO_MARKERS: MapMarker[] = [
  // Fixed refuges
  { id: "ref-1", layerId: "refuges-fixed", name: "Pharmacie des Halles", position: [48.8612, 2.3470], type: "Pharmacie", detail: "Refuge partenaire vérifié — orientation, disponibilité non garantie" },
  { id: "ref-2", layerId: "refuges-fixed", name: "Mairie du 4ème", position: [48.8555, 2.3565], type: "Mairie", detail: "Refuge institutionnel — orientation, disponibilité non garantie" },
  { id: "ref-3", layerId: "refuges-fixed", name: "Boulangerie Saint-Michel", position: [48.8530, 2.3445], type: "Commerce", detail: "Refuge partenaire vérifié — orientation, disponibilité non garantie" },
  { id: "ref-4", layerId: "refuges-fixed", name: "École élémentaire Voltaire", position: [48.8630, 2.3800], type: "École", detail: "Refuge institutionnel — orientation, disponibilité non garantie" },

  // Mobile refuges
  { id: "mob-1", layerId: "refuges-mobile", name: "Taxi partenaire — Zone Bastille", position: [48.8533, 2.3695], type: "Taxi", detail: "Chauffeur agréé — disponibilité non garantie" },
  { id: "mob-2", layerId: "refuges-mobile", name: "Ambulance — Secteur Nord", position: [48.8780, 2.3500], type: "Ambulance", detail: "Service d'urgence — disponibilité non garantie" },

  // Support points
  { id: "sp-1", layerId: "support-points", name: "Association Sentinelles Solidaires", position: [48.8590, 2.3510], type: "Association", detail: "Point d'accueil et d'écoute — horaires variables" },
  { id: "sp-2", layerId: "support-points", name: "Centre d'accueil municipal", position: [48.8650, 2.3350], type: "Centre d'accueil", detail: "Accueil jour et nuit, orientation vers les services adaptés" },
  { id: "sp-3", layerId: "support-points", name: "Relais communautaire Belleville", position: [48.8720, 2.3780], type: "Relais", detail: "Présence bénévole, point de repère communautaire" },
];

export const DEMO_ROUTES: MapRoute[] = [
  {
    id: "route-1",
    layerId: "itineraires",
    name: "Itinéraire de réassurance — Châtelet → Bastille",
    points: [
      [48.8580, 2.3470],
      [48.8575, 2.3510],
      [48.8568, 2.3560],
      [48.8555, 2.3600],
      [48.8545, 2.3650],
      [48.8535, 2.3690],
    ],
    detail: "Parcours passant par 3 refuges et 2 zones éclairées",
  },
  {
    id: "route-2",
    layerId: "itineraires",
    name: "Itinéraire de réassurance — Opéra → République",
    points: [
      [48.8710, 2.3320],
      [48.8720, 2.3400],
      [48.8730, 2.3480],
      [48.8740, 2.3540],
      [48.8680, 2.3620],
    ],
    detail: "Parcours éclairé avec points d'appui disponibles",
  },
];

/** Filter zones by ethical rules before display */
export function filterZonesEthically(zones: MapZone[]): MapZone[] {
  const now = new Date();
  return zones.filter((zone) => {
    // Vigilance zones: require minimum reports
    if (zone.layerId === "vigilance") {
      if ((zone.reportCount ?? 0) < MIN_REPORTS_THRESHOLD) return false;
      if (zone.expiresAt && new Date(zone.expiresAt) < now) return false;
    }
    // Temporary critical zones: check expiry
    if (zone.layerId === "temp-critical") {
      if (zone.expiresAt && new Date(zone.expiresAt) < now) return false;
    }
    return true;
  });
}

// Category labels for the layer panel
export const LAYER_CATEGORIES: Record<string, { label: string; description: string }> = {
  eclairees: { label: "Zones éclairées", description: "Refuges, relais et points d'appui" },
  risques: { label: "Risques environnementaux", description: "Facteurs naturels et urbains" },
  vigilance: { label: "Attention & vigilance", description: "Signalements contextuels" },
  communaute: { label: "Présence communautaire", description: "Sentinelles et relais actifs" },
  itineraires: { label: "Itinéraires", description: "Trajets de réassurance" },
};
