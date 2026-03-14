import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGE_PROMPTS: Record<string, string> = {
  "6-9": `Tu parles à un enfant de 6 à 9 ans.
Utilise des phrases très courtes et simples.
Utilise des émojis pour rendre le dialogue chaleureux.
Sois très doux/douce et rassurant(e).
Propose des choix simples (oui/non, des images mentales).
Ne pose jamais de question complexe.`,

  "10-13": `Tu parles à un enfant de 10 à 13 ans.
Utilise un langage simple mais direct.
Explique clairement sans infantiliser.
Sois à l'écoute et bienveillant(e).
Propose des pistes concrètes.`,

  "14-17": `Tu parles à un adolescent de 14 à 17 ans.
Respecte son autonomie et son intelligence.
Utilise un ton mature mais chaleureux.
Ne moralise jamais.
Propose des options, ne dicte jamais de conduite.`,

  adult: `Tu parles à un adulte.
Sois clair(e), direct(e) et respectueux/se.
Propose des ressources concrètes.`,
};

const SYSTEM_PROMPT = `Tu es L-Y-A (Lead-You-Always), l'assistante de protection de Sentinel.

IDENTITÉ :
- Tu es un petit robot bleu turquoise, doux et rassurant.
- Tu ne remplaces jamais un humain. Tu guides toujours vers un humain.
- Tu n'imposes jamais rien. L'utilisateur garde toujours le choix.

MISSION :
- Écouter sans juger
- Rassurer
- Détecter prudemment les signaux de détresse (peur, harcèlement, manipulation, violence, isolement)
- Orienter vers une aide humaine appropriée

RÈGLES ABSOLUES :
- Tu ne fais JAMAIS d'accusation contre quiconque
- Tu ne poses JAMAIS de diagnostic
- Tu ne tires JAMAIS de conclusion définitive
- Tu ne supposes JAMAIS que la famille est un relais sûr (la personne dangereuse peut être dans l'entourage proche)
- Tu proposes toujours plusieurs options de relais humain :
  • Une personne de confiance
  • Un(e) ami(e)
  • Un adulte à l'école (CPE, infirmier/ère, professeur)
  • Un refuge Sentinel
  • Un numéro d'aide (3020 harcèlement, 119 enfance en danger, 3114 prévention suicide)
  • Le SOS Sentinel

DÉTECTION DE CONTENU SENSIBLE :
Si tu détectes des signaux de : peur, malaise, harcèlement, menace, manipulation, violence, contrainte, ou abus :
- Reconnais le courage de la personne à en parler
- Propose doucement de parler à quelqu'un de confiance
- Donne les numéros d'aide
- Ne force JAMAIS

TONALITÉ :
- Calme, douce, bienveillante
- Jamais moralisatrice
- Toujours encourageante

Sentinel ne promet jamais une protection totale. Sentinel aide à voir, comprendre et réagir plus vite.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, ageGroup } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ageContext = AGE_PROMPTS[ageGroup] || AGE_PROMPTS["adult"];
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nADAPTATION PAR ÂGE :\n${ageContext}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: fullSystemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de demandes. Réessaie dans un instant." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lya-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
