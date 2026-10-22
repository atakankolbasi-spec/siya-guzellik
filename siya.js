(function () {
  'use strict';

  var KEY = 'siya.musteriler.v1';
  /* Kaynak: HAKEDIS.xlsx > KUAFOR FIYAT ve GUZELLIK FIYAT sayfaları */
  var VARSAYILAN_HIZMETLER = [
    ['Kuaför', 'Fön', 300], ['Kuaför', 'Fön & Yıkama', 400], ['Kuaför', 'Kırık Fön', 400], ['Kuaför', 'Kırık Fön & Yıkama', 500],
    ['Kuaför', 'Yıkama', 150], ['Kuaför', 'Saç Kesim', 500], ['Kuaför', 'Saç Kesim & Yıkama', 600], ['Kuaför', 'Maşa', 600],
    ['Kuaför', 'Topuz', 1000], ['Kuaför', 'Ombre, Sombre, Röfle - Başlangıç Fiyat', 2500], ['Kuaför', 'Perma - Başlangıç Fiyat', 2500],
    ['Kuaför', 'Brezilya Fönü - Başlangıç Fiyat', 1500], ['Kuaför', 'Keratin Botoks', 1500], ['Kuaför', 'Dip Boya', 600],
    ['Kuaför', 'Komple Boya', 1000], ['Kuaför', 'Kaynak', 12500], ['Kuaför', 'Cila', 500], ['Kuaför', 'Şok Bakım', 1000],
    ['Güzellik', 'Cilt Bakım', 1250], ['Güzellik', 'Saç Terapisi', 1500], ['Güzellik', 'G5 Zayıflama - 6 Seans', 2000],
    ['Güzellik', 'Slim Thin - 6 Seans (Bacak-Göbek)', 4000], ['Güzellik', 'Slim Thin - 6 Seans (Kol)', 2500],
    ['Güzellik', 'Collift Yüz Gençleştirme', 3500], ['Güzellik', 'Microblading (Kıl Tekniği Kaş)', 3000],
    ['Güzellik', 'Ölçülü Kaş Alım', 200], ['Güzellik', 'Manikür', 300], ['Güzellik', 'Pedikür', 500],
    ['Güzellik', 'Manikür & Kalıcı Oje', 550], ['Güzellik', 'Pedikür & Kalıcı Oje', 850], ['Güzellik', 'Protez Tırnak', 1000],
    ['Güzellik', 'French & İnci Tozu', 100], ['Güzellik', 'Jel Güçlendirme', 850],
    ['Lazer', 'Albycold Diode Lazer 3 Bölge (Kolaltı-Genital-Tüm Bacak) - Tek Seans', 1500],
    ['Lazer', 'Albycold Diode Lazer Komple Vücut - Tek Seans', 2000], ['Lazer', 'Albycold Diode Lazer - Bacak', 750],
    ['Lazer', 'Albycold Diode Lazer - Kol', 750], ['Lazer', 'Albycold Diode Lazer - Genital', 500],
    ['Lazer', 'Albycold Diode Lazer - Kolaltı', 500], ['Lazer', 'Albycold Diode Lazer - Tüm Yüz', 500],
    ['Lazer', 'Albycold Diode Lazer - Bıyık', 350],
    ['Ağda', 'Ağda 3 Bölge (Kolaltı-Genital-Tüm Bacak)', 1000], ['Ağda', 'Ağda Komple Vücut', 1500], ['Ağda', 'Ağda - Kolaltı', 250],
    ['Ağda', 'Ağda - Genital', 500], ['Ağda', 'Ağda - Bacak', 500], ['Ağda', 'Ağda - Kol', 500]
  ];
  var ESKI_VARSAYILAN = ['Saç Kesimi', 'Fön', 'Saç Boyama', 'Röfle / Balyaj', 'Keratin', 'Perma', 'Saç Bakımı', 'Manikür', 'Pedikür',
    'Kalıcı Oje', 'Protez Tırnak', 'Cilt Bakımı', 'Kaş / Kirpik', 'Makyaj', 'Gelin Başı', 'Ağda', 'Lazer', 'Masaj'];
  var KATEGORILER = ['Kuaför', 'Güzellik', 'Lazer', 'Ağda'];
  var SON_KUL_KEY = 'siya.sonkullanici', RAN_KEY = 'siya.randevular.v1', URUN_KEY = 'siya.urunler.v1', USAT_KEY = 'siya.urunsatis.v1', AYAR_KEY = 'siya.ayarlar.v1', HIZ_KEY = 'siya.hizmetler.v1', KUL_KEY = 'siya.kullanicilar.v1', OTURUM_KEY = 'siya.oturum';
  var ODEMELER = ['Nakit', 'Kredi Kartı', 'Havale / EFT'];
  var GUN_RISK = 60;

  /* Kaynak: HAKEDIS.xlsx > STOK LISTESI (kod, ürün, satış, alış, miktar, devreden satış) */
  var VARSAYILAN_URUNLER = [
    ['S26CB001', 'Code Blonde Saç Kremi 500ml. Kuru Saçlar', 'Code Blonde', 750, 315.28, 9, 0],
    ['S26CB002', 'Code Blonde Serum 120ml. Keratin', 'Code Blonde', 750, 240.28, 14, 0],
    ['S26CB003', 'Code Blonde Yoğun Saç Bakım Serumu 50ml.', 'Code Blonde', 750, 240.28, 12, 0],
    ['S26CB004', 'Code Blonde Şampuan 500ml. Kabaran Saçlar', 'Code Blonde', 500, 100, 9, 0],
    ['S26CB005', 'Code Blonde Serum 120ml. Argan', 'Code Blonde', 750, 240.28, 6, 0],
    ['S26BT001', 'Batçı Yoğun Onarım Ve Besleyici Saç Kremi 200ml (Kahveli)', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT002', 'Batçı Matchalı Saç Kremi 200ml', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT003', 'Batçı Havyarlı Saç Kremi 200ml', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT004', 'Batçı Havyarlı Saç Fön Sütü 200ml', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT005', 'Batçı Matchalı Saç Fön Sütü 200ml', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT006', 'Batçı Besleyici Fön Sütü 200ml Kahveli', 'Batçı', 500, 140.28, 6, 0],
    ['S26BT007', 'Batçı El Ve Yüz Bakım Kremi 300ml', 'Batçı', 500, 60.28, 6, 0],
    ['S26IQ001', 'IQ Şampuan', 'IQ', 1700, 887, 6, 0],
    ['S26IQ002', 'IQ Krem', 'IQ', 1700, 887, 6, 0],
    ['S26IQ003', 'IQ Serum', 'IQ', 2000, 1187, 6, 0],
    ['S26IQ004', 'IQ Maske', 'IQ', 1900, 1037, 6, 0],
    ['S26S001', 'Ombreli Premium 0.8 Gramaj 200 Adet', 'Kaynak Saç', 15000, 6000, 1, 0],
    ['S26S002', 'Açık Kumral Premium 0.8 Gramaj 200 Adet', 'Kaynak Saç', 15000, 6000, 1, 0],
    ['S26S003', 'Ombreli Özbek 0.8 Gramaj 200 Adet', 'Kaynak Saç', 12000, 6000, 1, 0],
    ['S26S004', 'Kumral Özbek 0.8 Gramaj 200 Adet', 'Kaynak Saç', 12000, 6000, 1, 0],
    ['S26S005', 'Kahverengi Özbek 0.6 Gramaj 200 Adet', 'Kaynak Saç', 12000, 6000, 1, 1],
    ['S26G001', 'Kaş Kirpik Serumu', 'Cilt Bakım', 750, 200, 10, 0],
    ['S26G002', 'Beyazlatıcı Krem', 'Cilt Bakım', 750, 200, 10, 0],
    ['S26G003', 'BB Krem', 'Cilt Bakım', 1250, 500, 2, 0],
    ['S26G004', 'Anubis Peeling', 'Cilt Bakım', 1500, 250, 5, 0],
    ['S26G005', 'Transparent Miceller Su', 'Cilt Bakım', 750, 250, 4, 0],
    ['S26G006', 'Anubis 7 Days Shock', 'Cilt Bakım', 1250, 250, 4, 0],
    ['S26G007', 'Transparent Krem', 'Cilt Bakım', 1000, 250, 3, 0],
    ['S26G008', 'Lovona Lazer Sonrası Krem', 'Cilt Bakım', 500, 250, 1, 0],
    ['S26G009', 'Selülit Krem', 'Cilt Bakım', 750, 250, 1, 0]
  ];
  /* Supabase bağlantısı: URL boşsa uygulama eskisi gibi yalnızca bu cihazda çalışır */
  var BULUT_URL = 'https://ekdgumcqyuhtjdduhlvp.supabase.co', BULUT_KEY = 'sb_publishable_HtPipUUY5fUfxre_6Dohyg_jW2c5RsN', EPOSTA_ALANI = 'siya-giris.com';
  var BEKLEYEN_KEY = 'siya.bekleyen', GECIS_KEY = 'siya.bulutGecis', PROFIL_KEY = 'siya.profil';
  var sb = null;
  try { if (BULUT_URL && window.createPCSClient) sb = window.createPCSClient(BULUT_URL, BULUT_KEY, { auth: { persistSession: true, autoRefreshToken: true } }); } catch (e) { sb = null; }
  var bulut = { durum: 'baglan', snap: {}, hazir: false, mesgul: false, tekrar: false, zaman: 0, yeniden: 0, kanal: null, son: '' };
  var db = yukle();
  var hizmetler = yukleHiz();
  var kullanicilar = yukleKul();
  var randevular = yukleListe(RAN_KEY);
  var urunSatis = yukleListe(USAT_KEY);
  var urunler = yukleUrun();
  var oturum = null;
  var ayarlar = yukleAyar();
  var durum = {
    m: { ara: '', filtre: 'hepsi', sirala: 'ad', limit: 50 },
    z: { donem: 'bugun', bas: '', bit: '', odeme: '', uzman: '', ara: '' },
    r: { donem: 'ay', bas: '', bit: '' }, fa: '', ayb: 'gorunum', aq: '', sonSayfa: '', pg: bugun(), rn: { gun: bugun() }, st: { ara: '', filtre: 'hepsi' }
  };
  var $ = function (s) { return document.querySelector(s); };
  var modal = $('#modal');

  /* ---------- veri ---------- */
  function yukle() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function yukleHiz() {
    try {
      var v = JSON.parse(localStorage.getItem(HIZ_KEY));
      var eskiVarsayilan = Array.isArray(v) && v.length && v.every(function (h) {
        return !h.fiyat && !h.kategori && ESKI_VARSAYILAN.indexOf(h.ad) > -1;
      });
      if (Array.isArray(v) && !eskiVarsayilan) return v;
    } catch (e) { /* ilk açılış */ }
    var ilk = VARSAYILAN_HIZMETLER.map(function (h) { return { id: yeniId(), kategori: h[0], ad: h[1], fiyat: h[2] }; });
    try { localStorage.setItem(HIZ_KEY, JSON.stringify(ilk)); } catch (e) { /* depolama kapalı */ }
    return ilk;
  }
  function kaydetHiz() {
    try { localStorage.setItem(HIZ_KEY, JSON.stringify(hizmetler)); esitleTetik(); return true; }
    catch (e) { bildir('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); return false; }
  }
  function yukleListe(k) {
    try { var v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function kaydetListe(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); esitleTetik(); return true; }
    catch (e) { bildir('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); return false; }
  }
  function kaydetRan() { return kaydetListe(RAN_KEY, randevular); }
  function kaydetUSat() { return kaydetListe(USAT_KEY, urunSatis); }
  function kaydetUrun() { return kaydetListe(URUN_KEY, urunler); }
  function yukleUrun() {
    var ham = null;
    try { ham = localStorage.getItem(URUN_KEY); } catch (e) { ham = null; }
    if (ham !== null) { try { var v = JSON.parse(ham); if (Array.isArray(v)) return v; } catch (e) { /* yeniden yükle */ } }
    var ilk = VARSAYILAN_URUNLER.map(function (u) { return { id: yeniId(), kod: u[0], ad: u[1], grup: u[2], satis: u[3], alis: u[4], miktar: u[5], devir: u[6] }; });
    try { localStorage.setItem(URUN_KEY, JSON.stringify(ilk)); } catch (e) { /* depolama kapalı */ }
    return ilk;
  }
  function yukleKul() {
    try { var v = JSON.parse(localStorage.getItem(KUL_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function kaydetKul() {
    try { localStorage.setItem(KUL_KEY, JSON.stringify(kullanicilar)); return true; }
    catch (e) { bildir('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); return false; }
  }
  function yonetici() { return !!oturum && oturum.rol === 'yonetici'; }
  function silebilir() { return yonetici() || (!!oturum && ayarlar.personelSil === true); }
  function kaydet() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); esitleTetik(); return true; }
    catch (e) { bildir('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); return false; }
  }
  function yeniId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function bul(id) { return db.filter(function (m) { return m.id === id; })[0]; }

  /* ---------- yardımcılar ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function tr(s) { return String(s || '').toLocaleLowerCase('tr'); }
  function bugun() {
    var d = new Date();
    return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
  }
  function p2(n) { return n < 10 ? '0' + n : '' + n; }
  function tarihGoster(iso) {
    if (!iso) return '—';
    var a = iso.split('-');
    return a.length === 3 ? a[2] + '.' + a[1] + '.' + a[0] : iso;
  }
  function para(n) {
    return (Number(n) || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺';
  }
  function gunFarki(iso) {
    if (!iso) return null;
    var a = iso.split('-').map(Number);
    var t = new Date(a[0], a[1] - 1, a[2]);
    var b = new Date(); b = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((b - t) / 864e5);
  }
  function ziyaretler(m) { return (m.ziyaretler || []).slice().sort(function (a, b) { return a.tarih < b.tarih ? 1 : -1; }); }
  function sonZiyaret(m) { var z = ziyaretler(m)[0]; return z ? z.tarih : ''; }
  function toplam(m) { return (m.ziyaretler || []).reduce(function (s, z) { return s + (Number(z.tutar) || 0); }, 0); }
  function sonrakiDogum(iso) {
    if (!iso) return null;
    var a = iso.split('-').map(Number);
    var b = new Date(); b = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    var d = new Date(b.getFullYear(), a[1] - 1, a[2]);
    if (d < b) d = new Date(b.getFullYear() + 1, a[1] - 1, a[2]);
    return Math.round((d - b) / 864e5);
  }
  function yas(iso) {
    if (!iso) return '';
    var a = iso.split('-').map(Number), n = new Date();
    var y = n.getFullYear() - a[0];
    if (n.getMonth() + 1 < a[1] || (n.getMonth() + 1 === a[1] && n.getDate() < a[2])) y--;
    return y > 0 && y < 120 ? y : '';
  }
  function telTemiz(t) { return String(t || '').replace(/[^\d+]/g, ''); }
  function waLink(t) {
    var d = telTemiz(t).replace(/^\+/, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    if (d.charAt(0) === '0') d = '90' + d.slice(1);
    else if (d.length === 10) d = '90' + d;
    return 'https://wa.me/' + d;
  }
  function renkler(ad) {
    var h = 0, i;
    for (i = 0; i < ad.length; i++) h = (h * 31 + ad.charCodeAt(i)) % 40;
    h = (h + 335) % 360;
    return '--h1:hsl(' + h + ',42%,62%);--h2:hsl(' + ((h + 28) % 360) + ',38%,42%)';
  }
  function bas(ad) {
    var p = String(ad || '?').trim().split(/\s+/);
    return ((p[0] || '?').charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toLocaleUpperCase('tr');
  }
  var tmr;
  function bildir(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(tmr); tmr = setTimeout(function () { t.classList.remove('on'); }, 2800);
  }

  /* ---------- tarih ve toplama yardımcıları ---------- */
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var GUN_KISA = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  var RENKLER = ['#b8506a', '#e6b36e', '#7c6cc4', '#3fa89b', '#9aa3b5'];
  var SAYFALAR = [
    ['pano', 'Pano', 'pano', 'GÜNLÜK ÖZET', 'Bugünün özeti, randevular ve kısa yollar'],
    ['musteriler', 'Müşteriler', 'users', 'MÜŞTERİ KAYITLARI', 'Tüm müşteriler, notlar ve ziyaret geçmişi'],
    ['randevular', 'Randevular', 'takvim', 'RANDEVU TAKVİMİ', 'Günlük ve haftalık randevu planı'],
    ['ziyaretler', 'Ziyaret Defteri', 'book', 'ZİYARET DEFTERİ', 'Günlük işlemler, tutarlar ve ödeme türleri'],
    ['stok', 'Ürünler & Stok', 'kutu', 'ÜRÜN VE STOK', 'Satış fiyatı, maliyet ve kalan stok'],
    ['raporlar', 'Raporlar', 'chart', 'RAPORLAR', 'Ciro, işlem ve uzman bazlı değerlendirme', true],
    ['fiyatlar', 'Fiyat Listesi', 'tag', 'FİYAT LİSTESİ', 'İşlemler ve satış fiyatları'],
    ['ayarlar', 'Ayarlar', 'ayar', 'AYARLAR', 'Görünüm, hesap, kullanıcılar ve yedekleme']
  ];
  function sf(ad) { return SAYFALAR.filter(function (x) { return x[0] === ad; })[0]; }
  var IKON = {
    pano: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    takvim: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    kutu: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.5L12 12.5l8.7-5M12 22V12.5"/>',
    kul: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    kilit: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    goz: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    ayar: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    ara: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    arti: '<path d="M12 5v14M5 12h14"/>',
    cikis: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    ay: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    gunes: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    ok: '<path d="M9 18l6-6-6-6"/>',
    panel: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18"/>',
    pasta: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20M7 8v3M12 8v3M17 8v3"/>',
    uyari: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    makas: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>',
    indir: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    bina: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
    tik: '<path d="M20 6L9 17l-5-5"/>',
    yildiz: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'
  };
  function ik(ad) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IKON[ad] || '') + '</svg>'; }
  function isoD(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function dObj(iso) { var a = iso.split('-').map(Number); return new Date(a[0], a[1] - 1, a[2]); }
  function gunEkle(iso, n) { var d = dObj(iso); d.setDate(d.getDate() + n); return isoD(d); }
  function uzunTarih(iso) { var d = dObj(iso); return d.getDate() + ' ' + AYLAR[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + GUNLER[d.getDay()]; }
  function donemAraligi(k, bas, bit) {
    var b = bugun(), d = dObj(b), y = d.getFullYear(), a = d.getMonth(), g;
    switch (k) {
      case 'bugun': return [b, b];
      case 'dun': return [gunEkle(b, -1), gunEkle(b, -1)];
      case 'hafta': g = (d.getDay() + 6) % 7; return [gunEkle(b, -g), gunEkle(b, 6 - g)];
      case 'ay': return [isoD(new Date(y, a, 1)), isoD(new Date(y, a + 1, 0))];
      case 'gecenay': return [isoD(new Date(y, a - 1, 1)), isoD(new Date(y, a, 0))];
      case 'son30': return [gunEkle(b, -29), b];
      case 'yil': return [y + '-01-01', y + '-12-31'];
      case 'ozel': return [bas || b, bit || bas || b];
      default: return ['0000-00-00', '9999-99-99'];
    }
  }
  var DONEMLER = [['bugun', 'Bugün'], ['dun', 'Dün'], ['hafta', 'Bu hafta'], ['ay', 'Bu ay'], ['gecenay', 'Geçen ay'], ['son30', 'Son 30 gün'], ['yil', 'Bu yıl'], ['hepsi', 'Tümü'], ['ozel', 'Tarih seç']];
  function donemAdi(k, r) {
    if (k === 'hepsi') return 'Tüm zamanlar';
    return r[0] === r[1] ? tarihGoster(r[0]) : tarihGoster(r[0]) + ' – ' + tarihGoster(r[1]);
  }
  function tumZ() {
    var r = [];
    db.forEach(function (m) { (m.ziyaretler || []).forEach(function (z) { r.push({ m: m, z: z }); }); });
    return r;
  }
  function aralikta(l, a) { return l.filter(function (x) { return x.z.tarih >= a[0] && x.z.tarih <= a[1]; }); }
  function kalemGrup(k) {
    if (k.grup) return k.grup;
    var h = hizmetler.filter(function (x) { return tr(x.ad) === tr(k.ad); })[0];
    return h && h.kategori ? h.kategori : 'Diğer';
  }
  function kalemPaylari(z) {
    var ks = (z.kalemler && z.kalemler.length) ? z.kalemler : (z.hizmetler || []).map(function (a) { return { ad: a, fiyat: 0 }; });
    var tutar = Number(z.tutar) || 0;
    var top = ks.reduce(function (s, k) { return s + (Number(k.fiyat) || 0); }, 0);
    if (!ks.length) return [{ ad: 'Diğer', grup: 'Diğer', pay: tutar }];
    return ks.map(function (k) {
      return { ad: k.ad, grup: kalemGrup(k), pay: top > 0 ? tutar * (Number(k.fiyat) || 0) / top : tutar / ks.length };
    });
  }
  function netCarpan(z) { return z.odeme === 'Kredi Kartı' ? 1 / (1 + (Number(ayarlar.kartKesinti) || 0) / 100) : 1; }
  function ozetle(l) {
    var o = { adet: 0, ciro: 0, net: 0, odeme: {}, gruplar: {}, hizmet: {}, uzman: {}, gunluk: {}, musteri: {}, ortak: 0 };
    l.forEach(function (x) {
      var z = x.z, t = Number(z.tutar) || 0, nc = netCarpan(z);
      o.adet++; o.ciro += t; o.net += t * nc; o.musteri[x.m.id] = 1;
      var od = z.odeme || 'Nakit'; o.odeme[od] = (o.odeme[od] || 0) + t;
      o.gunluk[z.tarih] = (o.gunluk[z.tarih] || 0) + t;
      var u = z.personel || '—'; o.uzman[u] = o.uzman[u] || { adet: 0, ciro: 0 }; o.uzman[u].adet++; o.uzman[u].ciro += t;
      kalemPaylari(z).forEach(function (k) {
        o.gruplar[k.grup] = (o.gruplar[k.grup] || 0) + k.pay;
        o.hizmet[k.ad] = o.hizmet[k.ad] || { adet: 0, ciro: 0 }; o.hizmet[k.ad].adet++; o.hizmet[k.ad].ciro += k.pay;
        if (ayarlar.ortakAd && k.grup === ayarlar.ortakGrup) o.ortak += k.pay * nc * (Number(ayarlar.ortakPay) || 0) / 100;
      });
    });
    return o;
  }
  function sirala(obj, alan) {
    return Object.keys(obj).map(function (k) {
      var v = obj[k]; return typeof v === 'number' ? { ad: k, ciro: v } : { ad: k, adet: v.adet, ciro: v.ciro };
    }).sort(function (a, b) { return (b[alan || 'ciro'] || 0) - (a[alan || 'ciro'] || 0); });
  }
  function riskli(m) { var f = gunFarki(sonZiyaret(m)); return f !== null && f >= GUN_RISK; }
  function dogumYakin(m) { var d = sonrakiDogum(m.dogum); return d !== null && d <= 30; }

  /* ---------- ayarlar ---------- */
  function yukleAyar() {
    var v = {};
    try { v = JSON.parse(localStorage.getItem(AYAR_KEY)) || {}; } catch (e) { v = {}; }
    var vars = { personelSil: false, tema: 'light', vurgu: '#b8506a', yogunluk: 'normal', yazi: '100', kose: 'yumusak', anim: true, menuSabit: false, gorunum: 'tablo', kartKesinti: 20, ortakAd: '', ortakPay: 50, ortakGrup: 'Kuaför', sonYedek: '' };
    Object.keys(vars).forEach(function (k) { if (v[k] === undefined) v[k] = vars[k]; });
    return v;
  }
  function kaydetAyar() {
    try { localStorage.setItem(AYAR_KEY, JSON.stringify(ayarlar)); esitleTetik(); return true; } catch (e) { return false; }
  }
  function olcekUygula() {
    var w = window.innerWidth, taban = w >= 2400 ? 1.5 : w >= 2000 ? 1.25 : w >= 1700 ? 1.1 : 1;
    var f = Math.round(taban * (Number(ayarlar.yazi) || 100)) / 100;
    document.documentElement.style.zoom = f === 1 ? '' : String(f);
  }
  function temaUygula() {
    var h = document.documentElement;
    var koyu = ayarlar.tema === 'dark' || (ayarlar.tema === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    h.setAttribute('data-theme', koyu ? 'dark' : 'light');
    h.style.setProperty('--a', /^#[0-9a-f]{6}$/i.test(ayarlar.vurgu) ? ayarlar.vurgu : '#b8506a');
    var K = { keskin: [6, 8, 4], yumusak: [18, 22, 12], yuvarlak: [26, 30, 18] }[ayarlar.kose] || [18, 22, 12];
    h.style.setProperty('--r', K[0] + 'px'); h.style.setProperty('--rl', K[1] + 'px'); h.style.setProperty('--r2', K[2] + 'px');
    h.style.setProperty('--dy', { sik: '5px', normal: '9px', ferah: '14px' }[ayarlar.yogunluk] || '9px');
    h.classList.toggle('noanim', ayarlar.anim === false);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = koyu ? '#170f14' : (ayarlar.vurgu || '#b8506a');
    olcekUygula();
  }
  window.addEventListener('resize', olcekUygula);
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', function () { if (ayarlar.tema === 'auto') temaUygula(); });
  }

  /* ---------- sayfa yönlendirme ---------- */
  function sayfaAdi() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var s = SAYFALAR.filter(function (x) { return x[0] === h; })[0];
    if (!s || (s[5] && !yonetici())) s = SAYFALAR[0];
    return s;
  }
  function git(ad) { if (location.hash === '#/' + ad) render(); else location.hash = '#/' + ad; }

  /* ---------- kabuk ---------- */
  function yedekHatirlat() {
    if (!yonetici() || !db.length) return '';
    var f = ayarlar.sonYedek ? gunFarki(ayarlar.sonYedek.slice(0, 10)) : null;
    if (f !== null && f < (sb ? 30 : 7)) return '';
    return '<div class="banner"><span>' + ik('uyari') + '<b>Yedek zamanı.</b> ' +
      (f === null ? 'Henüz yedek almadınız.' : f + ' gündür yedek almadınız.') +
      (sb ? ' Veriler bulutta saklanır; yine de ayda bir yedek önerilir.' : ' Kayıtlar yalnızca bu tarayıcıda durur.') + '</span><button class="btn small" type="button" data-act="yedek">Şimdi yedekle</button></div>';
  }
  function render() {
    if (!oturum) return;
    var s = sayfaAdi(), app = $('#app'), yKonum = window.scrollY;
    var nav = SAYFALAR.filter(function (x) { return !x[5] || yonetici(); }).map(function (x) {
      var sayi = x[0] === 'musteriler' && db.length ? db.length : x[0] === 'randevular' ? (randevuGun(bugun()).filter(function (r) { return r.durum === 'bekliyor'; }).length || '') : x[0] === 'stok' ? (urunler.filter(function (u) { return urunKalan(u) <= 2; }).length || '') : '';
      return '<button type="button" class="nav-item' + (s[0] === x[0] ? ' active' : '') + '" data-nav="' + x[0] + '" title="' + esc(x[1]) + '"' +
        (s[0] === x[0] ? ' aria-current="page"' : '') + '>' + ik(x[2]) + '<span class="nav-text">' + esc(x[1]) + '</span>' +
        (sayi !== '' ? '<span class="nav-count">' + sayi + '</span>' : '') + '</button>';
    }).join('');
    var icerik = ({ pano: pano, musteriler: musteriler, randevular: randevuSayfasi, ziyaretler: ziyaretSayfasi, stok: stokSayfasi, raporlar: raporSayfasi, fiyatlar: fiyatSayfasi, ayarlar: ayarSayfasi })[s[0]]();
    document.body.classList.toggle('k-wide', !!ayarlar.menuSabit);
    app.innerHTML =
      '<aside class="sidebar"><div class="brand"><div class="brand-mark" aria-hidden="true"><img src="logo.png" alt=""></div><div class="brand-text"><div class="brand-name">SİYA</div><div class="brand-sub">GÜZELLİK &amp; KUAFÖR</div></div></div>' +
      '<button type="button" class="k-pin" data-act="menu-sabit" title="Menüyü sabitle / daralt" aria-label="Menüyü sabitle">' + ik('panel') + '</button>' +
      '<div class="nav-label">ÇALIŞMA ALANI</div><nav aria-label="Ana gezinme">' + nav + '</nav>' +
      '<div class="sidebar-bottom"><div class="sidebar-user"><span class="avatar sm" style="' + renkler(oturum.ad) + '">' + esc(bas(oturum.ad)) + '</span>' +
      '<span class="who-t"><b>' + esc(oturum.ad) + '</b><small>' + (yonetici() ? 'Yönetici' : 'Personel') + '</small></span>' +
      '<button type="button" class="out" data-act="cikis" title="Çıkış yap" aria-label="Çıkış yap">' + ik('cikis') + '</button></div></div></aside>' +
      '<div class="shell"><header class="topbar"><div class="breadcrumb">' + ik('bina') + '<span>SİYA</span>' + ik('ok') + '<strong>' + esc(s[1]) + '</strong></div>' +
      '<button type="button" class="k-search" data-act="ara">' + ik('ara') + '<span>MÜŞTERİ, İŞLEM VEYA SAYFA ARA</span><kbd>Ctrl</kbd><kbd>K</kbd></button>' +
      '<div class="topbar-right"><span class="save-status ' + (sb ? bulut.durum : '') + '" id="bulut-durum">' + bulutEtiket() + '</span>' +
      '<button type="button" class="hdr-btn" data-act="tema" title="Açık / koyu görünüm" aria-label="Görünümü değiştir">' + ik(ayarlar.tema === 'dark' ? 'gunes' : 'ay') + '</button>' +
      '<button type="button" class="hdr-btn solid" data-act="yeni-ziyaret">' + ik('arti') + '<span class="lbl-d">Ziyaret Ekle</span></button></div></header>' +
      '<main id="main">' + yedekHatirlat() + icerik + '<footer class="foot">SİYA Güzellik &amp; Kuaför · ' + (sb ? 'Veriler bulutta saklanır' : 'Veriler bu cihazın tarayıcısında saklanır') + ' · <button class="k-link" type="button" data-act="yedek"' + (yonetici() ? '' : ' hidden') + '>Yedekle</button></footer></main></div>';
    if (s[0] === 'musteriler') musteriListe();
    else if (s[0] === 'ziyaretler') ziyaretIcerik();
    else if (s[0] === 'fiyatlar') fiyatListe();
    window.scrollTo(0, durum.sonSayfa === s[0] ? yKonum : 0);
    durum.sonSayfa = s[0];
  }

  function sayfaBasligi(s, aksiyon) {
    return '<div class="heading pagehead"><div><div class="eyebrow">' + s[3] + '</div><h1>' + esc(s[1]) + '</h1><p>' + esc(s[4]) + '</p></div><div class="actions">' + (aksiyon || '') + '</div></div>';
  }

  /* ---------- grafik parçaları ---------- */
  function barlar(g) {
    var mx = Math.max.apply(null, g.map(function (x) { return x.d; }).concat([1]));
    return '<div class="bars">' + g.map(function (x) {
      var yuk = x.d ? Math.max(6, Math.round(x.d / mx * 100)) : 3;
      return '<button type="button" class="bar' + (x.bugun ? ' today' : '') + '" data-act="gun" data-gun="' + x.iso + '" title="' + esc(x.t) + '">' +
        '<em>' + (x.d ? esc(x.e) : '') + '</em><i style="height:' + yuk + '%"></i><small>' + esc(x.k) + '</small></button>';
    }).join('') + '</div>';
  }
  function renkAl(i) { return i % RENKLER.length === 0 ? (/^#[0-9a-f]{6}$/i.test(ayarlar.vurgu) ? ayarlar.vurgu : RENKLER[0]) : RENKLER[i % RENKLER.length]; }
  function halka(parcalar, orta, altYazi) {
    var top = parcalar.reduce(function (s, p) { return s + p.d; }, 0), ac = 0, cg = [];
    parcalar.forEach(function (p, i) {
      var y = top ? p.d / top * 100 : 0;
      cg.push(renkAl(i) + ' ' + ac + '% ' + (ac + y) + '%'); ac += y;
    });
    return '<div class="donut-wrap"><div class="donut" style="background:' + (top ? 'conic-gradient(' + cg.join(',') + ')' : 'var(--line)') + '"><div><b>' + orta + '</b><small>' + altYazi + '</small></div></div>' +
      '<ul class="legend">' + parcalar.map(function (p, i) {
        return '<li><i style="background:' + renkAl(i) + '"></i>' + esc(p.ad) + '<b>' + (p.e || '') + '</b></li>';
      }).join('') + '</ul></div>';
  }
  function bos(yazi) { return '<div class="empty">' + ik('tik') + esc(yazi) + '</div>'; }

  function ziyaretBandi(t, l) {
    var adm = yonetici(), top = l.reduce(function (a, x) { return a + (Number(x.z.tutar) || 0); }, 0);
    var odKls = { 'Nakit': 'nakit', 'Kredi Kartı': 'kart', 'Havale / EFT': 'havale' };
    return '<div class="zband"><div class="zb-head"><span class="zb-dot"></span><b>' + uzunTarih(t) + '</b><span class="zb-pill">' + l.length + ' ZİYARET</span>' +
      (t === bugun() ? '<span class="zb-pill hl">BUGÜN</span>' : '') + (adm ? '<span class="zb-top">' + para(top) + '</span>' : '') + '</div>' +
      (l.length ? '<div class="zb-cols"><span>#</span><span>ÖDEME</span><span>MÜŞTERİ</span><span>İŞLEMLER</span><span>UZMAN</span><span class="r">TUTAR</span><span></span></div>' +
      l.map(function (x, i) {
        return '<div class="zb-row" data-act="ac" data-id="' + esc(x.m.id) + '"><span class="zb-no">' + p2(i + 1) + '</span>' +
          '<span class="zb-od ' + (odKls[x.z.odeme] || 'nakit') + '">' + esc(x.z.odeme || 'Nakit') + '</span>' +
          '<span class="zb-c"><b>' + esc(x.m.ad) + '</b></span>' +
          '<span class="zb-isl">' + (x.z.hizmetler || []).map(function (h) { return '<span class="zb-box">' + esc(h) + '</span>'; }).join('') + (x.z.not ? '<small class="znote">' + esc(x.z.not) + '</small>' : '') + '</span>' +
          '<span class="zb-u">' + esc(x.z.personel || '—') + '</span><span class="zb-t">' + para(x.z.tutar) + '</span>' +
          '<span class="zb-a"><button class="link" type="button" data-act="z-duzenle" data-id="' + esc(x.m.id) + '" data-z="' + esc(x.z.id) + '">Düzenle</button>' +
          (silebilir() ? '<button class="link d" type="button" data-act="z-sil" data-id="' + esc(x.m.id) + '" data-z="' + esc(x.z.id) + '">Sil</button>' : '') + '</span></div>';
      }).join('') : '<div class="zb-bos">Bu gün için ziyaret kaydı yok.</div>') + '</div>';
  }

  function pano() {
    var b = bugun(), g = durum.pg || b, bugunMu = g === b, tum = tumZ(), ay = aralikta(tum, donemAraligi('ay')), gun = aralikta(tum, [g, g]);
    var oAy = ozetle(ay), oGun = ozetle(gun), adm = yonetici();
    var sa = new Date().getHours(), selam = sa < 12 ? 'Günaydın' : sa < 18 ? 'İyi günler' : 'İyi akşamlar';
    var ilkAd = (oturum.ad || '').trim().split(/\s+/)[0];
    var yakin = db.filter(dogumYakin).sort(function (a, c) { return sonrakiDogum(a.dogum) - sonrakiDogum(c.dogum); });
    var gelmeyen = db.filter(riskli).sort(function (a, c) { return sonZiyaret(a).localeCompare(sonZiyaret(c)); });
    var rvGun = randevuGun(g).filter(function (r) { return r.durum !== 'iptal'; }), rvBek = rvGun.filter(function (r) { return r.durum === 'bekliyor'; });
    var stat = function (d, e, c) { return '<div class="k-stat"><b>' + d + '</b><i' + (c ? ' style="background:' + c + '"' : '') + '></i><span>' + e + '</span></div>'; };
    var tikStat = function (t, d, e, ipucu, c) {
      return '<button type="button" class="k-stat link" data-act="takip" data-t="' + t + '"><b>' + d + '</b><i style="background:' + c + '"></i><span>' + e + '</span><small>' + esc(ipucu) + '</small></button>';
    };
    var ilkYakin = yakin[0], ilkGel = gelmeyen[0];
    var hero = '<div class="heading k-hero"><div class="k-title"><div class="k-hi">' + selam.toUpperCase() + (ilkAd ? ', ' + esc(ilkAd.toLocaleUpperCase('tr')) : '') + '</div>' +
      '<h1>Salonun bugünkü durumu</h1><div class="k-date">' + uzunTarih(g).toLocaleUpperCase('tr') + '</div>' +
      '<div class="k-daypick"><button type="button" data-act="pg-gun" data-gun="' + gunEkle(g, -1) + '" aria-label="Önceki gün">‹</button><input type="date" data-in="pg-gun" value="' + g + '" aria-label="Tarih seç"><button type="button" data-act="pg-gun" data-gun="' + gunEkle(g, 1) + '" aria-label="Sonraki gün">›</button>' + (bugunMu ? '' : '<button type="button" class="bg" data-act="pg-gun" data-gun="' + b + '">Bugüne dön</button>') + '</div></div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="yeni-ziyaret">' + ik('arti') + ' Ziyaret Ekle</button>' +
      '<button class="btn" type="button" data-act="yeni-randevu">Randevu Ekle</button><button class="btn" type="button" data-act="yeni-musteri">Yeni Müşteri</button><button class="btn" type="button" data-act="urun-sat">Ürün Sat</button></div>' +
      '<div class="k-stats"><span class="k-stats-label">' + (bugunMu ? 'BUGÜN' : tarihGoster(g)) + '</span>' + stat(oGun.adet, 'ZİYARET') +
      (adm ? stat(para(oGun.ciro), 'CİRO', '#e6b36e') : stat(oAy.adet, 'BU AY ZİYARET', '#e6b36e')) +
      stat(rvBek.length + '<em>/' + rvGun.length + '</em>', 'RANDEVU', '#8fd3c5') + stat(db.length, 'MÜŞTERİ', '#f4a7bb') +
      tikStat('dogum', yakin.length, 'DOĞUM GÜNÜ', ilkYakin ? ilkYakin.ad.split(' ')[0] + ' · ' + (sonrakiDogum(ilkYakin.dogum) === 0 ? 'bugün' : sonrakiDogum(ilkYakin.dogum) + ' gün') : 'önümüzdeki 30 gün', '#c4b5fd') +
      tikStat('gelmeyen', gelmeyen.length, 'GELMEYEN', ilkGel ? ilkGel.ad.split(' ')[0] + ' · ' + gunFarki(sonZiyaret(ilkGel)) + ' gün' : GUN_RISK + '+ gündür yok', '#fbbf77') + '</div></div>';

    if (!db.length) {
      return hero + '<section class="panel"><div class="welcome"><div class="big">Hoş geldiniz 👋</div><p>SİYA müşteri kayıt sistemi hazır. Başlamak için şu adımları izleyin:</p>' +
        '<ol><li><b>Fiyat listesi</b> ve <b>ürün stoku</b> Excel dosyanızdan aktarıldı' + (yonetici() ? ' — <button class="k-link" type="button" data-nav="fiyatlar">fiyatları kontrol edin</button>' : '') + '.</li>' +
        '<li><button class="k-link" type="button" data-act="yeni-musteri">İlk müşterinizi ekleyin</button>.</li>' +
        '<li>Randevu ya da ziyaret ekleyin: işlemleri seçin, tutar otomatik hesaplanır.</li>' +
        (yonetici() ? '<li>Düzenli olarak <button class="k-link" type="button" data-act="yedek">yedek alın</button>.</li>' : '') + '</ol></div></section>';
    }

    var gunler = [], i, g7 = gunEkle(b, -6), o7 = ozetle(aralikta(tum, [g7, b]));
    for (i = 6; i >= 0; i--) {
      var iso = gunEkle(b, -i), n = tum.filter(function (x) { return x.z.tarih === iso; }), v = adm ? (o7.gunluk[iso] || 0) : n.length;
      gunler.push({ iso: iso, d: v, e: adm ? (v >= 1000 ? Math.round(v / 100) / 10 + 'B' : String(Math.round(v))) : String(v), k: i === 0 ? 'Bugün' : GUN_KISA[dObj(iso).getDay()], bugun: i === 0,
        t: tarihGoster(iso) + ': ' + n.length + ' ziyaret' + (adm ? ', ' + para(o7.gunluk[iso] || 0) : '') });
    }
    var gr = sirala(oAy.gruplar).map(function (x) { return { ad: x.ad, d: x.ciro, e: adm ? para(x.ciro) : '%' + Math.round(x.ciro / (oAy.ciro || 1) * 100) }; });
    var pop = sirala(oAy.hizmet, 'adet').slice(0, 5), mxp = pop.length ? pop[0].adet : 1;
    var kart = function (baslik, sag, icerik, sinif) { return '<section class="k-card ' + (sinif || '') + '"><div class="k-card-h">' + baslik + (sag ? '<b>' + sag + '</b>' : '') + '</div>' + icerik + '</section>'; };
    var cards = '<div class="k-cards">' +
      kart('SON 7 GÜN', adm ? 'CİRO (₺, BİN = B)' : 'ZİYARET', barlar(gunler)) +
      kart('GRUP DAĞILIMI', 'BU AY', gr.length ? halka(gr, adm ? para(oAy.ciro) : oAy.adet, adm ? 'CİRO' : 'ZİYARET') : bos('Bu ay henüz işlem yok.')) +
      kart('POPÜLER İŞLEMLER', 'BU AY', pop.length ? '<ul class="rank">' + pop.map(function (p) {
        return '<li><span>' + esc(p.ad) + '</span><b>' + p.adet + '</b><i style="width:' + Math.round(p.adet / mxp * 100) + '%"></i></li>';
      }).join('') + '</ul>' : bos('Bu ay henüz işlem yok.')) +
      kart('ÖDEME TÜRÜ', 'BU AY', adm ? (oAy.ciro ? halka(['Nakit', 'Kredi Kartı', 'Havale / EFT'].map(function (n) { return { ad: n, d: oAy.odeme[n] || 0, e: para(oAy.odeme[n] || 0) }; }), oAy.adet, 'ZİYARET') : bos('Bu ay henüz ödeme yok.')) : bos('Ödeme özeti yöneticiye açıktır.')) + '</div>';

    var bugunTablo = ziyaretBandi(g, gun.slice().sort(function (x, y) { return (x.z.id < y.z.id) ? -1 : 1; }));
    var rvListe = rvGun.length ? '<ul class="mini">' + rvGun.slice(0, 6).map(function (r) {
      var ds = RDURUM[r.durum] || RDURUM.bekliyor;
      return '<li><button type="button" data-nav="randevular"><span class="rvt">' + esc(r.saat) + '</span><b>' + esc(r.ad) + '</b><small class="rst ' + ds[1] + '">' + ds[0] + '</small></button></li>';
    }).join('') + '</ul>' : bos(bugunMu ? 'Bugün için randevu yok.' : 'Bu gün için randevu yok.');
    var azStok = urunler.filter(function (u) { return urunKalan(u) <= 2; }).sort(function (a, c) { return urunKalan(a) - urunKalan(c); });
    var stokListe = azStok.length ? '<ul class="mini">' + azStok.slice(0, 5).map(function (u) {
      var ds = stokDurum(u);
      return '<li><button type="button" data-nav="stok"><span class="kalan ' + ds[1] + '">' + Math.max(0, urunKalan(u)) + '</span><b>' + esc(u.ad) + '</b><small class="rst ' + ds[1] + '">' + ds[0] + '</small></button></li>';
    }).join('') + '</ul>' : bos('Stok seviyeleri yeterli.');
    var alt = '<div class="k-cards two">' +
      kart(bugunMu ? 'BUGÜNÜN ZİYARETLERİ' : 'ZİYARETLER · ' + tarihGoster(g), gun.length + ' KAYIT', bugunTablo, 'wide') +
      '<div class="stack">' + kart(bugunMu ? 'BUGÜNÜN RANDEVULARI' : 'RANDEVULAR · ' + tarihGoster(g), '<button class="k-link" type="button" data-nav="randevular">TÜMÜ</button>', rvListe) +
      kart('STOK UYARISI', azStok.length ? '<button class="k-link" type="button" data-nav="stok">STOK</button>' : '', stokListe) + '</div></div>';
    return hero + cards + alt;
  }

  /* ---------- MÜŞTERİLER ---------- */
  var FILTRELER = [
    ['hepsi', 'Tümü', function () { return true; }],
    ['vip', 'VIP', function (m) { return m.vip; }],
    ['dogum', 'Doğum günü yakın', dogumYakin],
    ['risk', GUN_RISK + '+ gün gelmeyen', riskli],
    ['alerji', 'Alerji notlu', function (m) { return !!(m.alerji && m.alerji.trim()); }],
    ['yeni', 'Hiç ziyareti yok', function (m) { return !(m.ziyaretler || []).length; }]
  ];
  function aramaMetni(m) {
    return tr([m.ad, m.tel, m.eposta, m.not, m.alerji].concat((m.ziyaretler || []).map(function (z) {
      return (z.hizmetler || []).join(' ') + ' ' + (z.personel || '') + ' ' + (z.not || '');
    })).join(' '));
  }
  function musteriler() {
    var mm = durum.m;
    var csv = yonetici() ? '<button class="btn" type="button" data-act="csv-musteri">' + ik('indir') + ' Excel (.csv)</button>' : '';
    return sayfaBasligi(sf('musteriler'), csv + '<button class="btn primary" type="button" data-act="yeni-musteri">' + ik('arti') + ' Yeni Müşteri</button>') +
      '<section class="panel"><div class="toolbar"><label class="search"><span class="sr">Müşteri ara</span>' + ik('ara') +
      '<input data-in="m-ara" type="search" placeholder="İsim, telefon, işlem veya not ara…" autocomplete="off" value="' + esc(mm.ara) + '"></label>' +
      '<label class="sort"><span class="sr">Sırala</span><select data-in="m-sirala">' + [['ad', 'İsme göre (A–Z)'], ['son', 'Son ziyarete göre'], ['harcama', 'Toplam harcamaya göre'], ['ziyaret', 'Ziyaret sayısına göre'], ['yeni', 'Yeni eklenenler']].map(function (o) {
        return '<option value="' + o[0] + '"' + (mm.sirala === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></label>' +
      '<div class="seg" role="group" aria-label="Görünüm"><button type="button" data-act="gorunum" data-g="tablo" aria-pressed="' + (ayarlar.gorunum === 'tablo') + '">Tablo</button><button type="button" data-act="gorunum" data-g="kart" aria-pressed="' + (ayarlar.gorunum === 'kart') + '">Kart</button></div></div>' +
      '<div class="chips" id="m-filtre"></div><div id="m-liste" aria-live="polite"></div></section>';
  }
  function musteriListe() {
    var kutu = $('#m-liste'); if (!kutu) return;
    var mm = durum.m, q = tr(mm.ara).trim(), qt = telTemiz(q);
    var f = FILTRELER.filter(function (x) { return x[0] === mm.filtre; })[0];
    var l = db.filter(function (m) { return f[2](m) && (!q || aramaMetni(m).indexOf(q) > -1 || (qt.length > 2 && telTemiz(m.tel).indexOf(qt) > -1)); });
    var cmp = {
      ad: function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); },
      son: function (a, b) { return sonZiyaret(b).localeCompare(sonZiyaret(a)); },
      harcama: function (a, b) { return toplam(b) - toplam(a); },
      ziyaret: function (a, b) { return (b.ziyaretler || []).length - (a.ziyaretler || []).length; },
      yeni: function (a, b) { return (b.olusturma || '').localeCompare(a.olusturma || ''); }
    }[mm.sirala];
    l.sort(cmp);
    $('#m-filtre').innerHTML = FILTRELER.map(function (x) {
      return '<button type="button" class="chip" data-act="filtre" data-f="' + x[0] + '" aria-pressed="' + (mm.filtre === x[0]) + '">' + esc(x[1]) + '<span class="n">' + db.filter(x[2]).length + '</span></button>';
    }).join('');
    if (!l.length) {
      kutu.innerHTML = '<div class="bos"><div class="big">' + (db.length ? 'Sonuç bulunamadı' : 'Henüz müşteri kaydı yok') + '</div>' +
        (db.length ? 'Arama ya da filtreyi değiştirmeyi deneyin.' : 'İlk müşterinizi eklemek için “Yeni Müşteri” düğmesine basın.') + '</div>';
      return;
    }
    var goster = l.slice(0, mm.limit), rozet = function (m) {
      var r = '', d = sonrakiDogum(m.dogum);
      if (m.vip) r += '<span class="tag vip">★ VIP</span>';
      if (d !== null && d <= 30) r += '<span class="tag dogum">' + (d === 0 ? 'Bugün doğum günü' : '🎂 ' + d + ' gün') + '</span>';
      if (m.alerji && m.alerji.trim()) r += '<span class="tag alerji">Alerji</span>';
      if (riskli(m)) r += '<span class="tag risk">' + gunFarki(sonZiyaret(m)) + ' gün</span>';
      return r;
    };
    var html;
    if (ayarlar.gorunum === 'kart') {
      html = '<div class="mcards">' + goster.map(function (m) {
        var son = sonZiyaret(m);
        return '<div class="mcard" role="button" tabindex="0" data-act="ac" data-id="' + esc(m.id) + '"><span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span>' +
          '<b>' + esc(m.ad) + '</b><span class="tags">' + rozet(m) + '</span><small>' + esc(m.tel || 'Telefon yok') + '</small>' +
          '<span class="mrow"><span><small>Son ziyaret</small><b>' + (son ? tarihGoster(son) : '—') + '</b></span><span><small>Ziyaret</small><b>' + (m.ziyaretler || []).length + '</b></span><span><small>Harcama</small><b>' + para(toplam(m)) + '</b></span></span>' + (silebilir() ? '<button class="link d msil" type="button" data-act="m-sil" data-id="' + esc(m.id) + '">Sil</button>' : '') + '</div>';
      }).join('') + '</div>';
    } else {
      html = '<div class="tbl-wrap"><table class="tbl click"><thead><tr><th>Müşteri</th><th>Telefon</th><th>Son ziyaret</th><th class="r">Ziyaret</th><th class="r">Harcama</th>' + (silebilir() ? '<th></th>' : '') + '</tr></thead><tbody>' +
        goster.map(function (m) {
          var son = sonZiyaret(m);
          return '<tr data-act="ac" data-id="' + esc(m.id) + '"><td><div class="cust"><span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><span><b>' + esc(m.ad) + '</b><span class="tags">' + rozet(m) + '</span></span></div></td>' +
            '<td>' + esc(m.tel || '—') + '</td><td>' + (son ? tarihGoster(son) : '—') + '</td><td class="r">' + (m.ziyaretler || []).length + '</td><td class="r"><b>' + para(toplam(m)) + '</b></td>' + (silebilir() ? '<td class="r"><button class="link d" type="button" data-act="m-sil" data-id="' + esc(m.id) + '">Sil</button></td>' : '') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }
    kutu.innerHTML = '<div class="count">' + l.length + ' müşteri</div>' + html +
      (l.length > goster.length ? '<div class="more"><button class="btn" type="button" data-act="daha">Daha fazla göster (' + (l.length - goster.length) + ' kalan)</button></div>' : '');
  }

  /* ---------- ZİYARET DEFTERİ ---------- */
  function donemSecici(anahtar, d) {
    return '<div class="chips periods">' + DONEMLER.map(function (x) {
      return '<button type="button" class="chip" data-act="donem" data-k="' + anahtar + '" data-d="' + x[0] + '" aria-pressed="' + (d.donem === x[0]) + '">' + x[1] + '</button>';
    }).join('') + '</div>' + (d.donem === 'ozel' ? '<div class="daterange"><label>Başlangıç<input type="date" data-in="' + anahtar + '-bas" value="' + esc(d.bas) + '"></label><label>Bitiş<input type="date" data-in="' + anahtar + '-bit" value="' + esc(d.bit) + '"></label></div>' : '');
  }
  function ziyaretSayfasi() {
    var d = durum.z, uz = {};
    tumZ().forEach(function (x) { if (x.z.personel) uz[x.z.personel] = 1; });
    var csv = yonetici() ? '<button class="btn" type="button" data-act="csv-ziyaret">' + ik('indir') + ' Liste (.csv)</button><button class="btn" type="button" data-act="excel-rapor">' + ik('indir') + ' Excel Raporu</button>' : '';
    return sayfaBasligi(sf('ziyaretler'), csv + '<button class="btn primary" type="button" data-act="yeni-ziyaret">' + ik('arti') + ' Ziyaret Ekle</button>') +
      '<section class="panel"><div class="toolbar col">' + donemSecici('z', d) +
      '<div class="frow"><label class="search">' + ik('ara') + '<span class="sr">Ara</span><input data-in="z-ara" type="search" placeholder="Müşteri, işlem veya not ara…" autocomplete="off" value="' + esc(d.ara) + '"></label>' +
      '<label class="sort"><span class="sr">Ödeme</span><select data-in="z-odeme"><option value="">Tüm ödemeler</option>' + ODEMELER.map(function (o) { return '<option' + (d.odeme === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>' +
      '<label class="sort"><span class="sr">Uzman</span><select data-in="z-uzman"><option value="">Tüm uzmanlar</option>' + Object.keys(uz).sort().map(function (o) { return '<option' + (d.uzman === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></label></div></div>' +
      '<div id="z-icerik"></div></section>';
  }
  function ziyaretListesi() {
    var d = durum.z, r = donemAraligi(d.donem, d.bas, d.bit), q = tr(d.ara).trim();
    return aralikta(tumZ(), r).filter(function (x) {
      if (d.odeme && x.z.odeme !== d.odeme) return false;
      if (d.uzman && x.z.personel !== d.uzman) return false;
      return !q || tr(x.m.ad + ' ' + (x.z.hizmetler || []).join(' ') + ' ' + (x.z.not || '') + ' ' + (x.z.personel || '')).indexOf(q) > -1;
    }).sort(function (a, b) { return a.z.tarih === b.z.tarih ? 0 : a.z.tarih < b.z.tarih ? 1 : -1; });
  }
  function ziyaretIcerik() {
    var kutu = $('#z-icerik'); if (!kutu) return;
    var l = ziyaretListesi(), o = ozetle(l), adm = yonetici(), d = durum.z;
    var s = '<div class="sumrow"><div class="sum"><small>ZİYARET</small><b>' + o.adet + '</b></div><div class="sum"><small>MÜŞTERİ</small><b>' + Object.keys(o.musteri).length + '</b></div>' +
      (adm ? '<div class="sum"><small>TOPLAM</small><b>' + para(o.ciro) + '</b></div><div class="sum"><small>NAKİT</small><b>' + para(o.odeme.Nakit) + '</b></div><div class="sum"><small>KREDİ KARTI</small><b>' + para(o.odeme['Kredi Kartı']) + '</b></div><div class="sum"><small>HAVALE</small><b>' + para(o.odeme['Havale / EFT']) + '</b></div>' +
        '<div class="sum"><small>ORTALAMA</small><b>' + para(o.adet ? o.ciro / o.adet : 0) + '</b></div>' : '') + '</div>';
    if (!l.length) { kutu.innerHTML = s + '<div class="bos"><div class="big">Bu dönemde ziyaret yok</div>Farklı bir dönem ya da filtre seçin.</div>'; return; }
    var gruplar = {}, sira = [];
    l.forEach(function (x) { if (!gruplar[x.z.tarih]) { gruplar[x.z.tarih] = []; sira.push(x.z.tarih); } gruplar[x.z.tarih].push(x); });
    kutu.innerHTML = s + '<div class="zbands">' + sira.map(function (t) { return ziyaretBandi(t, gruplar[t]); }).join('') + '</div>';
  }

  /* ---------- RAPORLAR ---------- */
  function raporSayfasi() {
    var d = durum.r, r = donemAraligi(d.donem, d.bas, d.bit), l = aralikta(tumZ(), r), o = ozetle(l);
    var yeni = db.filter(function (m) { var t = (m.olusturma || '').slice(0, 10); return t >= r[0] && t <= r[1]; }).length;
    var kk = Number(ayarlar.kartKesinti) || 0, kesinti = o.ciro - o.net;
    var us = urunSatis.filter(function (x) { return x.tarih >= r[0] && x.tarih <= r[1]; });
    var uCiro = us.reduce(function (a, x) { return a + x.adet * x.fiyat; }, 0), uKar = us.reduce(function (a, x) { return a + x.adet * (x.fiyat - (Number(x.alis) || 0)); }, 0);
    var kpi = function (e, v, a) { return '<div class="kpi"><small>' + e + '</small><b>' + v + '</b><span>' + (a || '') + '</span></div>'; };
    var odeme = ['Nakit', 'Kredi Kartı', 'Havale / EFT'].map(function (n) { return { ad: n, d: o.odeme[n] || 0, e: para(o.odeme[n] || 0) }; });
    var gr = sirala(o.gruplar).map(function (x) { return { ad: x.ad, d: x.ciro, e: para(x.ciro) }; });
    var hz = sirala(o.hizmet, 'adet').slice(0, 15), uz = sirala(o.uzman);
    var gunlukSeri = '', gunSay = Math.round((dObj(r[1] === '9999-99-99' ? bugun() : r[1]) - dObj(r[0] === '0000-00-00' ? bugun() : r[0])) / 864e5) + 1;
    if (d.donem !== 'hepsi' && gunSay <= 31) {
      var seri = [], i, bitis = r[1] > bugun() && d.donem !== 'ozel' ? bugun() : r[1];
      for (i = 0; i < gunSay; i++) { var iso = gunEkle(r[0], i); if (iso > bitis && d.donem !== 'ozel') break; var v = o.gunluk[iso] || 0; seri.push({ iso: iso, d: v, e: v >= 1000 ? Math.round(v / 100) / 10 + 'B' : String(Math.round(v)), k: String(dObj(iso).getDate()), bugun: iso === bugun(), t: tarihGoster(iso) + ': ' + para(v) }); }
      gunlukSeri = '<section class="k-card"><div class="k-card-h">GÜNLÜK CİRO<b>' + esc(donemAdi(d.donem, r)) + '</b></div>' + barlar(seri) + '</section>';
    }
    var tablo = function (basliklar, satirlar) {
      return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + basliklar.map(function (b, i) { return '<th' + (i ? ' class="r"' : '') + '>' + b + '</th>'; }).join('') + '</tr></thead><tbody>' + satirlar + '</tbody></table></div>';
    };
    var hak = '';
    if (ayarlar.ortakAd) {
      hak = '<section class="k-card"><div class="k-card-h">HAKEDİŞ<b>' + esc(ayarlar.ortakGrup) + ' · %' + (Number(ayarlar.ortakPay) || 0) + '</b></div>' +
        tablo(['Kalem', 'Tutar'], '<tr><td>Brüt ciro</td><td class="r">' + para(o.ciro) + '</td></tr><tr><td>Kredi kartı kesintisi (%' + kk + ')</td><td class="r">− ' + para(kesinti) + '</td></tr>' +
          '<tr><td><b>Net ciro</b></td><td class="r"><b>' + para(o.net) + '</b></td></tr><tr><td>' + esc(ayarlar.ortakAd) + ' hakedişi</td><td class="r">' + para(o.ortak) + '</td></tr>' +
          '<tr><td><b>SİYA hakedişi</b></td><td class="r"><b>' + para(o.net - o.ortak) + '</b></td></tr>') +
        '<p class="hint pad">Hesap, Ayarlar sayfasındaki oranlara göre yapılır: kredi kartı ödemeleri tutar ÷ (1 + kesinti) olarak net sayılır; ' + esc(ayarlar.ortakGrup) + ' işlemlerinin netinden ortak payı ayrılır.</p></section>';
    }
    return sayfaBasligi(sf('raporlar'), '<button class="btn" type="button" data-act="yazdir">Yazdır</button><button class="btn" type="button" data-act="csv-ziyaret">' + ik('indir') + ' Liste (.csv)</button><button class="btn primary" type="button" data-act="excel-rapor">' + ik('indir') + ' Excel Raporu (.xlsx)</button>') +
      '<section class="panel pad"><div class="toolbar col flat">' + donemSecici('r', d) + '</div><div class="periodname">' + esc(donemAdi(d.donem, r)) + '</div>' +
      '<div class="kpis">' + kpi('BRÜT CİRO', para(o.ciro), o.adet + ' ziyaret') + kpi('NET CİRO', para(o.net), kesinti ? 'kart kesintisi −' + para(kesinti) : 'kesinti yok') +
      kpi('ORTALAMA SEPET', para(o.adet ? o.ciro / o.adet : 0), 'ziyaret başına') + kpi('MÜŞTERİ', Object.keys(o.musteri).length, yeni + ' yeni kayıt') + kpi('ÜRÜN SATIŞI', para(uCiro), us.length + ' satış · kâr ' + para(uKar)) + '</div></section>' +
      '<div class="k-cards r2">' + gunlukSeri +
      '<section class="k-card"><div class="k-card-h">ÖDEME TÜRÜ</div>' + (o.ciro ? halka(odeme, o.adet, 'ZİYARET') : bos('Bu dönemde ödeme yok.')) + '</section>' +
      '<section class="k-card"><div class="k-card-h">GRUP DAĞILIMI</div>' + (o.ciro ? halka(gr, para(o.ciro), 'CİRO') : bos('Bu dönemde işlem yok.')) + '</section>' + hak +
      '<section class="k-card wide"><div class="k-card-h">İŞLEM BAZLI<b>İLK 15</b></div>' + (hz.length ? tablo(['İşlem', 'Adet', 'Ciro'], hz.map(function (x) { return '<tr><td>' + esc(x.ad) + '</td><td class="r">' + x.adet + '</td><td class="r"><b>' + para(x.ciro) + '</b></td></tr>'; }).join('')) : bos('Bu dönemde işlem yok.')) + '</section>' +
      '<section class="k-card"><div class="k-card-h">UZMAN BAZLI</div>' + (uz.length ? tablo(['Uzman', 'Ziyaret', 'Ciro'], uz.map(function (x) { return '<tr><td>' + esc(x.ad) + '</td><td class="r">' + x.adet + '</td><td class="r"><b>' + para(x.ciro) + '</b></td></tr>'; }).join('')) : bos('Bu dönemde kayıt yok.')) + '</section></div>';
  }

  /* ---------- FİYAT LİSTESİ ---------- */
  function fiyatSayfasi() {
    return sayfaBasligi(sf('fiyatlar'), yonetici() ? '<button class="btn primary" type="button" data-act="fiyat-duzenle">Fiyatları Düzenle</button>' : '') +
      '<section class="panel"><div class="toolbar"><label class="search">' + ik('ara') + '<span class="sr">İşlem ara</span><input data-in="fa-ara" type="search" placeholder="İşlem ara…" autocomplete="off" value="' + esc(durum.fa) + '"></label></div><div id="fa-liste"></div></section>';
  }
  function fiyatListe() {
    var kutu = $('#fa-liste'); if (!kutu) return;
    var q = tr(durum.fa).trim();
    var l = hizmetler.map(function (h) { return { ad: h.ad, fiyat: Number(h.fiyat) || 0, kategori: h.kategori || 'Diğer' }; }).filter(function (h) { return !q || tr(h.ad).indexOf(q) > -1; });
    if (!l.length) { kutu.innerHTML = '<div class="bos"><div class="big">İşlem bulunamadı</div></div>'; return; }
    kutu.innerHTML = '<div class="fgrid">' + kategoriler(l).map(function (k) {
      return '<section class="k-card"><div class="k-card-h">' + esc(k.ad.toLocaleUpperCase('tr')) + '<b>' + k.liste.length + ' İŞLEM</b></div><ul class="plist">' + k.liste.map(function (h) {
        return '<li><span>' + esc(h.ad) + '</span><b>' + (h.fiyat ? para(h.fiyat) : '—') + '</b></li>';
      }).join('') + '</ul></section>';
    }).join('') + '</div>';
  }

  /* ---------- AYARLAR ---------- */
  var AYAR_BOLUMLER = [
    ['gorunum', 'GÖRÜNÜM', 'Tema, renk, yoğunluk ve genel çalışma hissi', 'ayar'],
    ['yerlesim', 'YERLEŞİM', 'Menü ve müşteri listesi düzeni', 'panel'],
    ['hesap', 'HESABIM', 'Kullanıcı bilgileri, şifre ve çıkış', 'users'],
    ['odeme', 'ÖDEME VE HAKEDİŞ', 'Kart kesintisi ve hakediş oranları', 'tag', true],
    ['kullanicilar', 'KULLANICILAR', 'Personel hesapları ve yetkiler', 'users', true],
    ['veri', 'VERİ VE YEDEK', 'Yedekleme, aktarma ve silme', 'indir', true],
    ['kisayol', 'KISAYOLLAR', 'Klavye ile hızlı çalış', 'ara'],
    ['hakkinda', 'HAKKINDA', 'Sistem ve hesap bilgileri', 'bina']
  ];
  var VURGULAR = [['Gül', '#b8506a'], ['Mavi', '#3b5bdb'], ['Turkuaz', '#0f9d8a'], ['Turuncu', '#f26a1b'], ['Mor', '#7c3aed'], ['Kırmızı', '#e11d48'], ['Yeşil', '#2f9e6e'], ['Altın', '#b8862b']];
  var SIFIRLA = { gorunum: { tema: 'light', vurgu: '#b8506a', yogunluk: 'normal', yazi: '100', kose: 'yumusak', anim: true }, yerlesim: { menuSabit: false, gorunum: 'tablo' } };
  function ayarSatirlari(id) {
    var adm = yonetici();
    var seg = function (k, secenekler, deger) {
      return '<div class="seg">' + secenekler.map(function (o) { return '<button type="button" data-act="ayar" data-k="' + k + '" data-v="' + o[0] + '" aria-pressed="' + (String(deger) === String(o[0])) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    };
    var tgl = function (k, d) { return '<button type="button" class="tgl" data-act="ayar" data-k="' + k + '" data-v="' + (!d) + '" aria-pressed="' + !!d + '" aria-label="Aç / kapat"></button>'; };
    var r = function (t, a, h, etiket) { return { t: t, a: a, h: h, e: etiket }; };
    var depo = 0; try { depo = Math.round((JSON.stringify(db).length + JSON.stringify(hizmetler).length + JSON.stringify(urunler).length + JSON.stringify(randevular).length) / 1024); } catch (e) { depo = 0; }
    var grupSec = KATEGORILER.concat(['Diğer']);
    var vurguHex = String(ayarlar.vurgu || '').toLowerCase();
    var L = {
      gorunum: [
        r('TEMA', 'Aydınlık, karanlık ya da cihazın ayarını izle', seg('tema', [['light', 'Aydınlık'], ['dark', 'Karanlık'], ['auto', 'Otomatik']], ayarlar.tema), 'BU CİHAZ'),
        r('VURGU RENGİ', 'Düğmeler, menüde seçili sayfa, bant ve vurgular', '<div class="swatches">' + VURGULAR.map(function (v) {
          return '<button type="button" class="sw" style="--c:' + v[1] + '" data-act="ayar" data-k="vurgu" data-v="' + v[1] + '" aria-pressed="' + (vurguHex === v[1]) + '"><i></i><small>' + v[0].toLocaleUpperCase('tr') + '</small></button>';
        }).join('') + '<label class="sw ozel"><i></i><small>ÖZEL</small><input type="color" data-in="ay-vurgu" value="' + esc(/^#[0-9a-f]{6}$/i.test(ayarlar.vurgu) ? ayarlar.vurgu : '#b8506a') + '" aria-label="Özel vurgu rengi"></label></div>', 'BU CİHAZ'),
        r('YOĞUNLUK', 'Tablo satırlarının yüksekliği', seg('yogunluk', [['sik', 'Sıkı'], ['normal', 'Normal'], ['ferah', 'Ferah']], ayarlar.yogunluk)),
        r('YAZI BOYUTU', 'Tüm sayfayı büyütür veya küçültür', seg('yazi', [['85', '%85'], ['92', '%92'], ['100', '%100'], ['108', '%108'], ['116', '%116'], ['125', '%125']], String(ayarlar.yazi))),
        r('KÖŞE YUVARLAKLIĞI', 'Kartların ve düğmelerin köşe biçimi', seg('kose', [['keskin', 'Keskin'], ['yumusak', 'Yumuşak'], ['yuvarlak', 'Yuvarlak']], ayarlar.kose)),
        r('ANİMASYONLAR', 'Geçişler ve efektler', tgl('anim', ayarlar.anim !== false), 'BU CİHAZ')
      ],
      yerlesim: [
        r('YAN MENÜ', 'Daralan menü üzerine gelince açılır, sabit menü hep açık kalır', seg('menuSabit', [['false', 'Daralan'], ['true', 'Sabit']], ayarlar.menuSabit)),
        r('MÜŞTERİ LİSTESİ', 'Müşteriler sayfasının varsayılan görünümü', seg('gorunum', [['tablo', 'Tablo'], ['kart', 'Kart']], ayarlar.gorunum))
      ],
      hesap: [r('HESAP', esc(oturum.kullanici) + ' · ' + (adm ? 'Yönetici' : 'Personel'),
        '<div class="btnrow" style="margin:0"><span class="avatar" style="' + renkler(oturum.ad) + '">' + esc(bas(oturum.ad)) + '</span><b style="align-self:center">' + esc(oturum.ad) + '</b><button class="btn" type="button" data-act="sifre">Şifre Değiştir</button><button class="btn danger" type="button" data-act="cikis">Çıkış Yap</button></div>')],
      odeme: [
        r('KREDİ KARTI KESİNTİSİ (%)', 'Kartla ödemelerde net tutar = tutar ÷ (1 + oran). Excel dosyanızda %20.', '<input class="num" type="number" min="0" max="100" step="0.1" data-in="ay-kartKesinti" value="' + esc(ayarlar.kartKesinti) + '">'),
        r('ORTAK / UZMAN ADI', 'Hakediş paylaşılan kişi (boşsa hakediş hesabı kapalı)', '<input class="txt" maxlength="40" placeholder="Örn. Hakan" data-in="ay-ortakAd" value="' + esc(ayarlar.ortakAd) + '">'),
        r('ORTAK PAYI (%)', 'Seçili grubun net cirosundan ayrılan pay', '<input class="num" type="number" min="0" max="100" step="1" data-in="ay-ortakPay" value="' + esc(ayarlar.ortakPay) + '">'),
        r('HAKEDİŞ GRUBU', 'Payın hesaplandığı işlem grubu', '<select data-in="ay-ortakGrup">' + grupSec.map(function (g) { return '<option' + (ayarlar.ortakGrup === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select>')
      ],
      kullanicilar: [r('PERSONEL SİLME YETKİSİ', 'Açıksa personel hesapları müşteri, ziyaret ve randevu kaydını silebilir (ürün, satış ve fiyat silme yönetici işidir)', tgl('personelSil', ayarlar.personelSil === true), 'BU CİHAZ'),
        r('KULLANICILAR', kullanicilar.length + ' hesap. Personel müşteri, ziyaret, randevu ve satış ekleyebilir; silme, fiyat, ciro, rapor ve yedek yönetici işidir.', '<button class="btn primary" type="button" data-act="kullanicilar">Kullanıcıları Yönet</button>')],
      veri: [
        r('KAYITLAR', db.length + ' müşteri · ' + tumZ().length + ' ziyaret · ' + randevular.length + ' randevu · ' + urunler.length + ' ürün · yaklaşık ' + depo + ' KB. Son yedek: ' + (ayarlar.sonYedek ? tarihGoster(ayarlar.sonYedek.slice(0, 10)) : 'hiç alınmadı'), '<button class="btn primary" type="button" data-act="yedek">Yedekle / Aktar</button>'),
        r('EXCEL RAPORU', 'Günlük, haftalık ve aylık rapor; ham veri, ürün satışı ve stok sayfalarıyla (.xlsx)', '<button class="btn" type="button" data-act="excel-rapor">Excel Raporu İndir</button>'),
        r('TÜM VERİLERİ SİL', 'Müşteri, ziyaret, randevu ve ürün satışları silinir (fiyat listesi ve ürün kartları kalır)', '<button class="btn danger" type="button" data-act="sifirla">Tüm Verileri Sil</button>')
      ],
      kisayol: [r('KISAYOLLAR', 'Klavye ile hızlı çalışın', '<div class="kbdlist" style="width:100%;min-width:260px">' +
        [['Hızlı arama', ['Ctrl', 'K']], ['Aramada seçim', ['↑', '↓']], ['Seçileni aç', ['Enter']], ['Pencereyi kapat', ['Esc']]].map(function (x) {
          return '<div>' + x[0] + '<span>' + x[1].map(function (t) { return '<kbd>' + t + '</kbd>'; }).join('') + '</span></div>';
        }).join('') + '</div>')],
      hakkinda: [r('SİSTEM', 'SİYA Güzellik & Kuaför müşteri kayıtları', '<div class="aboutgrid" style="width:100%;min-width:260px"><div><small>SÜRÜM</small><b>2.0</b></div><div><small>KULLANICI</small><b>' + esc(oturum.ad) + '</b></div><div><small>YETKİ</small><b>' + (adm ? 'YÖNETİCİ' : 'PERSONEL') + '</b></div><div><small>VERİ KONUMU</small><b>' + (sb ? 'BULUT' : 'BU CİHAZ') + '</b></div></div>')]
    };
    return L[id] || [];
  }
  function ayarPanel() {
    var adm = yonetici(), sec = AYAR_BOLUMLER.filter(function (x) { return !x[4] || adm; });
    var cur = sec.filter(function (x) { return x[0] === durum.ayb; })[0] || sec[0], q = tr(durum.aq).trim();
    var satir = function (x) {
      return '<div class="setrow"><div><b class="rtitle">' + x.t + (x.e ? ' <span class="rtag">' + x.e + '</span>' : '') + '</b><small>' + x.a + '</small></div><div class="ctl">' + x.h + '</div></div>';
    };
    if (q) {
      var bul2 = [];
      sec.forEach(function (b) { ayarSatirlari(b[0]).forEach(function (x) { if (tr(x.t + ' ' + x.a + ' ' + b[1]).indexOf(q) > -1) bul2.push(x); }); });
      return '<div class="sp-head"><span class="ic">' + ik('ara') + '</span><div><h2>ARAMA SONUÇLARI</h2><p>' + bul2.length + ' AYAR BULUNDU</p></div></div><div class="sp-body">' +
        (bul2.length ? bul2.map(satir).join('') : '<div class="bos"><div class="big">Ayar bulunamadı</div></div>') + '</div>';
    }
    return '<div class="sp-head"><span class="ic">' + ik(cur[3]) + '</span><div><h2>' + cur[1] + '</h2><p>' + esc(cur[2].toLocaleUpperCase('tr')) + '</p></div>' +
      (SIFIRLA[cur[0]] ? '<button class="k-link" type="button" data-act="ay-sifirla" data-b="' + cur[0] + '">BU BÖLÜMÜ SIFIRLA</button>' : '') + '</div><div class="sp-body">' + ayarSatirlari(cur[0]).map(satir).join('') + '</div>';
  }
  function ayarSayfasi() {
    var adm = yonetici(), sec = AYAR_BOLUMLER.filter(function (x) { return !x[4] || adm; });
    var cur = sec.filter(function (x) { return x[0] === durum.ayb; })[0] || sec[0];
    return sayfaBasligi(sf('ayarlar'), '<label class="setsearch">' + ik('ara') + '<span class="sr">Ayar ara</span><input data-in="ay-ara" type="search" placeholder="Ayar ara…" autocomplete="off" value="' + esc(durum.aq) + '"></label>') +
      '<div class="setlayout"><nav class="setnav" aria-label="Ayar bölümleri">' + sec.map(function (b) {
        return '<button type="button" class="' + (b[0] === cur[0] && !durum.aq ? 'on' : '') + '" data-act="ay-bolum" data-b="' + b[0] + '"><span class="ic">' + ik(b[3]) + '</span><span><b>' + b[1] + '</b><small>' + esc(b[2].toLocaleUpperCase('tr')) + '</small></span></button>';
      }).join('') + '</nav><section class="setpanel" id="ay-panel">' + ayarPanel() + '</section></div>';
  }

  function tazele() { render(); }

  /* ---------- hızlı ziyaret ---------- */
  function hizliZiyaret() {
    ac(baslik('Ziyaret Ekle') + '<div class="m-body f"><label for="hz-ara">Hangi müşteri?</label><input id="hz-ara" type="search" placeholder="İsim veya telefon yazın…" autocomplete="off"><div id="hz-liste" class="hzl"></div></div>' +
      '<div class="m-foot"><button class="btn left" type="button" id="hz-yeni">+ Yeni müşteri olarak ekle</button><button class="btn" type="button" id="hz-v">Vazgeç</button></div>');
    function ciz() {
      var q = tr($('#hz-ara').value).trim(), qt = telTemiz(q);
      var l = db.filter(function (m) { return !q || tr(m.ad).indexOf(q) > -1 || (qt.length > 2 && telTemiz(m.tel).indexOf(qt) > -1); })
        .sort(function (a, b) { return sonZiyaret(b).localeCompare(sonZiyaret(a)) || a.ad.localeCompare(b.ad, 'tr'); }).slice(0, 8);
      $('#hz-liste').innerHTML = l.length ? l.map(function (m) {
        return '<button type="button" class="hzi" data-id="' + esc(m.id) + '"><span class="avatar sm" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><span><b>' + esc(m.ad) + '</b><small>' + esc(m.tel || 'Telefon yok') + (sonZiyaret(m) ? ' · son: ' + tarihGoster(sonZiyaret(m)) : '') + '</small></span></button>';
      }).join('') : '<p class="hint">Eşleşen müşteri yok.</p>';
    }
    $('#hz-ara').addEventListener('input', ciz); ciz();
    $('#hz-liste').addEventListener('click', function (e) {
      var b = e.target.closest('[data-id]'); if (!b) return;
      var m = bul(b.getAttribute('data-id')); ziyaretModal(m, null, { geri: kapat });
    });
    $('#hz-yeni').onclick = function () { musteriForm(); };
    $('#hz-v').onclick = kapat;
    setTimeout(function () { $('#hz-ara').focus(); }, 30);
  }

  /* ---------- hızlı arama (Ctrl+K) ---------- */
  var qs = $('#qs'), qsSecim = 0, qsOgeler = [];
  function qsAc() {
    if (!oturum) return;
    qs.innerHTML = '<div class="k-qs-box"><div class="k-qs-in">' + ik('ara') + '<input id="qs-in" placeholder="Müşteri, işlem ya da sayfa ara…" autocomplete="off" aria-label="Ara"><kbd>Esc</kbd></div><div class="k-qs-list" id="qs-list"></div>' +
      '<div class="k-qs-foot"><span><kbd>↑</kbd><kbd>↓</kbd> seç</span><span><kbd>Enter</kbd> aç</span></div></div>';
    if (!qs.open) qs.showModal();
    $('#qs-in').addEventListener('input', qsCiz); qsCiz();
    $('#qs-in').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { qsSecim = Math.min(qsOgeler.length - 1, qsSecim + 1); qsVurgu(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { qsSecim = Math.max(0, qsSecim - 1); qsVurgu(); e.preventDefault(); }
      else if (e.key === 'Enter') { if (qsOgeler[qsSecim]) qsCalistir(qsSecim); e.preventDefault(); }
    });
    setTimeout(function () { $('#qs-in').focus(); }, 20);
  }
  function qsCiz() {
    var q = tr($('#qs-in').value).trim(), qt = telTemiz(q), o = [];
    var eylemler = [['Yeni müşteri ekle', 'arti', function () { musteriForm(); }], ['Ziyaret ekle', 'arti', hizliZiyaret], ['Randevu ekle', 'takvim', function () { randevuForm(null); }], ['Ürün sat', 'kutu', function () { satisForm(); }]];
    eylemler.forEach(function (e) { if (!q || tr(e[0]).indexOf(q) > -1) o.push({ g: 'EYLEMLER', t: e[0], a: '', i: e[1], f: e[2] }); });
    SAYFALAR.forEach(function (s) { if ((!s[5] || yonetici()) && (!q || tr(s[1]).indexOf(q) > -1)) o.push({ g: 'SAYFALAR', t: s[1], a: s[4], i: s[2], f: function () { git(s[0]); } }); });
    if (q) {
      db.filter(function (m) { return tr(m.ad).indexOf(q) > -1 || (qt.length > 2 && telTemiz(m.tel).indexOf(qt) > -1); }).slice(0, 8).forEach(function (m) {
        o.push({ g: 'MÜŞTERİLER', t: m.ad, a: (m.tel || '') + (sonZiyaret(m) ? ' · son ziyaret ' + tarihGoster(sonZiyaret(m)) : ''), i: 'users', f: function () { detay(m.id); } });
      });
    }
    qsOgeler = o; qsSecim = 0;
    var son = '';
    $('#qs-list').innerHTML = o.length ? o.map(function (x, i) {
      var g = x.g !== son ? '<div class="k-qs-g">' + x.g + '</div>' : ''; son = x.g;
      return g + '<button type="button" class="k-qs-item' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' + ik(x.i) + '<span><b>' + esc(x.t) + '</b>' + (x.a ? '<small>' + esc(x.a) + '</small>' : '') + '</span></button>';
    }).join('') : '<div class="k-qs-empty">Sonuç yok</div>';
  }
  function qsVurgu() {
    Array.prototype.forEach.call(qs.querySelectorAll('.k-qs-item'), function (b, i) { b.classList.toggle('on', i === qsSecim); if (i === qsSecim) b.scrollIntoView({ block: 'nearest' }); });
  }
  function qsCalistir(i) { var f = qsOgeler[i].f; qs.close(); f(); }
  qs.addEventListener('click', function (e) {
    var b = e.target.closest('.k-qs-item'); if (b) return qsCalistir(Number(b.getAttribute('data-i')));
    if (e.target === qs) qs.close();
  });

  /* ---------- excel raporu (.xlsx) — kütüphanesiz, formüllü ---------- */
  var CRC_T = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF, i; for (i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zipYap(dosyalar) {
    var enc = new TextEncoder(), parts = [], cd = [], ofs = 0, cdBoy = 0;
    dosyalar.forEach(function (f) {
      var ad = enc.encode(f.ad), veri = enc.encode(f.icerik), crc = crc32(veri), n = veri.length;
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true); lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, n, true); lh.setUint32(22, n, true); lh.setUint16(26, ad.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), ad, veri);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, n, true); ch.setUint32(24, n, true); ch.setUint16(28, ad.length, true); ch.setUint32(42, ofs, true);
      cd.push(new Uint8Array(ch.buffer), ad); cdBoy += 46 + ad.length; ofs += 30 + ad.length + n;
    });
    var son = new DataView(new ArrayBuffer(22));
    son.setUint32(0, 0x06054b50, true); son.setUint16(8, dosyalar.length, true); son.setUint16(10, dosyalar.length, true); son.setUint32(12, cdBoy, true); son.setUint32(16, ofs, true);
    return new Blob(parts.concat(cd, [new Uint8Array(son.buffer)]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  function xesc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function colHarf(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function serial(iso) { var a = iso.split('-').map(Number); return Math.round((Date.UTC(a[0], a[1] - 1, a[2]) - Date.UTC(1899, 11, 30)) / 864e5); }
  /* stil numaraları: 1 başlık, 2 başlık(büyük), 3 not, 4 tarih, 5 para, 6 tam sayı, 7 metin, 8 toplam etiket, 9 toplam para, 10 toplam sayı, 11 sarı yüzde, 12 ay, 13 sarı metin */
  var XSTIL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="3"><numFmt numFmtId="164" formatCode="dd\\.mm\\.yyyy"/><numFmt numFmtId="165" formatCode="#,##0\\ &quot;₺&quot;"/><numFmt numFmtId="166" formatCode="mmmm\\ yyyy"/></numFmts>' +
    '<fonts count="5"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FF3A2230"/><name val="Calibri"/></font><font><i/><sz val="11"/><color rgb="FF86727D"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF3A2230"/><name val="Calibri"/></font></fonts>' +
    '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3A2230"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF9E8ED"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF3C4"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFE7D5DA"/></left><right style="thin"><color rgb="FFE7D5DA"/></right><top style="thin"><color rgb="FFE7D5DA"/></top><bottom style="thin"><color rgb="FFE7D5DA"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="14">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="1" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="165" fontId="4" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="1" fontId="4" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="9" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  function sayfaXml(sf) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"' + (sf.izgara === false ? ' showGridLines="0"' : '') + '>' +
      (sf.dondur ? '<pane' + (sf.dondur[0] ? ' xSplit="' + sf.dondur[0] + '"' : '') + ' ySplit="' + sf.dondur[1] + '" topLeftCell="' + colHarf(sf.dondur[0]) + (sf.dondur[1] + 1) + '" activePane="' + (sf.dondur[0] ? 'bottomRight' : 'bottomLeft') + '" state="frozen"/>' : '') + '</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/>';
    x += '<cols>' + sf.genislik.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols><sheetData>';
    sf.satirlar.forEach(function (row, ri) {
      if (!row) return;
      var r = ri + 1;
      x += '<row r="' + r + '"' + (sf.yuk && sf.yuk[r] ? ' ht="' + sf.yuk[r] + '" customHeight="1"' : '') + '>';
      row.forEach(function (h, ci) {
        if (h === null || h === undefined) return;
        if (typeof h !== 'object') h = { v: h };
        var ref = colHarf(ci) + r, st = h.s ? ' s="' + h.s + '"' : '';
        if (h.f) {
          var metin = typeof h.v === 'string';
          x += '<c r="' + ref + '"' + st + (metin ? ' t="str"' : '') + '><f>' + xesc(h.f) + '</f>' + (h.v !== undefined && h.v !== null ? '<v>' + (metin ? xesc(h.v) : (Math.round(Number(h.v) * 1e6) / 1e6)) + '</v>' : '') + '</c>';
        } else if (typeof h.v === 'number') x += '<c r="' + ref + '"' + st + '><v>' + h.v + '</v></c>';
        else if (h.v === '' || h.v === undefined || h.v === null) x += '<c r="' + ref + '"' + st + '/>';
        else x += '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' + xesc(h.v) + '</t></is></c>';
      });
      x += '</row>';
    });
    x += '</sheetData>' + (sf.filtre ? '<autoFilter ref="' + sf.filtre + '"/>' : '') + '</worksheet>';
    return x;
  }
  function excelRaporu() {
    if (!yonetici()) return;
    var kk = Number(ayarlar.kartKesinti) || 0, ortakVar = !!ayarlar.ortakAd, ortakPay = ortakVar ? (Number(ayarlar.ortakPay) || 0) / 100 : 0, ortakGrup = ayarlar.ortakGrup || 'Kuaför';
    /* ham satırlar: ziyaret × grup */
    var R = [];
    tumZ().sort(function (a, b) { return a.z.tarih < b.z.tarih ? -1 : a.z.tarih > b.z.tarih ? 1 : 0; }).forEach(function (x) {
      var z = x.z, gr = {}, sira = [];
      kalemPaylari(z).forEach(function (k) { if (!gr[k.grup]) { gr[k.grup] = { pay: 0, ad: [] }; sira.push(k.grup); } gr[k.grup].pay += k.pay; gr[k.grup].ad.push(k.ad); });
      sira.forEach(function (g, i) {
        var t = Math.round(gr[g].pay * 100) / 100, od = z.odeme || 'Nakit', net = od === 'Kredi Kartı' ? t / (1 + kk / 100) : t, s = serial(z.tarih);
        var d = dObj(z.tarih);
        R.push({ t: s, hafta: s - ((d.getDay() + 6) % 7), ay: serial(isoD(new Date(d.getFullYear(), d.getMonth(), 1))), musteri: x.m.ad, islem: gr[g].ad.join(' + '), grup: g, uzman: z.personel || '', odeme: od, tutar: t, net: net, ortak: g === ortakGrup ? net * ortakPay : 0, zv: i === 0 ? 1 : 0 });
      });
    });
    if (!R.length) { bildir('Rapor için ziyaret kaydı yok.'); return; }
    var N = R.length + 1, Rg = function (k) { return "'VERİ'!$" + k + '$2:$' + k + '$' + N; };
    var HDR = function (arr) { return arr.map(function (b) { return { v: b, s: 1 }; }); };
    var KOL = ['Ziyaret', 'Brüt Ciro', 'Nakit', 'Kredi Kartı', 'Havale / EFT', 'Kart Kesintisi', 'Net Ciro', 'Ortak Payı', 'SİYA Hakediş'];
    function toplaFn(f, alan) { return R.filter(f).reduce(function (a, r) { return a + r[alan]; }, 0); }
    /* bir rapor satırı: anahtar sütunu (VERİ'de), anahtar hücresi, başlangıç sütunu */
    function rapSatir(r, anahtarSut, anahtarAlan, anahtarDeger, anahtarHucre, c0) {
      var k = anahtarHucre, z = Rg(anahtarSut), L = function (j) { return colHarf(c0 + j); };
      var eslesen = function (r_) { return r_[anahtarAlan] === anahtarDeger; };
      var ode = function (o) { return toplaFn(function (r_) { return eslesen(r_) && r_.odeme === o; }, 'tutar'); };
      var brut = toplaFn(eslesen, 'tutar'), net = toplaFn(eslesen, 'net'), ort = toplaFn(eslesen, 'ortak');
      return [
        { f: 'SUMIFS(' + Rg('L') + ',' + z + ',' + k + ')', v: toplaFn(eslesen, 'zv'), s: 6 },
        { f: 'SUMIFS(' + Rg('G') + ',' + z + ',' + k + ')', v: brut, s: 5 },
        { f: 'SUMIFS(' + Rg('G') + ',' + z + ',' + k + ',' + Rg('F') + ',"Nakit")', v: ode('Nakit'), s: 5 },
        { f: 'SUMIFS(' + Rg('G') + ',' + z + ',' + k + ',' + Rg('F') + ',"Kredi Kartı")', v: ode('Kredi Kartı'), s: 5 },
        { f: 'SUMIFS(' + Rg('G') + ',' + z + ',' + k + ',' + Rg('F') + ',"Havale / EFT")', v: ode('Havale / EFT'), s: 5 },
        { f: L(1) + r + '-' + L(6) + r, v: brut - net, s: 5 },
        { f: 'SUMIFS(' + Rg('H') + ',' + z + ',' + k + ')', v: net, s: 5 },
        { f: 'SUMIFS(' + Rg('K') + ',' + z + ',' + k + ')', v: ort, s: 5 },
        { f: L(6) + r + '-' + L(7) + r, v: net - ort, s: 5 }
      ];
    }
    function toplamSatir(r, ilk, son, c0, etiketSut, etiket, degerler) {
      var row = [], i;
      for (i = 0; i < c0 + 9; i++) row.push(null);
      for (i = 0; i < c0; i++) row[i] = { v: i === etiketSut ? etiket : '', s: 8 };
      for (i = 0; i < 9; i++) { var L = colHarf(c0 + i); row[c0 + i] = { f: 'SUM(' + L + ilk + ':' + L + son + ')', v: degerler[i], s: i === 0 ? 10 : 9 }; }
      return row;
    }
    function toplamlar(satirlar) { var t = [0, 0, 0, 0, 0, 0, 0, 0, 0]; satirlar.forEach(function (s) { s.forEach(function (h, i) { t[i] += h.v; }); }); return t; }

    var ilk = R[0].t, son = R[R.length - 1].t, sheets = [];
    var yilAy = function (s) { var d = new Date(Date.UTC(1899, 11, 30) + s * 864e5); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; };
    /* AYLIK */
    var ay0 = yilAy(ilk), ay1 = yilAy(son), aylar = [], y = ay0.y, m = ay0.m;
    while (y < ay1.y || (y === ay1.y && m <= ay1.m)) { aylar.push(serial(y + '-' + p2(m + 1) + '-01')); m++; if (m > 11) { m = 0; y++; } }
    var aS = [[{ v: 'AYLIK RAPOR', s: 2 }], [{ v: 'Aylık ciro, ödeme dağılımı, kart kesintisi ve hakediş · Hazırlanma: ' + tarihGoster(bugun()), s: 3 }], HDR(['Ay'].concat(KOL))], hS = [], gS = [];
    var aRows = aylar.map(function (s, i) { var r = 4 + i; return [{ v: s, s: 12 }].concat(rapSatir(r, 'J', 'ay', s, '$A' + r, 1)); });
    aRows.forEach(function (row) { aS.push(row); });
    var aVals = toplamlar(aRows.map(function (r) { return r.slice(1); }));
    aS.push(toplamSatir(4 + aylar.length, 4, 3 + aylar.length, 1, 0, 'TOPLAM', aVals));
    sheets.push({ ad: 'AYLIK', satirlar: aS, genislik: [16, 10, 13, 12, 13, 13, 14, 14, 13, 14], yuk: { 3: 30 }, dondur: [1, 3], izgara: false });
    /* HAFTALIK */
    var hb0 = R[0].hafta;
    var haftalar = []; for (var hb = hb0; hb <= son; hb += 7) haftalar.push(hb);
    var hS0 = [[{ v: 'HAFTALIK RAPOR', s: 2 }], [{ v: 'Pazartesi–Pazar haftaları · Hazırlanma: ' + tarihGoster(bugun()), s: 3 }], HDR(['Hafta', 'Başlangıç', 'Bitiş'].concat(KOL))];
    var hRows = haftalar.map(function (s, i) { var r = 4 + i; return [{ v: (i + 1) + '. HAFTA', s: 7 }, { v: s, s: 4 }, { f: 'B' + r + '+6', v: s + 6, s: 4 }].concat(rapSatir(r, 'I', 'hafta', s, '$B' + r, 3)); });
    hRows.forEach(function (row) { hS0.push(row); });
    hS0.push(toplamSatir(4 + haftalar.length, 4, 3 + haftalar.length, 3, 2, 'TOPLAM', toplamlar(hRows.map(function (r) { return r.slice(3); }))));
    sheets.push({ ad: 'HAFTALIK', satirlar: hS0, genislik: [12, 13, 13, 10, 13, 12, 13, 14, 14, 13, 13, 14], yuk: { 3: 30 }, dondur: [3, 3], izgara: false });
    /* GÜNLÜK (en fazla son 400 gün) */
    var g0 = Math.max(ilk, son - 399), gS0 = [[{ v: 'GÜNLÜK RAPOR', s: 2 }], [{ v: 'Her gün için ziyaret, ciro ve ödeme dağılımı · Hazırlanma: ' + tarihGoster(bugun()), s: 3 }], HDR(['Tarih', 'Gün'].concat(KOL))], gRows = [], gi;
    for (gi = g0; gi <= son; gi++) {
      var rr = 4 + gRows.length, dd = new Date(Date.UTC(1899, 11, 30) + gi * 864e5), gun = GUNLER[dd.getUTCDay()];
      gRows.push([{ v: gi, s: 4 }, { f: 'CHOOSE(WEEKDAY(A' + rr + ',2),"Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar")', v: gun, s: 7 }].concat(rapSatir(rr, 'A', 't', gi, '$A' + rr, 2)));
    }
    gRows.forEach(function (row) { gS0.push(row); });
    gS0.push(toplamSatir(4 + gRows.length, 4, 3 + gRows.length, 2, 1, 'TOPLAM', toplamlar(gRows.map(function (r) { return r.slice(2); }))));
    sheets.push({ ad: 'GÜNLÜK', satirlar: gS0, genislik: [12, 13, 10, 13, 12, 13, 14, 14, 13, 13, 14], yuk: { 3: 30 }, dondur: [2, 3], izgara: false });
    /* VERİ */
    var vS = [HDR(['Tarih', 'Müşteri', 'İşlem', 'Grup', 'Uzman', 'Ödeme', 'Tutar', 'Net Tutar', 'Hafta Başı', 'Ay Başı', 'Ortak Payı', 'Ziyaret'])];
    R.forEach(function (r, i) {
      var n = i + 2;
      vS.push([{ v: r.t, s: 4 }, { v: r.musteri, s: 7 }, { v: r.islem, s: 7 }, { v: r.grup, s: 7 }, { v: r.uzman, s: 7 }, { v: r.odeme, s: 7 }, { v: r.tutar, s: 5 },
        { f: 'IF(F' + n + '="Kredi Kartı",G' + n + '/(1+AYARLAR!$B$2),G' + n + ')', v: r.net, s: 5 }, { f: 'A' + n + '-WEEKDAY(A' + n + ',2)+1', v: r.hafta, s: 4 },
        { f: 'DATE(YEAR(A' + n + '),MONTH(A' + n + '),1)', v: r.ay, s: 12 }, { f: 'IF(D' + n + '=AYARLAR!$B$4,H' + n + '*AYARLAR!$B$3,0)', v: r.ortak, s: 5 }, { v: r.zv, s: 6 }]);
    });
    sheets.push({ ad: 'VERİ', satirlar: vS, genislik: [12, 22, 34, 11, 14, 14, 12, 12, 12, 12, 12, 9], dondur: [0, 1], filtre: 'A1:L' + N });
    /* ÜRÜN SATIŞ */
    var us = urunSatis.slice().sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; });
    var uS = [HDR(['Tarih', 'Ürün', 'Adet', 'Birim Fiyat', 'Tutar', 'Alış Fiyatı', 'Kâr', 'Ödeme', 'Müşteri'])];
    us.forEach(function (x, i) {
      var n = i + 2, m_ = x.musteriId ? bul(x.musteriId) : null;
      uS.push([{ v: serial(x.tarih), s: 4 }, { v: x.ad, s: 7 }, { v: x.adet, s: 6 }, { v: x.fiyat, s: 5 }, { f: 'C' + n + '*D' + n, v: x.adet * x.fiyat, s: 5 }, { v: Number(x.alis) || 0, s: 5 },
        { f: 'C' + n + '*(D' + n + '-F' + n + ')', v: x.adet * (x.fiyat - (Number(x.alis) || 0)), s: 5 }, { v: x.odeme || '', s: 7 }, { v: m_ ? m_.ad : '', s: 7 }]);
    });
    if (us.length) { var tn = us.length + 2; uS.push([{ v: 'TOPLAM', s: 8 }, { v: '', s: 8 }, { f: 'SUM(C2:C' + (tn - 1) + ')', v: us.reduce(function (a, x) { return a + x.adet; }, 0), s: 10 }, { v: '', s: 8 }, { f: 'SUM(E2:E' + (tn - 1) + ')', v: us.reduce(function (a, x) { return a + x.adet * x.fiyat; }, 0), s: 9 }, { v: '', s: 8 }, { f: 'SUM(G2:G' + (tn - 1) + ')', v: us.reduce(function (a, x) { return a + x.adet * (x.fiyat - (Number(x.alis) || 0)); }, 0), s: 9 }]); }
    sheets.push({ ad: 'ÜRÜN SATIŞ', satirlar: uS, genislik: [12, 44, 8, 13, 13, 13, 13, 14, 20], dondur: [0, 1] });
    /* STOK */
    var sS = [HDR(['Kod', 'Ürün', 'Grup', 'Satış Fiyatı', 'Alış Fiyatı', 'Giriş', 'Satılan', 'Kalan', 'Stok Maliyeti'])];
    urunler.forEach(function (u, i) {
      var n = i + 2;
      sS.push([{ v: u.kod || '', s: 7 }, { v: u.ad, s: 7 }, { v: u.grup || '', s: 7 }, { v: Number(u.satis) || 0, s: 5 }, { v: Number(u.alis) || 0, s: 5 }, { v: Number(u.miktar) || 0, s: 6 }, { v: urunSatilan(u), s: 6 },
        { f: 'F' + n + '-G' + n, v: urunKalan(u), s: 6 }, { f: 'MAX(0,H' + n + ')*E' + n, v: Math.max(0, urunKalan(u)) * (Number(u.alis) || 0), s: 5 }]);
    });
    sheets.push({ ad: 'STOK', satirlar: sS, genislik: [11, 50, 14, 13, 13, 8, 9, 8, 14], dondur: [0, 1] });
    /* AYARLAR */
    sheets.push({ ad: 'AYARLAR', genislik: [26, 14, 52], satirlar: [HDR(['AYAR', 'DEĞER', 'AÇIKLAMA']),
      [{ v: 'Kredi kartı kesintisi', s: 7 }, { v: kk / 100, s: 11 }, { v: 'Net tutar = tutar ÷ (1 + oran)', s: 7 }],
      [{ v: 'Ortak payı', s: 7 }, { v: ortakPay, s: 11 }, { v: ortakVar ? 'Ortak: ' + ayarlar.ortakAd : 'Ortak adı sayfada tanımlı değil; pay 0', s: 7 }],
      [{ v: 'Hakediş grubu', s: 7 }, { v: ortakGrup, s: 13 }, { v: 'Payın hesaplandığı işlem grubu', s: 7 }], null,
      [{ v: 'Sarı hücreleri değiştirirseniz tüm sayfalardaki hesaplar güncellenir. Hazırlanma: ' + tarihGoster(bugun()), s: 3 }]] });
    /* paketle */
    var dosyalar = [
      { ad: '[Content_Types].xml', icerik: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        sheets.map(function (_, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' },
      { ad: '_rels/.rels', icerik: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { ad: 'xl/workbook.xml', icerik: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>' +
        sheets.map(function (sf, i) { return '<sheet name="' + xesc(sf.ad) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>' },
      { ad: 'xl/_rels/workbook.xml.rels', icerik: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets.map(function (_, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
        '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { ad: 'xl/styles.xml', icerik: XSTIL }
    ].concat(sheets.map(function (sf, i) { return { ad: 'xl/worksheets/sheet' + (i + 1) + '.xml', icerik: sayfaXml(sf) }; }));
    var blob = zipYap(dosyalar);
    indir('siya-rapor-' + bugun() + '.xlsx', blob, blob.type);
    bildir('Excel raporu indirildi: günlük, haftalık, aylık, veri, ürün ve stok sayfaları.');
  }

  /* ---------- csv ---------- */
  function csvMusteriler() {
    var s = ['Ad Soyad;Telefon;E-posta;Doğum Tarihi;VIP;Ziyaret Sayısı;Son Ziyaret;Toplam Harcama;Alerji;Not'];
    db.forEach(function (m) {
      s.push([m.ad, m.tel, m.eposta, m.dogum ? tarihGoster(m.dogum) : '', m.vip ? 'Evet' : '', (m.ziyaretler || []).length,
        sonZiyaret(m) ? tarihGoster(sonZiyaret(m)) : '', toplam(m), m.alerji, m.not].map(csvHucre).join(';'));
    });
    indir('siya-musteriler-' + bugun() + '.csv', '﻿' + s.join('\r\n'), 'text/csv;charset=utf-8');
  }
  function csvZiyaretler(l) {
    var s = ['Tarih;Müşteri;Telefon;İşlemler;Uzman;Ödeme;Tutar;Net Tutar;Not'];
    l.slice().sort(function (a, b) { return a.z.tarih < b.z.tarih ? -1 : 1; }).forEach(function (x) {
      s.push([tarihGoster(x.z.tarih), x.m.ad, x.m.tel, (x.z.hizmetler || []).join(' + '), x.z.personel, x.z.odeme, Number(x.z.tutar) || 0, Math.round((Number(x.z.tutar) || 0) * netCarpan(x.z) * 100) / 100, x.z.not].map(csvHucre).join(';'));
    });
    indir('siya-ziyaretler-' + bugun() + '.csv', '﻿' + s.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ---------- olaylar ---------- */
  function tumVeriyiSil() {
    var t = prompt('Tüm müşteri, ziyaret, randevu ve ürün satış kayıtları silinecek (fiyat listesi ve ürün kartları kalır). Geri alınamaz.\nDevam etmek için SİL yazın:');
    if (t === null || tr(t.trim()) !== 'sil') return;
    db = []; randevular = []; urunSatis = []; kaydet(); kaydetRan(); kaydetUSat(); render(); bildir('Müşteri, randevu ve ürün satış kayıtları silindi (fiyat listesi ve ürünler kaldı).');
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && tr(e.key) === 'k') { e.preventDefault(); if (qs.open) qs.close(); else qsAc(); }
  });
  window.addEventListener('hashchange', function () { if (oturum) { durum.m.limit = 50; render(); } });
  $('#app').addEventListener('click', function (e) {
    var n = e.target.closest('[data-nav]');
    if (n) { if (n.getAttribute('data-f')) { durum.m.filtre = n.getAttribute('data-f'); } git(n.getAttribute('data-nav')); return; }
    var a = e.target.closest('[data-act]'); if (!a) return;
    var act = a.getAttribute('data-act');
    if (act === 'ac') return detay(a.getAttribute('data-id'));
    if (act === 'z-duzenle') { e.stopPropagation(); var m = bul(a.getAttribute('data-id')); ziyaretModal(m, (m.ziyaretler || []).filter(function (z) { return z.id === a.getAttribute('data-z'); })[0], { geri: kapat }); return; }
    var is = {
      'yeni-musteri': function () { musteriForm(); }, 'yeni-ziyaret': hizliZiyaret,
      'yeni-randevu': function () { randevuForm(null); },
      'z-sil': function () { var m = bul(a.getAttribute('data-id')); if (!silebilir() || !m || !confirm('Bu ziyaret kaydı silinsin mi?')) return; m.ziyaretler = m.ziyaretler.filter(function (x) { return x.id !== a.getAttribute('data-z'); }); kaydet(); render(); bildir('Ziyaret silindi.'); },
      'm-sil': function () { sil(a.getAttribute('data-id')); },
      'urun-sil': function () { var u = bulUrun(a.getAttribute('data-id')); if (!yonetici() || !u || !confirm('“' + u.ad + '” ürünü silinsin mi? Geçmiş satış kayıtları durur.')) return; urunler = urunler.filter(function (x) { return x.id !== u.id; }); kaydetUrun(); render(); bildir('Ürün silindi.'); },
      'pg-gun': function () { durum.pg = a.getAttribute('data-gun'); render(); },
      'takip': function () { takipPenceresi(a.getAttribute('data-t')); },
      'rv-gun': function () { durum.rn.gun = a.getAttribute('data-gun'); render(); },
      'rv-geldi': function () { randevuGeldi(randevular.filter(function (r) { return r.id === a.getAttribute('data-id'); })[0]); },
      'rv-durum': function () { var r = randevular.filter(function (x) { return x.id === a.getAttribute('data-id'); })[0]; r.durum = a.getAttribute('data-d'); kaydetRan(); render(); },
      'rv-duzenle': function () { randevuForm(randevular.filter(function (x) { return x.id === a.getAttribute('data-id'); })[0]); },
      'rv-sil': function () { if (!silebilir() || !confirm('Randevu silinsin mi?')) return; randevular = randevular.filter(function (x) { return x.id !== a.getAttribute('data-id'); }); kaydetRan(); render(); },
      'urun-sat': function () { satisForm(a.getAttribute('data-id')); }, 'urun-ekle': function () { urunForm(null); },
      'urun-duzenle': function () { urunForm(bulUrun(a.getAttribute('data-id'))); }, 'urun-giris': function () { urunGiris(bulUrun(a.getAttribute('data-id'))); },
      'satis-sil': function () { if (!yonetici() || !confirm('Bu satış silinsin mi? Ürün stoğa geri eklenir.')) return; urunSatis = urunSatis.filter(function (x) { return x.id !== a.getAttribute('data-id'); }); kaydetUSat(); render(); },
      'st-filtre': function () { durum.st.filtre = a.getAttribute('data-f'); render(); }, 'csv-stok': csvStok, 'ara': qsAc, 'cikis': cikis, 'yedek': yedekEkrani,
      'fiyat-duzenle': fiyatEkrani, 'kullanicilar': kullaniciEkrani, 'sifre': function () { sifreFormu(oturum, true, kapat); },
      'sifirla': tumVeriyiSil, 'yazdir': function () { window.print(); }, 'csv-musteri': csvMusteriler, 'excel-rapor': excelRaporu,
      'csv-ziyaret': function () { csvZiyaretler(sayfaAdi()[0] === 'raporlar' ? aralikta(tumZ(), donemAraligi(durum.r.donem, durum.r.bas, durum.r.bit)) : ziyaretListesi()); },
      'tema': function () { var koyu = document.documentElement.getAttribute('data-theme') === 'dark'; ayarlar.tema = koyu ? 'light' : 'dark'; kaydetAyar(); temaUygula(); render(); },
      'ay-bolum': function () { durum.ayb = a.getAttribute('data-b'); durum.aq = ''; render(); },
      'ay-sifirla': function () { var o = SIFIRLA[a.getAttribute('data-b')]; Object.keys(o).forEach(function (k) { ayarlar[k] = o[k]; }); kaydetAyar(); temaUygula(); render(); bildir('Bölüm varsayılana döndü.'); },
      'menu-sabit': function () { ayarlar.menuSabit = !ayarlar.menuSabit; kaydetAyar(); render(); },
      'gorunum': function () { ayarlar.gorunum = a.getAttribute('data-g'); kaydetAyar(); render(); },
      'filtre': function () { durum.m.filtre = a.getAttribute('data-f'); durum.m.limit = 50; musteriListe(); },
      'daha': function () { durum.m.limit += 50; musteriListe(); },
      'gun': function () { durum.z.donem = 'ozel'; durum.z.bas = durum.z.bit = a.getAttribute('data-gun'); git('ziyaretler'); },
      'donem': function () { var k = a.getAttribute('data-k'); durum[k].donem = a.getAttribute('data-d'); if (durum[k].donem === 'ozel' && !durum[k].bas) { durum[k].bas = durum[k].bit = bugun(); } render(); },
      'ayar': function () {
        var k = a.getAttribute('data-k'), v = a.getAttribute('data-v');
        ayarlar[k] = v === 'true' ? true : v === 'false' ? false : v; kaydetAyar();
        temaUygula();
        render();
      }
    }[act];
    if (is) is();
  });
  function girdi(e) {
    var t = e.target, k = t.getAttribute && t.getAttribute('data-in'); if (!k) return;
    var v = t.value;
    if (k === 'm-ara') { durum.m.ara = v; durum.m.limit = 50; musteriListe(); }
    else if (k === 'm-sirala') { durum.m.sirala = v; musteriListe(); }
    else if (k === 'z-ara') { durum.z.ara = v; ziyaretIcerik(); }
    else if (k === 'z-odeme') { durum.z.odeme = v; ziyaretIcerik(); }
    else if (k === 'z-uzman') { durum.z.uzman = v; ziyaretIcerik(); }
    else if (k === 'z-bas' || k === 'z-bit') { durum.z[k.slice(2)] = v; if (k === 'z-bas' && (!durum.z.bit || durum.z.bit < v)) durum.z.bit = v; ziyaretIcerik(); }
    else if (k === 'r-bas' || k === 'r-bit') { if (e.type === 'change') { durum.r[k.slice(2)] = v; if (k === 'r-bas' && (!durum.r.bit || durum.r.bit < v)) durum.r.bit = v; render(); } }
    else if (k === 'fa-ara') { durum.fa = v; fiyatListe(); }
    else if (k === 'pg-gun' && e.type === 'change' && v) { durum.pg = v; render(); }
    else if (k === 'rn-gun' && e.type === 'change' && v) { durum.rn.gun = v; render(); }
    else if (k === 'st-ara') { durum.st.ara = v; stokTabloGuncelle(); }
    else if (k === 'ay-ara') { durum.aq = v; var pn = $('#ay-panel'); if (pn) pn.innerHTML = ayarPanel(); Array.prototype.forEach.call(document.querySelectorAll('.setnav button'), function (b) { b.classList.toggle('on', !v && b.getAttribute('data-b') === durum.ayb); }); }
    else if (k === 'ay-vurgu') { ayarlar.vurgu = v; temaUygula(); if (e.type === 'change') { kaydetAyar(); render(); } }
    else if (k.indexOf('ay-') === 0 && e.type === 'change') {
      var an = k.slice(3);
      ayarlar[an] = (an === 'kartKesinti' || an === 'ortakPay') ? Math.min(100, Math.max(0, Number(v) || 0)) : v.trim();
      kaydetAyar(); bildir('Ayar kaydedildi.');
    }
  }
  function stokTabloGuncelle() {
    var y = window.scrollY; render(); window.scrollTo(0, y);
    var i = document.querySelector('[data-in=st-ara]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }
  $('#app').addEventListener('input', girdi);
  $('#app').addEventListener('change', girdi);

  /* ---------- diyalog ---------- */
  function ac(html) {
    modal.innerHTML = html;
    if (!modal.open) modal.showModal();
    var x = modal.querySelector('.x'); if (x) x.onclick = kapat;
  }
  function kapat() { if (modal.open) modal.close(); }
  modal.addEventListener('click', function (e) { if (e.target === modal) kapat(); });

  function baslik(t) { return '<div class="m-head"><h2 id="modal-baslik">' + t + '</h2><button class="x" type="button" aria-label="Kapat">×</button></div>'; }

  /* müşteri formu */
  function musteriForm(id) {
    var m = id ? bul(id) : { vip: false };
    ac(baslik(id ? 'Müşteriyi Düzenle' : 'Yeni Müşteri') +
      '<form id="mf" autocomplete="off"><div class="m-body"><div class="grid f">' +
      '<div class="full"><label for="f-ad">Ad Soyad *</label><input id="f-ad" required maxlength="80" value="' + esc(m.ad) + '"></div>' +
      '<div><label for="f-tel">Telefon</label><input id="f-tel" type="tel" inputmode="tel" maxlength="20" placeholder="05xx xxx xx xx" value="' + esc(m.tel) + '"></div>' +
      '<div><label for="f-ep">E-posta</label><input id="f-ep" type="email" maxlength="100" value="' + esc(m.eposta) + '"></div>' +
      '<div><label for="f-dg">Doğum tarihi</label><input id="f-dg" type="date" max="' + bugun() + '" value="' + esc(m.dogum) + '"></div>' +
      '<div><label for="f-kn">Nasıl tanıştık?</label><select id="f-kn">' +
      ['', 'Tavsiye', 'Instagram', 'Yoldan geçerken', 'Eski müşteri', 'Diğer'].map(function (o) {
        return '<option' + (m.kaynak === o ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="full"><label for="f-al">Alerji / hassasiyet uyarısı</label><textarea id="f-al" maxlength="400" placeholder="Örn. boya içeriğindeki PPD’ye alerjisi var">' + esc(m.alerji) + '</textarea></div>' +
      '<div class="full"><label for="f-nt">Notlar / tercihler</label><textarea id="f-nt" maxlength="800" placeholder="Örn. 7 numara dip boya, kahve sever, sabah randevusu tercih eder">' + esc(m.not) + '</textarea></div>' +
      '<div class="full check"><input id="f-vip" type="checkbox"' + (m.vip ? ' checked' : '') + '><label for="f-vip" style="margin:0;color:inherit;font-size:14px">★ VIP müşteri</label></div>' +
      '</div><p class="err" id="f-err" hidden></p></div>' +
      '<div class="m-foot">' + (id && silebilir() ? '<button type="button" class="btn danger left" id="sil">Müşteriyi Sil</button>' : '') +
      '<button type="button" class="btn" id="vazgec">Vazgeç</button><button class="btn primary" type="submit">Kaydet</button></div></form>');
    $('#vazgec').onclick = function () { id ? detay(id) : kapat(); };
    if (id && silebilir()) $('#sil').onclick = function () { sil(id); };
    $('#mf').onsubmit = function (e) {
      e.preventDefault();
      var ad = $('#f-ad').value.trim();
      if (!ad) { var er = $('#f-err'); er.textContent = 'Ad soyad gerekli.'; er.hidden = false; return; }
      var tel = $('#f-tel').value.trim();
      var cift = db.filter(function (x) { return x.id !== id && tel && telTemiz(x.tel) === telTemiz(tel); })[0];
      if (cift && !confirm('Bu telefon numarası “' + cift.ad + '” adlı müşteride kayıtlı. Yine de kaydedilsin mi?')) return;
      var hedef = id ? m : { id: yeniId(), olusturma: new Date().toISOString(), ziyaretler: [] };
      hedef.ad = ad; hedef.tel = tel; hedef.eposta = $('#f-ep').value.trim(); hedef.dogum = $('#f-dg').value;
      hedef.kaynak = $('#f-kn').value; hedef.alerji = $('#f-al').value.trim(); hedef.not = $('#f-nt').value.trim();
      hedef.vip = $('#f-vip').checked;
      if (!id) db.push(hedef);
      if (kaydet()) { tazele(); bildir(id ? 'Müşteri güncellendi.' : 'Müşteri eklendi.'); detay(hedef.id); }
    };
    setTimeout(function () { if (modal.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return; $('#f-ad').focus(); }, 30);
  }
  function sil(id) {
    var m = bul(id);
    if (!silebilir()) return;
    if (!m || !confirm('“' + m.ad + '” ve tüm ziyaret geçmişi silinsin mi? Bu işlem geri alınamaz.')) return;
    db = db.filter(function (x) { return x.id !== id; });
    kaydet(); tazele(); kapat(); bildir('Müşteri silindi.');
  }

  /* detay */
  function detay(id, duzenlenenZiyaret) {
    var m = bul(id); if (!m) return kapat();
    var zs = ziyaretler(m), son = zs[0], d = sonrakiDogum(m.dogum), ya = yas(m.dogum);
    var tel = m.tel ? '<a href="tel:' + esc(telTemiz(m.tel)) + '">' + esc(m.tel) + '</a> · <a href="' + esc(waLink(m.tel)) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' : '—';
    var h = baslik('Müşteri Kartı') + '<div class="m-body">' +
      '<div class="hero"><span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><div><h3>' + esc(m.ad) +
      (m.vip ? '<span class="tag vip">★ VIP</span>' : '') + '</h3><p>' + (m.kaynak ? esc(m.kaynak) + ' ile geldi · ' : '') +
      'Kayıt: ' + tarihGoster((m.olusturma || '').slice(0, 10)) + '</p></div></div>' +
      '<div class="kv">' +
      '<div><small>Telefon</small><b>' + tel + '</b></div>' +
      '<div><small>E-posta</small><b>' + (m.eposta ? '<a href="mailto:' + esc(m.eposta) + '">' + esc(m.eposta) + '</a>' : '—') + '</b></div>' +
      '<div><small>Doğum günü</small><b>' + (m.dogum ? tarihGoster(m.dogum) + (ya ? ' (' + ya + ')' : '') : '—') + '</b>' +
      (d !== null && d <= 30 ? '<br><small>' + (d === 0 ? 'Bugün! 🎂' : d + ' gün sonra') + '</small>' : '') + '</div>' +
      '<div><small>Ziyaret / Harcama</small><b>' + zs.length + ' · ' + para(toplam(m)) + '</b></div>' +
      '<div><small>Son ziyaret</small><b>' + (son ? tarihGoster(son.tarih) : '—') + '</b></div>' +
      '<div><small>Ort. harcama</small><b>' + (zs.length ? para(toplam(m) / zs.length) : '—') + '</b></div></div>' +
      (m.alerji ? '<div class="note al"><b>⚠ Alerji / hassasiyet:</b> ' + esc(m.alerji) + '</div>' : '') +
      (m.not ? '<div class="note">' + esc(m.not) + '</div>' : '') +
      '<div class="sec">Ziyaret Geçmişi</div>' +
      (zs.length ? zs.map(function (z) {
        return '<div class="visit"><span class="d">' + tarihGoster(z.tarih) + '</span><span class="money">' + para(z.tutar) + '</span>' +
          '<span class="svc">' + (z.hizmetler || []).map(function (s) { return '<i>' + esc(s) + '</i>'; }).join('') + '</span>' +
          '<span class="meta">' + [z.personel && 'Uzman: ' + z.personel, z.odeme, z.not, z.ekleyen && 'Kaydeden: ' + z.ekleyen].filter(Boolean).map(esc).join(' · ') + '</span>' +
          '<span class="acts"><button class="link" data-zd="' + esc(z.id) + '" type="button">Düzenle</button>' +
          (silebilir() ? '<button class="link d" data-zs="' + esc(z.id) + '" type="button">Sil</button>' : '') + '</span></div>';
      }).join('') : '<p style="color:var(--muted)">Henüz ziyaret kaydı yok.</p>') +
      (urunSatis.filter(function (x) { return x.musteriId === m.id; }).length ? '<div class="sec">Ürün Alımları</div>' + urunSatis.filter(function (x) { return x.musteriId === m.id; }).map(function (x) { return '<div class="visit"><span class="d">' + tarihGoster(x.tarih) + '</span><span class="money">' + para(x.adet * x.fiyat) + '</span><span class="svc"><i>' + esc(x.adet + ' × ' + x.ad) + '</i></span></div>'; }).join('') : '') +
      '</div><div class="m-foot"><button class="btn" id="yazdir" type="button">Yazdır</button><button class="btn" id="rvekle" type="button">Randevu Ver</button>' + (silebilir() ? '<button class="btn danger" id="msil" type="button">Müşteriyi Sil</button>' : '') +
      '<button class="btn" id="duzenle" type="button">Bilgileri Düzenle</button>' +
      '<button class="btn primary" id="zekle" type="button">+ Ziyaret Ekle</button></div>';
    ac(h);
    $('#duzenle').onclick = function () { musteriForm(id); };
    $('#yazdir').onclick = function () { window.print(); };
    $('#rvekle').onclick = function () { randevuForm(null); setTimeout(function () { var i = $('#rv-m'); if (i) i.value = m.ad + (m.tel ? ' · ' + m.tel : ''); }, 40); };
    if (silebilir()) $('#msil').onclick = function () { sil(id); };
    $('#zekle').onclick = function () { ziyaretModal(m, null, { geri: function () { detay(id); } }); };
    Array.prototype.forEach.call(modal.querySelectorAll('[data-zd]'), function (b) {
      b.onclick = function () {
        ziyaretModal(m, (m.ziyaretler || []).filter(function (z) { return z.id === b.getAttribute('data-zd'); })[0], { geri: function () { detay(id); } });
      };
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-zs]'), function (b) {
      b.onclick = function () {
        if (!silebilir() || !confirm('Bu ziyaret kaydı silinsin mi?')) return;
        m.ziyaretler = m.ziyaretler.filter(function (z) { return z.id !== b.getAttribute('data-zs'); });
        kaydet(); tazele(); detay(id);
      };
    });
  }

  function kategoriler(liste) {
    var sira = [], tut = {};
    liste.forEach(function (h) {
      if (!tut[h.kategori]) { tut[h.kategori] = { ad: h.kategori, liste: [] }; sira.push(tut[h.kategori]); }
      tut[h.kategori].liste.push(h);
    });
    sira.sort(function (a, b) { return (a.ad === 'Diğer') - (b.ad === 'Diğer'); });
    return sira;
  }
  /* ---------- işlem seçici (açılır pencere) ---------- */
  var secici = $('#secici');
  function seciciKatalog() {
    return hizmetler.map(function (h) { return { ad: h.ad, fiyat: Number(h.fiyat) || 0, grup: h.kategori || 'Diğer' }; });
  }
  function kalemKopya(l) {
    return (l || []).map(function (k) { return { ad: k.ad, fiyat: Number(k.fiyat) || 0, grup: k.grup || kalemGrup(k) }; });
  }
  function secimBaslangic(z) {
    if (!z) return [];
    if (z.kalemler && z.kalemler.length) return kalemKopya(z.kalemler);
    return (z.hizmetler || []).map(function (a) {
      var h = hizmetler.filter(function (x) { return tr(x.ad) === tr(a); })[0];
      return { ad: a, fiyat: h ? Number(h.fiyat) || 0 : 0, grup: h ? (h.kategori || 'Diğer') : 'Diğer' };
    });
  }
  function kalemToplam(ks) { return ks.reduce(function (s, k) { return s + (Number(k.fiyat) || 0); }, 0); }
  function seciciAc(st, bitti) {
    var kat = kategoriler(seciciKatalog().map(function (h) { return { ad: h.ad, fiyat: h.fiyat, kategori: h.grup }; }));
    var acik = {};
    var varsa = kat.filter(function (k) { return k.liste.some(function (h) { return st.kalemler.some(function (x) { return x.ad === h.ad; }); }); });
    (varsa.length ? varsa : kat.slice(0, 1)).forEach(function (k) { acik[k.ad] = true; });
    secici.innerHTML = '<div class="m-head"><h2>İşlem Seç</h2><button class="x" type="button" aria-label="Kapat">×</button></div>' +
      '<div class="m-body f"><input id="sc-ara" type="search" placeholder="İşlem ara… (örn. fön, lazer, manikür)" autocomplete="off" aria-label="İşlem ara"><div id="sc-list"></div></div>' +
      '<div class="m-foot"><span class="left"><small class="hint">SEÇİLEN</small><br><b id="sc-oz"></b></span><button class="btn primary" type="button" id="sc-ok">Tamam</button></div>';
    function secili(ad) { return st.kalemler.some(function (x) { return x.ad === ad; }); }
    function ozet() {
      var n = st.kalemler.length;
      $('#sc-oz').textContent = n ? n + ' işlem · ' + para(kalemToplam(st.kalemler)) : 'Henüz işlem seçilmedi';
      Array.prototype.forEach.call(secici.querySelectorAll('[data-gh]'), function (b) {
        var g = kat.filter(function (k) { return k.ad === b.getAttribute('data-gh'); })[0];
        var c = g.liste.filter(function (h) { return secili(h.ad); }).length;
        var rozet = b.querySelector('.sc-n'); rozet.textContent = c; rozet.hidden = !c;
      });
    }
    function liste() {
      var q = tr($('#sc-ara').value).trim(), html = '', say = 0;
      kat.forEach(function (k) {
        var l = k.liste.filter(function (h) { return !q || tr(h.ad).indexOf(q) > -1; });
        if (!l.length) return;
        say += l.length;
        var a = q ? true : !!acik[k.ad];
        html += '<div class="sc-grp' + (a ? ' open' : '') + '"><button type="button" class="sc-gh" data-gh="' + esc(k.ad) + '" aria-expanded="' + a + '"><span>' + esc(k.ad) + '</span>' +
          '<small>' + l.length + ' işlem</small><em class="sc-n" hidden></em><i aria-hidden="true">' + ik('ok') + '</i></button>' +
          (a ? '<div class="sc-items">' + l.map(function (h) {
            return '<label class="sc-item"><input type="checkbox" value="' + esc(h.ad) + '" data-f="' + h.fiyat + '" data-g="' + esc(k.ad) + '"' + (secili(h.ad) ? ' checked' : '') + '><span class="cb"></span><span class="nm">' + esc(h.ad) + '</span><b>' + (h.fiyat ? para(h.fiyat) : '—') + '</b></label>';
          }).join('') + '</div>' : '') + '</div>';
      });
      $('#sc-list').innerHTML = html || '<p class="hint" style="padding:20px 4px">Eşleşen işlem yok. Listede olmayan işlemi ziyaret ekranından elle ekleyebilirsiniz.</p>';
      ozet();
    }
    $('#sc-ara').addEventListener('input', liste);
    $('#sc-list').addEventListener('click', function (e) {
      var b = e.target.closest('[data-gh]'); if (!b) return;
      var ad = b.getAttribute('data-gh'); acik[ad] = !acik[ad]; liste();
    });
    $('#sc-list').addEventListener('change', function (e) {
      var c = e.target; if (c.type !== 'checkbox') return;
      if (c.checked) { if (!secili(c.value)) st.kalemler.push({ ad: c.value, fiyat: Number(c.getAttribute('data-f')) || 0, grup: c.getAttribute('data-g') }); }
      else st.kalemler = st.kalemler.filter(function (x) { return x.ad !== c.value; });
      ozet();
    });
    function bit() { secici.onclose = null; if (secici.open) secici.close(); bitti(); }
    secici.querySelector('.x').onclick = bit; $('#sc-ok').onclick = bit;
    secici.onclose = function () { secici.onclose = null; bitti(); };
    liste();
    if (!secici.open) secici.showModal();
    setTimeout(function () { $('#sc-ara').focus(); }, 30);
  }
  secici.addEventListener('click', function (e) { if (e.target === secici) secici.close(); });

  /* seçilen işlemler alanı: ziyaret ve randevu pencereleri ortak kullanır */
  function islemHtml() {
    return '<div class="islem"><div id="isl-chips" class="isl-chips"></div>' +
      '<div class="isl-btns"><button type="button" class="btn" id="isl-sec">' + ik('arti') + ' İşlem seç</button><span class="hint" id="isl-top"></span></div>' +
      '<div class="isl-ek"><input id="isl-ekad" maxlength="60" placeholder="Listede olmayan işlem adı" aria-label="Listede olmayan işlem"><input id="isl-ekf" type="number" min="0" step="1" inputmode="numeric" placeholder="₺" aria-label="Fiyat"><button type="button" class="btn small" id="isl-ekle">Ekle</button></div></div>';
  }
  function islemBagla(st, degisti) {
    function ciz() {
      $('#isl-chips').innerHTML = st.kalemler.length ? st.kalemler.map(function (k, i) {
        return '<span class="isl-chip"><b>' + esc(k.ad) + '</b><em>' + (k.fiyat ? para(k.fiyat) : '—') + '</em><button type="button" data-rm="' + i + '" aria-label="' + esc(k.ad) + ' işlemini kaldır">×</button></span>';
      }).join('') : '<span class="isl-bos">Henüz işlem seçilmedi</span>';
      $('#isl-top').textContent = st.kalemler.length ? st.kalemler.length + ' işlem · ' + para(kalemToplam(st.kalemler)) : '';
      degisti();
    }
    $('#isl-sec').onclick = function () { seciciAc(st, ciz); };
    $('#isl-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rm]'); if (!b) return;
      st.kalemler.splice(Number(b.getAttribute('data-rm')), 1); ciz();
    });
    $('#isl-ekle').onclick = function () {
      var ad = $('#isl-ekad').value.trim(); if (!ad) { bildir('İşlem adını yazın.'); return; }
      if (!st.kalemler.some(function (k) { return k.ad === ad; })) st.kalemler.push({ ad: ad, fiyat: Math.max(0, Number($('#isl-ekf').value) || 0), grup: 'Diğer' });
      $('#isl-ekad').value = ''; $('#isl-ekf').value = ''; ciz();
    };
    ciz();
  }
  function aktifKullanicilar() { return kullanicilar.filter(function (u) { return u.aktif !== false; }); }
  function uzmanListe() { return '<datalist id="uz-l">' + aktifKullanicilar().map(function (u) { return '<option value="' + esc(u.ad) + '">'; }).join('') + '</datalist>'; }

  /* ---------- ziyaret penceresi ---------- */
  function ziyaretModal(m, z, opts) {
    opts = opts || {};
    var on = opts.on || {}, geri = opts.geri || kapat;
    var st = { kalemler: z ? secimBaslangic(z) : kalemKopya(on.kalemler) }, elle = false;
    ac(baslik((z ? 'Ziyareti Düzenle' : 'Ziyaret Ekle') + '<small class="msub">' + esc(m.ad) + '</small>') +
      '<form id="vf" class="f" autocomplete="off"><div class="m-body"><div class="grid g3">' +
      '<div><label for="z-t">Tarih *</label><input id="z-t" type="date" required value="' + esc(z ? z.tarih : (on.tarih || bugun())) + '"></div>' +
      '<div><label for="z-p">Uzman</label><input id="z-p" list="uz-l" maxlength="60" value="' + esc(z ? z.personel : (on.personel || (oturum && oturum.ad))) + '">' + uzmanListe() + '</div>' +
      '<div><label for="z-od">Ödeme</label><select id="z-od">' + ODEMELER.map(function (o) { return '<option' + (z && z.odeme === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></div>' +
      '<div class="full"><span class="lbl">Yapılan işlemler</span>' + islemHtml() + '</div>' +
      '<div class="full"><label for="z-n">Not (kullanılan ürün, renk kodu, sonuç…)</label><textarea id="z-n" maxlength="500">' + esc(z ? z.not : (on.not || '')) + '</textarea></div>' +
      '</div></div><div class="m-foot"><div class="tutarbox left"><label for="z-tu">TUTAR (₺)</label><input id="z-tu" type="number" min="0" step="1" inputmode="numeric" value="' + esc(z ? z.tutar : '') + '">' +
      '<button type="button" class="link" id="z-oto" hidden>otomatik hesapla</button></div>' +
      '' + (z && silebilir() ? '<button type="button" class="btn danger" id="z-sil">Ziyareti Sil</button>' : '') + '<button type="button" class="btn" id="z-v">Vazgeç</button><button class="btn primary" type="submit">Kaydet</button></div></form>');
    if (z && silebilir()) $('#z-sil').onclick = function () {
      if (!confirm('Bu ziyaret kaydı silinsin mi?')) return;
      m.ziyaretler = m.ziyaretler.filter(function (x) { return x.id !== z.id; });
      if (kaydet()) { tazele(); geri(); bildir('Ziyaret silindi.'); }
    };
    if (z) {
      var onceki = kalemToplam(st.kalemler);
      elle = !(z.kalemler && z.kalemler.length) || onceki !== Number(z.tutar);
    }
    function guncelle() {
      var t = kalemToplam(st.kalemler);
      if (!elle) $('#z-tu').value = t || '';
      $('#z-oto').hidden = !elle || Number($('#z-tu').value) === t;
    }
    islemBagla(st, guncelle);
    $('#z-tu').addEventListener('input', function () { elle = true; guncelle(); });
    $('#z-oto').onclick = function () { elle = false; guncelle(); };
    $('#z-v').onclick = geri;
    $('#vf').onsubmit = function (e) {
      e.preventDefault();
      var tarih = $('#z-t').value;
      if (!tarih) { bildir('Tarih seçin.'); return; }
      if (!st.kalemler.length) { bildir('En az bir işlem seçin.'); return; }
      var kayit = z || { id: yeniId(), ekleyen: oturum ? oturum.ad : '' };
      kayit.tarih = tarih; kayit.tutar = Math.max(0, Number($('#z-tu').value) || 0);
      kayit.kalemler = kalemKopya(st.kalemler); kayit.hizmetler = st.kalemler.map(function (k) { return k.ad; });
      kayit.personel = $('#z-p').value.trim(); kayit.odeme = $('#z-od').value; kayit.not = $('#z-n').value.trim();
      if (!z) { m.ziyaretler = m.ziyaretler || []; m.ziyaretler.push(kayit); }
      if (!kaydet()) return;
      if (opts.onkaydet) opts.onkaydet(kayit);
      tazele(); geri(); bildir('Ziyaret kaydedildi.');
    };
  }

  /* ---------- takip pencereleri (üst banttaki kutular) ---------- */
  function takipPenceresi(t) {
    var dogum = t === 'dogum';
    var l = dogum ? db.filter(dogumYakin).sort(function (a, c) { return sonrakiDogum(a.dogum) - sonrakiDogum(c.dogum); })
      : db.filter(riskli).sort(function (a, c) { return sonZiyaret(a).localeCompare(sonZiyaret(c)); });
    ac(baslik(dogum ? '🎂 Yaklaşan Doğum Günleri' : 'Uzun Süredir Gelmeyenler') + '<div class="m-body">' +
      '<p class="hint">' + (dogum ? 'Önümüzdeki 30 gün içinde doğum günü olan müşteriler.' : GUN_RISK + ' günden uzun süredir ziyareti olmayan müşteriler. Hatırlatma mesajı için WhatsApp düğmesini kullanın.') + '</p>' +
      (l.length ? '<ul class="tk">' + l.map(function (m) {
        var d = sonrakiDogum(m.dogum), ilk = (m.ad || '').trim().split(/\s+/)[0], msg = dogum
          ? 'Merhaba ' + ilk + ', doğum gününüz kutlu olsun! 🎂 SİYA Güzellik & Kuaför olarak güzel bir yıl dileriz.'
          : 'Merhaba ' + ilk + ', sizi bir süredir göremedik. SİYA Güzellik & Kuaför’de sizi tekrar ağırlamak isteriz. Randevu için bize yazabilirsiniz.';
        var son = sonZiyaret(m);
        return '<li><span class="avatar sm" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><span class="tk-i"><b>' + esc(m.ad) + '</b><small>' +
          (dogum ? (d === 0 ? 'Bugün doğum günü' : d + ' gün sonra') + ' · ' + dObj(m.dogum).getDate() + ' ' + AYLAR[dObj(m.dogum).getMonth()] + (yas(m.dogum) ? ' · ' + (yas(m.dogum) + 1) + '. yaş' : '')
            : gunFarki(son) + ' gündür yok · son ziyaret ' + tarihGoster(son)) + '</small></span>' +
          '<span class="tk-b"><button class="btn small" type="button" data-ac="' + esc(m.id) + '">Aç</button>' +
          (m.tel ? '<a class="btn small primary" href="' + esc(waLink(m.tel) + '?text=' + encodeURIComponent(msg)) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' : '<span class="hint">tel yok</span>') + '</span></li>';
      }).join('') + '</ul>' : '<div class="bos"><div class="big">' + (dogum ? 'Yaklaşan doğum günü yok' : 'Herkes düzenli geliyor 🎉') + '</div></div>') + '</div>');
    modal.querySelector('.m-body').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ac]'); if (b) detay(b.getAttribute('data-ac'));
    });
  }

  /* ---------- RANDEVULAR ---------- */
  var RDURUM = { bekliyor: ['Bekliyor', 'wait'], geldi: ['Tamamlandı', 'ok'], iptal: ['İptal', 'bad'], gelmedi: ['Gelmedi', 'warn'] };
  function dkEkle(saat, dk) {
    var a = saat.split(':').map(Number), t = a[0] * 60 + a[1] + dk;
    return p2(Math.floor(t / 60) % 24) + ':' + p2(t % 60);
  }
  function randevuGun(g) {
    return randevular.filter(function (r) { return r.tarih === g; }).sort(function (a, b) { return a.saat < b.saat ? -1 : a.saat > b.saat ? 1 : 0; });
  }
  function randevuSayfasi() {
    var g = durum.rn.gun, d = dObj(g), hb = gunEkle(g, -((d.getDay() + 6) % 7)), l = randevuGun(g), i;
    var hafta = '';
    for (i = 0; i < 7; i++) {
      var iso = gunEkle(hb, i), n = randevular.filter(function (r) { return r.tarih === iso && r.durum !== 'iptal'; }).length;
      hafta += '<button type="button" class="wd' + (iso === g ? ' on' : '') + (iso === bugun() ? ' today' : '') + '" data-act="rv-gun" data-gun="' + iso + '"><small>' + GUN_KISA[dObj(iso).getDay()] + '</small><b>' + dObj(iso).getDate() + '</b><em>' + (n ? n + ' randevu' : '—') + '</em></button>';
    }
    var aktif = l.filter(function (r) { return r.durum !== 'iptal'; }), bek = l.filter(function (r) { return r.durum === 'bekliyor'; }).length;
    var tah = aktif.reduce(function (s, r) { return s + kalemToplam(r.kalemler || []); }, 0);
    var kartlar = l.map(function (r) {
      var ds = RDURUM[r.durum] || RDURUM.bekliyor, bit = dkEkle(r.saat, Number(r.sure) || 60);
      var acts = r.durum === 'bekliyor'
        ? '<button class="btn small primary" type="button" data-act="rv-geldi" data-id="' + esc(r.id) + '">Geldi · Ziyaret oluştur</button>' +
          (r.tel || (r.musteriId && bul(r.musteriId) && bul(r.musteriId).tel) ? '<a class="btn small" target="_blank" rel="noopener noreferrer" href="' + esc(waLink(r.tel || bul(r.musteriId).tel) + '?text=' + encodeURIComponent('Merhaba ' + (r.ad || '').split(' ')[0] + ', ' + tarihGoster(r.tarih) + ' saat ' + r.saat + ' randevunuzu hatırlatmak isteriz. SİYA Güzellik & Kuaför')) + '">WhatsApp</a>' : '') +
          '<button class="btn small" type="button" data-act="rv-durum" data-d="gelmedi" data-id="' + esc(r.id) + '">Gelmedi</button><button class="btn small" type="button" data-act="rv-durum" data-d="iptal" data-id="' + esc(r.id) + '">İptal</button>'
        : '<button class="btn small" type="button" data-act="rv-durum" data-d="bekliyor" data-id="' + esc(r.id) + '">Beklemeye al</button>';
      return '<div class="rvcard ' + esc(r.durum) + '"><div class="rvtime"><b>' + esc(r.saat) + '</b><small>' + (Number(r.sure) || 60) + ' dk · ' + bit + '</small></div>' +
        '<div class="rvmain"><div class="rvname">' + (r.musteriId && bul(r.musteriId) ? '<button type="button" class="lnk" data-act="ac" data-id="' + esc(r.musteriId) + '">' + esc(r.ad) + '</button>' : esc(r.ad)) +
        ' <span class="rst ' + ds[1] + '">' + ds[0] + '</span>' + (r.musteriId ? '' : ' <span class="rst new">Yeni müşteri</span>') + '</div>' +
        '<div class="rvsvc">' + ((r.kalemler || []).length ? r.kalemler.map(function (k) { return '<span class="pill">' + esc(k.ad) + '</span>'; }).join('') : '<span class="hint">İşlem belirtilmedi</span>') + '</div>' +
        '<div class="rvmeta">' + [r.personel && 'Uzman: ' + r.personel, r.tel, r.not].filter(Boolean).map(esc).join(' · ') + '</div>' +
        '<div class="rvacts">' + acts + '<button class="link" type="button" data-act="rv-duzenle" data-id="' + esc(r.id) + '">Düzenle</button>' +
        (silebilir() ? '<button class="link d" type="button" data-act="rv-sil" data-id="' + esc(r.id) + '">Sil</button>' : '') + '</div></div>' +
        '<div class="rvprice">' + (kalemToplam(r.kalemler || []) ? '<b>' + para(kalemToplam(r.kalemler)) + '</b><small>tahmini</small>' : '') + '</div></div>';
    }).join('');
    return sayfaBasligi(sf('randevular'), '<button class="btn primary" type="button" data-act="yeni-randevu">' + ik('arti') + ' Randevu Ekle</button>') +
      '<section class="panel"><div class="daynav"><button class="btn small" type="button" data-act="rv-gun" data-gun="' + gunEkle(g, -1) + '" aria-label="Önceki gün">‹</button>' +
      '<div class="dn-t"><b>' + uzunTarih(g) + '</b>' + (g === bugun() ? '<span class="tag dogum">Bugün</span>' : '') + '</div>' +
      '<button class="btn small" type="button" data-act="rv-gun" data-gun="' + gunEkle(g, 1) + '" aria-label="Sonraki gün">›</button>' +
      '<button class="btn small" type="button" data-act="rv-gun" data-gun="' + bugun() + '">Bugün</button>' +
      '<input type="date" data-in="rn-gun" value="' + g + '" aria-label="Tarihe git"></div>' +
      '<div class="weekstrip">' + hafta + '</div>' +
      '<div class="sumrow"><div class="sum"><small>RANDEVU</small><b>' + aktif.length + '</b></div><div class="sum"><small>BEKLEYEN</small><b>' + bek + '</b></div>' +
      '<div class="sum"><small>TAMAMLANAN</small><b>' + l.filter(function (r) { return r.durum === 'geldi'; }).length + '</b></div>' +
      (yonetici() ? '<div class="sum"><small>TAHMİNİ CİRO</small><b>' + para(tah) + '</b></div>' : '') + '</div>' +
      '<div class="rvlist">' + (kartlar || '<div class="bos"><div class="big">Bu gün için randevu yok</div>“Randevu Ekle” ile yeni bir randevu oluşturun.</div>') + '</div></section>';
  }
  function randevuForm(r, tarih) {
    var yeni = !r;
    r = r || { tarih: tarih || durum.rn.gun, saat: '10:00', sure: 60, kalemler: [], durum: 'bekliyor', personel: oturum ? oturum.ad : '' };
    var st = { kalemler: kalemKopya(r.kalemler) }, etiket = {}, secM = r.musteriId ? bul(r.musteriId) : null;
    var saatler = [], t;
    for (t = 8 * 60; t <= 22 * 60; t += 15) saatler.push(p2(Math.floor(t / 60)) + ':' + p2(t % 60));
    var mEt = function (m) { return m.ad + (m.tel ? ' · ' + m.tel : ''); };
    db.forEach(function (m) { etiket[mEt(m)] = m.id; });
    ac(baslik(yeni ? 'Randevu Ekle' : 'Randevuyu Düzenle') + '<form id="rf" class="f" autocomplete="off"><div class="m-body"><div class="grid g3">' +
      '<div class="full"><label for="rv-m">Müşteri * <small class="hint">(kayıtlı değilse adını yazın)</small></label><input id="rv-m" list="rv-ml" required maxlength="80" placeholder="İsim veya telefon yazın…" value="' + esc(secM ? mEt(secM) : (r.ad || '')) + '">' +
      '<datalist id="rv-ml">' + db.map(function (m) { return '<option value="' + esc(mEt(m)) + '">'; }).join('') + '</datalist></div>' +
      '<div class="full" id="rv-telw"><label for="rv-tel">Telefon (yeni müşteri için)</label><input id="rv-tel" type="tel" maxlength="20" value="' + esc(r.tel || '') + '"></div>' +
      '<div><label for="rv-t">Tarih *</label><input id="rv-t" type="date" required value="' + esc(r.tarih) + '"></div>' +
      '<div><label for="rv-s">Saat *</label><select id="rv-s">' + saatler.map(function (s) { return '<option' + (s === r.saat ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
      '<div><label for="rv-d">Süre</label><select id="rv-d">' + [15, 30, 45, 60, 90, 120, 150, 180, 240].map(function (n) { return '<option value="' + n + '"' + (Number(r.sure) === n ? ' selected' : '') + '>' + n + ' dk</option>'; }).join('') + '</select></div>' +
      '<div><label for="rv-p">Uzman</label><input id="rv-p" list="uz-l" maxlength="60" value="' + esc(r.personel || '') + '">' + uzmanListe() + '</div>' +
      (yeni ? '' : '<div><label for="rv-du">Durum</label><select id="rv-du">' + Object.keys(RDURUM).map(function (k) { return '<option value="' + k + '"' + (r.durum === k ? ' selected' : '') + '>' + RDURUM[k][0] + '</option>'; }).join('') + '</select></div>') +
      '<div class="full"><span class="lbl">Planlanan işlemler</span>' + islemHtml() + '</div>' +
      '<div class="full"><label for="rv-n">Not</label><textarea id="rv-n" maxlength="400">' + esc(r.not || '') + '</textarea></div>' +
      '</div><p class="err" id="rv-err" hidden></p></div><div class="m-foot"><button type="button" class="btn" id="rv-v">Vazgeç</button><button class="btn primary" type="submit">Kaydet</button></div></form>');
    function telGoster() { $('#rv-telw').hidden = !!etiket[$('#rv-m').value]; }
    $('#rv-m').addEventListener('input', telGoster); telGoster();
    islemBagla(st, function () {});
    $('#rv-v').onclick = kapat;
    $('#rf').onsubmit = function (e) {
      e.preventDefault();
      var txt = $('#rv-m').value.trim(), mid = etiket[txt] || '', m = mid ? bul(mid) : null;
      if (!txt) return;
      var tel = m ? m.tel || '' : $('#rv-tel').value.trim();
      var saat = $('#rv-s').value, tarihV = $('#rv-t').value, uz = $('#rv-p').value.trim();
      var cakisan = randevular.filter(function (x) { return x.id !== r.id && x.tarih === tarihV && x.saat === saat && x.durum === 'bekliyor' && (!uz || x.personel === uz); })[0];
      if (cakisan && !confirm('Bu saatte ' + (cakisan.personel ? cakisan.personel + ' için ' : '') + '“' + cakisan.ad + '” randevusu var. Yine de kaydedilsin mi?')) return;
      r.musteriId = mid; r.ad = m ? m.ad : txt; r.tel = tel; r.tarih = tarihV; r.saat = saat; r.sure = Number($('#rv-d').value) || 60;
      r.personel = uz; r.kalemler = kalemKopya(st.kalemler); r.not = $('#rv-n').value.trim();
      if (!yeni) r.durum = $('#rv-du').value; else { r.id = yeniId(); r.durum = 'bekliyor'; r.ekleyen = oturum ? oturum.ad : ''; r.olusturma = new Date().toISOString(); randevular.push(r); }
      if (!kaydetRan()) return;
      durum.rn.gun = r.tarih; kapat(); git('randevular'); render(); bildir(yeni ? 'Randevu eklendi.' : 'Randevu güncellendi.');
    };
    setTimeout(function () { var i = $('#rv-m'); if (i) i.focus(); }, 30);
  }
  function randevuGeldi(r) {
    var m = r.musteriId ? bul(r.musteriId) : null;
    if (!m) {
      m = { id: yeniId(), ad: r.ad, tel: r.tel || '', olusturma: new Date().toISOString(), ziyaretler: [], vip: false };
      db.push(m); kaydet(); r.musteriId = m.id; kaydetRan();
    }
    ziyaretModal(m, null, { on: { kalemler: r.kalemler, personel: r.personel, tarih: r.tarih, not: r.not }, geri: kapat,
      onkaydet: function (z) { r.durum = 'geldi'; r.ziyaretId = z.id; kaydetRan(); } });
  }

  /* ---------- ÜRÜNLER VE STOK ---------- */
  function urunSatilan(u) { return (Number(u.devir) || 0) + urunSatis.filter(function (s) { return s.urunId === u.id; }).reduce(function (a, s) { return a + (Number(s.adet) || 0); }, 0); }
  function urunKalan(u) { return (Number(u.miktar) || 0) - urunSatilan(u); }
  function stokDurum(u) { var k = urunKalan(u); return k <= 0 ? ['Tükendi', 'bad'] : k <= 2 ? ['Azalıyor', 'warn'] : ['Yeterli', 'ok']; }
  function stokSayfasi() {
    var adm = yonetici(), d = durum.st, q = tr(d.ara).trim();
    var gruplar = []; urunler.forEach(function (u) { if (u.grup && gruplar.indexOf(u.grup) < 0) gruplar.push(u.grup); });
    var toplamAdet = 0, maliyet = 0, deger = 0, azalan = 0, biten = 0;
    urunler.forEach(function (u) {
      var k = Math.max(0, urunKalan(u)); toplamAdet += k; maliyet += k * (Number(u.alis) || 0); deger += k * (Number(u.satis) || 0);
      if (urunKalan(u) <= 0) biten++; else if (urunKalan(u) <= 2) azalan++;
    });
    var filtreler = [['hepsi', 'Tümü'], ['azalan', 'Azalan'], ['biten', 'Tükenen']].concat(gruplar.map(function (g) { return ['g:' + g, g]; }));
    var kpi = function (e, v, a) { return '<div class="kpi"><small>' + e + '</small><b>' + v + '</b><span>' + (a || '') + '</span></div>'; };
    var l = urunler.filter(function (u) {
      if (q && tr(u.ad + ' ' + u.kod + ' ' + (u.grup || '')).indexOf(q) < 0) return false;
      if (d.filtre === 'azalan') return urunKalan(u) > 0 && urunKalan(u) <= 2;
      if (d.filtre === 'biten') return urunKalan(u) <= 0;
      if (d.filtre.indexOf('g:') === 0) return u.grup === d.filtre.slice(2);
      return true;
    });
    var satir = l.map(function (u) {
      var ds = stokDurum(u), k = urunKalan(u);
      return '<tr><td><span class="kod">' + esc(u.kod) + '</span></td><td><b>' + esc(u.ad) + '</b><div class="znote">' + esc(u.grup || '') + '</div></td>' +
        '<td class="r">' + para(u.satis) + '</td>' + (adm ? '<td class="r hm">' + para(u.alis) + '</td>' : '') +
        '<td class="r hm">' + (Number(u.miktar) || 0) + '</td><td class="r hm">' + urunSatilan(u) + '</td><td class="r"><b class="kalan ' + ds[1] + '">' + k + '</b></td>' +
        '<td><span class="rst ' + ds[1] + '">' + ds[0] + '</span></td><td class="r nowrap"><button class="btn small primary" type="button" data-act="urun-sat" data-id="' + esc(u.id) + '"' + (k <= 0 ? ' disabled' : '') + '>Sat</button>' +
        (adm ? ' <button class="link" type="button" data-act="urun-giris" data-id="' + esc(u.id) + '">Giriş</button><button class="link" type="button" data-act="urun-duzenle" data-id="' + esc(u.id) + '">Düzenle</button><button class="link d" type="button" data-act="urun-sil" data-id="' + esc(u.id) + '">Sil</button>' : '') + '</td></tr>';
    }).join('');
    var son = urunSatis.slice().sort(function (a, b) { return a.tarih === b.tarih ? (b.olusturma || '').localeCompare(a.olusturma || '') : a.tarih < b.tarih ? 1 : -1; }).slice(0, 25);
    return sayfaBasligi(sf('stok'), (adm ? '<button class="btn" type="button" data-act="csv-stok">' + ik('indir') + ' Excel (.csv)</button><button class="btn" type="button" data-act="urun-ekle">Ürün Ekle</button>' : '') +
      '<button class="btn primary" type="button" data-act="urun-sat">' + ik('arti') + ' Ürün Sat</button>') +
      '<div class="kpis stk">' + kpi('ÜRÜN ÇEŞİDİ', urunler.length, gruplar.length + ' grup') + kpi('STOKTAKİ ADET', toplamAdet, biten + ' tükendi · ' + azalan + ' azalıyor') +
      (adm ? kpi('STOK MALİYETİ', para(maliyet), 'alış fiyatıyla') + kpi('SATIŞ DEĞERİ', para(deger), 'tamamı satılırsa') : '') + '</div>' +
      '<section class="panel stkp"><div class="toolbar"><label class="search">' + ik('ara') + '<span class="sr">Ürün ara</span><input data-in="st-ara" type="search" placeholder="Ürün, kod veya grup ara…" autocomplete="off" value="' + esc(d.ara) + '"></label></div>' +
      '<div class="chips">' + filtreler.map(function (f) { return '<button type="button" class="chip" data-act="st-filtre" data-f="' + esc(f[0]) + '" aria-pressed="' + (d.filtre === f[0]) + '">' + esc(f[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kod</th><th>Ürün</th><th class="r">Satış</th>' + (adm ? '<th class="r hm">Alış</th>' : '') + '<th class="r hm">Giriş</th><th class="r hm">Satılan</th><th class="r">Kalan</th><th>Durum</th><th></th></tr></thead><tbody>' +
      (satir || '<tr><td colspan="9"><div class="bos"><div class="big">Ürün bulunamadı</div></div></td></tr>') + '</tbody></table></div></section>' +
      '<section class="panel stkp"><div class="toolbar"><b class="ptitle">Son ürün satışları</b></div>' + (son.length ?
        '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tarih</th><th>Ürün</th><th class="r">Adet</th><th class="r">Tutar</th><th class="hm">Ödeme</th><th class="hm">Müşteri</th>' + (adm ? '<th class="r hm">Kâr</th><th></th>' : '') + '</tr></thead><tbody>' +
        son.map(function (s) {
          var m = s.musteriId ? bul(s.musteriId) : null;
          return '<tr><td>' + tarihGoster(s.tarih) + '</td><td>' + esc(s.ad) + '</td><td class="r">' + s.adet + '</td><td class="r"><b>' + para(s.adet * s.fiyat) + '</b></td><td class="hm">' + esc(s.odeme || '') + '</td><td class="hm">' + (m ? esc(m.ad) : '—') + '</td>' +
            (adm ? '<td class="r hm">' + para(s.adet * (s.fiyat - (Number(s.alis) || 0))) + '</td><td class="r"><button class="link d" type="button" data-act="satis-sil" data-id="' + esc(s.id) + '">Sil</button></td>' : '') + '</tr>';
        }).join('') + '</tbody></table></div>' : '<div class="bos">Henüz ürün satışı yok.</div>') + '</section>';
  }
  function urunForm(u) {
    if (!yonetici()) return;
    var yeni = !u; u = u || { kod: '', ad: '', grup: '', satis: '', alis: '', miktar: '' };
    var gr = []; urunler.forEach(function (x) { if (x.grup && gr.indexOf(x.grup) < 0) gr.push(x.grup); });
    ac(baslik(yeni ? 'Ürün Ekle' : 'Ürünü Düzenle') + '<form id="uf2" class="f" autocomplete="off"><div class="m-body"><div class="grid">' +
      '<div class="full"><label for="u-ad2">Ürün adı *</label><input id="u-ad2" required maxlength="100" value="' + esc(u.ad) + '"></div>' +
      '<div><label for="u-kod">Ürün kodu</label><input id="u-kod" maxlength="30" value="' + esc(u.kod) + '"></div>' +
      '<div><label for="u-grup">Grup</label><input id="u-grup" list="u-gl" maxlength="30" value="' + esc(u.grup) + '"><datalist id="u-gl">' + gr.map(function (g) { return '<option value="' + esc(g) + '">'; }).join('') + '</datalist></div>' +
      '<div><label for="u-satis">Satış fiyatı (₺)</label><input id="u-satis" type="number" min="0" step="0.01" inputmode="decimal" value="' + esc(u.satis) + '"></div>' +
      '<div><label for="u-alis">Alış birim fiyatı (₺)</label><input id="u-alis" type="number" min="0" step="0.01" inputmode="decimal" value="' + esc(u.alis) + '"></div>' +
      '<div class="full"><label for="u-mik">Toplam giriş miktarı</label><input id="u-mik" type="number" min="0" step="1" inputmode="numeric" value="' + esc(u.miktar) + '"><p class="hint">Kalan stok = giriş miktarı − satılan. Yeni mal geldiğinde listede “Giriş” düğmesini kullanın.</p></div>' +
      '</div></div><div class="m-foot">' + (yeni ? '' : '<button type="button" class="btn danger left" id="u-sil">Ürünü Sil</button>') + '<button type="button" class="btn" id="u-v">Vazgeç</button><button class="btn primary" type="submit">Kaydet</button></div></form>');
    $('#u-v').onclick = kapat;
    if (!yeni) $('#u-sil').onclick = function () {
      if (!confirm('“' + u.ad + '” ürünü silinsin mi? Geçmiş satış kayıtları durur.')) return;
      urunler = urunler.filter(function (x) { return x.id !== u.id; }); kaydetUrun(); kapat(); render(); bildir('Ürün silindi.');
    };
    $('#uf2').onsubmit = function (e) {
      e.preventDefault();
      var h = yeni ? { id: yeniId(), devir: 0 } : u;
      h.ad = $('#u-ad2').value.trim(); h.kod = $('#u-kod').value.trim(); h.grup = $('#u-grup').value.trim();
      h.satis = Math.max(0, Number($('#u-satis').value) || 0); h.alis = Math.max(0, Number($('#u-alis').value) || 0); h.miktar = Math.max(0, Number($('#u-mik').value) || 0);
      if (!h.ad) return;
      if (yeni) urunler.push(h);
      if (kaydetUrun()) { kapat(); render(); bildir(yeni ? 'Ürün eklendi.' : 'Ürün güncellendi.'); }
    };
    setTimeout(function () { $('#u-ad2').focus(); }, 30);
  }
  function urunGiris(u) {
    if (!yonetici()) return;
    ac(baslik('Stok Girişi<small class="msub">' + esc(u.ad) + '</small>') + '<form id="gf2" class="f" autocomplete="off"><div class="m-body"><p class="hint">Şu an kalan: <b>' + urunKalan(u) + '</b> adet · mevcut alış fiyatı ' + para(u.alis) + '</p><div class="grid">' +
      '<div><label for="g-adet">Gelen adet *</label><input id="g-adet" type="number" min="1" step="1" required inputmode="numeric"></div>' +
      '<div><label for="g-alis">Yeni alış birim fiyatı (₺)</label><input id="g-alis" type="number" min="0" step="0.01" inputmode="decimal" placeholder="boşsa değişmez"></div></div>' +
      '<p class="hint">Yeni alış fiyatı girerseniz mevcut stokla ağırlıklı ortalaması alınır.</p></div><div class="m-foot"><button type="button" class="btn" id="g-v">Vazgeç</button><button class="btn primary" type="submit">Girişi Kaydet</button></div></form>');
    $('#g-v').onclick = kapat;
    $('#gf2').onsubmit = function (e) {
      e.preventDefault();
      var n = Math.floor(Number($('#g-adet').value) || 0), ya = $('#g-alis').value;
      if (n < 1) return;
      if (ya !== '') { var mevcut = Math.max(0, urunKalan(u)); u.alis = Math.round((((Number(u.alis) || 0) * mevcut + Number(ya) * n) / (mevcut + n)) * 100) / 100; }
      u.miktar = (Number(u.miktar) || 0) + n;
      if (kaydetUrun()) { kapat(); render(); bildir(n + ' adet stok girişi yapıldı.'); }
    };
    setTimeout(function () { $('#g-adet').focus(); }, 30);
  }
  function satisForm(urunId) {
    if (!urunler.length) { bildir('Önce ürün ekleyin.'); return; }
    var mEt = function (m) { return m.ad + (m.tel ? ' · ' + m.tel : ''); }, etiket = {};
    db.forEach(function (m) { etiket[mEt(m)] = m.id; });
    var secenek = urunler.slice().sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); });
    ac(baslik('Ürün Sat') + '<form id="sf2" class="f" autocomplete="off"><div class="m-body"><div class="grid g3">' +
      '<div class="full"><label for="s-u">Ürün *</label><select id="s-u">' + secenek.map(function (u) {
        return '<option value="' + esc(u.id) + '"' + (u.id === urunId ? ' selected' : '') + (urunKalan(u) <= 0 ? ' disabled' : '') + '>' + esc(u.ad) + ' — kalan ' + urunKalan(u) + '</option>';
      }).join('') + '</select></div>' +
      '<div><label for="s-adet">Adet *</label><input id="s-adet" type="number" min="1" step="1" value="1" required inputmode="numeric"></div>' +
      '<div><label for="s-fiyat">Birim fiyat (₺)</label><input id="s-fiyat" type="number" min="0" step="0.01" inputmode="decimal"></div>' +
      '<div><label for="s-t">Tarih</label><input id="s-t" type="date" value="' + bugun() + '"></div>' +
      '<div><label for="s-od">Ödeme</label><select id="s-od">' + ODEMELER.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select></div>' +
      '<div class="full" style="grid-column:span 2"><label for="s-m">Müşteri (isteğe bağlı)</label><input id="s-m" list="s-ml" maxlength="80" placeholder="Kayıtlı müşteri seçin"><datalist id="s-ml">' + db.map(function (m) { return '<option value="' + esc(mEt(m)) + '">'; }).join('') + '</datalist></div>' +
      '<div class="full"><label for="s-n">Not</label><input id="s-n" maxlength="200"></div></div><p class="err" id="s-err" hidden></p></div>' +
      '<div class="m-foot"><div class="tutarbox left"><label>TOPLAM</label><b id="s-top">0 ₺</b></div><button type="button" class="btn" id="s-v">Vazgeç</button><button class="btn primary" type="submit">Satışı Kaydet</button></div></form>');
    function sec() { return bulUrun($('#s-u').value); }
    function hesap() { $('#s-top').textContent = para((Number($('#s-adet').value) || 0) * (Number($('#s-fiyat').value) || 0)); }
    function urunDegisti() { var u = sec(); $('#s-fiyat').value = u ? u.satis : ''; $('#s-adet').max = u ? Math.max(1, urunKalan(u)) : ''; hesap(); }
    $('#s-u').addEventListener('change', urunDegisti); $('#s-adet').addEventListener('input', hesap); $('#s-fiyat').addEventListener('input', hesap);
    if ($('#s-u').selectedOptions[0] && $('#s-u').selectedOptions[0].disabled) { var ilk = secenek.filter(function (u) { return urunKalan(u) > 0; })[0]; if (ilk) $('#s-u').value = ilk.id; }
    urunDegisti();
    $('#s-v').onclick = kapat;
    $('#sf2').onsubmit = function (e) {
      e.preventDefault();
      var u = sec(), adet = Math.floor(Number($('#s-adet').value) || 0), er = $('#s-err');
      if (!u || adet < 1) return;
      if (adet > urunKalan(u)) { er.textContent = 'Yeterli stok yok (kalan ' + urunKalan(u) + ').'; er.hidden = false; return; }
      urunSatis.push({ id: yeniId(), tarih: $('#s-t').value || bugun(), urunId: u.id, ad: u.ad, adet: adet, fiyat: Math.max(0, Number($('#s-fiyat').value) || 0), alis: Number(u.alis) || 0,
        odeme: $('#s-od').value, musteriId: etiket[$('#s-m').value] || '', not: $('#s-n').value.trim(), ekleyen: oturum ? oturum.ad : '', olusturma: new Date().toISOString() });
      if (kaydetUSat()) { kapat(); render(); bildir('Satış kaydedildi.'); }
    };
  }
  function bulUrun(id) { return urunler.filter(function (u) { return u.id === id; })[0]; }
  function csvStok() {
    var s = ['Kod;Ürün;Grup;Satış Fiyatı;Alış Fiyatı;Giriş;Satılan;Kalan;Stok Maliyeti'];
    urunler.forEach(function (u) { s.push([u.kod, u.ad, u.grup, u.satis, u.alis, u.miktar, urunSatilan(u), urunKalan(u), Math.round(Math.max(0, urunKalan(u)) * (Number(u.alis) || 0) * 100) / 100].map(csvHucre).join(';')); });
    indir('siya-stok-' + bugun() + '.csv', '﻿' + s.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ---------- fiyat listesi (yönetici) ---------- */
  function fiyatEkrani() {
    if (!yonetici()) return;
    var kopya = hizmetler.map(function (h) { return { id: h.id, kategori: h.kategori || '', ad: h.ad, fiyat: h.fiyat }; });
    function oku() {
      Array.prototype.forEach.call(modal.querySelectorAll('.fyrow'), function (r) {
        var k = kopya[Number(r.getAttribute('data-i'))];
        if (!k) return;
        k.ad = r.querySelector('.fy-ad').value; k.fiyat = r.querySelector('.fy-fi').value; k.kategori = r.querySelector('.fy-kt').value;
      });
    }
    function ciz(odak) {
      ac(baslik('Hizmet ve Fiyat Listesi') + '<div class="m-body f">' +
        '<p class="hint">İşlem adlarını ve fiyatlarını buradan belirleyin. Ziyaret eklerken işlem seçilince tutar otomatik yazılır. ' +
        'Fiyatı değiştirmek <b>geçmiş ziyaretleri</b> etkilemez.</p><div id="fl">' +
        (kopya.length ? kopya.map(function (k, i) {
          return '<div class="fyrow" data-i="' + i + '"><input class="fy-kt" list="fy-kl" maxlength="30" aria-label="Grup" placeholder="Grup" value="' + esc(k.kategori) + '"><input class="fy-ad" maxlength="60" aria-label="İşlem adı" placeholder="İşlem adı" value="' + esc(k.ad) + '">' +
            '<input class="fy-fi" type="number" min="0" step="1" inputmode="numeric" aria-label="Fiyat (₺)" placeholder="0" value="' + esc(k.fiyat) + '">' +
            '<span class="tl">₺</span><button class="link d" type="button" data-sil="' + i + '">Sil</button></div>';
        }).join('') : '<p class="hint">Henüz işlem yok.</p>') +
        '</div><datalist id="fy-kl">' + KATEGORILER.map(function (k) { return '<option value="' + esc(k) + '">'; }).join('') + '</datalist><button class="btn sm" id="fy-ekle" type="button" style="margin-top:10px">+ İşlem ekle</button></div>' +
        '<div class="m-foot"><button class="btn" id="fy-v" type="button">Vazgeç</button><button class="btn primary" id="fy-k" type="button">Kaydet</button></div>');
      $('#fy-ekle').onclick = function () { oku(); kopya.push({ id: yeniId(), kategori: kopya.length ? kopya[kopya.length - 1].kategori : '', ad: '', fiyat: '' }); ciz(true); };
      $('#fy-v').onclick = kapat;
      Array.prototype.forEach.call(modal.querySelectorAll('[data-sil]'), function (b) {
        b.onclick = function () { oku(); kopya.splice(Number(b.getAttribute('data-sil')), 1); ciz(); };
      });
      $('#fy-k').onclick = function () {
        oku();
        var gor = {}, temiz = [];
        for (var i = 0; i < kopya.length; i++) {
          var ad = kopya[i].ad.trim();
          if (!ad) continue;
          if (gor[tr(ad)]) { bildir('“' + ad + '” iki kez yazılmış.'); return; }
          gor[tr(ad)] = 1;
          temiz.push({ id: kopya[i].id, kategori: kopya[i].kategori.trim(), ad: ad, fiyat: Math.max(0, Number(kopya[i].fiyat) || 0) });
        }
        hizmetler = temiz;
        if (kaydetHiz()) { kapat(); render(); bildir('Fiyat listesi kaydedildi.'); }
      };
      if (odak) { var son = modal.querySelectorAll('.fy-ad'); if (son.length) son[son.length - 1].focus(); }
    }
    ciz();
  }

  /* ---------- bulut (Supabase) eşitleme ---------- */
  var BULUT_TABLOLAR = ['musteriler', 'ziyaretler', 'randevular', 'hizmetler', 'urunler', 'urun_satis', 'ayarlar'];
  function satirlar() {
    var o = { musteriler: [], ziyaretler: [], randevular: [], hizmetler: [], urunler: [], urun_satis: [], ayarlar: [] };
    db.forEach(function (m) {
      var v = {}; Object.keys(m).forEach(function (k) { if (k !== 'ziyaretler') v[k] = m[k]; });
      o.musteriler.push({ id: m.id, veri: v });
      (m.ziyaretler || []).forEach(function (z) { o.ziyaretler.push({ id: z.id, musteri_id: m.id, tarih: z.tarih || null, veri: z }); });
    });
    randevular.forEach(function (r) { o.randevular.push({ id: r.id, tarih: r.tarih || null, veri: r }); });
    hizmetler.forEach(function (h) { o.hizmetler.push({ id: h.id, veri: h }); });
    urunler.forEach(function (u) { o.urunler.push({ id: u.id, veri: u }); });
    urunSatis.forEach(function (x) { o.urun_satis.push({ id: x.id, tarih: x.tarih || null, veri: x }); });
    o.ayarlar.push({ anahtar: 'genel', veri: { kartKesinti: Number(ayarlar.kartKesinti) || 0, ortakAd: ayarlar.ortakAd || '', ortakPay: Number(ayarlar.ortakPay) || 0, ortakGrup: ayarlar.ortakGrup || 'Kuaför', personelSil: ayarlar.personelSil === true } });
    return o;
  }
  function anahtarAdi(t) { return t === 'ayarlar' ? 'anahtar' : 'id'; }
  function satirIndeks(o) {
    var idx = {};
    BULUT_TABLOLAR.forEach(function (t) { idx[t] = {}; o[t].forEach(function (r) { idx[t][r[anahtarAdi(t)]] = JSON.stringify(r); }); });
    return idx;
  }
  function yerelYaz() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); localStorage.setItem(HIZ_KEY, JSON.stringify(hizmetler)); localStorage.setItem(RAN_KEY, JSON.stringify(randevular)); localStorage.setItem(USAT_KEY, JSON.stringify(urunSatis)); localStorage.setItem(URUN_KEY, JSON.stringify(urunler)); } catch (e) { /* önbellek yazılamadı */ }
  }
  function yerelTemizle() {
    db = []; randevular = []; urunSatis = [];
    try { localStorage.removeItem(KEY); localStorage.removeItem(RAN_KEY); localStorage.removeItem(USAT_KEY); } catch (e) { /* yok */ }
  }
  function bulutEtiket() {
    if (!sb) return 'KAYIT BU CİHAZDA';
    return { baglan: 'BULUTA BAĞLANIYOR…', tamam: 'BULUT · EŞİTLENDİ', esit: 'EŞİTLENİYOR…', hata: 'BAĞLANTI YOK · TEKRAR DENENİYOR' }[bulut.durum] || 'BULUT';
  }
  function durumGoster(d) {
    bulut.durum = d;
    var e = $('#bulut-durum'); if (e) { e.textContent = bulutEtiket(); e.className = 'save-status ' + d; }
  }
  function bekleyenIsaret(v) { try { if (v) localStorage.setItem(BEKLEYEN_KEY, '1'); else localStorage.removeItem(BEKLEYEN_KEY); } catch (e) { /* yok */ } }
  function esitleTetik() {
    if (!sb || !oturum || !bulut.hazir) return;
    bekleyenIsaret(true); durumGoster('esit');
    clearTimeout(bulut.zaman); bulut.zaman = setTimeout(esitle, 450);
  }
  function parcala(a, n) { var r = []; for (var i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; }
  function esitle() {
    if (!sb || !oturum || !bulut.hazir) return Promise.resolve();
    if (bulut.mesgul) { bulut.tekrar = true; return Promise.resolve(); }
    bulut.mesgul = true;
    var o = satirlar(), isler = [], adm = yonetici();
    BULUT_TABLOLAR.forEach(function (t) {
      if (!adm && (t === 'hizmetler' || t === 'urunler' || t === 'ayarlar')) return;
      var anah = anahtarAdi(t), yeni = {}, onceki = bulut.snap[t] || {};
      o[t].forEach(function (r) { yeni[r[anah]] = JSON.stringify(r); });
      var yukle = o[t].filter(function (r) { return onceki[r[anah]] !== yeni[r[anah]]; });
      var sil = Object.keys(onceki).filter(function (id) { return !(id in yeni); });
      if (yukle.length || sil.length) isler.push({ t: t, anah: anah, yukle: yukle, sil: sil, yeni: yeni });
    });
    var zincir = Promise.resolve();
    isler.forEach(function (is) {
      parcala(is.yukle, 200).forEach(function (p) {
        zincir = zincir.then(function () { return sb.from(is.t).upsert(p).then(function (r) { if (r.error) throw r.error; p.forEach(function (x) { bulut.snap[is.t][x[is.anah]] = is.yeni[x[is.anah]]; }); }); });
      });
      parcala(is.sil, 100).forEach(function (p) {
        zincir = zincir.then(function () { return sb.from(is.t).delete().in(is.anah, p).then(function (r) { if (r.error) throw r.error; p.forEach(function (id) { delete bulut.snap[is.t][id]; }); }); });
      });
    });
    return zincir.then(function () {
      bulut.mesgul = false; bulut.son = new Date().toISOString();
      if (bulut.tekrar) { bulut.tekrar = false; return esitle(); }
      bekleyenIsaret(false); durumGoster('tamam');
    }).catch(function (e) {
      bulut.mesgul = false; bulut.tekrar = false;
      var yetki = e && (e.code === '42501' || e.status === 401 || e.status === 403 || /row-level security|permission denied/i.test(e.message || ''));
      if (yetki) { bildir('Bu değişiklik için yetkiniz yok; kayıtlar buluttan yeniden yükleniyor.'); bekleyenIsaret(false); bulutYukle(true); return; }
      durumGoster('hata'); clearTimeout(bulut.yeniden); bulut.yeniden = setTimeout(esitle, 15000);
    });
  }
  function hepsiniCek(t) {
    var out = [], bas = 0;
    function sayfa() {
      return sb.from(t).select('*').order(anahtarAdi(t)).range(bas, bas + 999).then(function (r) {
        if (r.error) throw r.error;
        out = out.concat(r.data || []);
        if ((r.data || []).length < 1000) return out;
        bas += 1000; return sayfa();
      });
    }
    return sayfa();
  }
  function ortakAyarUygula(v) {
    if (!v) return;
    ['kartKesinti', 'ortakAd', 'ortakPay', 'ortakGrup', 'personelSil'].forEach(function (k) { if (v[k] !== undefined) ayarlar[k] = v[k]; });
    try { localStorage.setItem(AYAR_KEY, JSON.stringify(ayarlar)); } catch (e) { /* yok */ }
  }
  function profilleriYukle() {
    return sb.from('profiller').select('*').order('kullanici').then(function (r) {
      if (r.error) throw r.error;
      kullanicilar = (r.data || []).map(function (p) { return { id: p.id, kullanici: p.kullanici, ad: p.ad, rol: p.rol, aktif: p.aktif }; });
      return kullanicilar;
    });
  }
  function profilBul(kullaniciId) {
    return sb.from('profiller').select('*').eq('id', kullaniciId).maybeSingle().then(function (r) {
      if (r.error) throw r.error;
      if (!r.data || r.data.aktif === false) return null;
      return { id: r.data.id, kullanici: r.data.kullanici, ad: r.data.ad, rol: r.data.rol, aktif: true };
    });
  }
  function bulutYukle(sessiz) {
    durumGoster('baglan');
    return Promise.all(BULUT_TABLOLAR.map(hepsiniCek)).then(function (v) {
      var bulutDb = [], mm = {}, yerel = { db: db, randevular: randevular, urunSatis: urunSatis };
      v[0].forEach(function (r) { var m = Object.assign({}, r.veri, { id: r.id, ziyaretler: [] }); mm[r.id] = m; bulutDb.push(m); });
      v[1].forEach(function (r) { var m = mm[r.musteri_id]; if (m) m.ziyaretler.push(Object.assign({}, r.veri, { id: r.id })); });
      var yerelVar = yerel.db.length || yerel.randevular.length || yerel.urunSatis.length;
      var bulutBos = !v[0].length && !v[1].length && !v[2].length && !v[5].length;
      var gecis = false, bekleyen = false;
      try { gecis = localStorage.getItem(GECIS_KEY) === '1'; bekleyen = localStorage.getItem(BEKLEYEN_KEY) === '1'; } catch (e) { /* yok */ }
      var birlestir = false;
      if (!sessiz && yerelVar && !gecis) {
        birlestir = confirm(bulutBos
          ? 'Bu cihazda ' + yerel.db.length + ' müşteri, ' + yerel.randevular.length + ' randevu ve ' + yerel.urunSatis.length + ' ürün satışı kaydı var.\n\nBuluta aktarılsın mı? (Önerilir)'
          : 'Bu cihazda eski kayıtlar var (' + yerel.db.length + ' müşteri), bulutta da kayıtlar mevcut.\n\nBu cihazdaki kayıtlar bulutakilerle birleştirilsin mi?\nİptal derseniz bu cihazdaki eski kayıtlar kullanılmaz.');
      } else if (!sessiz && bekleyen) birlestir = true;
      /* bulut = gerçek durum */
      db = bulutDb; randevular = v[2].map(function (r) { return Object.assign({}, r.veri, { id: r.id }); });
      urunSatis = v[5].map(function (r) { return Object.assign({}, r.veri, { id: r.id }); });
      if (v[3].length) hizmetler = v[3].map(function (r) { return Object.assign({}, r.veri, { id: r.id }); });
      if (v[4].length) urunler = v[4].map(function (r) { return Object.assign({}, r.veri, { id: r.id }); });
      var genel = v[6].filter(function (r) { return r.anahtar === 'genel'; })[0];
      if (genel) ortakAyarUygula(genel.veri);
      bulut.snap = satirIndeks(satirlar());
      if (!v[3].length) bulut.snap.hizmetler = {};
      if (!v[4].length) bulut.snap.urunler = {};
      if (!genel) bulut.snap.ayarlar = {};
      if (birlestir) {
        yerel.db.forEach(function (ym) {
          var m = bul(ym.id);
          if (!m) { db.push(ym); return; }
          (ym.ziyaretler || []).forEach(function (z) { if (!(m.ziyaretler || []).some(function (x) { return x.id === z.id; })) { m.ziyaretler = m.ziyaretler || []; m.ziyaretler.push(z); } });
        });
        yerel.randevular.forEach(function (r) { if (!randevular.some(function (x) { return x.id === r.id; })) randevular.push(r); });
        yerel.urunSatis.forEach(function (r) { if (!urunSatis.some(function (x) { return x.id === r.id; })) urunSatis.push(r); });
      }
      try { localStorage.setItem(GECIS_KEY, '1'); } catch (e) { /* yok */ }
      yerelYaz(); bulut.hazir = true;
      return profilleriYukle().catch(function () { return kullanicilar; }).then(function () {
        bulutKanal(); render(); durumGoster('tamam');
        return esitle();
      });
    }).catch(function (e) {
      durumGoster('hata');
      if (!sessiz) bildir('Buluta bağlanılamadı; kayıtlar bu cihazdan gösteriliyor. Bağlantı gelince otomatik denenecek.');
      clearTimeout(bulut.yeniden); bulut.yeniden = setTimeout(function () { bulutYukle(true); }, 15000);
    });
  }
  function bulutKanal() {
    if (bulut.kanal) { try { sb.removeChannel(bulut.kanal); } catch (e) { /* yok */ } bulut.kanal = null; }
    try {
      var k = sb.channel('siya-degisiklik');
      BULUT_TABLOLAR.concat(['profiller']).forEach(function (t) {
        k.on('postgres_changes', { event: '*', schema: 'public', table: t }, function (p) { olayKuyrugu(t, p); });
      });
      k.subscribe(); bulut.kanal = k;
    } catch (e) { bulut.kanal = null; }
  }
  var olaylar = [], olayZaman = 0;
  function olayKuyrugu(t, p) { olaylar.push({ t: t, p: p }); clearTimeout(olayZaman); olayZaman = setTimeout(olaylariIsle, 200); }
  function olaylariIsle() {
    var kuyruk = olaylar; olaylar = [];
    if (!sb || !oturum || !bulut.hazir) return;
    var idx = satirIndeks(satirlar()), dokunulan = [], profilDegisti = false, degisti = false;
    function temiz(t, id) { return idx[t][id] === bulut.snap[t][id]; }
    function liste(t) { return t === 'randevular' ? randevular : t === 'hizmetler' ? hizmetler : t === 'urunler' ? urunler : urunSatis; }
    kuyruk.forEach(function (e) {
      var t = e.t, tur = e.p.eventType, yeni = e.p.new || {}, eski = e.p.old || {};
      if (t === 'profiller') { profilDegisti = true; return; }
      if (t === 'ayarlar') { if (yeni.veri && yeni.anahtar === 'genel' && temiz('ayarlar', 'genel')) { ortakAyarUygula(yeni.veri); dokunulan.push(['ayarlar', 'genel']); degisti = true; } return; }
      var id = tur === 'DELETE' ? eski.id : yeni.id;
      if (!id || !temiz(t, id)) return;
      if (t === 'musteriler') {
        if (tur === 'DELETE') { db = db.filter(function (m) { return m.id !== id; }); }
        else {
          var m = bul(id), v = Object.assign({}, yeni.veri, { id: id });
          if (m) { var zs = m.ziyaretler || []; Object.keys(m).forEach(function (k) { delete m[k]; }); Object.assign(m, v, { ziyaretler: zs }); }
          else db.push(Object.assign(v, { ziyaretler: [] }));
        }
      } else if (t === 'ziyaretler') {
        if (tur === 'DELETE') db.forEach(function (m) { m.ziyaretler = (m.ziyaretler || []).filter(function (z) { return z.id !== id; }); });
        else {
          var mu = bul(yeni.musteri_id); if (!mu) return;
          var zv = Object.assign({}, yeni.veri, { id: id }), j = (mu.ziyaretler || []).map(function (z) { return z.id; }).indexOf(id);
          mu.ziyaretler = mu.ziyaretler || [];
          if (j > -1) mu.ziyaretler[j] = zv; else mu.ziyaretler.push(zv);
        }
      } else {
        var L = liste(t), j2 = L.map(function (x) { return x.id; }).indexOf(id);
        if (tur === 'DELETE') { if (j2 > -1) L.splice(j2, 1); }
        else { var nv = Object.assign({}, yeni.veri, { id: id }); if (j2 > -1) L[j2] = nv; else L.push(nv); }
      }
      dokunulan.push([t, id]); degisti = true;
    });
    if (dokunulan.length) {
      var o2 = satirIndeks(satirlar());
      dokunulan.forEach(function (x) { if (x[1] in o2[x[0]]) bulut.snap[x[0]][x[1]] = o2[x[0]][x[1]]; else delete bulut.snap[x[0]][x[1]]; });
      yerelYaz();
    }
    if (profilDegisti) profilleriYukle().then(function () {
      var ben = kullanicilar.filter(function (u) { return u.id === oturum.id; })[0];
      if (!ben || ben.aktif === false) { bildir('Hesabınız kapatıldı.'); cikis(); return; }
      if (ben.rol !== oturum.rol) { oturum.rol = ben.rol; }
      renderErtele();
    }).catch(function () { /* yok */ });
    if (degisti) renderErtele();
  }
  var renderZaman = 0;
  function renderErtele() {
    clearTimeout(renderZaman);
    renderZaman = setTimeout(function () {
      var a = document.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && $('#app').contains(a)) { renderErtele(); return; }
      render();
    }, 500);
  }
  window.addEventListener('online', function () { if (sb && oturum) { bulutYukle(true); } });
  function fnCagir(govde) {
    return sb.functions.invoke('kullanici-yonet', { body: govde }).then(function (r) {
      if (!r.error) return r.data && r.data.hata ? { hata: r.data.hata } : { tamam: true };
      var ctx = r.error.context;
      if (ctx && typeof ctx.json === 'function') return ctx.json().then(function (j) { return { hata: (j && j.hata) || 'İşlem başarısız.' }; }, function () { return { hata: 'İşlem başarısız.' }; });
      return { hata: /not found|404|Failed to send/i.test(String(r.error.message)) ? 'Kullanıcı yönetimi fonksiyonu kurulu değil (Supabase → Edge Functions → kullanici-yonet).' : (r.error.message || 'İşlem başarısız.') };
    });
  }
  function epostaOlustur(girdi) { girdi = String(girdi || '').trim().toLowerCase(); return girdi.indexOf('@') > -1 ? girdi : girdi + '@' + EPOSTA_ALANI; }

  function kullaniciEkraniBulut() {
    if (!yonetici()) return;
    function cevir(r) { return r === 'yonetici' ? 'Yönetici' : 'Personel'; }
    function aktifYon() { return kullanicilar.filter(function (x) { return x.rol === 'yonetici' && x.aktif !== false; }).length; }
    function cizim() {
      ac(baslik('Kullanıcılar') + '<div class="m-body f"><p class="hint">Giriş, kullanıcı adı (ya da e-posta) ve şifreyle yapılır. Personel müşteri, ziyaret, randevu ve satış ekleyip düzenleyebilir; silme, fiyat listesi, ciro ve yedekleme yönetici işidir.</p>' +
        kullanicilar.map(function (u) {
          var ben = u.id === oturum.id;
          return '<div class="urow"><div><b>' + esc(u.ad) + '</b>' + (ben ? ' <span class="tag vip">Siz</span>' : '') + (u.aktif === false ? ' <span class="tag risk">Pasif</span>' : '') +
            '<br><small>' + esc(u.kullanici) + ' · ' + cevir(u.rol) + '</small></div><div class="acts">' +
            '<button class="link" data-sf="' + esc(u.id) + '" type="button">Şifre sıfırla</button>' +
            (ben ? '' : '<button class="link" data-rl="' + esc(u.id) + '" type="button">' + (u.rol === 'yonetici' ? 'Personel yap' : 'Yönetici yap') + '</button>' +
              '<button class="link" data-ak="' + esc(u.id) + '" type="button">' + (u.aktif === false ? 'Aç' : 'Kapat') + '</button><button class="link d" data-sl="' + esc(u.id) + '" type="button">Sil</button>') + '</div></div>';
        }).join('') +
        '<div class="sec">Yeni kullanıcı aç</div><form id="uf" autocomplete="off"><div class="grid">' +
        '<div><label for="u-ad">Ad Soyad</label><input id="u-ad" required maxlength="60"></div>' +
        '<div><label for="u-k">Kullanıcı adı</label><input id="u-k" required maxlength="30" autocapitalize="none"></div>' +
        '<div><label for="u-s">Şifre</label><input id="u-s" type="password" required autocomplete="new-password"></div>' +
        '<div><label for="u-r">Yetki</label><select id="u-r"><option value="personel">Personel</option><option value="yonetici">Yönetici</option></select></div>' +
        '</div><p class="err" id="u-err" hidden></p><div style="margin-top:12px"><button class="btn primary" type="submit" id="u-btn">Kullanıcıyı Aç</button></div></form></div>');
      function hata(t) { var e = $('#u-err'); e.textContent = t; e.hidden = false; }
      function yap(govde, mesaj) {
        return fnCagir(govde).then(function (r) { if (r.hata) { bildir(r.hata); return; } bildir(mesaj); return profilleriYukle().then(cizim); });
      }
      $('#uf').onsubmit = function (e) {
        e.preventDefault();
        var kadi = tr($('#u-k').value.trim()), sf = $('#u-s').value;
        if (!/^[a-z0-9._-]{3,30}$/.test(kadi)) return hata('Kullanıcı adı 3–30 karakter; harf, rakam, nokta, tire ya da alt çizgi olabilir.');
        if (sf.length < 6) return hata('Şifre en az 6 karakter olmalı.');
        $('#u-btn').disabled = true;
        fnCagir({ islem: 'olustur', kullanici: kadi, ad: $('#u-ad').value.trim(), sifre: sf, rol: $('#u-r').value }).then(function (r) {
          if (r.hata) { $('#u-btn').disabled = false; return hata(r.hata); }
          bildir('Kullanıcı açıldı.'); return profilleriYukle().then(cizim);
        });
      };
      function ara(id) { return kullanicilar.filter(function (x) { return x.id === id; })[0]; }
      Array.prototype.forEach.call(modal.querySelectorAll('[data-sf]'), function (b) {
        b.onclick = function () { sifreFormu(ara(b.getAttribute('data-sf')), false, cizim); };
      });
      Array.prototype.forEach.call(modal.querySelectorAll('[data-rl]'), function (b) {
        b.onclick = function () { var u = ara(b.getAttribute('data-rl')); yap({ islem: 'rol', id: u.id, rol: u.rol === 'yonetici' ? 'personel' : 'yonetici' }, 'Yetki güncellendi.'); };
      });
      Array.prototype.forEach.call(modal.querySelectorAll('[data-ak]'), function (b) {
        b.onclick = function () { var u = ara(b.getAttribute('data-ak')); yap({ islem: 'aktif', id: u.id, aktif: u.aktif === false }, u.aktif === false ? 'Kullanıcı açıldı.' : 'Kullanıcı kapatıldı.'); };
      });
      Array.prototype.forEach.call(modal.querySelectorAll('[data-sl]'), function (b) {
        b.onclick = function () {
          var u = ara(b.getAttribute('data-sl'));
          if (!confirm('“' + u.ad + '” kullanıcısı silinsin mi? Girişi kalkar; eski kayıtları durur.')) return;
          yap({ islem: 'sil', id: u.id }, 'Kullanıcı silindi.');
        };
      });
    }
    profilleriYukle().then(cizim, cizim);
  }

  /* ---------- giriş ve kullanıcılar ---------- */
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function unhex(h) {
    var a = new Uint8Array(h.length / 2), i;
    for (i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16);
    return a;
  }
  function hashle(sifre, tuzHex) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(sifre), 'PBKDF2', false, ['deriveBits']).then(function (k) {
      return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unhex(tuzHex), iterations: 150000, hash: 'SHA-256' }, k, 256);
    }).then(hex);
  }
  function kullaniciYap(kadi, ad, sifre, rol) {
    var tuz = hex(crypto.getRandomValues(new Uint8Array(16)));
    return hashle(sifre, tuz).then(function (h) {
      return { id: yeniId(), kullanici: kadi, ad: ad, rol: rol, tuz: tuz, hash: h, aktif: true };
    });
  }
  var girisHata = 0, girisKilit = 0;
  function girisEkrani() {
    var g = $('#giris'), ilk = !sb && !kullanicilar.length, son = '';
    document.body.classList.add('kilitli');
    g.hidden = false;
    try { son = localStorage.getItem(SON_KUL_KEY) || ''; } catch (e) { son = ''; }
    var alan = function (id, tip, et, ikon, ek) {
      return '<div class="lf"><label for="' + id + '">' + et + '</label><div class="lbox"><span class="li">' + ik(ikon) + '</span>' +
        '<input id="' + id + '" type="' + tip + '" required ' + ek + '>' + (tip === 'password' ? '<button type="button" class="eye" data-g="' + id + '" aria-label="Şifreyi göster / gizle" title="Şifreyi göster / gizle">' + ik('goz') + '</button>' : '') + '</div></div>';
    };
    var cekirdek = '<div class="login-bg" aria-hidden="true"><i></i><i></i><i></i></div>';
    if (!(window.crypto && crypto.subtle)) {
      g.innerHTML = cekirdek + '<div class="login"><div class="login-logo"><img src="logo.png" alt="SİYA"></div><h2>GÜVENLİ BAĞLANTI GEREKLİ</h2><p class="sub">Giriş için sayfayı https:// adresinden açın.</p></div>';
      return;
    }
    g.innerHTML = cekirdek + '<form class="login f" id="gf" autocomplete="off" novalidate>' +
      '<div class="login-logo"><img src="logo.png" alt="SİYA Güzellik &amp; Kuaför"></div>' +
      '<h2>' + (ilk ? 'İLK KURULUM' : 'HOŞ GELDİNİZ') + '</h2>' +
      '<p class="sub">' + (ilk ? 'Yönetici hesabınızı oluşturarak başlayın' : 'Müşteri kayıt sistemine giriş yapın') + '</p>' +
      (ilk ? alan('g-ad', 'text', 'Ad soyad', 'users', 'maxlength="60" autocomplete="name"') : '') +
      alan('g-k', 'text', sb ? 'Kullanıcı adı veya e-posta' : 'Kullanıcı adı', 'kul', 'maxlength="60" autocapitalize="none" spellcheck="false" autocomplete="username" value="' + esc(ilk ? '' : son) + '"') +
      alan('g-s', 'password', 'Şifre', 'kilit', 'autocomplete="' + (ilk ? 'new-password' : 'current-password') + '"') +
      (ilk ? alan('g-s2', 'password', 'Şifre (tekrar)', 'kilit', 'autocomplete="new-password"') : '') +
      '<p class="caps" id="g-caps" hidden>' + ik('uyari') + ' CAPS LOCK AÇIK</p>' +
      (ilk ? '' : '<label class="rem"><input type="checkbox" id="g-hat"' + (son ? ' checked' : '') + '><span class="cb"></span>Kullanıcı adımı hatırla</label>') +
      '<p class="err" id="g-err" role="alert" hidden></p>' +
      '<button class="login-btn" id="g-btn" type="submit"><span>' + (ilk ? 'HESABI OLUŞTUR' : 'GİRİŞ YAP') + '</span></button>' +
      (ilk ? '<p class="lnote">Bu hesap yöneticidir: fiyatları, kullanıcıları ve yedeği yönetir. Şifrenizi unutmayın; bu cihazda sıfırlanamaz.</p>' : '') +
      '<div class="login-foot">' + ik('kilit') + '<span>Güvenli giriş · Şifreler özetlenerek saklanır</span></div></form>' +
      '<div class="login-copy">© ' + new Date().getFullYear() + ' SİYA GÜZELLİK &amp; KUAFÖR</div>';
    var btn = $('#g-btn');
    function hata(t) { var e = $('#g-err'); e.textContent = t; e.hidden = false; var f = $('#gf'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
    function mesgul(v, yazi) { btn.disabled = v; btn.classList.toggle('busy', v); btn.firstChild.textContent = yazi || (ilk ? 'HESABI OLUŞTUR' : 'GİRİŞ YAP'); }
    $('#gf').addEventListener('click', function (e) {
      var b = e.target.closest('.eye'); if (!b) return;
      var i = $('#' + b.getAttribute('data-g')); i.type = i.type === 'password' ? 'text' : 'password'; b.classList.toggle('on', i.type === 'text');
    });
    $('#gf').addEventListener('keydown', function (e) {
      if (e.getModifierState) $('#g-caps').hidden = !e.getModifierState('CapsLock');
    });
    $('#gf').addEventListener('input', function () { $('#g-err').hidden = true; });
    function bekle() {
      var kalan = Math.ceil((girisKilit - Date.now()) / 1000);
      if (kalan > 0) { mesgul(true, kalan + ' SN BEKLEYİN'); setTimeout(bekle, 500); } else { girisHata = 0; mesgul(false); $('#g-err').hidden = true; }
    }
    if (Date.now() < girisKilit) bekle();
    $('#gf').onsubmit = function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var kadi = tr($('#g-k').value.trim()), sifre = $('#g-s').value;
      if (ilk) {
        var ad = $('#g-ad').value.trim();
        if (!ad) return hata('Ad soyad gerekli.');
        if (!/^[a-z0-9._-]{3,30}$/.test(kadi)) return hata('Kullanıcı adı 3–30 karakter; harf, rakam, nokta, tire ya da alt çizgi olabilir.');
        if (sifre.length < 6) return hata('Şifre en az 6 karakter olmalı.');
        if (sifre !== $('#g-s2').value) return hata('Şifreler aynı değil.');
        mesgul(true, 'OLUŞTURULUYOR…');
        kullaniciYap(kadi, ad, sifre, 'yonetici').then(function (u) {
          kullanicilar.push(u); kaydetKul();
          try { localStorage.setItem(SON_KUL_KEY, kadi); } catch (x) { /* yok */ }
          oturumAc(u);
        });
        return;
      }
      if (!kadi || !sifre) return hata('Kullanıcı adı ve şifre gerekli.');
      mesgul(true, 'GİRİŞ YAPILIYOR…');
      var u = kullanicilar.filter(function (x) { return x.kullanici === kadi; })[0];
      var basarisiz = function (mesaj) {
        girisHata++;
        if (girisHata >= 5) { girisKilit = Date.now() + 30000; hata('Çok fazla hatalı deneme. 30 saniye bekleyin.'); bekle(); return; }
        mesgul(false); hata((typeof mesaj === 'string' ? mesaj : 'Kullanıcı adı ya da şifre hatalı.') + ' (' + (5 - girisHata) + ' deneme hakkı kaldı)');
      };
      if (sb) {
        var hamKadi = $('#g-k').value.trim();
        sb.auth.signInWithPassword({ email: epostaOlustur(hamKadi), password: sifre }).then(function (r) {
          if (r.error) {
            if (/fetch|network|failed|timeout/i.test(r.error.message || '')) { mesgul(false); return hata('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.'); }
            return basarisiz();
          }
          return profilBul(r.data.user.id).then(function (pu) {
            if (!pu) { sb.auth.signOut(); return basarisiz('Hesabınız tanımlı değil ya da kapalı.'); }
            pu.eposta = r.data.user.email; girisHata = 0;
            try { localStorage.setItem(PROFIL_KEY, JSON.stringify(pu)); if ($('#g-hat').checked) localStorage.setItem(SON_KUL_KEY, hamKadi); else localStorage.removeItem(SON_KUL_KEY); } catch (x) { /* yok */ }
            oturumAc(pu);
          });
        }).catch(function () { mesgul(false); hata('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.'); });
        return;
      }
      if (!u || u.aktif === false) { hashle(sifre, '00'.repeat(16)).then(basarisiz); return; }
      hashle(sifre, u.tuz).then(function (h) {
        if (h !== u.hash) return basarisiz();
        girisHata = 0;
        try { if ($('#g-hat').checked) localStorage.setItem(SON_KUL_KEY, kadi); else localStorage.removeItem(SON_KUL_KEY); } catch (x) { /* yok */ }
        oturumAc(u);
      });
    };
    setTimeout(function () { $(ilk ? '#g-ad' : (son ? '#g-s' : '#g-k')).focus(); }, 40);
  }
  function oturumAc(u) {
    oturum = u;
    try { sessionStorage.setItem(OTURUM_KEY, u.id); } catch (e) { /* oturum kalıcı olmaz */ }
    $('#giris').hidden = true; $('#giris').innerHTML = '';
    document.body.classList.remove('kilitli');
    if (!location.hash) location.hash = '#/pano';
    kapat(); render();
    if (sb) bulutYukle();
  }
  function cikis() {
    var son = function () {
      oturum = null; bulut.hazir = false; clearTimeout(bulut.zaman); clearTimeout(bulut.yeniden);
      if (sb) {
        if (bulut.kanal) { try { sb.removeChannel(bulut.kanal); } catch (e) { /* yok */ } bulut.kanal = null; }
        try { sb.auth.signOut(); } catch (e) { /* yok */ }
        var gecis = false, bek = false;
        try { gecis = localStorage.getItem(GECIS_KEY) === '1'; bek = localStorage.getItem(BEKLEYEN_KEY) === '1'; localStorage.removeItem(PROFIL_KEY); } catch (e) { /* yok */ }
        if (gecis && !bek) { yerelTemizle(); kullanicilar = []; }
      }
      try { sessionStorage.removeItem(OTURUM_KEY); } catch (e) { /* yok */ }
      kapat(); $('#app').innerHTML = ''; girisEkrani();
    };
    if (sb && bulut.hazir) esitle().then(son, son); else son();
  }
  function sifreFormu(u, eskiSor, bitti) {
    ac(baslik('Şifre Değiştir') + '<form id="sf" class="f" autocomplete="off"><div class="m-body"><div class="grid">' +
      '<div class="full"><b>' + esc(u.ad) + '</b> (' + esc(u.kullanici) + ')</div>' +
      (eskiSor ? '<div class="full"><label for="s-e">Mevcut şifre</label><input id="s-e" type="password" required autocomplete="current-password"></div>' : '') +
      '<div><label for="s-1">Yeni şifre</label><input id="s-1" type="password" required autocomplete="new-password"></div>' +
      '<div><label for="s-2">Yeni şifre (tekrar)</label><input id="s-2" type="password" required autocomplete="new-password"></div>' +
      '</div><p class="err" id="s-err" hidden></p></div><div class="m-foot"><button type="button" class="btn" id="s-v">Vazgeç</button>' +
      '<button class="btn primary" type="submit">Kaydet</button></div></form>');
    function hata(t) { var e = $('#s-err'); e.textContent = t; e.hidden = false; }
    $('#s-v').onclick = bitti;
    $('#sf').onsubmit = function (e) {
      e.preventDefault();
      var y = $('#s-1').value;
      if (y.length < 6) return hata('Yeni şifre en az 6 karakter olmalı.');
      if (y !== $('#s-2').value) return hata('Şifreler aynı değil.');
      if (sb) {
        var kendi = u.id === oturum.id, eposta = oturum.eposta || epostaOlustur(oturum.kullanici);
        var islem = kendi
          ? (eskiSor ? sb.auth.signInWithPassword({ email: eposta, password: $('#s-e').value }).then(function (r) { if (r.error) throw new Error('eski'); }) : Promise.resolve())
              .then(function () { return sb.auth.updateUser({ password: y }); }).then(function (r) { if (r.error) throw r.error; })
          : fnCagir({ islem: 'sifre', id: u.id, sifre: y }).then(function (r) { if (r.hata) throw new Error(r.hata); });
        islem.then(function () { bildir('Şifre değiştirildi.'); bitti(); }).catch(function (er) { hata(er.message === 'eski' ? 'Mevcut şifre hatalı.' : (er.message || 'Şifre değiştirilemedi.')); });
        return;
      }
      var ilk = eskiSor ? hashle($('#s-e').value, u.tuz).then(function (h) { return h === u.hash; }) : Promise.resolve(true);
      ilk.then(function (ok) {
        if (!ok) return hata('Mevcut şifre hatalı.');
        var tuz = hex(crypto.getRandomValues(new Uint8Array(16)));
        return hashle(y, tuz).then(function (h) {
          u.tuz = tuz; u.hash = h;
          if (kaydetKul()) { bildir('Şifre değiştirildi.'); bitti(); }
        });
      });
    };
    setTimeout(function () { var i = $(eskiSor ? '#s-e' : '#s-1'); if (i) i.focus(); }, 30);
  }
  function hesapEkrani() {
    ac(baslik('Hesabım') + '<div class="m-body"><div class="hero"><span class="avatar" style="' + renkler(oturum.ad) + '">' + esc(bas(oturum.ad)) + '</span>' +
      '<div><h3>' + esc(oturum.ad) + '</h3><p>' + esc(oturum.kullanici) + ' · ' + (yonetici() ? 'Yönetici' : 'Personel') + '</p></div></div></div>' +
      '<div class="m-foot"><button class="btn danger left" id="h-cik" type="button">Çıkış Yap</button>' +
      '<button class="btn" id="h-sif" type="button">Şifre Değiştir</button></div>');
    $('#h-cik').onclick = cikis;
    $('#h-sif').onclick = function () { sifreFormu(oturum, true, hesapEkrani); };
  }
  function kullaniciEkrani() {
    if (!yonetici()) return;
    if (sb) return kullaniciEkraniBulut();
    function cevir(r) { return r === 'yonetici' ? 'Yönetici' : 'Personel'; }
    function cizim() {
      ac(baslik('Kullanıcılar') + '<div class="m-body f"><p class="hint">Personel müşteri ve ziyaret ekleyip düzenleyebilir; silme, fiyat listesi, ciro ve yedekleme yönetici işidir.</p>' +
        kullanicilar.map(function (u) {
          var ben = u.id === oturum.id;
          return '<div class="urow"><div><b>' + esc(u.ad) + '</b>' + (ben ? ' <span class="tag vip">Siz</span>' : '') +
            (u.aktif === false ? ' <span class="tag risk">Pasif</span>' : '') + '<br><small>' + esc(u.kullanici) + ' · ' + cevir(u.rol) + '</small></div><div class="acts">' +
            '<button class="link" data-sf="' + esc(u.id) + '" type="button">Şifre sıfırla</button>' +
            (ben ? '' : '<button class="link" data-ak="' + esc(u.id) + '" type="button">' + (u.aktif === false ? 'Aç' : 'Kapat') + '</button>' +
              '<button class="link d" data-sl="' + esc(u.id) + '" type="button">Sil</button>') + '</div></div>';
        }).join('') +
        '<div class="sec">Yeni kullanıcı aç</div><form id="uf" autocomplete="off"><div class="grid">' +
        '<div><label for="u-ad">Ad Soyad</label><input id="u-ad" required maxlength="60"></div>' +
        '<div><label for="u-k">Kullanıcı adı</label><input id="u-k" required maxlength="30" autocapitalize="none"></div>' +
        '<div><label for="u-s">Şifre</label><input id="u-s" type="password" required autocomplete="new-password"></div>' +
        '<div><label for="u-r">Yetki</label><select id="u-r"><option value="personel">Personel</option><option value="yonetici">Yönetici</option></select></div>' +
        '</div><p class="err" id="u-err" hidden></p><div style="margin-top:12px"><button class="btn primary" type="submit">Kullanıcıyı Aç</button></div></form></div>');
      function hata(t) { var e = $('#u-err'); e.textContent = t; e.hidden = false; }
      $('#uf').onsubmit = function (e) {
        e.preventDefault();
        var ad = $('#u-ad').value.trim(), kadi = tr($('#u-k').value.trim()), sf = $('#u-s').value;
        if (!/^[a-z0-9._-]{3,30}$/.test(kadi)) return hata('Kullanıcı adı 3–30 karakter; harf, rakam, nokta, tire ya da alt çizgi olabilir.');
        if (kullanicilar.some(function (x) { return x.kullanici === kadi; })) return hata('Bu kullanıcı adı zaten var.');
        if (sf.length < 6) return hata('Şifre en az 6 karakter olmalı.');
        kullaniciYap(kadi, ad, sf, $('#u-r').value).then(function (u) {
          kullanicilar.push(u);
          if (kaydetKul()) { bildir('Kullanıcı açıldı.'); cizim(); }
        });
      };
      function ara(id) { return kullanicilar.filter(function (x) { return x.id === id; })[0]; }
      Array.prototype.forEach.call(modal.querySelectorAll('[data-sf]'), function (b) {
        b.onclick = function () { sifreFormu(ara(b.getAttribute('data-sf')), false, cizim); };
      });
      Array.prototype.forEach.call(modal.querySelectorAll('[data-ak]'), function (b) {
        b.onclick = function () {
          var u = ara(b.getAttribute('data-ak'));
          if (u.aktif !== false && u.rol === 'yonetici' && kullanicilar.filter(function (x) { return x.rol === 'yonetici' && x.aktif !== false; }).length < 2) {
            return bildir('Son aktif yöneticiyi kapatamazsınız.');
          }
          u.aktif = u.aktif === false; kaydetKul(); cizim();
        };
      });
      Array.prototype.forEach.call(modal.querySelectorAll('[data-sl]'), function (b) {
        b.onclick = function () {
          var u = ara(b.getAttribute('data-sl'));
          if (u.rol === 'yonetici' && kullanicilar.filter(function (x) { return x.rol === 'yonetici' && x.aktif !== false; }).length < 2) {
            return bildir('Son aktif yöneticiyi silemezsiniz.');
          }
          if (!confirm('“' + u.ad + '” kullanıcısı silinsin mi? Eski ziyaret kayıtları durur.')) return;
          kullanicilar = kullanicilar.filter(function (x) { return x.id !== u.id; }); kaydetKul(); cizim();
        };
      });
    }
    cizim();
  }

  /* yedek / aktarım */
  function csvHucre(v) { v = String(v == null ? '' : v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function indir(ad, icerik, tip) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([icerik], { type: tip }));
    a.download = ad; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function yedekEkrani() {
    if (!yonetici()) return;
    ac(baslik('Yedekle / Aktar') + '<div class="m-body">' +
      '<p>Kayıtlar yalnızca bu tarayıcıda durur. Yedek müşterileri, ziyaretleri, randevuları, ürün stokunu ve fiyat listesini içerir; kullanıcı hesapları yedeğe girmez. Tarayıcı verisi silinirse kaybolur; bu yüzden düzenli yedek alın.</p>' +
      '<div class="sec">Dışa aktar</div><div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn primary" id="y-json" type="button">Yedek dosyası (.json)</button>' +
      '<button class="btn" id="y-csv" type="button">Excel için liste (.csv)</button></div>' +
      '<div class="sec">İçe aktar</div><p>Daha önce aldığınız yedek dosyasını seçin. Aynı kayıtlar güncellenir, yenileri eklenir; mevcut kayıt silinmez.</p>' +
      '<button class="btn" id="y-ice" type="button">Yedek dosyası seç…</button></div>');
    $('#y-json').onclick = function () {
      ayarlar.sonYedek = new Date().toISOString(); kaydetAyar(); render();
      indir('siya-yedek-' + bugun() + '.json', JSON.stringify({ uygulama: 'siya', surum: 2, tarih: new Date().toISOString(), musteriler: db, hizmetler: hizmetler, randevular: randevular, urunler: urunler, urunSatis: urunSatis }, null, 2), 'application/json');
    };
    $('#y-csv').onclick = function () {
      var s = ['Ad Soyad;Telefon;E-posta;Doğum Tarihi;VIP;Ziyaret Sayısı;Son Ziyaret;Toplam Harcama;Alerji;Not'];
      db.forEach(function (m) {
        s.push([m.ad, m.tel, m.eposta, tarihGoster(m.dogum) === '—' ? '' : tarihGoster(m.dogum), m.vip ? 'Evet' : '', (m.ziyaretler || []).length,
          sonZiyaret(m) ? tarihGoster(sonZiyaret(m)) : '', toplam(m), m.alerji, m.not].map(csvHucre).join(';'));
      });
      indir('siya-musteriler-' + bugun() + '.csv', '﻿' + s.join('\r\n'), 'text/csv;charset=utf-8');
    };
    $('#y-ice').onclick = function () { $('#dosya').click(); };
  }
  $('#dosya').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var v = JSON.parse(r.result), arr = Array.isArray(v) ? v : v.musteriler;
        if (!Array.isArray(arr)) throw new Error('biçim');
        var yeni = 0, guncel = 0;
        arr.forEach(function (m) {
          if (!m || typeof m.ad !== 'string' || !m.ad.trim()) return;
          m.id = typeof m.id === 'string' && m.id ? m.id : yeniId();
          m.ziyaretler = Array.isArray(m.ziyaretler) ? m.ziyaretler : [];
          m.ziyaretler.forEach(function (z) { if (!z.id) z.id = yeniId(); });
          var i = db.map(function (x) { return x.id; }).indexOf(m.id);
          if (i > -1) { db[i] = m; guncel++; } else { db.push(m); yeni++; }
        });
        if (Array.isArray(v.hizmetler)) {
          v.hizmetler.forEach(function (h) {
            if (!h || typeof h.ad !== 'string' || !h.ad.trim()) return;
            var var_ = hizmetler.filter(function (x) { return tr(x.ad) === tr(h.ad); })[0];
            if (var_) var_.fiyat = Math.max(0, Number(h.fiyat) || 0);
            else hizmetler.push({ id: yeniId(), kategori: String(h.kategori || '').trim(), ad: h.ad.trim(), fiyat: Math.max(0, Number(h.fiyat) || 0) });
          });
          kaydetHiz();
        }
        var birlestir = function (kaynak, hedef) {
          (Array.isArray(kaynak) ? kaynak : []).forEach(function (x) {
            if (!x || typeof x !== 'object') return;
            x.id = typeof x.id === 'string' && x.id ? x.id : yeniId();
            var j = hedef.map(function (y) { return y.id; }).indexOf(x.id);
            if (j > -1) hedef[j] = x; else hedef.push(x);
          });
        };
        birlestir(v.randevular, randevular); birlestir(v.urunler, urunler); birlestir(v.urunSatis, urunSatis);
        kaydetRan(); kaydetUrun(); kaydetUSat();
        kaydet(); tazele(); kapat();
        bildir(yeni + ' yeni, ' + guncel + ' güncellenen müşteri aktarıldı.');
      } catch (err) { bildir('Dosya okunamadı: geçerli bir SİYA yedeği değil.'); }
    };
    r.readAsText(f);
  });

  function oturumsuz() {
    var gecis = false, bek = false;
    try { gecis = localStorage.getItem(GECIS_KEY) === '1'; bek = localStorage.getItem(BEKLEYEN_KEY) === '1'; } catch (e) { /* yok */ }
    if (gecis && !bek) { yerelTemizle(); kullanicilar = []; }
    girisEkrani();
  }
  function baslat() {
    temaUygula();
    document.body.classList.add('kilitli');
    if (sb) {
      sb.auth.onAuthStateChange(function (olay) {
        if (olay === 'SIGNED_OUT' && oturum) { oturum = null; bulut.hazir = false; kapat(); $('#app').innerHTML = ''; girisEkrani(); }
      });
      sb.auth.getSession().then(function (r) {
        var ses = r.data && r.data.session;
        if (!ses) { oturumsuz(); return; }
        return profilBul(ses.user.id).then(function (pu) {
          if (!pu) { sb.auth.signOut(); oturumsuz(); return; }
          pu.eposta = ses.user.email;
          try { localStorage.setItem(PROFIL_KEY, JSON.stringify(pu)); } catch (e) { /* yok */ }
          oturumAc(pu);
        }, function () {
          var pu = null; try { pu = JSON.parse(localStorage.getItem(PROFIL_KEY)); } catch (e) { pu = null; }
          if (pu && pu.id === ses.user.id) oturumAc(pu); else girisEkrani();
        });
      }).catch(function () { girisEkrani(); });
      return;
    }
    var id = null;
    try { id = sessionStorage.getItem(OTURUM_KEY); } catch (e) { /* yok */ }
    var u = kullanicilar.filter(function (x) { return x.id === id && x.aktif !== false; })[0];
    if (u && window.crypto && crypto.subtle) oturumAc(u); else girisEkrani();
  }
  baslat();
})();
