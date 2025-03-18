create policy "Enable read access for all users"
on "public"."routine_exercises"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."routines"
as permissive
for select
to public
using (true);



