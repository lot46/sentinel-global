import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue with bundlers
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ZonePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  type: "safe" | "watch" | "alert";
}

const DEMO_ZONES: ZonePoint[] = [
  { id: "1", name: "Zone éclairée — Centre-ville", lat: 48.8566, lng: 2.3522, radius: 400, type: "safe" },
  { id: "2", name: "Point d'appui — Gare du Nord", lat: 48.8809, lng: 2.3553, radius: 250, type: "safe" },
  { id: "3", name: "Zone de vigilance — Barbès", lat: 48.8840, lng: 2.3495, radius: 300, type: "watch" },
  { id: "4", name: "Zone éclairée — Bastille", lat: 48.8533, lng: 2.3695, radius: 350, type: "safe" },
  { id: "5", name: "Point d'appui — République", lat: 48.8675, lng: 2.3638, radius: 200, type: "safe" },
];

const zoneColors: Record<string, string> = {
  safe: "hsl(220, 70%, 50%)",
  watch: "hsl(38, 92%, 50%)",
  alert: "hsl(0, 72%, 51%)",
};

const zoneFills: Record<string, string> = {
  safe: "hsl(220, 70%, 50%)",
  watch: "hsl(38, 92%, 50%)",
  alert: "hsl(0, 72%, 51%)",
};

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

interface SentinelMapProps {
  className?: string;
}

const SentinelMap = ({ className }: SentinelMapProps) => {
  return (
    <div className={className} style={{ minHeight: 340 }}>
      <MapContainer
        center={[48.8626, 2.3555]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "var(--radius)" }}
      >
        <InvalidateSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {DEMO_ZONES.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={{
              color: zoneColors[zone.type],
              fillColor: zoneFills[zone.type],
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{zone.name}</strong>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default SentinelMap;
