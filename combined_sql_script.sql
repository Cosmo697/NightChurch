-- Combined SQL Script for Night Church Database Setup
-- This script sets up:
-- 1. Subscribers table for email signup
-- 2. Puzzle system with gates, riddles, and easter eggs
-- 3. All necessary functions and permissions

-- First ensure the UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================
-- PART 1: SUBSCRIBERS SYSTEM
-- =======================================

-- Create subscribers table if not exists
CREATE TABLE IF NOT EXISTS public.subscribers (
  id          uuid         NOT NULL DEFAULT uuid_generate_v4(),
  email       text         NOT NULL UNIQUE,
  name        text,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert data (subscribe)
DROP POLICY IF EXISTS allow_anonymous_insert ON public.subscribers;
CREATE POLICY allow_anonymous_insert
  ON public.subscribers
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only allow admins to view all subscribers
DROP POLICY IF EXISTS admin_select_subscribers ON public.subscribers;
CREATE POLICY admin_select_subscribers
  ON public.subscribers
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Allow users to see their own subscription (by email)
DROP POLICY IF EXISTS user_select_own_subscription ON public.subscribers;
CREATE POLICY user_select_own_subscription
  ON public.subscribers
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

-- Create function to handle duplicate emails
CREATE OR REPLACE FUNCTION public.handle_new_subscriber()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM public.subscribers WHERE email = NEW.email) THEN
    -- Return existing record instead of inserting
    RETURN NULL;
  END IF;
  
  -- Otherwise proceed with insert
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS handle_new_subscriber_trigger ON public.subscribers;
CREATE TRIGGER handle_new_subscriber_trigger
  BEFORE INSERT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_subscriber();

