import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsSection } from "./CommentsSection";
import { UploadsSection } from "./UploadsSection";
import { SummarySection } from "./SummarySection";

interface ProjectDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export function ProjectDetailView({ open, onOpenChange, projectId, projectName }: ProjectDetailViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{projectName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="space-y-4">
            <CommentsSection projectId={projectId} />
          </TabsContent>
          <TabsContent value="uploads">
            <UploadsSection projectId={projectId} />
          </TabsContent>
          <TabsContent value="summary">
            <SummarySection projectId={projectId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
