import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, X, Info, Shield, MapPin } from "lucide-react";
import type { MapZone } from "./map-data";
import { cn } from "@/lib/utils";

interface MapContextCardProps {
  zone: MapZone | null;
  onClose: () => void;
  threatLevel: number;
}

/** Labels aligned with REFERENTIEL.md V1 vocabulary */
const LAYER_LABELS: Record<string, string> = {
  "env-flood": "Vigilance environnementale",
  "env-fire": "Vigilance environnementale",
  "env-storm": "Vigilance environnementale",
  "env-pollution": "Inconfort environnemental",
  "env-noise": "Inconfort environnemental",
  "env-lighting": "Zone d'attention — Éclairage",
  "signalements": "Zone à signalements convergents",
  "faible-reassurance": "Zone à faible réassurance",
  "community": "Présence communautaire",
  "refuges-fixed": "Zone éclairée — Refuge fixe",
  "refuges-mobile": "Zone éclairée — Refuge mobile",
  "support-points": "Service utile à proximité",
};

const MapContextCard = ({ zone, onClose, threatLevel }: MapContextCardProps) => {
  if (!zone) return null;

  const categoryLabel = LAYER_LABELS[zone.layerId] || "Information";
  const isAttention = zone.layerId.startsWith("env-") || zone.layerId === "signalements" || zone.layerId === "faible-reassurance";

  return (
    <Card className={cn(
      "border transition-all duration-300 animate-in slide-in-from-bottom-2",
      isAttention ? "border-level2/30 bg-level2/[0.03]" : "border-sentinel/30 bg-sentinel/[0.03]"
    )}>
      <CardContent className="pt-4 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium",
                  isAttention ? "border-level2/40 text-level2" : "border-sentinel/40 text-sentinel"
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

        {/* RÈGLE ABSOLUE: Always show nearest solution for attention zones */}
        {isAttention && zone.nearestSolution && (
          <div className="bg-sentinel/[0.06] border border-sentinel/20 rounded-lg p-2.5 flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-sentinel flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground leading-relaxed">
              <span className="font-medium">Solution proche : </span>
              {zone.nearestSolution}
            </p>
          </div>
        )}

        {/* L-Y-A contextual assistance */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-sentinel" />
            <span className="text-[11px] font-semibold text-foreground">Aide humaine proche — L-Y-A</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            {isAttention
              ? "L-Y-A peut t'orienter vers un refuge, un service utile ou un contact de confiance."
              : "L-Y-A peut t'accompagner et t'orienter vers ce point d'appui."
            }
          </p>
          <Link to="/sentinel/lya">
            <Button variant="outline" size="sm" className="w-full h-7 text-xs border-sentinel/20 hover:bg-sentinel/5">
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Parler à L-Y-A
            </Button>
          </Link>
        </div>

        {/* Disclaimer — no forbidden vocabulary */}
        <p className="text-[9px] text-muted-foreground/50 leading-relaxed flex items-start gap-1">
          <Shield className="w-3 h-3 flex-shrink-0 mt-0.5" />
          Information indicative à des fins d'anticipation. Ne constitue ni un jugement ni une qualification du lieu.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapContextCard;
