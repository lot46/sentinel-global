import { Link } from "react-router-dom";
import { APPS } from "@/packages/types";
import { Shield, Heart, Handshake } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  sentinel: <Shield className="w-6 h-6" />,
  "je-suis-la": <Heart className="w-6 h-6" />,
  echangeo: <Handshake className="w-6 h-6" />,
};

const colorClasses: Record<string, string> = {
  sentinel: "text-sentinel bg-sentinel/10 hover:bg-sentinel/20 border-sentinel/20",
  "je-suis-la": "text-jesuis bg-jesuis/10 hover:bg-jesuis/20 border-jesuis/20",
  echangeo: "text-echangeo bg-echangeo/10 hover:bg-echangeo/20 border-echangeo/20",
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full space-y-16 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Sentinel Global
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Trois outils citoyens. Un même objectif : veiller les uns sur les autres.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {APPS.map((app) => (
              <Link
                key={app.id}
                to={app.path}
                className={`group rounded-xl border p-6 text-left transition-all ${colorClasses[app.slug]}`}
              >
                <div className="mb-4">{icons[app.slug]}</div>
                <h2 className="font-semibold text-foreground mb-1">{app.name}</h2>
                <p className="text-sm text-muted-foreground leading-snug">
                  {app.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Sentinel Global — Écosystème citoyen
      </footer>
    </div>
  );
};

export default Index;
