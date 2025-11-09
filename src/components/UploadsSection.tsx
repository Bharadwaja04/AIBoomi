import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, FileType, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Upload {
  id: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface UploadsSectionProps {
  projectId: string;
}

export function UploadsSection({ projectId }: UploadsSectionProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    fetchUploads();
  }, [projectId]);

  const fetchUploads = async () => {
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching uploads:", error);
      return;
    }

    setUploads(data || []);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.match(/jpg|jpeg|png/i)) return <Image className="h-5 w-5" />;
    if (fileType === "pdf") return <FileType className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Uploaded Files</h3>
      {uploads.length === 0 ? (
        <p className="text-muted-foreground">No files uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {uploads.map((upload) => (
            <Card key={upload.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(upload.file_type)}
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {upload.file_type.toUpperCase()} File
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {format(new Date(upload.created_at), "MMM dd, yyyy")}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(upload.file_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
              {upload.file_type.match(/jpg|jpeg|png/i) && (
                <CardContent>
                  <img
                    src={upload.file_url}
                    alt="Upload preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
