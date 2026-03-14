import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  CloudRain,
  Volume2,
  Eye,
  Home,
  Car,
  Users,
  Database,
} from "lucide-react";
import type { MapLayer } from "./map-data";

const iconMap: Record<string, React.ElementType> = {
  CloudRain,
  Volume2,
  Eye,
  Home,
  Car,
  Users,
  Database,
};

interface MapLayerPanelProps {
  layers: MapLayer[];
  onToggle: (layerId: string) => void;
}

const MapLayerPanel = ({ layers, onToggle }: MapLayerPanelProps) => {
  const activeCount = layers.filter((l) => l.visible).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          Couches d'information
          <span className="text-xs font-normal text-muted-foreground">
            {activeCount}/{layers.length} actives
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {layers.map((layer) => {
          const Icon = iconMap[layer.icon] || Database;
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <span
                className="flex-shrink-0 w-3 h-3 rounded-full transition-opacity"
                style={{
                  backgroundColor: layer.color,
                  opacity: layer.visible ? 1 : 0.2,
                }}
              />
              <Icon
                className="w-4 h-4 flex-shrink-0 transition-opacity"
                style={{ color: layer.color, opacity: layer.visible ? 1 : 0.3 }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ opacity: layer.visible ? 1 : 0.5 }}>
                  {layer.label}
                </p>
              </div>
              <Switch
                checked={layer.visible}
                onCheckedChange={() => onToggle(layer.id)}
                className="scale-75"
              />
            </button>
          );
        })}

        <p className="text-[10px] text-muted-foreground/60 pt-2 leading-relaxed">
          Sources : données de démonstration. En production, données issues de 
          Géorisques, data.gouv.fr et signalements communautaires anonymisés.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapLayerPanel;
