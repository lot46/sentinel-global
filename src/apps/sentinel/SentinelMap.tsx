import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "@/lib/utils";
import type { MapLayer } from "./map-data";
import { DEMO_ZONES, DEMO_MARKERS, filterZonesEthically, offsetPosition } from "./map-data";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createColoredIcon(color: string) {
  return L.divIcon({
    className: "sentinel-marker",
    html: `<div style="
      width: 12px; height: 12px; 
      background: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

interface SentinelMapProps {
  className?: string;
  layers: MapLayer[];
}

const SentinelMap = ({ className, layers }: SentinelMapProps) => {
  const visibleLayerIds = useMemo(
    () => new Set(layers.filter((l) => l.visible).map((l) => l.id)),
    [layers]
  );

  const layerColorMap = useMemo(
    () => Object.fromEntries(layers.map((l) => [l.id, l.color])),
    [layers]
  );

  // Apply ethical filtering
  const ethicalZones = useMemo(() => filterZonesEthically(DEMO_ZONES), []);
  const filteredZones = ethicalZones.filter((z) => visibleLayerIds.has(z.layerId));
  const filteredMarkers = DEMO_MARKERS.filter((m) => visibleLayerIds.has(m.layerId));

  return (
    <div className={cn("relative", className)} style={{ minHeight: 340 }}>
      <MapContainer
        center={[48.8600, 2.3500]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "var(--radius)" }}
      >
        <InvalidateSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {filteredZones.map((zone) => {
          // Offset community presence positions for privacy
          const pos = zone.layerId === "community"
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
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <strong className="block text-sm">{zone.name}</strong>
                  {zone.detail && <p>{zone.detail}</p>}
                  {zone.expiresAt && (
                    <p className="opacity-60">Expire le {new Date(zone.expiresAt).toLocaleDateString("fr-FR")}</p>
                  )}
                  {zone.source && (
                    <p className="opacity-60">Source : {zone.source}</p>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}

        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createColoredIcon(layerColorMap[marker.layerId])}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <strong className="block text-sm">{marker.name}</strong>
                <p className="opacity-60">{marker.type}</p>
                {marker.detail && <p>{marker.detail}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SentinelMap;
