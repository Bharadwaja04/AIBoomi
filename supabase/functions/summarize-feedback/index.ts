import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all comments for the project
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("project_id", projectId);

    if (commentsError) throw commentsError;

    if (!comments || comments.length === 0) {
      return new Response(
        JSON.stringify({ error: "No comments found for this project" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare comments text for AI
    const commentsText = comments
      .map((c) => `${c.author} (${c.timestamp || "no timestamp"}): ${c.comment}`)
      .join("\n\n");

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a project feedback analyzer. Analyze the provided client feedback comments and create a structured summary. Return your response in this JSON format:
{
  "summary": "A comprehensive summary of all feedback in 2-3 sentences",
  "priority": "high/medium/low based on urgency of feedback",
  "combined_comments": ["key point 1", "key point 2", "key point 3"]
}`,
          },
          {
            role: "user",
            content: `Analyze these project feedback comments:\n\n${commentsText}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    // Parse AI response
    let parsedResponse;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiContent.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      parsedResponse = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      // Fallback: create a basic structure
      parsedResponse = {
        summary: aiContent,
        priority: "medium",
        combined_comments: comments.map(c => c.comment).slice(0, 5)
      };
    }

    // Save summary to database
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .insert({
        project_id: projectId,
        summary: parsedResponse.summary,
        priority: parsedResponse.priority,
        combined_comments: parsedResponse.combined_comments || [],
      })
      .select()
      .single();

    if (summaryError) throw summaryError;

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in summarize-feedback function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
