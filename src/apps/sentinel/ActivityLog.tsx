import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Activity, Heart, Clock } from "lucide-react";

const activityItems = [
  { time: "14:32", label: "Signal de sécurité enregistré", icon: ShieldCheck },
  { time: "11:15", label: "Niveau de vigilance consulté", icon: Activity },
  { time: "08:00", label: "Retour au calme confirmé", icon: Heart },
];

const ActivityLog = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Activité récente</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {activityItems.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </span>
            <span className="flex-1 text-foreground">{item.label}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default ActivityLog;
