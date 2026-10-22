# SİYA | Güzellik & Kuaför — Müşteri Kayıtları

Kurulum gerektirmeyen statik sayfa. Tasarım, PCS Transit YYS panosundaki "Kontrol Kulesi" düzeninin gül-altın uyarlamasıdır.
Veriler Supabase'de (bulut) tutulur; tarayıcı yalnızca önbellek olarak kullanılır. Kurulum: `supabase/kurulum.sql` (tablolar, yetki kuralları, anlık güncelleme) ve `supabase/functions/kullanici-yonet` (kullanıcı açma/silme). Bağlantı bilgileri `siya.js` başındadır (`BULUT_URL`, `BULUT_KEY`); URL boş bırakılırsa uygulama eskisi gibi yalnızca bu cihazda çalışır. Ayarlar > Yedekle / Aktar ile JSON yedeği yine alınabilir. Otomatik yedekleme: `supabase/yedekleme.sql` her gece 00:00'da (Türkiye saati) tüm kayıtların kopyasını `yedekler` tablosuna alır (45 gün saklanır); yönetici Ayarlar > Veri ve Yedek > Yedekleri Göster ekranından yedekleri indirir ya da geri yükler.

## Sayfalar

- **Pano:** günün özeti, doğum günü ve gelmeyen müşteriler için üst banttaki tıklanabilir kutular, son 7 gün grafiği, grup / ödeme dağılımı, popüler işlemler, bugünün ziyaretleri, doğum günleri ve uzun süredir gelmeyenler.
- **Müşteriler:** arama, filtre (VIP, doğum günü, gelmeyen, alerji), sıralama, tablo / kart görünümü, müşteri kartı ve ziyaret geçmişi.
- **Randevular:** gün ve hafta görünümü, saat / süre / uzman, çakışma uyarısı, WhatsApp hatırlatma, “Geldi” ile ziyarete çevirme.
- **Ürünler & Stok:** HAKEDIS.xlsx STOK LISTESI'ndeki 30 ürün; satış, stok girişi, kalan stok ve düşük stok uyarısı.
- **Ziyaret Defteri:** dönem seçimi (bugün, hafta, ay, özel tarih), ödeme / uzman filtresi, gün gün tutarlar, CSV.
- **Raporlar (yönetici):** brüt / net ciro, ödeme türü, grup, işlem ve uzman bazlı döküm, isteğe bağlı hakediş.
- **Fiyat Listesi:** HAKEDIS.xlsx'teki 47 işlem; yönetici fiyatları düzenler, ziyarette işlem seçince tutar otomatik yazılır.
- **Ayarlar:** tema (açık / koyu), menü, kredi kartı kesintisi, hakediş oranı, kullanıcılar, yedek.

Ctrl+K: müşteri, işlem ya da sayfa hızlı arama. Telefonda menü alta iner.

## Kullanıcılar

Bulut modunda giriş Supabase Auth iledir: kullanıcı adı (arkada `kullanıcıadı@siya-giris.com`) ya da e-posta + şifre. İlk açılan hesap otomatik yönetici olur; sonrakileri yönetici Ayarlar > Kullanıcılar'dan açar. (Yerel mod: ilk açılışta yönetici hesabı kurulur.) Personel müşteri ve ziyaret ekler/düzenler; silme, fiyat listesi, ciro, raporlar ve yedekleme yöneticiye aittir.
Şifreler tarayıcıda PBKDF2 ile özetlenir. Veri sunucuda olmadığı için bu giriş ortak bilgisayarda kötü niyetli birine karşı koruma sağlamaz; gerçek güvenlik için sonraki adım Supabase'tir.

## Dosyalar

`index.html`, `siya.css`, `siya.js`, `siya.svg`, `fonts/` (Inter ve Plus Jakarta Sans, SIL OFL; lisans metinleri aynı klasörde).
GitHub Pages: Settings > Pages > main / root.
