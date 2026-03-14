import type { LatLngExpression } from "leaflet";

// --- Ethical safeguards ---

/** Minimum number of reports before a vigilance zone is displayed */
export const MIN_REPORTS_THRESHOLD = 3;

/** Days after which a community report expires */
export const REPORT_EXPIRY_DAYS = 14;

/** Blur community presence: never show exact count, never show 0 */
export function blurPresenceCount(count: number): string {
  if (count <= 0) return "Présence détectée";
  if (count < 5) return "Quelques utilisateurs actifs";
  if (count < 20) return "Plusieurs utilisateurs actifs";
  if (count < 50) return "Communauté active";
  return "Forte présence communautaire";
}

/** Slightly offset a position for privacy (±~50m) */
export function offsetPosition(pos: LatLngExpression): LatLngExpression {
  const arr = pos as [number, number];
  const offset = () => (Math.random() - 0.5) * 0.001; // ~50m
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
}

export const MAP_LAYERS: MapLayer[] = [
  {
    id: "environmental",
    label: "Risques environnementaux",
    description: "Inondations, incendies, séismes, tempêtes (sources open data)",
    color: "hsl(25, 95%, 53%)",
    icon: "CloudRain",
    visible: true,
  },
  {
    id: "discomfort",
    label: "Zones d'inconfort",
    description: "Bruit, luminosité excessive, densité urbaine",
    color: "hsl(280, 60%, 55%)",
    icon: "Volume2",
    visible: false,
  },
  {
    id: "vigilance",
    label: "Vigilance communautaire",
    description: "Signalements anonymisés (min. 3 signalements, expiration 14 jours)",
    color: "hsl(38, 92%, 50%)",
    icon: "Eye",
    visible: true,
  },
  {
    id: "refuges-fixed",
    label: "Refuges fixes",
    description: "Commerces partenaires, mairies, pharmacies — orientation, pas de garantie",
    color: "hsl(220, 70%, 50%)",
    icon: "Home",
    visible: true,
  },
  {
    id: "refuges-mobile",
    label: "Refuges mobiles",
    description: "Taxis partenaires, ambulances — disponibilité non garantie",
    color: "hsl(200, 70%, 50%)",
    icon: "Car",
    visible: false,
  },
  {
    id: "community",
    label: "Présence communautaire",
    description: "Indicateur flou — aucun comptage exact, positions décalées",
    color: "hsl(160, 55%, 40%)",
    icon: "Users",
    visible: false,
  },
  {
    id: "opendata",
    label: "Zones d'attention",
    description: "Données open data publiques (data.gouv, Géorisques)",
    color: "hsl(0, 60%, 50%)",
    icon: "Database",
    visible: false,
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

// Demo data — Paris area
export const DEMO_ZONES: MapZone[] = [
  // Environmental risks
  { id: "env-1", layerId: "environmental", name: "Zone d'attention inondation — Berges de Seine", position: [48.8566, 2.3422], radius: 500, detail: "Risque de crue historique", source: "Géorisques" },
  { id: "env-2", layerId: "environmental", name: "Zone d'attention — Mouvement de terrain", position: [48.8750, 2.3600], radius: 300, detail: "Retrait-gonflement des argiles", source: "Géorisques" },

  // Discomfort
  { id: "dis-1", layerId: "discomfort", name: "Zone d'inconfort sonore — Gare du Nord", position: [48.8809, 2.3553], radius: 350, detail: "Niveau sonore élevé en journée" },
  { id: "dis-2", layerId: "discomfort", name: "Zone d'inconfort — Densité élevée", position: [48.8620, 2.3380], radius: 400, detail: "Densité piétonne importante" },

  // Vigilance — only zones with >= MIN_REPORTS_THRESHOLD are shown
  { id: "vig-1", layerId: "vigilance", name: "Zone de vigilance communautaire", position: [48.8840, 2.3495], radius: 250, detail: "Plusieurs signalements anonymisés cette semaine", reportCount: 5, expiresAt: "2026-03-28" },
  { id: "vig-2", layerId: "vigilance", name: "Zone de signalement communautaire", position: [48.8490, 2.3800], radius: 200, detail: "Signalements anonymisés récents", reportCount: 3, expiresAt: "2026-03-25" },

  // Community presence — blurred counts, offset positions
  { id: "com-1", layerId: "community", name: "Présence communautaire", position: [48.8566, 2.3522], radius: 600, detail: blurPresenceCount(47) },
  { id: "com-2", layerId: "community", name: "Présence communautaire", position: [48.8700, 2.3400], radius: 400, detail: blurPresenceCount(12) },
  { id: "com-3", layerId: "community", name: "Présence communautaire", position: [48.8450, 2.3600], radius: 500, detail: blurPresenceCount(2) },

  // Open data
  { id: "od-1", layerId: "opendata", name: "Zone d'attention — Installation classée", position: [48.8450, 2.3200], radius: 350, detail: "Installation classée SEVESO seuil bas", source: "data.gouv.fr" },
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
    return true;
  });
}