-- Create a service function for email signup from server-side
CREATE OR REPLACE FUNCTION public.add_subscriber(subscriber_email TEXT, subscriber_name TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_subscriber RECORD;
  new_subscriber RECORD;
  result JSONB;
BEGIN
  -- Check if email already exists
  SELECT * INTO existing_subscriber FROM subscribers WHERE email = subscriber_email;
  
  IF existing_subscriber.id IS NOT NULL THEN
    -- Return existing record
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Email already subscribed',
      'data', jsonb_build_object(
        'id', existing_subscriber.id,
        'email', existing_subscriber.email,
        'created_at', existing_subscriber.created_at
      )
    );
  END IF;
  
  -- Insert new subscriber
  INSERT INTO subscribers (email, name, created_at, updated_at)
  VALUES (subscriber_email, subscriber_name, now(), now())
  RETURNING * INTO new_subscriber;
  
  -- Return success result
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully subscribed',
    'data', jsonb_build_object(
      'id', new_subscriber.id,
      'email', new_subscriber.email,
      'created_at', new_subscriber.created_at
    )
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Error adding subscriber: ' || SQLERRM
  );
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.add_subscriber(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.add_subscriber(TEXT, TEXT) TO authenticated;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Set a basic update trigger to maintain updated_at
CREATE OR REPLACE FUNCTION public.update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subscribers_timestamp ON public.subscribers;
CREATE TRIGGER trigger_update_subscribers_timestamp
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_timestamp();

-- =======================================
-- PART 2: PUZZLE SYSTEM
-- =======================================

-- Create Gate Progress Table
CREATE TABLE IF NOT EXISTS public.gate_progress (
  id            uuid         NOT NULL DEFAULT uuid_generate_v4(),
  user_id       uuid,        -- User ID from auth.users, no foreign key constraint
  anonymous_id  text,        -- For users who haven't created an account yet
  portal_solved boolean      NOT NULL DEFAULT false,
  current_gate  int          NOT NULL DEFAULT 1,
  gates_solved  int[]        NOT NULL DEFAULT '{}',
  last_updated  timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY(id),
  -- Either user_id OR anonymous_id must be provided
  CONSTRAINT user_identifier_check CHECK (
    (user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)
  )
);

-- Create a unique constraint differently to avoid syntax issues
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_progress_idx ON public.gate_progress 
  ((COALESCE(user_id::text, '')) text_ops, (COALESCE(anonymous_id, '')) text_ops);

-- Create Easter Eggs Table (defines all possible eggs in the system)
CREATE TABLE IF NOT EXISTS public.easter_eggs (
  id          uuid         NOT NULL DEFAULT uuid_generate_v4(),
  egg_key     text         NOT NULL UNIQUE, -- identifier used in code
  gate_number int          NOT NULL,
  title       text         NOT NULL,
  description text,
  hint        text,
  PRIMARY KEY(id)
);

-- Create User Egg Discoveries Table
CREATE TABLE IF NOT EXISTS public.egg_discoveries (
  id            uuid         NOT NULL DEFAULT uuid_generate_v4(),
  user_id       uuid,        -- User ID from auth.users, no foreign key constraint
  anonymous_id  text,
  egg_id        uuid         NOT NULL REFERENCES public.easter_eggs(id),
  discovered_at timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY(id),
  -- Either user_id OR anonymous_id must be provided
  CONSTRAINT egg_user_identifier_check CHECK (
    (user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)
  )
);

-- Create a unique constraint differently to avoid syntax issues
CREATE UNIQUE INDEX IF NOT EXISTS unique_egg_discovery_idx ON public.egg_discoveries 
  ((COALESCE(user_id::text, '')) text_ops, (COALESCE(anonymous_id, '')) text_ops, egg_id);

-- Create Riddles Table
CREATE TABLE IF NOT EXISTS public.riddles (
  id          uuid         NOT NULL DEFAULT uuid_generate_v4(),
  gate_number int          NOT NULL UNIQUE,
  title       text         NOT NULL,
  content     text         NOT NULL,
  answer      text         NOT NULL,
  hint        text,
  PRIMARY KEY(id)
);

-- Create User Riddle Solutions Table
CREATE TABLE IF NOT EXISTS public.riddle_solutions (
  id            uuid         NOT NULL DEFAULT uuid_generate_v4(),
  user_id       uuid,        -- User ID from auth.users, no foreign key constraint
  anonymous_id  text,
  riddle_id     uuid         NOT NULL REFERENCES public.riddles(id),
  solved_at     timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY(id),
  -- Either user_id OR anonymous_id must be provided
  CONSTRAINT riddle_user_identifier_check CHECK (
    (user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)
  )
);

-- Create a unique constraint differently to avoid syntax issues
CREATE UNIQUE INDEX IF NOT EXISTS unique_riddle_solution_idx ON public.riddle_solutions 
  ((COALESCE(user_id::text, '')) text_ops, (COALESCE(anonymous_id, '')) text_ops, riddle_id);

-- Enable Row Level Security
ALTER TABLE public.gate_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easter_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.egg_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riddles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riddle_solutions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Gate Progress Policies
DROP POLICY IF EXISTS select_own_progress ON public.gate_progress;
CREATE POLICY select_own_progress
  ON public.gate_progress
  FOR SELECT
  TO public
  USING (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

DROP POLICY IF EXISTS insert_own_progress ON public.gate_progress;
CREATE POLICY insert_own_progress
  ON public.gate_progress
  FOR INSERT
  TO public
  WITH CHECK (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

DROP POLICY IF EXISTS update_own_progress ON public.gate_progress;
CREATE POLICY update_own_progress
  ON public.gate_progress
  FOR UPDATE
  TO public
  USING (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

-- Easter Eggs Policies (all users can see eggs)
DROP POLICY IF EXISTS select_eggs ON public.easter_eggs;
CREATE POLICY select_eggs
  ON public.easter_eggs
  FOR SELECT
  TO public
  USING (true);

-- Egg Discoveries Policies
DROP POLICY IF EXISTS select_own_discoveries ON public.egg_discoveries;
CREATE POLICY select_own_discoveries
  ON public.egg_discoveries
  FOR SELECT
  TO public
  USING (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

DROP POLICY IF EXISTS insert_own_discoveries ON public.egg_discoveries;
CREATE POLICY insert_own_discoveries
  ON public.egg_discoveries
  FOR INSERT
  TO public
  WITH CHECK (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

-- Riddles Policies (all users can see riddles)
DROP POLICY IF EXISTS select_riddles ON public.riddles;
CREATE POLICY select_riddles
  ON public.riddles
  FOR SELECT
  TO public
  USING (true);

-- Riddle Solutions Policies
DROP POLICY IF EXISTS select_own_solutions ON public.riddle_solutions;
CREATE POLICY select_own_solutions
  ON public.riddle_solutions
  FOR SELECT
  TO public
  USING (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

DROP POLICY IF EXISTS insert_own_solutions ON public.riddle_solutions;
CREATE POLICY insert_own_solutions
  ON public.riddle_solutions
  FOR INSERT
  TO public
  WITH CHECK (
    (user_id = auth.uid()) OR 
    (anonymous_id IS NOT NULL AND anonymous_id = (current_setting('request.headers')::json->>'x-anonymous-id'))
  );

-- ===========================================
-- PART 3: HELPER FUNCTIONS FOR PUZZLE SYSTEM
-- ===========================================

-- Check if a user has solved the portal puzzle
CREATE OR REPLACE FUNCTION public.has_solved_portal(
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_solved boolean;
BEGIN
  SELECT portal_solved INTO v_solved
  FROM public.gate_progress
  WHERE (user_id = p_user_id OR anonymous_id = p_anonymous_id)
  LIMIT 1;
  
  RETURN COALESCE(v_solved, false);
END;
$$;

-- Check if a user has solved a specific gate
CREATE OR REPLACE FUNCTION public.has_solved_gate(
  p_gate_number int,
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_solved boolean;
BEGIN
  SELECT p_gate_number = ANY(gates_solved) INTO v_solved
  FROM public.gate_progress
  WHERE (user_id = p_user_id OR anonymous_id = p_anonymous_id)
  LIMIT 1;
  
  RETURN COALESCE(v_solved, false);
END;
$$;

-- Get a user's current gate
CREATE OR REPLACE FUNCTION public.get_current_gate(
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_gate int;
BEGIN
  SELECT current_gate INTO v_current_gate
  FROM public.gate_progress
  WHERE (user_id = p_user_id OR anonymous_id = p_anonymous_id)
  LIMIT 1;
  
  RETURN COALESCE(v_current_gate, 1);
END;
$$;

-- Check an answer for a specific gate
CREATE OR REPLACE FUNCTION public.check_riddle_answer(
  p_gate_number int,
  p_answer text,
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_riddle_id uuid;
  v_correct_answer text;
  v_current_gate int;
  v_progress_id uuid;
  v_gates_solved int[];
BEGIN
  -- Get current gate and progress for this user
  SELECT id, current_gate, gates_solved INTO v_progress_id, v_current_gate, v_gates_solved
  FROM public.gate_progress
  WHERE (user_id = p_user_id OR anonymous_id = p_anonymous_id)
  LIMIT 1;
  
  -- Create progress record if none exists
  IF v_progress_id IS NULL THEN
    INSERT INTO public.gate_progress (user_id, anonymous_id, current_gate, gates_solved)
    VALUES (p_user_id, p_anonymous_id, 1, '{}')
    RETURNING id, current_gate, gates_solved
    INTO v_progress_id, v_current_gate, v_gates_solved;
  END IF;
  
  -- Only allow checking current or previous gates
  IF p_gate_number > v_current_gate THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'This gate is not yet accessible'
    );
  END IF;
  
  -- Get the riddle and correct answer
  SELECT id, lower(answer) INTO v_riddle_id, v_correct_answer
  FROM public.riddles
  WHERE gate_number = p_gate_number;
  
  -- Check if the answer is correct (case insensitive)
  IF lower(p_answer) = v_correct_answer THEN
    -- Mark this gate as solved if not already
    IF NOT (p_gate_number = ANY(v_gates_solved)) THEN
      -- Add to solved gates array
      UPDATE public.gate_progress
      SET 
        gates_solved = array_append(gates_solved, p_gate_number),
        -- If solving Gate 1 (portal), mark portal_solved as true
        portal_solved = CASE WHEN p_gate_number = 1 THEN true ELSE portal_solved END,
        -- If solving current gate, advance to next gate
        current_gate = CASE WHEN p_gate_number = current_gate THEN current_gate + 1 ELSE current_gate END,
        last_updated = now()
      WHERE id = v_progress_id;
      
      -- Record the solution
      INSERT INTO public.riddle_solutions (user_id, anonymous_id, riddle_id)
      VALUES (p_user_id, p_anonymous_id, v_riddle_id);
    END IF;
    
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Correct answer!',
      'next_gate', CASE WHEN p_gate_number = v_current_gate THEN v_current_gate + 1 ELSE NULL END
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Incorrect answer. Try again.'
    );
  END IF;
END;
$$;

-- Grant permissions to use the functions
GRANT EXECUTE ON FUNCTION public.has_solved_portal TO anon;
GRANT EXECUTE ON FUNCTION public.has_solved_portal TO authenticated;

GRANT EXECUTE ON FUNCTION public.has_solved_gate TO anon;
GRANT EXECUTE ON FUNCTION public.has_solved_gate TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_current_gate TO anon;
GRANT EXECUTE ON FUNCTION public.get_current_gate TO authenticated;

GRANT EXECUTE ON FUNCTION public.check_riddle_answer TO anon;
GRANT EXECUTE ON FUNCTION public.check_riddle_answer TO authenticated;

-- Insert initial puzzle data - Gate 1 (Portal)
INSERT INTO public.riddles (gate_number, title, content, answer, hint)
VALUES (
  1, 
  'Dissolution of Ego', 
  'I speak in your name, yet I am not you.
I dress in masks and fear what''s true.
To open the door and finally grow,
What must you name, then let go?',
  'ego',
  'It starts with "e" and is a part of yourself that isn''t really yourself'
) ON CONFLICT (gate_number) DO NOTHING;