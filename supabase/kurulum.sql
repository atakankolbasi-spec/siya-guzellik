-- SİYA Güzellik & Kuaför — Supabase kurulumu
-- Supabase paneli → SQL Editor → "New query" → tamamını yapıştırıp RUN.
-- Güvenle tekrar çalıştırılabilir (var olanı bozmaz).

-- 1) Tablolar ------------------------------------------------------------
create table if not exists public.profiller (
  id uuid primary key references auth.users(id) on delete cascade,
  kullanici text not null unique check (kullanici ~ '^[a-z0-9._-]{3,30}$'),
  ad text not null,
  rol text not null default 'personel' check (rol in ('yonetici','personel')),
  aktif boolean not null default true,
  olusturma timestamptz not null default now()
);

create table if not exists public.musteriler  (id text primary key, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.ziyaretler  (id text primary key, musteri_id text not null, tarih date, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.randevular  (id text primary key, tarih date, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.hizmetler   (id text primary key, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.urunler     (id text primary key, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.urun_satis  (id text primary key, tarih date, veri jsonb not null default '{}', olusturma timestamptz not null default now(), guncelleme timestamptz not null default now());
create table if not exists public.ayarlar     (anahtar text primary key, veri jsonb not null default '{}', guncelleme timestamptz not null default now());

create index if not exists ziyaretler_tarih_idx on public.ziyaretler (tarih);
create index if not exists ziyaretler_musteri_idx on public.ziyaretler (musteri_id);
create index if not exists randevular_tarih_idx on public.randevular (tarih);
create index if not exists urun_satis_tarih_idx on public.urun_satis (tarih);

create or replace function public.dokun() returns trigger language plpgsql as $$
begin new.guncelleme := now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['musteriler','ziyaretler','randevular','hizmetler','urunler','urun_satis','ayarlar'] loop
    execute format('drop trigger if exists dokun on public.%I', t);
    execute format('create trigger dokun before update on public.%I for each row execute function public.dokun()', t);
  end loop;
end $$;

-- 2) Yetki yardımcıları --------------------------------------------------
create or replace function public.aktif_kullanici() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiller where id = auth.uid() and aktif)
$$;

create or replace function public.yonetici() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiller where id = auth.uid() and aktif and rol = 'yonetici')
$$;

create or replace function public.silebilir() returns boolean
language sql stable security definer set search_path = public as $$
  select public.yonetici()
      or (public.aktif_kullanici()
          and coalesce((select (veri->>'personelSil')::boolean from public.ayarlar where anahtar = 'genel'), false))
$$;

revoke all on function public.aktif_kullanici(), public.yonetici(), public.silebilir() from public, anon;
grant execute on function public.aktif_kullanici(), public.yonetici(), public.silebilir() to authenticated;

-- 3) Yeni kullanıcı → profil (ilk kullanıcı otomatik yönetici olur) -------
create or replace function public.yeni_kullanici() returns trigger
language plpgsql security definer set search_path = public as $$
declare k text; sayi int;
begin
  select count(*) into sayi from public.profiller;
  k := lower(coalesce(nullif(new.raw_user_meta_data->>'kullanici',''), split_part(new.email, '@', 1)));
  insert into public.profiller (id, kullanici, ad, rol)
  values (new.id, k, coalesce(nullif(new.raw_user_meta_data->>'ad',''), k),
          case when sayi = 0 then 'yonetici'
               when new.raw_user_meta_data->>'rol' = 'yonetici' then 'yonetici'
               else 'personel' end);
  return new;
end $$;

drop trigger if exists yeni_kullanici_olustu on auth.users;
create trigger yeni_kullanici_olustu after insert on auth.users
  for each row execute function public.yeni_kullanici();

-- 4) Satır düzeyi güvenlik (RLS) ----------------------------------------
alter table public.profiller enable row level security;
drop policy if exists profiller_oku on public.profiller;
drop policy if exists profiller_guncelle on public.profiller;
create policy profiller_oku on public.profiller for select to authenticated using (public.aktif_kullanici());
create policy profiller_guncelle on public.profiller for update to authenticated using (public.yonetici()) with check (public.yonetici());

do $$
declare t text;
begin
  -- personelin de ekleyip düzenleyebildiği kayıtlar; silme: yönetici ya da (ayar açıksa) personel
  foreach t in array array['musteriler','ziyaretler','randevular'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_oku', t);
    execute format('drop policy if exists %I on public.%I', t||'_ekle', t);
    execute format('drop policy if exists %I on public.%I', t||'_guncelle', t);
    execute format('drop policy if exists %I on public.%I', t||'_sil', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.aktif_kullanici())', t||'_oku', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.aktif_kullanici())', t||'_ekle', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.aktif_kullanici()) with check (public.aktif_kullanici())', t||'_guncelle', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.silebilir())', t||'_sil', t);
  end loop;

  -- ürün satışı: personel ekler/düzenler, silmek yönetici işi
  execute 'alter table public.urun_satis enable row level security';
  execute 'drop policy if exists urun_satis_oku on public.urun_satis';
  execute 'drop policy if exists urun_satis_ekle on public.urun_satis';
  execute 'drop policy if exists urun_satis_guncelle on public.urun_satis';
  execute 'drop policy if exists urun_satis_sil on public.urun_satis';
  execute 'create policy urun_satis_oku on public.urun_satis for select to authenticated using (public.aktif_kullanici())';
  execute 'create policy urun_satis_ekle on public.urun_satis for insert to authenticated with check (public.aktif_kullanici())';
  execute 'create policy urun_satis_guncelle on public.urun_satis for update to authenticated using (public.aktif_kullanici()) with check (public.aktif_kullanici())';
  execute 'create policy urun_satis_sil on public.urun_satis for delete to authenticated using (public.yonetici())';

  -- fiyat listesi, ürün kartları, ortak ayarlar: herkes okur, yalnızca yönetici yazar
  foreach t in array array['hizmetler','urunler','ayarlar'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_oku', t);
    execute format('drop policy if exists %I on public.%I', t||'_ekle', t);
    execute format('drop policy if exists %I on public.%I', t||'_guncelle', t);
    execute format('drop policy if exists %I on public.%I', t||'_sil', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.aktif_kullanici())', t||'_oku', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.yonetici())', t||'_ekle', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.yonetici()) with check (public.yonetici())', t||'_guncelle', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.yonetici())', t||'_sil', t);
  end loop;
end $$;

-- 5) Erişim izinleri (tablolar otomatik açılmadığı için elle) -------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.musteriler, public.ziyaretler, public.randevular, public.hizmetler, public.urunler, public.urun_satis, public.ayarlar to authenticated;
grant select, update on public.profiller to authenticated;
revoke all on all tables in schema public from anon;

-- 6) Anlık güncelleme (Realtime) ------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['musteriler','ziyaretler','randevular','hizmetler','urunler','urun_satis','ayarlar','profiller'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- Bitti. Sonuç kontrolü (her tabloda rls_acik = true olmalı):
select c.relname as tablo, c.relrowsecurity as rls_acik
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' order by 1;
