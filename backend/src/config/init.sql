-- Samarinda Terbaru - Supabase schema
-- Jalankan file ini di Supabase SQL Editor.
-- Catatan: Supabase Auth sudah menyediakan tabel auth.users.
-- Tabel public.profiles menyimpan data aplikasi untuk user/admin.

create extension if not exists pgcrypto;

drop table if exists public.comments cascade;
drop table if exists public.news cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'admin' check (role in ('admin', 'author', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id bigint generated always as identity primary key,
  name text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id bigint generated always as identity primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  image_url text,
  video_url text,
  category_id bigint references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  is_deleted boolean not null default false,
  expires_at timestamptz not null default (now() + interval '1 month'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id bigint generated always as identity primary key,
  news_id bigint not null references public.news(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_role on public.profiles(role);
create index idx_categories_name on public.categories(name);
create index idx_news_slug on public.news(slug);
create index idx_news_category_id on public.news(category_id);
create index idx_news_created_at on public.news(created_at desc);
create index idx_news_expires_at on public.news(expires_at);
create index idx_news_public on public.news(is_deleted, expires_at, created_at desc);
create index idx_comments_news_id on public.comments(news_id);
create index idx_comments_created_at on public.comments(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'author')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.news enable row level security;
alter table public.comments enable row level security;

create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "profiles_delete_admin"
on public.profiles
for delete
to authenticated
using (public.is_admin());

create policy "categories_public_read"
on public.categories
for select
to anon, authenticated
using (true);

create policy "categories_staff_insert"
on public.categories
for insert
to authenticated
with check (public.is_staff());

create policy "categories_staff_update"
on public.categories
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "categories_staff_delete"
on public.categories
for delete
to authenticated
using (public.is_staff());

create policy "news_public_read_active"
on public.news
for select
to anon, authenticated
using (is_deleted = false and expires_at > now());

create policy "news_staff_read_all"
on public.news
for select
to authenticated
using (public.is_staff());

create policy "news_staff_insert"
on public.news
for insert
to authenticated
with check (public.is_staff());

create policy "news_staff_update"
on public.news
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "news_staff_delete"
on public.news
for delete
to authenticated
using (public.is_staff());

create policy "comments_public_read_for_active_news"
on public.comments
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.news n
    where n.id = comments.news_id
      and n.is_deleted = false
      and n.expires_at > now()
  )
);

create policy "comments_staff_read_all"
on public.comments
for select
to authenticated
using (public.is_staff());

create policy "comments_public_insert_for_active_news"
on public.comments
for insert
to anon, authenticated
with check (
  length(trim(name)) > 0
  and length(trim(content)) > 0
  and exists (
    select 1
    from public.news n
    where n.id = comments.news_id
      and n.is_deleted = false
      and n.expires_at > now()
  )
);

create policy "comments_staff_delete"
on public.comments
for delete
to authenticated
using (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-media',
  'news-media',
  true,
  524288000,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "news_media_public_read" on storage.objects;
drop policy if exists "news_media_staff_insert" on storage.objects;
drop policy if exists "news_media_staff_update" on storage.objects;
drop policy if exists "news_media_staff_delete" on storage.objects;

create policy "news_media_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'news-media');

create policy "news_media_staff_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'news-media' and public.is_staff());

create policy "news_media_staff_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'news-media' and public.is_staff())
with check (bucket_id = 'news-media' and public.is_staff());

create policy "news_media_staff_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'news-media' and public.is_staff());
