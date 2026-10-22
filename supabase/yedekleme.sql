-- SİYA — otomatik yedekleme (bulutta, her gece)
-- Supabase paneli → SQL Editor → New query → tamamını yapıştırıp RUN.
-- Güvenle tekrar çalıştırılabilir.
--
-- Ne yapar?
--   * Her gece 00:00'da (Türkiye saati) tüm kayıtların bir kopyasını "yedekler" tablosuna alır.
--   * Otomatik yedekler 45 gün saklanır, sonra silinir.
--   * Yönetici uygulamadan (Ayarlar → Veri ve Yedek) yedekleri görür, indirir, geri yükler.

-- 1) Yedek tablosu --------------------------------------------------------
create table if not exists public.yedekler (
  id bigint generated always as identity primary key,
  olusturma timestamptz not null default now(),
  tur text not null default 'otomatik' check (tur in ('otomatik', 'elle')),
  ozet jsonb not null default '{}',
  veri jsonb not null
);
create index if not exists yedekler_olusturma_idx on public.yedekler (olusturma desc);

alter table public.yedekler enable row level security;
drop policy if exists yedekler_oku on public.yedekler;
create policy yedekler_oku on public.yedekler for select to authenticated using (public.yonetici());

revoke all on public.yedekler from anon, authenticated;
grant select on public.yedekler to authenticated;
grant all on public.yedekler to service_role;

-- 2) Yedek alan işlev ------------------------------------------------------
create or replace function public.yedek_al(tur text default 'otomatik') returns bigint
language plpgsql security definer set search_path = public as $$
declare yeni bigint; v jsonb; o jsonb;
begin
  -- uygulamadan çağrılırsa yalnızca yönetici; zamanlayıcı (oturumsuz) çağrısı serbest
  if auth.uid() is not null and not public.yonetici() then
    raise exception 'Bu işlem yöneticiye aittir.' using errcode = '42501';
  end if;
  if tur not in ('otomatik', 'elle') then tur := 'elle'; end if;

  v := jsonb_build_object(
    'musteriler', coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.musteriler t), '[]'::jsonb),
    'ziyaretler', coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.ziyaretler t), '[]'::jsonb),
    'randevular', coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.randevular t), '[]'::jsonb),
    'hizmetler',  coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.hizmetler t), '[]'::jsonb),
    'urunler',    coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.urunler t), '[]'::jsonb),
    'urun_satis', coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.urun_satis t), '[]'::jsonb),
    'ayarlar',    coalesce((select jsonb_agg(to_jsonb(t)) from public.ayarlar t), '[]'::jsonb)
  );
  o := jsonb_build_object(
    'musteri', jsonb_array_length(v->'musteriler'),
    'ziyaret', jsonb_array_length(v->'ziyaretler'),
    'randevu', jsonb_array_length(v->'randevular'),
    'urun', jsonb_array_length(v->'urunler'),
    'satis', jsonb_array_length(v->'urun_satis')
  );

  insert into public.yedekler (tur, ozet, veri) values (tur, o, v) returning id into yeni;
  delete from public.yedekler where yedekler.tur = 'otomatik' and olusturma < now() - interval '45 days';
  return yeni;
end $$;

revoke all on function public.yedek_al(text) from public, anon;
grant execute on function public.yedek_al(text) to authenticated, service_role;

-- 3) Zamanlayıcı: her gece 21:00 UTC = 00:00 Türkiye -----------------------
-- Not: pg_cron kapalıysa Supabase → Database → Extensions → "pg_cron" anahtarını açıp bu sorguyu yeniden çalıştırın.
create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'siya-gece-yedegi') then
    perform cron.unschedule('siya-gece-yedegi');
  end if;
  perform cron.schedule('siya-gece-yedegi', '0 21 * * *', $cron$select public.yedek_al('otomatik')$cron$);
end $$;

-- 4) İlk yedeği hemen al ve sonucu göster -----------------------------------
select public.yedek_al('otomatik') as ilk_yedek_no;
select id, olusturma, tur, ozet from public.yedekler order by olusturma desc limit 5;
select jobname, schedule, active from cron.job where jobname = 'siya-gece-yedegi';
