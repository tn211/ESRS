
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

ALTER FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_old_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  status int;
  content text;
  avatar_name text;
begin
  if coalesce(old.avatar_url, '') <> ''
      and (tg_op = 'DELETE' or (old.avatar_url <> coalesce(new.avatar_url, ''))) then
    -- extract avatar name
    avatar_name := old.avatar_url;
    select
      into status, content
      result.status, result.content
      from public.delete_avatar(avatar_name) as result;
    if status <> 200 then
      raise warning 'Could not delete avatar: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

ALTER FUNCTION "public"."delete_old_avatar"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_old_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

ALTER FUNCTION "public"."delete_old_profile"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  project_url text := '<YOURPROJECTURL>';
  service_role_key text := '<YOURSERVICEROLEKEY>'; --  full access needed
  url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

ALTER FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "comment_id" integer NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "parent_id" integer,
    "slug" "text" NOT NULL,
    "body" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "comments_body_check" CHECK ((("length"("body") >= 1) AND ("length"("body") <= 2000)))
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

ALTER TABLE "public"."comments" ALTER COLUMN "comment_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."comments_comment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."follows" (
    "follow_id" integer NOT NULL,
    "follower_id" integer NOT NULL,
    "following_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."follows" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."follows_follow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."follows_follow_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."follows_follow_id_seq" OWNED BY "public"."follows"."follow_id";

CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "ingredient_id" integer NOT NULL,
    "recipe_id" integer,
    "name" character varying,
    "quantity" character varying NOT NULL,
    "profile_id" "uuid",
    "unit" "text"
);

ALTER TABLE "public"."ingredients" OWNER TO "postgres";

ALTER TABLE "public"."ingredients" ALTER COLUMN "ingredient_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ingredients_ingredient_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "like_id" integer,
    "recipe_id" integer,
    "created_at" timestamp with time zone,
    "profile_id" "uuid"
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipe_tags" (
    "recipe_id" integer,
    "tag_id" integer
);

ALTER TABLE "public"."recipe_tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "recipe_id" integer NOT NULL,
    "title" character varying,
    "description" "text",
    "instructions" "text",
    "image_url" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "profile_id" "uuid"
);

ALTER TABLE "public"."recipes" OWNER TO "postgres";

ALTER TABLE "public"."recipes" ALTER COLUMN "recipe_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."recipes_recipe_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "tag_id" integer NOT NULL,
    "tag_name" character varying(255) NOT NULL
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."tags_tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."tags_tag_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."tags_tag_id_seq" OWNED BY "public"."tags"."tag_id";

CREATE TABLE IF NOT EXISTS "public"."usernotifications" (
    "notification_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "reference_id" integer NOT NULL,
    "seen" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."usernotifications" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."usernotifications_notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."usernotifications_notification_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."usernotifications_notification_id_seq" OWNED BY "public"."usernotifications"."notification_id";

ALTER TABLE ONLY "public"."follows" ALTER COLUMN "follow_id" SET DEFAULT "nextval"('"public"."follows_follow_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."tags" ALTER COLUMN "tag_id" SET DEFAULT "nextval"('"public"."tags_tag_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."usernotifications" ALTER COLUMN "notification_id" SET DEFAULT "nextval"('"public"."usernotifications_notification_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id");

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_following_id_key" UNIQUE ("follower_id", "following_id");

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follow_id");

ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("ingredient_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("recipe_id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_tag_name_key" UNIQUE ("tag_name");

ALTER TABLE ONLY "public"."usernotifications"
    ADD CONSTRAINT "usernotifications_pkey" PRIMARY KEY ("notification_id");

CREATE OR REPLACE TRIGGER "before_profile_changes" BEFORE DELETE OR UPDATE OF "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."delete_old_avatar"();

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("comment_id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "fk_ingredients_profiles" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "fk_ingredients_recipes" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("recipe_id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "fk_likes_profiles" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "fk_recipes_profiles" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."usernotifications"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."recipes";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_comment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_comment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_comment_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";

GRANT ALL ON SEQUENCE "public"."follows_follow_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."follows_follow_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."follows_follow_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."ingredients" TO "anon";
GRANT ALL ON TABLE "public"."ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredients" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ingredients_ingredient_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ingredients_ingredient_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ingredients_ingredient_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."recipe_tags" TO "anon";
GRANT ALL ON TABLE "public"."recipe_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."recipe_tags" TO "service_role";

GRANT ALL ON TABLE "public"."recipes" TO "anon";
GRANT ALL ON TABLE "public"."recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."recipes_recipe_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."recipes_recipe_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."recipes_recipe_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tags_tag_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_tag_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_tag_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."usernotifications" TO "anon";
GRANT ALL ON TABLE "public"."usernotifications" TO "authenticated";
GRANT ALL ON TABLE "public"."usernotifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."usernotifications_notification_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usernotifications_notification_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usernotifications_notification_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
