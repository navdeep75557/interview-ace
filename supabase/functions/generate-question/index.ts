import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role, experienceLevel } = await req.json();

    const roleDescriptions: Record<string, string> = {
      frontend: "Frontend Developer focusing on React, TypeScript, CSS, and UI/UX",
      backend: "Backend Developer focusing on Node.js, APIs, databases, and system design",
      fullstack: "Full Stack Developer covering both frontend and backend technologies"
    };

    const levelDescriptions: Record<string, string> = {
      beginner: "entry-level with 0-2 years experience",
      intermediate: "mid-level with 2-5 years experience",
      advanced: "senior-level with 5+ years experience"
    };

    const prompt = `You are an expert technical interviewer. Generate a single interview question for a ${roleDescriptions[role]} position at the ${levelDescriptions[experienceLevel]} level.

The question should:
- Be specific and technical
- Test real-world problem-solving skills
- Be appropriate for the experience level
- Be challenging but fair

Return ONLY the question text, nothing else. Do not include any preamble or explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert technical interviewer for software engineering positions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const question = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ question }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating question:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
