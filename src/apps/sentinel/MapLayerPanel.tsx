import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CloudRain,
  Volume2,
  Eye,
  Home,
  Car,
  Users,
  Database,
  HandHelping,
  Waves,
  Flame,
  CloudLightning,
  Wind,
  Moon,
  AlertTriangle,
  Clock,
  Route,
} from "lucide-react";
import type { MapLayer } from "./map-data";
import { LAYER_CATEGORIES } from "./map-data";

const iconMap: Record<string, React.ElementType> = {
  CloudRain,
  Volume2,
  Eye,
  Home,
  Car,
  Users,
  Database,
  HandHelping,
  Waves,
  Flame,
  CloudLightning,
  Wind,
  Moon,
  AlertTriangle,
  Clock,
  Route,
};

interface MapLayerPanelProps {
  layers: MapLayer[];
  onToggle: (layerId: string) => void;
}

const MapLayerPanel = ({ layers, onToggle }: MapLayerPanelProps) => {
  const activeCount = layers.filter((l) => l.visible).length;

  // Group layers by category
  const categories = Object.entries(LAYER_CATEGORIES);
  const grouped = categories.map(([catId, cat]) => ({
    ...cat,
    id: catId,
    layers: layers.filter((l) => l.category === catId),
  })).filter(g => g.layers.length > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          Couches d'information
          <Badge variant="outline" className="text-[10px] font-normal">
            {activeCount}/{layers.length} actives
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {grouped.map((group) => (
          <div key={group.id} className="space-y-1">
            <div className="flex items-center gap-2 pb-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            </div>

            {group.layers.map((layer) => {
              const Icon = iconMap[layer.icon] || Database;
              return (
                <button
                  key={layer.id}
                  onClick={() => onToggle(layer.id)}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                >
                  <span
                    className="flex-shrink-0 w-2.5 h-2.5 rounded-full transition-opacity"
                    style={{
                      backgroundColor: layer.color,
                      opacity: layer.visible ? 1 : 0.2,
                    }}
                  />
                  <Icon
                    className="w-3.5 h-3.5 flex-shrink-0 transition-opacity"
                    style={{ color: layer.color, opacity: layer.visible ? 1 : 0.3 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate transition-opacity"
                      style={{ opacity: layer.visible ? 1 : 0.5 }}
                    >
                      {layer.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 truncate hidden group-hover:block">
                      {layer.description}
                    </p>
                  </div>
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={() => onToggle(layer.id)}
                    className="scale-[0.65]"
                  />
                </button>
              );
            })}
          </div>
        ))}

        <p className="text-[10px] text-muted-foreground/60 pt-2 leading-relaxed border-t border-border/50">
          Sources : données de démonstration. En production, données issues de
          Géorisques, data.gouv.fr, Airparif, Météo-France et signalements communautaires anonymisés.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapLayerPanel;
