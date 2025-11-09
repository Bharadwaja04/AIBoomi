import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onFileUploaded: () => void;
}

export function UploadDialog({ open, onOpenChange, projectId, onFileUploaded }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['.txt', '.pdf', '.jpg', '.jpeg', '.png'];
      const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        toast.error("Invalid file type. Please upload .txt, .pdf, .jpg, or .png files");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("project_uploads")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("project_uploads")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("uploads").insert({
        project_id: projectId,
        file_url: publicUrl,
        file_type: fileExt || "unknown",
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully!");
      onFileUploaded();
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload text, image, or PDF files for this project</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            accept=".txt,.pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="mt-2"
          />
          {file && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {file.name}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
