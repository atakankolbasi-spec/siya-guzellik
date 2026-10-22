# SİYA | Güzellik & Kuaför — Müşteri Kayıtları

Kurulum gerektirmeyen statik sayfa. Tasarım, PCS Transit YYS panosundaki "Kontrol Kulesi" düzeninin gül-altın uyarlamasıdır.
Veriler tarayıcıda (localStorage) tutulur; düzenli olarak Ayarlar > Yedekle / Aktar ile JSON yedeği alın.

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

İlk açılışta yönetici hesabı kurulur. Personel müşteri ve ziyaret ekler/düzenler; silme, fiyat listesi, ciro, raporlar ve yedekleme yöneticiye aittir.
Şifreler tarayıcıda PBKDF2 ile özetlenir. Veri sunucuda olmadığı için bu giriş ortak bilgisayarda kötü niyetli birine karşı koruma sağlamaz; gerçek güvenlik için sonraki adım Supabase'tir.

## Dosyalar

`index.html`, `siya.css`, `siya.js`, `siya.svg`, `fonts/` (Inter ve Plus Jakarta Sans, SIL OFL; lisans metinleri aynı klasörde).
GitHub Pages: Settings > Pages > main / root.
