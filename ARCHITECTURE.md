# Sentinel Global — Architecture

## Objectif

Écosystème citoyen composé de trois applications partageant un socle technique commun.

## Applications

| App | Chemin | Rôle |
|-----|--------|------|
| **Sentinel** | `/sentinel` | Protection citoyenne et anticipation communautaire |
| **Je suis là** | `/je-suis-la` | Signal de présence pour personnes isolées |
| **ÉCHANGEo** | `/echangeo` | Entraide locale entre voisins |

## Structure

```
src/
├── apps/                    # Logique métier par application
│   ├── sentinel/
│   ├── je-suis-la/
│   └── echangeo/
├── packages/                # Code partagé
│   ├── types/               # Types et constantes communes
│   └── ui/                  # Composants UI partagés (AppShell, etc.)
├── components/ui/           # shadcn/ui (design system de base)
├── pages/                   # Pages globales (Index, NotFound)
└── hooks/                   # Hooks partagés
```

## Design system

- Tokens CSS dans `src/index.css` (HSL)
- Couleurs par app : `--app-sentinel`, `--app-jesuis`, `--app-echangeo`
- Classes Tailwind : `sentinel`, `jesuis`, `echangeo`

## Règles

- Identité visuelle commune via le design system
- Logique métier séparée par app dans `src/apps/`
- Composants partagés dans `src/packages/ui/`
- Authentification et services à mutualiser (à venir)
