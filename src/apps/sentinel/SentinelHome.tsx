import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const SentinelHome = () => {
  return (
    <AppShell appName="Sentinel">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6">
        <div className="max-w-lg text-center space-y-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sentinel/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-sentinel" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Sentinel</h1>
            <p className="text-muted-foreground leading-relaxed">
              Veiller ensemble. Alerter quand il le faut. Protéger ceux qui nous entourent.
            </p>
          </div>
          <Button size="lg" className="bg-sentinel hover:bg-sentinel/90 text-sentinel-foreground">
            Accéder à Sentinel
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default SentinelHome;
