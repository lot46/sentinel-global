import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, HandHelping, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  currentLevel: number;
}

const QuickActions = ({ currentLevel }: QuickActionsProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3 sm:grid-cols-3">
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-sentinel/5 hover:border-sentinel/30">
          <ShieldCheck className="w-5 h-5 text-sentinel" />
          Je me sens en sécurité
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-level2/5 hover:border-level2/30">
          <HandHelping className="w-5 h-5 text-level2" />
          J'ai besoin d'un appui
        </Button>
        <Link to="/sentinel/sos">
          <Button
            variant="outline"
            className={cn(
              "h-auto py-4 flex flex-col gap-2 text-sm font-medium hover:bg-level4/5 hover:border-level4/30 w-full",
              currentLevel >= 3 && "border-level4/30 bg-level4/5"
            )}
          >
            <AlertTriangle className={cn("w-5 h-5 text-level4", currentLevel >= 3 && "animate-pulse")} />
            Préparer un SOS
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default QuickActions;
