-- Enable Realtime for the products table
-- 1. Ensure the table broadcasts full row changes
alter table products replica identity full;

-- 2. Create or Update the publication
-- We use a do block to safely handle existing publication
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- 3. Add the products table to the publication
alter publication supabase_realtime add table products;
