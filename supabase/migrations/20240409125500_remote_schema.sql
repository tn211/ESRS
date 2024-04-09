CREATE TRIGGER before_delete_user BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION delete_old_profile();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


create policy "Allow authenticated user uploads"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'recipe-images'::text));


create policy "Anyone can update their own avatar."
on "storage"."objects"
as permissive
for update
to public
using ((auth.uid() = owner))
with check ((bucket_id = 'avatars'::text));


create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));



