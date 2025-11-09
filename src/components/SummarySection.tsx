import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Summary {
  id: string;
  summary: string;
  priority: string;
  combined_comments: any;
  created_at: string;
}

interface SummarySectionProps {
  projectId: string;
}

export function SummarySection({ projectId }: SummarySectionProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, [projectId]);

  const fetchSummaries = async () => {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching summaries:", error);
      return;
    }

    setSummaries(data || []);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("summarize-feedback", {
        body: { projectId },
      });

      if (error) throw error;

      toast.success("Feedback summary generated!");
      fetchSummaries();
    } catch (error: any) {
      console.error("Error generating summary:", error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error.message?.includes("402")) {
        toast.error("Payment required. Please add credits to your workspace.");
      } else {
        toast.error("Failed to generate summary");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">AI Summaries</h3>
        <Button onClick={handleGenerateSummary} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
      </div>

      {summaries.length === 0 ? (
        <p className="text-muted-foreground">
          No summaries yet. Click "Generate Summary" to create one.
        </p>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Feedback Summary</CardTitle>
                  <Badge variant={getPriorityColor(summary.priority)}>
                    {summary.priority} Priority
                  </Badge>
                </div>
                <CardDescription>
                  {format(new Date(summary.created_at), "MMM dd, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{summary.summary}</p>
                </div>
                {summary.combined_comments && Array.isArray(summary.combined_comments) && summary.combined_comments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Combined Comments</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {summary.combined_comments.map((comment: any, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {typeof comment === "string" ? comment : JSON.stringify(comment)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
