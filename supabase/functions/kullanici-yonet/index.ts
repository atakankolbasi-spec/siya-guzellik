// SİYA — kullanıcı yönetimi (yalnızca yönetici çağırabilir)
// Supabase paneli → Edge Functions → "Deploy a new function" → ad: kullanici-yonet → bu dosyanın içeriğini yapıştırın.
// "Verify JWT" açık kalsın.
import { createClient } from 'npm:@supabase/supabase-js@2';

const EPOSTA_ALANI = 'siya-giris.com'; // uygulamadaki EPOSTA_ALANI ile aynı olmalı
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const yanit = (govde: unknown, kod = 200) =>
  new Response(JSON.stringify(govde), { status: kod, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const servis = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, servis, { auth: { persistSession: false } });

    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: { user } } = await admin.auth.getUser(jwt);
    if (!user) return yanit({ hata: 'Oturum geçersiz.' }, 401);
    const { data: ben } = await admin.from('profiller').select('rol, aktif').eq('id', user.id).maybeSingle();
    if (!ben || !ben.aktif || ben.rol !== 'yonetici') return yanit({ hata: 'Bu işlem yöneticiye aittir.' }, 403);

    const b = await req.json();
    const kullanici = String(b.kullanici || '').trim().toLowerCase();

    if (b.islem === 'olustur') {
      if (!/^[a-z0-9._-]{3,30}$/.test(kullanici)) return yanit({ hata: 'Kullanıcı adı 3–30 karakter; harf, rakam, nokta, tire ya da alt çizgi olabilir.' }, 400);
      if (String(b.sifre || '').length < 6) return yanit({ hata: 'Şifre en az 6 karakter olmalı.' }, 400);
      const rol = b.rol === 'yonetici' ? 'yonetici' : 'personel';
      const { data, error } = await admin.auth.admin.createUser({
        email: `${kullanici}@${EPOSTA_ALANI}`, password: String(b.sifre), email_confirm: true,
        user_metadata: { kullanici, ad: String(b.ad || kullanici).trim(), rol },
      });
      if (error) return yanit({ hata: /already|registered|exists/i.test(error.message) ? 'Bu kullanıcı adı zaten var.' : error.message }, 400);
      return yanit({ tamam: true, id: data.user?.id });
    }

    const id = String(b.id || '');
    if (!id) return yanit({ hata: 'Kullanıcı seçilmedi.' }, 400);
    const { data: hedef } = await admin.from('profiller').select('id, rol, aktif').eq('id', id).maybeSingle();
    if (!hedef) return yanit({ hata: 'Kullanıcı bulunamadı.' }, 404);
    const aktifYonetici = async () => (await admin.from('profiller').select('id', { count: 'exact', head: true }).eq('rol', 'yonetici').eq('aktif', true)).count || 0;

    if (b.islem === 'sifre') {
      if (String(b.sifre || '').length < 6) return yanit({ hata: 'Şifre en az 6 karakter olmalı.' }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { password: String(b.sifre) });
      if (error) return yanit({ hata: error.message }, 400);
      return yanit({ tamam: true });
    }
    if (b.islem === 'aktif') {
      const ac = !!b.aktif;
      if (!ac && hedef.rol === 'yonetici' && hedef.aktif && (await aktifYonetici()) < 2) return yanit({ hata: 'Son aktif yöneticiyi kapatamazsınız.' }, 400);
      if (!ac && id === user.id) return yanit({ hata: 'Kendi hesabınızı kapatamazsınız.' }, 400);
      await admin.from('profiller').update({ aktif: ac }).eq('id', id);
      await admin.auth.admin.updateUserById(id, { ban_duration: ac ? 'none' : '876000h' });
      return yanit({ tamam: true });
    }
    if (b.islem === 'rol') {
      const rol = b.rol === 'yonetici' ? 'yonetici' : 'personel';
      if (rol === 'personel' && hedef.rol === 'yonetici' && hedef.aktif && (await aktifYonetici()) < 2) return yanit({ hata: 'Son aktif yöneticinin yetkisi düşürülemez.' }, 400);
      await admin.from('profiller').update({ rol }).eq('id', id);
      return yanit({ tamam: true });
    }
    if (b.islem === 'sil') {
      if (id === user.id) return yanit({ hata: 'Kendi hesabınızı silemezsiniz.' }, 400);
      if (hedef.rol === 'yonetici' && hedef.aktif && (await aktifYonetici()) < 2) return yanit({ hata: 'Son aktif yönetici silinemez.' }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return yanit({ hata: error.message }, 400);
      return yanit({ tamam: true });
    }
    return yanit({ hata: 'Bilinmeyen işlem.' }, 400);
  } catch (e) {
    return yanit({ hata: String((e as Error).message || e) }, 500);
  }
});
