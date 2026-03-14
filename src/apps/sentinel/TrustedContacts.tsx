import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppShell from "@/packages/ui/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, Mail, Phone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrustedContact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  relationship: string | null;
  is_verified: boolean;
}

const TrustedContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", relationship: "" });

  const fetchContacts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trusted_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at");
    setContacts((data as TrustedContact[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, [user]);

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;

    if (!form.email.trim() && !form.phone.trim()) {
      toast({ title: "Erreur", description: "Email ou téléphone requis.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("trusted_contacts").insert({
      user_id: user.id,
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      relationship: form.relationship.trim() || null,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: error.message.includes("Maximum") ? "Maximum 5 contacts de confiance." : error.message,
        variant: "destructive",
      });
    } else {
      setForm({ name: "", phone: "", email: "", relationship: "" });
      setShowForm(false);
      fetchContacts();
      toast({ title: "Contact ajouté", description: `${form.name} a été ajouté à votre cercle de confiance.` });
    }
  };

  const removeContact = async (id: string, name: string) => {
    await supabase.from("trusted_contacts").delete().eq("id", id);
    fetchContacts();
    toast({ title: "Contact retiré", description: `${name} a été retiré de votre cercle.` });
  };

  return (
    <AppShell appName="Sentinel">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sentinel/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-sentinel" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Cercle de confiance</h1>
              <p className="text-xs text-muted-foreground">3 à 5 contacts alertés en cas de SOS</p>
            </div>
          </div>
        </header>

        {/* Contact list */}
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Chargement...</div>
        ) : contacts.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="py-8 text-center space-y-3">
              <Users className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Aucun contact de confiance. Ajoutez des personnes qui seront alertées en cas de SOS.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <Card key={c.id}>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sentinel/10 flex items-center justify-center text-sentinel text-sm font-semibold">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {c.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                      {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                      {c.relationship && <span>· {c.relationship}</span>}
                    </div>
                  </div>
                  <Badge variant={c.is_verified ? "default" : "outline"} className="text-[10px]">
                    {c.is_verified ? "Vérifié" : "En attente"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeContact(c.id, c.name)}
                    aria-label={`Retirer ${c.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Ajouter un contact</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addContact} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Prénom Nom" required maxLength={100} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Relation</Label>
                    <Input value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="Parent, ami, voisin..." maxLength={50} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@email.com" maxLength={255} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Téléphone</Label>
                    <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+33 6 ..." maxLength={20} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <AlertCircle className="w-3 h-3" />
                  Email ou téléphone requis. Ces contacts seront alertés en cas de SOS.
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Annuler</Button>
                  <Button type="submit" size="sm" className="bg-sentinel hover:bg-sentinel/90">Ajouter</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          contacts.length < 5 && (
            <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un contact de confiance ({contacts.length}/5)
            </Button>
          )
        )}

        <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
          Vos contacts ne sont jamais partagés avec des tiers. Ils ne seront contactés qu'en cas de SOS activé par vous.
        </p>
      </div>
    </AppShell>
  );
};

export default TrustedContacts;
