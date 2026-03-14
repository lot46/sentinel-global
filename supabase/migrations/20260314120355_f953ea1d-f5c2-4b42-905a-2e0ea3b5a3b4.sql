
-- Coffre L-Y-A: secure entries for children to deposit fears/doubts
CREATE TABLE public.coffre_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mode text NOT NULL DEFAULT 'deposit' CHECK (mode IN ('deposit', 'advice', 'help')),
  content text NOT NULL,
  emoji text,
  sensitivity_level integer NOT NULL DEFAULT 0 CHECK (sensitivity_level BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.coffre_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own coffre entries"
  ON public.coffre_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own coffre entries"
  ON public.coffre_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coffre entries"
  ON public.coffre_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view child coffre entries"
  ON public.coffre_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = coffre_entries.user_id
        AND profiles.parent_user_id = auth.uid()
    )
  );

-- Timestamp trigger
CREATE TRIGGER update_coffre_entries_updated_at
  BEFORE UPDATE ON public.coffre_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
