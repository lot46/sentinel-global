import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "@/lib/utils";
import type { MapLayer, MapZone } from "./map-data";
import {
  DEMO_ZONES,
  DEMO_MARKERS,
  DEMO_ROUTES,
  filterZonesEthically,
  offsetPosition,
} from "./map-data";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createColoredIcon(color: string, size: number = 12) {
  return L.divIcon({
    className: "sentinel-marker",
    html: `<div style="
      width: ${size}px; height: ${size}px; 
      background: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

/** Captures click position for contextual info */
function MapClickHandler({ onSelect }: { onSelect: (zone: MapZone | null) => void }) {
  useMapEvents({
    click() {
      onSelect(null);
    },
  });
  return null;
}

interface SentinelMapProps {
  className?: string;
  layers: MapLayer[];
  onZoneSelect?: (zone: MapZone | null) => void;
}

const SentinelMap = ({ className, layers, onZoneSelect }: SentinelMapProps) => {
  const visibleLayerIds = useMemo(
    () => new Set(layers.filter((l) => l.visible).map((l) => l.id)),
    [layers]
  );

  const layerColorMap = useMemo(
    () => Object.fromEntries(layers.map((l) => [l.id, l.color])),
    [layers]
  );

  const ethicalZones = useMemo(() => filterZonesEthically(DEMO_ZONES), []);
  const filteredZones = ethicalZones.filter((z) => visibleLayerIds.has(z.layerId));
  const filteredMarkers = DEMO_MARKERS.filter((m) => visibleLayerIds.has(m.layerId));
  const filteredRoutes = DEMO_ROUTES.filter((r) => visibleLayerIds.has(r.layerId));

  const handleZoneClick = (zone: MapZone) => {
    onZoneSelect?.(zone);
  };

  return (
    <div className={cn("relative", className)} style={{ minHeight: 340 }}>
      <MapContainer
        center={[48.86, 2.35]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "var(--radius)" }}
      >
        <InvalidateSize />
        <MapClickHandler onSelect={onZoneSelect ?? (() => {})} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Zones (circles) */}
        {filteredZones.map((zone) => {
          const pos =
            zone.layerId === "community"
              ? offsetPosition(zone.position)
              : zone.position;

          return (
            <Circle
              key={zone.id}
              center={pos}
              radius={zone.radius}
              pathOptions={{
                color: layerColorMap[zone.layerId],
                fillColor: layerColorMap[zone.layerId],
                fillOpacity: 0.12,
                weight: 1.5,
              }}
              eventHandlers={{
                click: () => handleZoneClick(zone),
              }}
            >
              <Popup>
                <div className="text-xs space-y-1 max-w-[220px]">
                  <strong className="block text-sm leading-tight">{zone.name}</strong>
                  {zone.detail && <p className="text-muted-foreground">{zone.detail}</p>}
                  {zone.expiresAt && (
                    <p className="opacity-60">
                      Expire le{" "}
                      {new Date(zone.expiresAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                  {zone.source && (
                    <p className="opacity-60">Source : {zone.source}</p>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Markers */}
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createColoredIcon(layerColorMap[marker.layerId], 14)}
          >
            <Popup>
              <div className="text-xs space-y-1 max-w-[220px]">
                <strong className="block text-sm leading-tight">{marker.name}</strong>
                <p className="opacity-70 font-medium">{marker.type}</p>
                {marker.detail && <p className="text-muted-foreground">{marker.detail}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Itineraries (polylines) */}
        {filteredRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.points}
            pathOptions={{
              color: layerColorMap[route.layerId],
              weight: 4,
              opacity: 0.7,
              dashArray: "8, 6",
            }}
          >
            <Popup>
              <div className="text-xs space-y-1 max-w-[220px]">
                <strong className="block text-sm leading-tight">{route.name}</strong>
                {route.detail && <p className="text-muted-foreground">{route.detail}</p>}
                <p className="opacity-60 text-[10px]">
                  Itinéraire indicatif — conditions réelles à vérifier
                </p>
              </div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>

      {/* Live legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 px-3 py-2 max-w-[200px]">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Légende
        </p>
        <div className="space-y-1">
          {layers
            .filter((l) => l.visible)
            .map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-[10px] text-foreground/80 leading-tight">
                  {l.label}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SentinelMap;
