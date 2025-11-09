-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  client TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  comment TEXT NOT NULL,
  timestamp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create summaries table
CREATE TABLE public.summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  priority TEXT NOT NULL,
  combined_comments JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for project uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project_uploads', 'project_uploads', true);

-- RLS Policies - Making all data publicly accessible as requested
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone on projects
CREATE POLICY "Allow all operations on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on uploads" ON public.uploads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on summaries" ON public.summaries FOR ALL USING (true) WITH CHECK (true);

-- Storage policies for public access
CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project_uploads');
CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'project_uploads');
CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE USING (bucket_id = 'project_uploads');