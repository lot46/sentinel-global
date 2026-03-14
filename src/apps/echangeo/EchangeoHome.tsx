import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

const EchangeoHome = () => {
  return (
    <AppShell appName="ÉCHANGEo">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6">
        <div className="max-w-lg text-center space-y-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-echangeo/10 flex items-center justify-center">
            <Handshake className="w-8 h-8 text-echangeo" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">ÉCHANGEo</h1>
            <p className="text-muted-foreground leading-relaxed">
              Donner, demander, échanger. L'entraide de proximité, simplement.
            </p>
          </div>
          <Button size="lg" className="bg-echangeo hover:bg-echangeo/90 text-echangeo-foreground">
            Découvrir les échanges
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default EchangeoHome;
