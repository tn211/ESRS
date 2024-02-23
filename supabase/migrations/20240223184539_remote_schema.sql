create sequence "public"."comments_comment_id_seq";

create sequence "public"."follows_follow_id_seq";

create sequence "public"."likes_like_id_seq";

create sequence "public"."recipes_recipe_id_seq";

create sequence "public"."tags_tag_id_seq";

create sequence "public"."users_user_id_seq";

alter table "public"."achievements" drop constraint "achievements_user_id_fkey";

alter table "public"."budget_categories" drop constraint "budget_categories_user_id_fkey";

alter table "public"."expenses" drop constraint "expenses_user_id_fkey";

alter table "public"."users" drop constraint "users_id_key";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_id_key";

drop index if exists "public"."users_pkey";

create table "public"."comments" (
    "comment_id" integer not null default nextval('comments_comment_id_seq'::regclass),
    "recipe_id" integer not null,
    "user_id" integer not null,
    "comment" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."follows" (
    "follow_id" integer not null default nextval('follows_follow_id_seq'::regclass),
    "follower_id" integer not null,
    "following_id" integer not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."likes" (
    "like_id" integer not null default nextval('likes_like_id_seq'::regclass),
    "recipe_id" integer not null,
    "user_id" integer not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."recipe_tags" (
    "recipe_id" integer not null,
    "tag_id" integer not null
);


create table "public"."recipes" (
    "recipe_id" integer not null default nextval('recipes_recipe_id_seq'::regclass),
    "user_id" integer not null,
    "title" character varying(255) not null,
    "description" text not null,
    "ingredients" text not null,
    "instructions" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone,
    "image_url" text
);


create table "public"."tags" (
    "tag_id" integer not null default nextval('tags_tag_id_seq'::regclass),
    "tag_name" character varying(255) not null
);


alter table "public"."users" drop column "full_name";

alter table "public"."users" drop column "id";

alter table "public"."users" drop column "updated_at";

alter table "public"."users" add column "bio" text;

alter table "public"."users" add column "hashed_password" character varying(255) not null;

alter table "public"."users" add column "profile_picture_url" text;

alter table "public"."users" add column "user_id" integer not null default nextval('users_user_id_seq'::regclass);

alter table "public"."users" add column "username" character varying(255) not null;

alter table "public"."users" alter column "email" set data type character varying(255) using "email"::character varying(255);

alter sequence "public"."comments_comment_id_seq" owned by "public"."comments"."comment_id";

alter sequence "public"."follows_follow_id_seq" owned by "public"."follows"."follow_id";

alter sequence "public"."likes_like_id_seq" owned by "public"."likes"."like_id";

alter sequence "public"."recipes_recipe_id_seq" owned by "public"."recipes"."recipe_id";

alter sequence "public"."tags_tag_id_seq" owned by "public"."tags"."tag_id";

alter sequence "public"."users_user_id_seq" owned by "public"."users"."user_id";

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (comment_id);

CREATE UNIQUE INDEX follows_follower_id_following_id_key ON public.follows USING btree (follower_id, following_id);

CREATE UNIQUE INDEX follows_pkey ON public.follows USING btree (follow_id);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (like_id);

CREATE UNIQUE INDEX recipe_tags_recipe_id_tag_id_key ON public.recipe_tags USING btree (recipe_id, tag_id);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (recipe_id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (tag_id);

CREATE UNIQUE INDEX tags_tag_name_key ON public.tags USING btree (tag_name);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."follows" add constraint "follows_pkey" PRIMARY KEY using index "follows_pkey";

alter table "public"."likes" add constraint "likes_pkey" PRIMARY KEY using index "likes_pkey";

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."comments" add constraint "comments_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_recipe_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."follows" add constraint "follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_follower_id_fkey";

alter table "public"."follows" add constraint "follows_follower_id_following_id_key" UNIQUE using index "follows_follower_id_following_id_key";

alter table "public"."follows" add constraint "follows_following_id_fkey" FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_following_id_fkey";

alter table "public"."likes" add constraint "likes_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_recipe_id_fkey";

alter table "public"."likes" add constraint "likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_user_id_fkey";

alter table "public"."recipe_tags" add constraint "recipe_tags_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE not valid;

alter table "public"."recipe_tags" validate constraint "recipe_tags_recipe_id_fkey";

alter table "public"."recipe_tags" add constraint "recipe_tags_recipe_id_tag_id_key" UNIQUE using index "recipe_tags_recipe_id_tag_id_key";

alter table "public"."recipe_tags" add constraint "recipe_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE not valid;

alter table "public"."recipe_tags" validate constraint "recipe_tags_tag_id_fkey";

alter table "public"."recipes" add constraint "recipes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE not valid;

alter table "public"."recipes" validate constraint "recipes_user_id_fkey";

alter table "public"."tags" add constraint "tags_tag_name_key" UNIQUE using index "tags_tag_name_key";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

grant delete on table "public"."likes" to "anon";

grant insert on table "public"."likes" to "anon";

grant references on table "public"."likes" to "anon";

grant select on table "public"."likes" to "anon";

grant trigger on table "public"."likes" to "anon";

grant truncate on table "public"."likes" to "anon";

grant update on table "public"."likes" to "anon";

grant delete on table "public"."likes" to "authenticated";

grant insert on table "public"."likes" to "authenticated";

grant references on table "public"."likes" to "authenticated";

grant select on table "public"."likes" to "authenticated";

grant trigger on table "public"."likes" to "authenticated";

grant truncate on table "public"."likes" to "authenticated";

grant update on table "public"."likes" to "authenticated";

grant delete on table "public"."likes" to "service_role";

grant insert on table "public"."likes" to "service_role";

grant references on table "public"."likes" to "service_role";

grant select on table "public"."likes" to "service_role";

grant trigger on table "public"."likes" to "service_role";

grant truncate on table "public"."likes" to "service_role";

grant update on table "public"."likes" to "service_role";

grant delete on table "public"."recipe_tags" to "anon";

grant insert on table "public"."recipe_tags" to "anon";

grant references on table "public"."recipe_tags" to "anon";

grant select on table "public"."recipe_tags" to "anon";

grant trigger on table "public"."recipe_tags" to "anon";

grant truncate on table "public"."recipe_tags" to "anon";

grant update on table "public"."recipe_tags" to "anon";

grant delete on table "public"."recipe_tags" to "authenticated";

grant insert on table "public"."recipe_tags" to "authenticated";

grant references on table "public"."recipe_tags" to "authenticated";

grant select on table "public"."recipe_tags" to "authenticated";

grant trigger on table "public"."recipe_tags" to "authenticated";

grant truncate on table "public"."recipe_tags" to "authenticated";

grant update on table "public"."recipe_tags" to "authenticated";

grant delete on table "public"."recipe_tags" to "service_role";

grant insert on table "public"."recipe_tags" to "service_role";

grant references on table "public"."recipe_tags" to "service_role";

grant select on table "public"."recipe_tags" to "service_role";

grant trigger on table "public"."recipe_tags" to "service_role";

grant truncate on table "public"."recipe_tags" to "service_role";

grant update on table "public"."recipe_tags" to "service_role";

grant delete on table "public"."recipes" to "anon";

grant insert on table "public"."recipes" to "anon";

grant references on table "public"."recipes" to "anon";

grant select on table "public"."recipes" to "anon";

grant trigger on table "public"."recipes" to "anon";

grant truncate on table "public"."recipes" to "anon";

grant update on table "public"."recipes" to "anon";

grant delete on table "public"."recipes" to "authenticated";

grant insert on table "public"."recipes" to "authenticated";

grant references on table "public"."recipes" to "authenticated";

grant select on table "public"."recipes" to "authenticated";

grant trigger on table "public"."recipes" to "authenticated";

grant truncate on table "public"."recipes" to "authenticated";

grant update on table "public"."recipes" to "authenticated";

grant delete on table "public"."recipes" to "service_role";

grant insert on table "public"."recipes" to "service_role";

grant references on table "public"."recipes" to "service_role";

grant select on table "public"."recipes" to "service_role";

grant trigger on table "public"."recipes" to "service_role";

grant truncate on table "public"."recipes" to "service_role";

grant update on table "public"."recipes" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";


