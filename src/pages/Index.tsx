import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FolderOpen } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { UploadDialog } from "@/components/UploadDialog";
import { ProjectDetailView } from "@/components/ProjectDetailView";

interface Project {
  id: string;
  name: string;
  description: string | null;
  client: string;
  deadline_date: string;
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }

    setProjects(data || []);
  };



  const handleUpload = (project: Project) => {
    setSelectedProject(project);
    setUploadDialogOpen(true);
  };

  const handleViewComments = (project: Project) => {
    setSelectedProject(project);
    setDetailViewOpen(true);
  };

  const handleSummarize = (project: Project) => {
    setSelectedProject(project);
    setDetailViewOpen(true);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="dashboard">
      <div className="container mx-auto px-4 dashboard-content">
        <div className="dashboard-header">
          <div className="header-text">
            <h1 className="page-title">Feed forward</h1>
            <p className="page-subtitle">
              Manage structured client feedback on projects
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="dashboard-filters">
          <div className="search-box">
            <Search className="search-icon h-4 w-4" />
            <Input
              placeholder="Search projects or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-projects">
            <FolderOpen className="empty-icon h-24 w-24" />
            <h2 className="empty-title">
              {projects.length === 0 ? "No projects yet" : "No projects found"}
            </h2>
            <p className="empty-description">
              {projects.length === 0 
                ? "Create your first project to get started" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {projects.length === 0 && (
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-6"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpload={() => handleUpload(project)}
                onViewComments={() => handleViewComments(project)}
                onSummarize={() => handleSummarize(project)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={fetchProjects}
      />

      {selectedProject && (
        <>
          <UploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            projectId={selectedProject.id}
            onFileUploaded={fetchProjects}
          />
          <ProjectDetailView
            open={detailViewOpen}
            onOpenChange={setDetailViewOpen}
            projectId={selectedProject.id}
            projectName={selectedProject.name}
          />
        </>
      )}
    </div>
  );
};

export default Index;
