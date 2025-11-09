import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, MessageSquare, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    client: string;
    deadline_date: string;
  };
  onUpload: () => void;
  onViewComments: () => void;
  onSummarize: () => void;
}

export function ProjectCard({ project, onUpload, onViewComments, onSummarize }: ProjectCardProps) {
  return (
    <div 
      className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      style={{
        background: 'var(--color-dark-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(74, 172, 254, 0.1) 100%)',
          borderRadius: 'var(--radius-xl)',
        }}
      />
      
      {/* Shimmer Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s infinite',
          borderRadius: 'var(--radius-xl)',
        }}
      />

      <CardHeader className="relative pb-3 p-6">
        <CardTitle 
          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {project.name}
        </CardTitle>
        <CardDescription 
          className="font-medium mt-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Client: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{project.client}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-4 px-6">
        {project.description && (
          <p 
            className="text-sm line-clamp-3 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.description}
          </p>
        )}
        <div 
          className="flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(74, 172, 254, 0.1))',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Calendar className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          <span className="font-medium">Due: {format(new Date(project.deadline_date), "MMM dd, yyyy")}</span>
        </div>
      </CardContent>
      
      <CardFooter className="relative flex flex-col gap-3 pt-4 pb-6 px-6">
        <div className="flex gap-3 w-full">
          <button 
            onClick={onUpload}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-dark-hover)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          
          <button 
            onClick={onViewComments}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-dark-hover)';
              e.currentTarget.style.borderColor = 'var(--color-secondary)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </button>
        </div>
        
        <button 
          onClick={onSummarize}
          className="w-full px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group"
          style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-glow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.6), var(--shadow-lg)';
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          <Sparkles className="h-4 w-4" />
          Summarize Feedback
          
          {/* Shimmer overlay */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        </button>
      </CardFooter>
    </div>
  );
}
