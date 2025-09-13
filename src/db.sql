-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.app_clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['web'::text, 'mobile'::text])),
  client_identifier text,
  redirect_uris ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT app_clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.course_institutions (
  course_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  CONSTRAINT course_institutions_pkey PRIMARY KEY (course_id, institution_id),
  CONSTRAINT course_institutions_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT course_institutions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  level text DEFAULT 'general'::text CHECK (level = ANY (ARRAY['school'::text, 'college'::text, 'general'::text])),
  created_by uuid,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  client_id uuid,
  device_identifier text,
  platform text DEFAULT 'web'::text CHECK (platform = ANY (ARRAY['android'::text, 'ios'::text, 'web'::text])),
  push_token text,
  last_active timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT devices_pkey PRIMARY KEY (id),
  CONSTRAINT devices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.app_clients(id),
  CONSTRAINT devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.drill_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  drill_id uuid,
  user_id uuid,
  status text DEFAULT 'present'::text CHECK (status = ANY (ARRAY['present'::text, 'absent'::text, 'exempt'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT drill_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT drill_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT drill_attendance_drill_id_fkey FOREIGN KEY (drill_id) REFERENCES public.drills(id)
);
CREATE TABLE public.drills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  scheduled_at timestamp with time zone,
  institution_id uuid,
  location text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT drills_pkey PRIMARY KEY (id),
  CONSTRAINT drills_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT drills_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id)
);
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  text text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.incident_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reporter_id uuid,
  title text,
  description text,
  category text,
  image_path text,
  latitude double precision,
  longitude double precision,
  severity text DEFAULT 'low'::text CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT incident_reports_pkey PRIMARY KEY (id),
  CONSTRAINT incident_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.institutions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  institution_code text UNIQUE,
  type text DEFAULT 'school'::text CHECK (type = ANY (ARRAY['school'::text, 'college'::text, 'other'::text])),
  address text,
  contact_email text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT institutions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title text NOT NULL,
  description text,
  content text,
  content_type text DEFAULT 'article'::text CHECK (content_type = ANY (ARRAY['article'::text, 'video'::text, 'checklist'::text, 'mixed'::text])),
  resource_url text,
  order_no integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  message text NOT NULL,
  type text DEFAULT 'announcement'::text CHECK (type = ANY (ARRAY['drill'::text, 'emergency'::text, 'announcement'::text])),
  target_role text DEFAULT 'all'::text,
  institution_id uuid,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT notifications_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'admin'::text, 'expert'::text])),
  institution_id uuid,
  created_via_client uuid,
  phone text,
  avatar_url text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_created_via_client_fkey FOREIGN KEY (created_via_client) REFERENCES public.app_clients(id),
  CONSTRAINT profiles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  user_id uuid,
  score integer,
  max_score integer,
  answers jsonb,
  started_at timestamp with time zone DEFAULT now(),
  submitted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
);
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  question_text text NOT NULL,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_option text CHECK (correct_option = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text])),
  marks integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
);
CREATE TABLE public.quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id uuid,
  title text NOT NULL,
  passing_score integer DEFAULT 50,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  storage_path text,
  file_name text,
  category text,
  visibility text DEFAULT 'public'::text CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text])),
  uploaded_by uuid,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT resources_pkey PRIMARY KEY (id),
  CONSTRAINT resources_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  notification_id uuid,
  user_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_notifications_pkey PRIMARY KEY (id),
  CONSTRAINT user_notifications_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id),
  CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);