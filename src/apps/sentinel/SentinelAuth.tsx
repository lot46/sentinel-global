import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SentinelAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, displayName || undefined);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (isLogin) {
      navigate("/sentinel");
    } else {
      toast({
        title: "Compte créé",
        description: "Vérifiez votre email pour confirmer votre inscription.",
      });
    }
  };

  return (
    <AppShell appName="Sentinel">
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-sentinel/10 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-sentinel" />
            </div>
            <CardTitle className="text-xl">
              {isLogin ? "Connexion à Sentinel" : "Créer un compte Sentinel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom affiché</Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre prénom"
                    maxLength={100}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  maxLength={128}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-sentinel hover:bg-sentinel/90" disabled={loading}>
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer mon compte"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                {" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                  className="text-sentinel hover:underline font-medium"
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </p>
            </form>

            <p className="text-[10px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
              Sentinel ne vend pas vos données. Aucune publicité.
              <br />
              <Link to="/sentinel/transparence" className="text-sentinel hover:underline">
                Politique de transparence →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SentinelAuth;
