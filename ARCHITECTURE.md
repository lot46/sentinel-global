# Sentinel Global Architecture

## Objectif
Ce dépôt devient le socle technique de l’écosystème Sentinel Global.

Applications prévues :

- Sentinel
- Je suis là
- ÉCHANGEo

## Structure cible

apps/
  sentinel/
  je-suis-la/
  echangeo/

packages/
  ui/
  auth/
  services/
  design-system/

infrastructure/
  database/
  api/
  config/

## Règles
- conserver une identité visuelle commune
- mutualiser l’authentification
- mutualiser les composants UI
- mutualiser les services techniques
- garder une logique métier séparée pour chaque application
