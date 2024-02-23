create sequence "public"."ingredients_ingredient_id_seq";

revoke delete on table "public"."achievements" from "anon";

revoke insert on table "public"."achievements" from "anon";

revoke references on table "public"."achievements" from "anon";

revoke select on table "public"."achievements" from "anon";

revoke trigger on table "public"."achievements" from "anon";

revoke truncate on table "public"."achievements" from "anon";

revoke update on table "public"."achievements" from "anon";

revoke delete on table "public"."achievements" from "authenticated";

revoke insert on table "public"."achievements" from "authenticated";

revoke references on table "public"."achievements" from "authenticated";

revoke select on table "public"."achievements" from "authenticated";

revoke trigger on table "public"."achievements" from "authenticated";

revoke truncate on table "public"."achievements" from "authenticated";

revoke update on table "public"."achievements" from "authenticated";

revoke delete on table "public"."achievements" from "service_role";

revoke insert on table "public"."achievements" from "service_role";

revoke references on table "public"."achievements" from "service_role";

revoke select on table "public"."achievements" from "service_role";

revoke trigger on table "public"."achievements" from "service_role";

revoke truncate on table "public"."achievements" from "service_role";

revoke update on table "public"."achievements" from "service_role";

revoke delete on table "public"."budget_categories" from "anon";

revoke insert on table "public"."budget_categories" from "anon";

revoke references on table "public"."budget_categories" from "anon";

revoke select on table "public"."budget_categories" from "anon";

revoke trigger on table "public"."budget_categories" from "anon";

revoke truncate on table "public"."budget_categories" from "anon";

revoke update on table "public"."budget_categories" from "anon";

revoke delete on table "public"."budget_categories" from "authenticated";

revoke insert on table "public"."budget_categories" from "authenticated";

revoke references on table "public"."budget_categories" from "authenticated";

revoke select on table "public"."budget_categories" from "authenticated";

revoke trigger on table "public"."budget_categories" from "authenticated";

revoke truncate on table "public"."budget_categories" from "authenticated";

revoke update on table "public"."budget_categories" from "authenticated";

revoke delete on table "public"."budget_categories" from "service_role";

revoke insert on table "public"."budget_categories" from "service_role";

revoke references on table "public"."budget_categories" from "service_role";

revoke select on table "public"."budget_categories" from "service_role";

revoke trigger on table "public"."budget_categories" from "service_role";

revoke truncate on table "public"."budget_categories" from "service_role";

revoke update on table "public"."budget_categories" from "service_role";

revoke delete on table "public"."events" from "anon";

revoke insert on table "public"."events" from "anon";

revoke references on table "public"."events" from "anon";

revoke select on table "public"."events" from "anon";

revoke trigger on table "public"."events" from "anon";

revoke truncate on table "public"."events" from "anon";

revoke update on table "public"."events" from "anon";

revoke delete on table "public"."events" from "authenticated";

revoke insert on table "public"."events" from "authenticated";

revoke references on table "public"."events" from "authenticated";

revoke select on table "public"."events" from "authenticated";

revoke trigger on table "public"."events" from "authenticated";

revoke truncate on table "public"."events" from "authenticated";

revoke update on table "public"."events" from "authenticated";

revoke delete on table "public"."events" from "service_role";

revoke insert on table "public"."events" from "service_role";

revoke references on table "public"."events" from "service_role";

revoke select on table "public"."events" from "service_role";

revoke trigger on table "public"."events" from "service_role";

revoke truncate on table "public"."events" from "service_role";

revoke update on table "public"."events" from "service_role";

revoke delete on table "public"."expenses" from "anon";

revoke insert on table "public"."expenses" from "anon";

revoke references on table "public"."expenses" from "anon";

revoke select on table "public"."expenses" from "anon";

revoke trigger on table "public"."expenses" from "anon";

revoke truncate on table "public"."expenses" from "anon";

revoke update on table "public"."expenses" from "anon";

revoke delete on table "public"."expenses" from "authenticated";

revoke insert on table "public"."expenses" from "authenticated";

revoke references on table "public"."expenses" from "authenticated";

revoke select on table "public"."expenses" from "authenticated";

revoke trigger on table "public"."expenses" from "authenticated";

revoke truncate on table "public"."expenses" from "authenticated";

revoke update on table "public"."expenses" from "authenticated";

revoke delete on table "public"."expenses" from "service_role";

revoke insert on table "public"."expenses" from "service_role";

revoke references on table "public"."expenses" from "service_role";

revoke select on table "public"."expenses" from "service_role";

revoke trigger on table "public"."expenses" from "service_role";

revoke truncate on table "public"."expenses" from "service_role";

revoke update on table "public"."expenses" from "service_role";

alter table "public"."achievements" drop constraint "achievements_event_id_fkey";

alter table "public"."expenses" drop constraint "expenses_category_id_fkey";

alter table "public"."achievements" drop constraint "achievements_pkey";

alter table "public"."budget_categories" drop constraint "budget_categories_pkey";

alter table "public"."events" drop constraint "events_pkey";

alter table "public"."expenses" drop constraint "expenses_pkey";

drop index if exists "public"."achievements_pkey";

drop index if exists "public"."budget_categories_pkey";

drop index if exists "public"."events_pkey";

drop index if exists "public"."expenses_pkey";

drop table "public"."achievements";

drop table "public"."budget_categories";

drop table "public"."events";

drop table "public"."expenses";

create table "public"."ingredients" (
    "ingredient_id" integer not null default nextval('ingredients_ingredient_id_seq'::regclass),
    "recipe_id" integer not null,
    "name" character varying(255) not null,
    "quantity" character varying(255) not null
);


alter table "public"."recipes" drop column "ingredients";

alter sequence "public"."ingredients_ingredient_id_seq" owned by "public"."ingredients"."ingredient_id";

CREATE UNIQUE INDEX ingredients_pkey ON public.ingredients USING btree (ingredient_id);

alter table "public"."ingredients" add constraint "ingredients_pkey" PRIMARY KEY using index "ingredients_pkey";

alter table "public"."ingredients" add constraint "ingredients_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE not valid;

alter table "public"."ingredients" validate constraint "ingredients_recipe_id_fkey";

grant delete on table "public"."ingredients" to "anon";

grant insert on table "public"."ingredients" to "anon";

grant references on table "public"."ingredients" to "anon";

grant select on table "public"."ingredients" to "anon";

grant trigger on table "public"."ingredients" to "anon";

grant truncate on table "public"."ingredients" to "anon";

grant update on table "public"."ingredients" to "anon";

grant delete on table "public"."ingredients" to "authenticated";

grant insert on table "public"."ingredients" to "authenticated";

grant references on table "public"."ingredients" to "authenticated";

grant select on table "public"."ingredients" to "authenticated";

grant trigger on table "public"."ingredients" to "authenticated";

grant truncate on table "public"."ingredients" to "authenticated";

grant update on table "public"."ingredients" to "authenticated";

grant delete on table "public"."ingredients" to "service_role";

grant insert on table "public"."ingredients" to "service_role";

grant references on table "public"."ingredients" to "service_role";

grant select on table "public"."ingredients" to "service_role";

grant trigger on table "public"."ingredients" to "service_role";

grant truncate on table "public"."ingredients" to "service_role";

grant update on table "public"."ingredients" to "service_role";


