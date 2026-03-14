import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { ThreatLevel } from "./threat-levels";
import { cn } from "@/lib/utils";

interface ThreatBarProps {
  threat: ThreatLevel;
  currentLevel: number;
  onLevelChange: (level: number) => void;
}

const ThreatBar = ({ threat, currentLevel, onLevelChange }: ThreatBarProps) => (
  <div
    className={cn(
      "border-b px-4 sm:px-6 py-2 flex items-center justify-between text-sm transition-colors duration-500",
      threat.bgClass,
      threat.borderClass
    )}
  >
    <div className="flex items-center gap-2">
      <span
        className={cn("inline-block w-2 h-2 rounded-full animate-pulse", threat.textClass)}
        style={{ backgroundColor: threat.color }}
      />
      <span className={cn("font-medium", threat.textClass)}>Niveau {threat.level}</span>
      <span className="text-muted-foreground hidden sm:inline">— {threat.label}</span>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-[10px] font-normal border-muted-foreground/30 text-muted-foreground">
        Mode démo
      </Badge>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onLevelChange(Math.max(1, currentLevel - 1))} disabled={currentLevel <= 1} aria-label="Diminuer le niveau de vigilance">
        <ChevronDown className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onLevelChange(Math.min(4, currentLevel + 1))} disabled={currentLevel >= 4} aria-label="Augmenter le niveau de vigilance">
        <ChevronUp className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default ThreatBar;
