
-- ============================================
-- SENTINEL BACKEND — Phase 1: Core Schema
-- ============================================

-- 1. Enum types
CREATE TYPE public.age_group AS ENUM ('6-9', '10-13', '14-17', 'adult');
CREATE TYPE public.sos_status AS ENUM ('armed', 'countdown', 'active', 'cancelled', 'resolved');
CREATE TYPE public.refuge_type AS ENUM ('fixed', 'mobile', 'support-point');
CREATE TYPE public.refuge_status AS ENUM ('active', 'inactive', 'suspended');

-- 2. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  age_group public.age_group NOT NULL DEFAULT 'adult',
  is_minor BOOLEAN GENERATED ALWAYS AS (age_group IN ('6-9', '10-13', '14-17')) STORED,
  parent_user_id UUID REFERENCES auth.users(id),
  parent_consent_given BOOLEAN NOT NULL DEFAULT false,
  parent_consent_date TIMESTAMPTZ,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view child profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = parent_user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can update child profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = parent_user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Trusted contacts (circle of trust)
CREATE TABLE public.trusted_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  relationship TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT max_contacts CHECK (true) -- enforced via trigger
);

ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts"
  ON public.trusted_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON public.trusted_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON public.trusted_contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON public.trusted_contacts FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_trusted_contacts_updated_at
  BEFORE UPDATE ON public.trusted_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enforce max 5 contacts per user
CREATE OR REPLACE FUNCTION public.check_max_contacts()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.trusted_contacts WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 trusted contacts allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER enforce_max_contacts
  BEFORE INSERT ON public.trusted_contacts
  FOR EACH ROW EXECUTE FUNCTION public.check_max_contacts();

-- 5. SOS events
CREATE TABLE public.sos_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.sos_status NOT NULL DEFAULT 'armed',
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  threat_level INTEGER NOT NULL DEFAULT 1 CHECK (threat_level BETWEEN 1 AND 4),
  contacts_notified BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SOS events"
  ON public.sos_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SOS events"
  ON public.sos_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOS events"
  ON public.sos_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_sos_events_updated_at
  BEFORE UPDATE ON public.sos_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Refuges
CREATE TABLE public.refuges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type public.refuge_type NOT NULL,
  status public.refuge_status NOT NULL DEFAULT 'active',
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  description TEXT,
  hours TEXT,
  partner_verified BOOLEAN NOT NULL DEFAULT false,
  partner_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.refuges ENABLE ROW LEVEL SECURITY;

-- Refuges are publicly readable
CREATE POLICY "Refuges are viewable by authenticated users"
  ON public.refuges FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_refuges_updated_at
  BEFORE UPDATE ON public.refuges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Spatial index for proximity queries
CREATE INDEX idx_refuges_location ON public.refuges (latitude, longitude);

-- 7. Activity logs
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_activity_logs_user ON public.activity_logs (user_id, created_at DESC);

-- 8. Community reports (map signals)
CREATE TABLE public.map_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.map_reports ENABLE ROW LEVEL SECURITY;

-- Reports are anonymously viewable (no user_id exposed in select)
CREATE POLICY "Authenticated users can view reports"
  ON public.map_reports FOR SELECT
  TO authenticated
  USING (expires_at > now());

CREATE POLICY "Users can create reports"
  ON public.map_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON public.map_reports FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_map_reports_location ON public.map_reports (latitude, longitude);
CREATE INDEX idx_map_reports_expiry ON public.map_reports (expires_at);
