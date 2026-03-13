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
    const { question, answer, role, experienceLevel } = await req.json();

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Role: ${role} Developer
Experience Level: ${experienceLevel}

Interview Question: ${question}

Candidate's Answer: ${answer}

Please evaluate this answer and provide:
1. A detailed feedback on the answer quality, accuracy, and completeness
2. A score from 0 to 10
3. Specific improvement tips
4. A sample ideal answer

Respond in the following JSON format exactly:
{
  "feedback": "Your detailed feedback here",
  "score": 8,
  "improvementTips": "Specific tips to improve the answer",
  "sampleAnswer": "An ideal answer to this question"
}

Be constructive but honest. Consider the experience level when scoring.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert technical interviewer who provides detailed, constructive feedback. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    const evaluation = JSON.parse(content);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
