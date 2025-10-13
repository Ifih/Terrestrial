-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'researcher')),
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create satellite_images table for storing uploaded satellite imagery
CREATE TABLE IF NOT EXISTS public.satellite_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  capture_date DATE,
  image_type TEXT CHECK (image_type IN ('rgb', 'multispectral', 'infrared')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table for storing ML/DL model predictions
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES public.satellite_images(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL CHECK (model_type IN ('classical_ml', 'cnn_erosion', 'cnn_vegetation', 'segmentation')),
  prediction_data JSONB NOT NULL,
  confidence_score DECIMAL(5, 4),
  degradation_level TEXT CHECK (degradation_level IN ('none', 'low', 'moderate', 'high', 'severe')),
  erosion_detected BOOLEAN,
  vegetation_loss_percentage DECIMAL(5, 2),
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for LLM conversations
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table for storing chat history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table for climate scenario predictions
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  climate_scenario TEXT NOT NULL,
  prediction_data JSONB NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  predicted_for_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for satellite_images
CREATE POLICY "Users can view their own images" ON public.satellite_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images" ON public.satellite_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" ON public.satellite_images
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" ON public.satellite_images
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analysis_results
CREATE POLICY "Users can view their own analysis results" ON public.analysis_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis results" ON public.analysis_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for predictions
CREATE POLICY "Users can view their own predictions" ON public.predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" ON public.predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" ON public.predictions
  FOR DELETE USING (auth.uid() = user_id);
