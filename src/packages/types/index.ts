// Sentinel Global — Shared types

export interface AppDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  path: string;
  color: string;
}

export const APPS: AppDefinition[] = [
  {
    id: "sentinel",
    name: "Sentinel",
    slug: "sentinel",
    description: "Surveillance citoyenne et alerte communautaire",
    path: "/sentinel",
    color: "hsl(var(--app-sentinel))",
  },
  {
    id: "je-suis-la",
    name: "Je suis là",
    slug: "je-suis-la",
    description: "Signal de présence pour les personnes isolées",
    path: "/je-suis-la",
    color: "hsl(var(--app-jesuis))",
  },
  {
    id: "echangeo",
    name: "ÉCHANGEo",
    slug: "echangeo",
    description: "Entraide locale entre voisins",
    path: "/echangeo",
    color: "hsl(var(--app-echangeo))",
  },
];
