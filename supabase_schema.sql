-- Run this in the Supabase SQL Editor to create the materials table

CREATE TABLE public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    raw_content TEXT NOT NULL,
    student_profile TEXT NOT NULL,
    nama_siswa TEXT,
    kelas TEXT,
    mata_pelajaran TEXT,
    strategy TEXT,
    adapted_content TEXT,
    readability_score INTEGER,
    accessibility_score INTEGER,
    strengths JSONB,
    resources JSONB,
    pdf_url TEXT,
    rating BOOLEAN,
    rating_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only see and insert their own materials
CREATE POLICY "Users can insert their own materials" 
    ON public.materials FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own materials" 
    ON public.materials FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials" 
    ON public.materials FOR UPDATE 
    USING (auth.uid() = user_id);
