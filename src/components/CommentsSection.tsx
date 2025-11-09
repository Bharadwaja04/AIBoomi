import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

interface Comment {
  id: string;
  author: string;
  comment: string;
  timestamp: string | null;
  created_at: string;
}

interface CommentsSectionProps {
  projectId: string;
}

export function CommentsSection({ projectId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert({
        project_id: projectId,
        author,
        comment,
        timestamp: timestamp || null,
      });

      if (error) throw error;

      toast.success("Comment added successfully!");
      setAuthor("");
      setComment("");
      setTimestamp("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timestamp">Timestamp (optional)</Label>
            <Input
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g., 2:30 PM"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment">Comment *</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your feedback here..."
            rows={4}
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">All Comments</h3>
        {comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Add the first one!</p>
        ) : (
          comments.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.author}</CardTitle>
                <CardDescription>
                  {c.timestamp && `${c.timestamp} • `}
                  {format(new Date(c.created_at), "MMM dd, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{c.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
