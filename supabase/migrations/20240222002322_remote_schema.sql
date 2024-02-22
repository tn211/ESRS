
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

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "achievement_name" "text" NOT NULL,
    "description" "text",
    "achieved_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."achievements" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."budget_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "category_name" "text" NOT NULL,
    "budget_amount" numeric NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."budget_categories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "event_name" "text" NOT NULL,
    "description" "text",
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "goal" numeric,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."events" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "category_id" "uuid",
    "amount" numeric NOT NULL,
    "description" "text",
    "expense_date" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."expenses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."budget_categories"
    ADD CONSTRAINT "budget_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."budget_categories"
    ADD CONSTRAINT "budget_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."budget_categories"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";

GRANT ALL ON TABLE "public"."budget_categories" TO "anon";
GRANT ALL ON TABLE "public"."budget_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_categories" TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";

GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

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
