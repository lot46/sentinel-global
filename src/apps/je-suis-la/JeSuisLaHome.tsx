import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const JeSuisLaHome = () => {
  return (
    <AppShell appName="Je suis là">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6">
        <div className="max-w-lg text-center space-y-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-jesuis/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-jesuis" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Je suis là</h1>
            <p className="text-muted-foreground leading-relaxed">
              Un signal simple pour dire « tout va bien ». Pour que personne ne reste invisible.
            </p>
          </div>
          <Button size="lg" className="bg-jesuis hover:bg-jesuis/90 text-jesuis-foreground">
            Envoyer mon signal
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default JeSuisLaHome;
