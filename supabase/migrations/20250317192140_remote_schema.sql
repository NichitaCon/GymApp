create sequence "public"."exercises_exercise_id_seq";

create sequence "public"."routine_exercises_routine_exercise_id_seq";

create sequence "public"."routines_routine_id_seq";

create sequence "public"."set_logs_set_log_id_seq";

create sequence "public"."template_exercises_template_exercise_id_seq";

create sequence "public"."templates_template_id_seq";

create sequence "public"."workout_sessions_session_id_seq";

create table "public"."exercises" (
    "exercise_id" integer not null default nextval('exercises_exercise_id_seq'::regclass),
    "name" text not null,
    "description" text,
    "category" text,
    "muscle_group" text,
    "equipment_needed" text,
    "difficulty_level" text,
    "video_url" text,
    "form_tips" text
);


alter table "public"."exercises" enable row level security;

create table "public"."routine_exercises" (
    "routine_exercise_id" integer not null default nextval('routine_exercises_routine_exercise_id_seq'::regclass),
    "routine_id" integer,
    "exercise_id" integer,
    "rest_duration" integer,
    "order_index" integer
);


alter table "public"."routine_exercises" enable row level security;

create table "public"."routines" (
    "routine_id" integer not null default nextval('routines_routine_id_seq'::regclass),
    "user_id" uuid,
    "name" text not null,
    "description" text,
    "is_private" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."routines" enable row level security;

create table "public"."set_logs" (
    "set_log_id" integer not null default nextval('set_logs_set_log_id_seq'::regclass),
    "session_id" integer,
    "exercise_id" integer,
    "set_number" integer,
    "reps" integer,
    "weight" double precision,
    "notes" text
);


alter table "public"."set_logs" enable row level security;

create table "public"."template_exercises" (
    "template_exercise_id" integer not null default nextval('template_exercises_template_exercise_id_seq'::regclass),
    "template_id" integer,
    "exercise_id" integer,
    "rest_duration" integer,
    "order_index" integer
);


alter table "public"."template_exercises" enable row level security;

create table "public"."templates" (
    "template_id" integer not null default nextval('templates_template_id_seq'::regclass),
    "creator_id" uuid,
    "name" text not null,
    "description" text,
    "goal" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."templates" enable row level security;

create table "public"."workout_sessions" (
    "session_id" integer not null default nextval('workout_sessions_session_id_seq'::regclass),
    "user_id" uuid,
    "routine_id" integer,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "notes" text,
    "completed" boolean default false
);


alter table "public"."workout_sessions" enable row level security;

alter sequence "public"."exercises_exercise_id_seq" owned by "public"."exercises"."exercise_id";

alter sequence "public"."routine_exercises_routine_exercise_id_seq" owned by "public"."routine_exercises"."routine_exercise_id";

alter sequence "public"."routines_routine_id_seq" owned by "public"."routines"."routine_id";

alter sequence "public"."set_logs_set_log_id_seq" owned by "public"."set_logs"."set_log_id";

alter sequence "public"."template_exercises_template_exercise_id_seq" owned by "public"."template_exercises"."template_exercise_id";

alter sequence "public"."templates_template_id_seq" owned by "public"."templates"."template_id";

alter sequence "public"."workout_sessions_session_id_seq" owned by "public"."workout_sessions"."session_id";

CREATE UNIQUE INDEX exercises_pkey ON public.exercises USING btree (exercise_id);

CREATE UNIQUE INDEX routine_exercises_pkey ON public.routine_exercises USING btree (routine_exercise_id);

CREATE UNIQUE INDEX routines_pkey ON public.routines USING btree (routine_id);

CREATE UNIQUE INDEX set_logs_pkey ON public.set_logs USING btree (set_log_id);

CREATE UNIQUE INDEX template_exercises_pkey ON public.template_exercises USING btree (template_exercise_id);

CREATE UNIQUE INDEX templates_pkey ON public.templates USING btree (template_id);

CREATE UNIQUE INDEX workout_sessions_pkey ON public.workout_sessions USING btree (session_id);

alter table "public"."exercises" add constraint "exercises_pkey" PRIMARY KEY using index "exercises_pkey";

alter table "public"."routine_exercises" add constraint "routine_exercises_pkey" PRIMARY KEY using index "routine_exercises_pkey";

alter table "public"."routines" add constraint "routines_pkey" PRIMARY KEY using index "routines_pkey";

alter table "public"."set_logs" add constraint "set_logs_pkey" PRIMARY KEY using index "set_logs_pkey";

alter table "public"."template_exercises" add constraint "template_exercises_pkey" PRIMARY KEY using index "template_exercises_pkey";

alter table "public"."templates" add constraint "templates_pkey" PRIMARY KEY using index "templates_pkey";

alter table "public"."workout_sessions" add constraint "workout_sessions_pkey" PRIMARY KEY using index "workout_sessions_pkey";

alter table "public"."routine_exercises" add constraint "routine_exercises_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE not valid;

alter table "public"."routine_exercises" validate constraint "routine_exercises_exercise_id_fkey";

alter table "public"."routine_exercises" add constraint "routine_exercises_routine_id_fkey" FOREIGN KEY (routine_id) REFERENCES routines(routine_id) ON DELETE CASCADE not valid;

alter table "public"."routine_exercises" validate constraint "routine_exercises_routine_id_fkey";

alter table "public"."routines" add constraint "routines_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."routines" validate constraint "routines_user_id_fkey";

alter table "public"."set_logs" add constraint "set_logs_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE not valid;

alter table "public"."set_logs" validate constraint "set_logs_exercise_id_fkey";

alter table "public"."set_logs" add constraint "set_logs_session_id_fkey" FOREIGN KEY (session_id) REFERENCES workout_sessions(session_id) ON DELETE CASCADE not valid;

alter table "public"."set_logs" validate constraint "set_logs_session_id_fkey";

alter table "public"."template_exercises" add constraint "template_exercises_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE not valid;

alter table "public"."template_exercises" validate constraint "template_exercises_exercise_id_fkey";

alter table "public"."template_exercises" add constraint "template_exercises_template_id_fkey" FOREIGN KEY (template_id) REFERENCES templates(template_id) ON DELETE CASCADE not valid;

alter table "public"."template_exercises" validate constraint "template_exercises_template_id_fkey";

alter table "public"."templates" add constraint "templates_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."templates" validate constraint "templates_creator_id_fkey";

alter table "public"."workout_sessions" add constraint "workout_sessions_routine_id_fkey" FOREIGN KEY (routine_id) REFERENCES routines(routine_id) ON DELETE CASCADE not valid;

alter table "public"."workout_sessions" validate constraint "workout_sessions_routine_id_fkey";

alter table "public"."workout_sessions" add constraint "workout_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."workout_sessions" validate constraint "workout_sessions_user_id_fkey";

grant delete on table "public"."exercises" to "anon";

grant insert on table "public"."exercises" to "anon";

grant references on table "public"."exercises" to "anon";

grant select on table "public"."exercises" to "anon";

grant trigger on table "public"."exercises" to "anon";

grant truncate on table "public"."exercises" to "anon";

grant update on table "public"."exercises" to "anon";

grant delete on table "public"."exercises" to "authenticated";

grant insert on table "public"."exercises" to "authenticated";

grant references on table "public"."exercises" to "authenticated";

grant select on table "public"."exercises" to "authenticated";

grant trigger on table "public"."exercises" to "authenticated";

grant truncate on table "public"."exercises" to "authenticated";

grant update on table "public"."exercises" to "authenticated";

grant delete on table "public"."exercises" to "service_role";

grant insert on table "public"."exercises" to "service_role";

grant references on table "public"."exercises" to "service_role";

grant select on table "public"."exercises" to "service_role";

grant trigger on table "public"."exercises" to "service_role";

grant truncate on table "public"."exercises" to "service_role";

grant update on table "public"."exercises" to "service_role";

grant delete on table "public"."routine_exercises" to "anon";

grant insert on table "public"."routine_exercises" to "anon";

grant references on table "public"."routine_exercises" to "anon";

grant select on table "public"."routine_exercises" to "anon";

grant trigger on table "public"."routine_exercises" to "anon";

grant truncate on table "public"."routine_exercises" to "anon";

grant update on table "public"."routine_exercises" to "anon";

grant delete on table "public"."routine_exercises" to "authenticated";

grant insert on table "public"."routine_exercises" to "authenticated";

grant references on table "public"."routine_exercises" to "authenticated";

grant select on table "public"."routine_exercises" to "authenticated";

grant trigger on table "public"."routine_exercises" to "authenticated";

grant truncate on table "public"."routine_exercises" to "authenticated";

grant update on table "public"."routine_exercises" to "authenticated";

grant delete on table "public"."routine_exercises" to "service_role";

grant insert on table "public"."routine_exercises" to "service_role";

grant references on table "public"."routine_exercises" to "service_role";

grant select on table "public"."routine_exercises" to "service_role";

grant trigger on table "public"."routine_exercises" to "service_role";

grant truncate on table "public"."routine_exercises" to "service_role";

grant update on table "public"."routine_exercises" to "service_role";

grant delete on table "public"."routines" to "anon";

grant insert on table "public"."routines" to "anon";

grant references on table "public"."routines" to "anon";

grant select on table "public"."routines" to "anon";

grant trigger on table "public"."routines" to "anon";

grant truncate on table "public"."routines" to "anon";

grant update on table "public"."routines" to "anon";

grant delete on table "public"."routines" to "authenticated";

grant insert on table "public"."routines" to "authenticated";

grant references on table "public"."routines" to "authenticated";

grant select on table "public"."routines" to "authenticated";

grant trigger on table "public"."routines" to "authenticated";

grant truncate on table "public"."routines" to "authenticated";

grant update on table "public"."routines" to "authenticated";

grant delete on table "public"."routines" to "service_role";

grant insert on table "public"."routines" to "service_role";

grant references on table "public"."routines" to "service_role";

grant select on table "public"."routines" to "service_role";

grant trigger on table "public"."routines" to "service_role";

grant truncate on table "public"."routines" to "service_role";

grant update on table "public"."routines" to "service_role";

grant delete on table "public"."set_logs" to "anon";

grant insert on table "public"."set_logs" to "anon";

grant references on table "public"."set_logs" to "anon";

grant select on table "public"."set_logs" to "anon";

grant trigger on table "public"."set_logs" to "anon";

grant truncate on table "public"."set_logs" to "anon";

grant update on table "public"."set_logs" to "anon";

grant delete on table "public"."set_logs" to "authenticated";

grant insert on table "public"."set_logs" to "authenticated";

grant references on table "public"."set_logs" to "authenticated";

grant select on table "public"."set_logs" to "authenticated";

grant trigger on table "public"."set_logs" to "authenticated";

grant truncate on table "public"."set_logs" to "authenticated";

grant update on table "public"."set_logs" to "authenticated";

grant delete on table "public"."set_logs" to "service_role";

grant insert on table "public"."set_logs" to "service_role";

grant references on table "public"."set_logs" to "service_role";

grant select on table "public"."set_logs" to "service_role";

grant trigger on table "public"."set_logs" to "service_role";

grant truncate on table "public"."set_logs" to "service_role";

grant update on table "public"."set_logs" to "service_role";

grant delete on table "public"."template_exercises" to "anon";

grant insert on table "public"."template_exercises" to "anon";

grant references on table "public"."template_exercises" to "anon";

grant select on table "public"."template_exercises" to "anon";

grant trigger on table "public"."template_exercises" to "anon";

grant truncate on table "public"."template_exercises" to "anon";

grant update on table "public"."template_exercises" to "anon";

grant delete on table "public"."template_exercises" to "authenticated";

grant insert on table "public"."template_exercises" to "authenticated";

grant references on table "public"."template_exercises" to "authenticated";

grant select on table "public"."template_exercises" to "authenticated";

grant trigger on table "public"."template_exercises" to "authenticated";

grant truncate on table "public"."template_exercises" to "authenticated";

grant update on table "public"."template_exercises" to "authenticated";

grant delete on table "public"."template_exercises" to "service_role";

grant insert on table "public"."template_exercises" to "service_role";

grant references on table "public"."template_exercises" to "service_role";

grant select on table "public"."template_exercises" to "service_role";

grant trigger on table "public"."template_exercises" to "service_role";

grant truncate on table "public"."template_exercises" to "service_role";

grant update on table "public"."template_exercises" to "service_role";

grant delete on table "public"."templates" to "anon";

grant insert on table "public"."templates" to "anon";

grant references on table "public"."templates" to "anon";

grant select on table "public"."templates" to "anon";

grant trigger on table "public"."templates" to "anon";

grant truncate on table "public"."templates" to "anon";

grant update on table "public"."templates" to "anon";

grant delete on table "public"."templates" to "authenticated";

grant insert on table "public"."templates" to "authenticated";

grant references on table "public"."templates" to "authenticated";

grant select on table "public"."templates" to "authenticated";

grant trigger on table "public"."templates" to "authenticated";

grant truncate on table "public"."templates" to "authenticated";

grant update on table "public"."templates" to "authenticated";

grant delete on table "public"."templates" to "service_role";

grant insert on table "public"."templates" to "service_role";

grant references on table "public"."templates" to "service_role";

grant select on table "public"."templates" to "service_role";

grant trigger on table "public"."templates" to "service_role";

grant truncate on table "public"."templates" to "service_role";

grant update on table "public"."templates" to "service_role";

grant delete on table "public"."workout_sessions" to "anon";

grant insert on table "public"."workout_sessions" to "anon";

grant references on table "public"."workout_sessions" to "anon";

grant select on table "public"."workout_sessions" to "anon";

grant trigger on table "public"."workout_sessions" to "anon";

grant truncate on table "public"."workout_sessions" to "anon";

grant update on table "public"."workout_sessions" to "anon";

grant delete on table "public"."workout_sessions" to "authenticated";

grant insert on table "public"."workout_sessions" to "authenticated";

grant references on table "public"."workout_sessions" to "authenticated";

grant select on table "public"."workout_sessions" to "authenticated";

grant trigger on table "public"."workout_sessions" to "authenticated";

grant truncate on table "public"."workout_sessions" to "authenticated";

grant update on table "public"."workout_sessions" to "authenticated";

grant delete on table "public"."workout_sessions" to "service_role";

grant insert on table "public"."workout_sessions" to "service_role";

grant references on table "public"."workout_sessions" to "service_role";

grant select on table "public"."workout_sessions" to "service_role";

grant trigger on table "public"."workout_sessions" to "service_role";

grant truncate on table "public"."workout_sessions" to "service_role";

grant update on table "public"."workout_sessions" to "service_role";


