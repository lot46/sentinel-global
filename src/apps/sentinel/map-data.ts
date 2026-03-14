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

// Layer definitions — aligned with REFERENTIEL.md V1 categories
export interface MapLayer {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  visible: boolean;
  category: "refuges" | "services" | "meteo-env" | "eclairage" | "bruit" | "signalements" | "faible-reassurance" | "itineraires" | "communaute";
}

export const MAP_LAYERS: MapLayer[] = [
  // --- Cat 5 : Refuges Sentinel ---
  {
    id: "refuges-fixed",
    label: "Refuges fixes",
    description: "Commerces partenaires, mairies, pharmacies — orientation, pas de garantie",
    color: "hsl(220, 70%, 50%)",
    icon: "Home",
    visible: true,
    category: "refuges",
  },
  {
    id: "refuges-mobile",
    label: "Refuges mobiles",
    description: "Taxis partenaires, ambulances — disponibilité non garantie",
    color: "hsl(200, 70%, 50%)",
    icon: "Car",
    visible: false,
    category: "refuges",
  },

  // --- Cat 4 : Services utiles ---
  {
    id: "support-points",
    label: "Services utiles à proximité",
    description: "Relais communautaires, associations, centres d'accueil",
    color: "hsl(180, 55%, 45%)",
    icon: "HandHelping",
    visible: true,
    category: "services",
  },

  // --- Cat 3 : Météo et vigilance environnementale ---
  {
    id: "env-flood",
    label: "Inondations & submersion",
    description: "Zones de crue, submersion marine (Géorisques)",
    color: "hsl(210, 80%, 55%)",
    icon: "Waves",
    visible: true,
    category: "meteo-env",
  },
  {
    id: "env-fire",
    label: "Incendies",
    description: "Zones de vigilance feux de forêt, risque pyroclastique",
    color: "hsl(15, 90%, 55%)",
    icon: "Flame",
    visible: false,
    category: "meteo-env",
  },
  {
    id: "env-storm",
    label: "Tempêtes & séismes",
    description: "Alertes Météo-France, zones sismiques historiques",
    color: "hsl(25, 95%, 53%)",
    icon: "CloudLightning",
    visible: false,
    category: "meteo-env",
  },
  {
    id: "env-pollution",
    label: "Pollution",
    description: "Qualité de l'air, installations classées (SEVESO, ICPE)",
    color: "hsl(45, 70%, 50%)",
    icon: "Wind",
    visible: false,
    category: "meteo-env",
  },

  // --- Cat 2 : Bruit ---
  {
    id: "env-noise",
    label: "Inconfort sonore",
    description: "Cartes de bruit urbain, zones d'inconfort environnemental",
    color: "hsl(280, 60%, 55%)",
    icon: "Volume2",
    visible: false,
    category: "bruit",
  },

  // --- Cat 1 : Éclairage ---
  {
    id: "env-lighting",
    label: "Faible éclairage",
    description: "Zones peu éclairées (données municipales)",
    color: "hsl(50, 30%, 35%)",
    icon: "Moon",
    visible: false,
    category: "eclairage",
  },

  // --- Cat 8 : Zones à signalements convergents ---
  {
    id: "signalements",
    label: "Signalements convergents",
    description: "Signalements anonymisés recoupés (min. 3, expiration 14 jours)",
    color: "hsl(38, 92%, 50%)",
    icon: "Eye",
    visible: true,
    category: "signalements",
  },

  // --- Cat 7 : Zones à faible réassurance ---
  {
    id: "faible-reassurance",
    label: "Zones à faible réassurance",
    description: "Peu de présence communautaire ou de refuges à proximité",
    color: "hsl(0, 60%, 50%)",
    icon: "AlertTriangle",
    visible: false,
    category: "faible-reassurance",
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

  // --- Cat 6 : Itinéraires rassurants ---
  {
    id: "itineraires",
    label: "Itinéraires rassurants",
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
  /** Nearest solution (refuge, service, itinerary) — RÈGLE ABSOLUE */
  nearestSolution?: string;
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
  { id: "fl-1", layerId: "env-flood", name: "Zone d'attention — Berges de Seine", position: [48.8566, 2.3422], radius: 500, detail: "Risque de crue historique", source: "Géorisques", nearestSolution: "Refuge : Mairie du 4ème (350m)" },
  { id: "fl-2", layerId: "env-flood", name: "Zone d'attention — Submersion berges", position: [48.8480, 2.3280], radius: 350, detail: "Zone basse inondable en cas de crue centennale", source: "Géorisques", nearestSolution: "Service utile : Centre d'accueil municipal (500m)" },

  // Incendies
  { id: "fi-1", layerId: "env-fire", name: "Zone d'attention — Risque incendie", position: [48.8650, 2.4000], radius: 300, detail: "Proximité zone boisée, vigilance sécheresse", source: "SDIS Paris", nearestSolution: "Refuge : École Voltaire (250m)" },

  // Tempêtes & séismes
  { id: "st-1", layerId: "env-storm", name: "Zone d'attention — Mouvement de terrain", position: [48.8750, 2.3600], radius: 300, detail: "Retrait-gonflement des argiles", source: "Géorisques", nearestSolution: "Service utile : Relais communautaire Belleville (400m)" },

  // Pollution
  { id: "po-1", layerId: "env-pollution", name: "Zone d'attention — Installation classée", position: [48.8450, 2.3200], radius: 350, detail: "Installation classée SEVESO seuil bas", source: "data.gouv.fr", nearestSolution: "Itinéraire rassurant vers Châtelet (600m)" },
  { id: "po-2", layerId: "env-pollution", name: "Zone d'inconfort environnemental — Qualité de l'air", position: [48.8700, 2.3100], radius: 450, detail: "Indice ATMO régulièrement élevé", source: "Airparif", nearestSolution: "Service utile : Association Sentinelles Solidaires (300m)" },

  // Bruit
  { id: "no-1", layerId: "env-noise", name: "Zone d'inconfort environnemental — Gare du Nord", position: [48.8809, 2.3553], radius: 350, detail: "Niveau sonore élevé en journée", nearestSolution: "Refuge : Pharmacie des Halles (700m)" },
  { id: "no-2", layerId: "env-noise", name: "Zone d'inconfort environnemental — Densité sonore", position: [48.8620, 2.3380], radius: 400, detail: "Densité piétonne et trafic importants", nearestSolution: "Service utile : Association Sentinelles Solidaires (200m)" },

  // Faible éclairage
  { id: "li-1", layerId: "env-lighting", name: "Zone d'attention — Éclairage insuffisant", position: [48.8530, 2.3700], radius: 250, detail: "Éclairage public faible, voies secondaires", nearestSolution: "Refuge : Boulangerie Saint-Michel (400m)" },
  { id: "li-2", layerId: "env-lighting", name: "Zone d'attention — Passage peu éclairé", position: [48.8680, 2.3850], radius: 180, detail: "Passage souterrain, éclairage limité", nearestSolution: "Refuge : École Voltaire (150m)" },

  // Zones à signalements convergents
  { id: "sig-1", layerId: "signalements", name: "Zone à signalements convergents", position: [48.8840, 2.3495], radius: 250, detail: "Plusieurs signalements anonymisés recoupés cette semaine", reportCount: 5, expiresAt: "2026-03-28", nearestSolution: "Refuge mobile : Taxi partenaire Bastille (500m)" },
  { id: "sig-2", layerId: "signalements", name: "Zone à signalements convergents", position: [48.8490, 2.3800], radius: 200, detail: "Signalements anonymisés récents", reportCount: 3, expiresAt: "2026-03-25", nearestSolution: "Service utile : Relais communautaire (300m) · 📞 119" },

  // Zones à faible réassurance
  { id: "fr-1", layerId: "faible-reassurance", name: "Zone à faible réassurance", position: [48.8550, 2.3900], radius: 300, detail: "Croisement : faible éclairage + peu de refuges + isolement", source: "Analyse contextuelle", nearestSolution: "Itinéraire rassurant Châtelet→Bastille (400m)" },

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

  // Support points / Services utiles
  { id: "sp-1", layerId: "support-points", name: "Association Sentinelles Solidaires", position: [48.8590, 2.3510], type: "Association", detail: "Service utile — point d'accueil et d'écoute, horaires variables" },
  { id: "sp-2", layerId: "support-points", name: "Centre d'accueil municipal", position: [48.8650, 2.3350], type: "Centre d'accueil", detail: "Service utile — accueil jour et nuit, orientation vers aide humaine adaptée" },
  { id: "sp-3", layerId: "support-points", name: "Relais communautaire Belleville", position: [48.8720, 2.3780], type: "Relais", detail: "Service utile — présence bénévole, point de repère communautaire" },
];

export const DEMO_ROUTES: MapRoute[] = [
  {
    id: "route-1",
    layerId: "itineraires",
    name: "Itinéraire rassurant — Châtelet → Bastille",
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
    name: "Itinéraire rassurant — Opéra → République",
    points: [
      [48.8710, 2.3320],
      [48.8720, 2.3400],
      [48.8730, 2.3480],
      [48.8740, 2.3540],
      [48.8680, 2.3620],
    ],
    detail: "Parcours éclairé avec services utiles à proximité",
  },
];

/** Filter zones by ethical rules before display */
export function filterZonesEthically(zones: MapZone[]): MapZone[] {
  const now = new Date();
  return zones.filter((zone) => {
    // Signalements convergents: require minimum reports
    if (zone.layerId === "signalements") {
      if ((zone.reportCount ?? 0) < MIN_REPORTS_THRESHOLD) return false;
      if (zone.expiresAt && new Date(zone.expiresAt) < now) return false;
    }
    return true;
  });
}

// Category labels for the layer panel — aligned with REFERENTIEL.md V1
export const LAYER_CATEGORIES: Record<string, { label: string; description: string }> = {
  refuges: { label: "Refuges Sentinel", description: "Refuges fixes et mobiles partenaires" },
  services: { label: "Services utiles", description: "Points d'appui, associations, aide humaine proche" },
  "meteo-env": { label: "Météo & vigilance environnementale", description: "Risques naturels, pollution, alertes" },
  eclairage: { label: "Éclairage", description: "Données d'éclairage public municipal" },
  bruit: { label: "Bruit", description: "Cartographie sonore, inconfort environnemental" },
  signalements: { label: "Signalements convergents", description: "Signalements anonymisés recoupés" },
  "faible-reassurance": { label: "Faible réassurance", description: "Zones avec peu de solutions proches" },
  communaute: { label: "Présence communautaire", description: "Sentinelles et relais actifs" },
  itineraires: { label: "Itinéraires rassurants", description: "Trajets éclairés avec refuges proches" },
};
