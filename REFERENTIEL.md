# Sentinel.app — Référentiel officiel des zones, usages et garde-fous

> Document de référence pour tout choix de vocabulaire, de catégorisation et de comportement IA dans Sentinel.
> Ce document est la source de vérité pour les développeurs, les designers et l'IA L-Y-A.

---

## Mission

Sentinel aide à anticiper, comprendre et réduire les situations de vulnérabilité,
en priorité pour les enfants et les adolescents.

- Sentinel **ne surveille pas** les personnes.
- Sentinel **n'accuse personne**.
- Sentinel propose des **repères**, des **relais humains** et des **solutions concrètes**.

---

## Objectif central

**Réduire le temps d'isolement** et **le temps d'orientation vers une aide humaine adaptée.**

---

## Vocabulaire autorisé

| Terme | Usage |
|-------|-------|
| Zone d'attention | Zone identifiée par croisement de facteurs contextuels |
| Zone de vigilance renforcée | Zone avec signalements convergents vérifiés |
| Zone à signalements convergents | Zone avec multiple signalements anonymisés recoupés |
| Zone à faible réassurance | Zone avec peu de présence communautaire ou de refuges |
| Zone d'inconfort environnemental | Bruit, pollution, facteurs urbains |
| Zone éclairée | Refuges, points d'appui, relais accessibles |
| Refuge fixe | Commerce, mairie, pharmacie, école partenaire |
| Refuge mobile | Taxi, ambulance, chauffeur agréé |
| Itinéraire rassurant | Trajet passant par des zones éclairées et des refuges |
| Service utile à proximité | Point d'appui, association, centre d'accueil |
| Aide humaine proche | Contact de confiance, adulte scolaire, numéro d'aide |

---

## Vocabulaire interdit

Ces termes ne doivent **jamais** apparaître dans l'interface, les données ou les réponses de L-Y-A :

- ❌ Zone de deal
- ❌ Zone criminelle
- ❌ Zone de secte
- ❌ Zone dangereuse
- ❌ Surveillance
- ❌ Protection totale
- ❌ Garantie de sécurité

---

## Catégories de zones V1

| # | Catégorie | Identifiant technique | Description |
|---|-----------|----------------------|-------------|
| 1 | Éclairage | `eclairage` | Données d'éclairage public municipal |
| 2 | Bruit | `bruit` | Cartographie sonore urbaine |
| 3 | Météo et vigilance environnementale | `meteo-env` | Risques naturels, pollution, alertes |
| 4 | Services utiles | `services` | Points d'appui, associations, centres |
| 5 | Refuges Sentinel | `refuges` | Refuges fixes et mobiles partenaires |
| 6 | Itinéraires rassurants | `itineraires` | Trajets éclairés avec refuges proches |
| 7 | Zones à faible réassurance | `faible-reassurance` | Peu de présence communautaire ou refuges |
| 8 | Zones à signalements convergents | `signalements` | Signalements anonymisés recoupés (min. 3) |

---

## Populations prioritaires

- Enfants
- Adolescents
- Seniors
- Voyageurs
- Familles

---

## Actions autorisées de L-Y-A

- ✅ Écouter
- ✅ Reformuler
- ✅ Rassurer
- ✅ Proposer des options
- ✅ Orienter vers un humain
- ✅ Aider à trouver un refuge ou un service
- ✅ Suggérer un contact de confiance
- ✅ Proposer le SOS manuel

---

## Actions interdites de L-Y-A

- ❌ Accuser une personne
- ❌ Poser un diagnostic
- ❌ Promettre le secret absolu
- ❌ Promettre une protection totale
- ❌ Contacter automatiquement les autorités sans cadre validé
- ❌ Imposer une conduite

---

## Sources de données admissibles

- Open data publiques (Géorisques, Météo-France, data.gouv.fr, Airparif)
- Données environnementales officielles
- Signalements communautaires filtrés (min. 3 rapports, expiration 14 jours)
- Données internes Sentinel avec garde-fous

---

## Règle absolue

> **Sentinel montre toujours au moins une solution proche quand il affiche une zone d'attention :**
> refuge, service utile, itinéraire rassurant, contact humain, ou numéro d'aide.

---

*Ce document est la référence pour tout le projet Sentinel. Tout terme, toute catégorie et tout comportement IA doit être cohérent avec ce référentiel.*
