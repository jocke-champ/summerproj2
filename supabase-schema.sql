-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    checklist JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS shopping_lists_created_at_idx ON public.shopping_lists(created_at DESC);
CREATE INDEX IF NOT EXISTS shopping_lists_updated_at_idx ON public.shopping_lists(updated_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now (since we're not using auth)
-- In a production environment, you'd want more restrictive policies
CREATE POLICY "Allow all operations on projects" ON public.projects
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on shopping_lists" ON public.shopping_lists
    FOR ALL USING (true) WITH CHECK (true);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER handle_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_shopping_lists_updated_at
    BEFORE UPDATE ON public.shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some example data (optional)
INSERT INTO public.projects (title, description, checklist, progress) VALUES
('Sommarstuga renovering', 'Renovering av köket och vardagsrummet', 
 '[
   {"id": "1", "text": "Planera köksdesign", "completed": true, "createdAt": "2024-01-15T10:00:00.000Z"},
   {"id": "2", "text": "Köpa material", "completed": false, "createdAt": "2024-01-15T10:05:00.000Z"},
   {"id": "3", "text": "Installera skåp", "completed": false, "createdAt": "2024-01-15T10:10:00.000Z"}
 ]'::jsonb, 33),
('Trädgårdsarbete', 'Plantera och ordna trädgården för sommaren',
 '[
   {"id": "4", "text": "Köpa plantor", "completed": true, "createdAt": "2024-01-16T09:00:00.000Z"},
   {"id": "5", "text": "Plantera blommor", "completed": true, "createdAt": "2024-01-16T09:05:00.000Z"},
   {"id": "6", "text": "Bygga plank", "completed": false, "createdAt": "2024-01-16T09:10:00.000Z"}
 ]'::jsonb, 67);

INSERT INTO public.shopping_lists (name, items) VALUES
('Veckohandling', 
 '[
   {"id": "1", "name": "Mjölk", "quantity": "2L", "category": "Mejeri", "completed": false, "addedBy": "Joakim", "createdAt": "2024-01-15T12:00:00.000Z"},
   {"id": "2", "name": "Bananer", "category": "Frukt & Grönt", "completed": true, "addedBy": "Eva", "createdAt": "2024-01-15T12:05:00.000Z"},
   {"id": "3", "name": "Pasta", "quantity": "500g", "category": "Torrvaror", "completed": false, "addedBy": "Hanna", "createdAt": "2024-01-15T12:10:00.000Z"}
 ]'::jsonb),
('Festmiddag', 
 '[
   {"id": "4", "name": "Lax", "quantity": "1kg", "category": "Kött & Fisk", "completed": false, "addedBy": "Gustav", "createdAt": "2024-01-16T15:00:00.000Z"},
   {"id": "5", "name": "Vitt vin", "category": "Övrigt", "completed": false, "addedBy": "Jan", "createdAt": "2024-01-16T15:05:00.000Z"}
 ]'::jsonb); 