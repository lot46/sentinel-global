import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, X, Info, Shield } from "lucide-react";
import type { MapZone } from "./map-data";
import { cn } from "@/lib/utils";

interface MapContextCardProps {
  zone: MapZone | null;
  onClose: () => void;
  threatLevel: number;
}

const LAYER_LABELS: Record<string, string> = {
  "env-flood": "Risque environnemental",
  "env-fire": "Risque environnemental",
  "env-storm": "Risque environnemental",
  "env-pollution": "Risque environnemental",
  "env-noise": "Inconfort environnemental",
  "env-lighting": "Attention environnementale",
  "vigilance": "Vigilance communautaire",
  "attention": "Zone d'attention",
  "temp-critical": "Zone critique temporaire",
  "community": "Présence communautaire",
  "refuges-fixed": "Zone éclairée",
  "refuges-mobile": "Zone éclairée",
  "support-points": "Point d'appui",
};

const MapContextCard = ({ zone, onClose, threatLevel }: MapContextCardProps) => {
  if (!zone) return null;

  const categoryLabel = LAYER_LABELS[zone.layerId] || "Information";
  const isRisk = zone.layerId.startsWith("env-") || zone.layerId === "vigilance" || zone.layerId === "attention" || zone.layerId === "temp-critical";

  return (
    <Card className={cn(
      "border transition-all duration-300 animate-in slide-in-from-bottom-2",
      isRisk ? "border-level2/30 bg-level2/[0.03]" : "border-sentinel/30 bg-sentinel/[0.03]"
    )}>
      <CardContent className="pt-4 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium",
                  isRisk ? "border-level2/40 text-level2" : "border-sentinel/40 text-sentinel"
                )}
              >
                {categoryLabel}
              </Badge>
              {zone.source && (
                <Badge variant="secondary" className="text-[10px] font-normal">
                  {zone.source}
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-semibold leading-tight">{zone.name}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {zone.detail && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {zone.detail}
          </p>
        )}

        {zone.expiresAt && (
          <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Expire le {new Date(zone.expiresAt).toLocaleDateString("fr-FR")}
          </p>
        )}

        {/* L-Y-A contextual assistance */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-sentinel" />
            <span className="text-[11px] font-semibold text-foreground">Assistance L-Y-A</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            {isRisk
              ? "L-Y-A peut vous guider selon votre position et le niveau de vigilance actuel."
              : "L-Y-A peut vous orienter vers ce point d'appui et vous accompagner."
            }
          </p>
          <Link to="/sentinel/lya">
            <Button variant="outline" size="sm" className="w-full h-7 text-xs border-sentinel/20 hover:bg-sentinel/5">
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Parler à L-Y-A
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-[9px] text-muted-foreground/50 leading-relaxed flex items-start gap-1">
          <Shield className="w-3 h-3 flex-shrink-0 mt-0.5" />
          Information indicative à des fins d'anticipation. Ne constitue ni un jugement ni une qualification du lieu.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapContextCard;
