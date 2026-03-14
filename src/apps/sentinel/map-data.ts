import type { LatLngExpression } from "leaflet";

// Layer definitions
export interface MapLayer {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string; // lucide icon name
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
    description: "Signalements anonymisés de la communauté",
    color: "hsl(38, 92%, 50%)",
    icon: "Eye",
    visible: true,
  },
  {
    id: "refuges-fixed",
    label: "Refuges fixes",
    description: "Commerces partenaires, mairies, pharmacies",
    color: "hsl(220, 70%, 50%)",
    icon: "Home",
    visible: true,
  },
  {
    id: "refuges-mobile",
    label: "Refuges mobiles",
    description: "Taxis partenaires, ambulances",
    color: "hsl(200, 70%, 50%)",
    icon: "Car",
    visible: false,
  },
  {
    id: "community",
    label: "Présence communautaire",
    description: "Utilisateurs Sentinel actifs autour de la zone",
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

  // Vigilance
  { id: "vig-1", layerId: "vigilance", name: "Zone de vigilance communautaire", position: [48.8840, 2.3495], radius: 250, detail: "3 signalements anonymisés cette semaine" },
  { id: "vig-2", layerId: "vigilance", name: "Zone de signalement communautaire", position: [48.8490, 2.3800], radius: 200, detail: "1 signalement anonymisé" },

  // Community presence
  { id: "com-1", layerId: "community", name: "Présence communautaire active", position: [48.8566, 2.3522], radius: 600, detail: "47 utilisateurs actifs" },
  { id: "com-2", layerId: "community", name: "Présence communautaire modérée", position: [48.8700, 2.3400], radius: 400, detail: "12 utilisateurs actifs" },

  // Open data
  { id: "od-1", layerId: "opendata", name: "Zone d'attention — Installation classée", position: [48.8450, 2.3200], radius: 350, detail: "Installation classée SEVESO seuil bas", source: "data.gouv.fr" },
];

export const DEMO_MARKERS: MapMarker[] = [
  // Fixed refuges
  { id: "ref-1", layerId: "refuges-fixed", name: "Pharmacie des Halles", position: [48.8612, 2.3470], type: "Pharmacie", detail: "Refuge partenaire vérifié" },
  { id: "ref-2", layerId: "refuges-fixed", name: "Mairie du 4ème", position: [48.8555, 2.3565], type: "Mairie", detail: "Refuge institutionnel" },
  { id: "ref-3", layerId: "refuges-fixed", name: "Boulangerie Saint-Michel", position: [48.8530, 2.3445], type: "Commerce", detail: "Refuge partenaire vérifié" },
  { id: "ref-4", layerId: "refuges-fixed", name: "École élémentaire Voltaire", position: [48.8630, 2.3800], type: "École", detail: "Refuge institutionnel" },

  // Mobile refuges
  { id: "mob-1", layerId: "refuges-mobile", name: "Taxi partenaire — Zone Bastille", position: [48.8533, 2.3695], type: "Taxi", detail: "Chauffeur agréé en service" },
  { id: "mob-2", layerId: "refuges-mobile", name: "Ambulance — Secteur Nord", position: [48.8780, 2.3500], type: "Ambulance", detail: "Disponible" },
];
