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
  var AYAR_KEY = 'siya.ayarlar.v1', HIZ_KEY = 'siya.hizmetler.v1', KUL_KEY = 'siya.kullanicilar.v1', OTURUM_KEY = 'siya.oturum';
  var ODEMELER = ['Nakit', 'Kredi Kartı', 'Havale / EFT'];
  var GUN_RISK = 60;

  var db = yukle();
  var hizmetler = yukleHiz();
  var kullanicilar = yukleKul();
  var oturum = null;
  var ayarlar = yukleAyar();
  var durum = {
    m: { ara: '', filtre: 'hepsi', sirala: 'ad', limit: 50 },
    z: { donem: 'bugun', bas: '', bit: '', odeme: '', uzman: '', ara: '' },
    r: { donem: 'ay', bas: '', bit: '' }, fa: '', sonSayfa: ''
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
    try { localStorage.setItem(HIZ_KEY, JSON.stringify(hizmetler)); return true; }
    catch (e) { bildir('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); return false; }
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
  function kaydet() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); return true; }
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
    ['pano', 'Pano', 'pano', 'GÜNLÜK ÖZET', 'Bugünün özeti, takip listeleri ve kısa yollar'],
    ['musteriler', 'Müşteriler', 'users', 'MÜŞTERİ KAYITLARI', 'Tüm müşteriler, notlar ve ziyaret geçmişi'],
    ['ziyaretler', 'Ziyaret Defteri', 'book', 'ZİYARET DEFTERİ', 'Günlük işlemler, tutarlar ve ödeme türleri'],
    ['raporlar', 'Raporlar', 'chart', 'RAPORLAR', 'Ciro, işlem ve uzman bazlı değerlendirme', true],
    ['fiyatlar', 'Fiyat Listesi', 'tag', 'FİYAT LİSTESİ', 'İşlemler ve satış fiyatları'],
    ['ayarlar', 'Ayarlar', 'ayar', 'AYARLAR', 'Görünüm, hesap, kullanıcılar ve yedekleme']
  ];
  var IKON = {
    pano: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
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
    var vars = { tema: 'light', menuSabit: false, gorunum: 'tablo', kartKesinti: 20, ortakAd: '', ortakPay: 50, ortakGrup: 'Kuaför', sonYedek: '' };
    Object.keys(vars).forEach(function (k) { if (v[k] === undefined) v[k] = vars[k]; });
    return v;
  }
  function kaydetAyar() {
    try { localStorage.setItem(AYAR_KEY, JSON.stringify(ayarlar)); return true; } catch (e) { return false; }
  }
  function temaUygula() {
    document.documentElement.setAttribute('data-theme', ayarlar.tema === 'dark' ? 'dark' : 'light');
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = ayarlar.tema === 'dark' ? '#170f14' : '#2d1b24';
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
    if (f !== null && f < 7) return '';
    return '<div class="banner"><span>' + ik('uyari') + '<b>Yedek zamanı.</b> ' +
      (f === null ? 'Henüz yedek almadınız.' : f + ' gündür yedek almadınız.') +
      ' Kayıtlar yalnızca bu tarayıcıda durur.</span><button class="btn small" type="button" data-act="yedek">Şimdi yedekle</button></div>';
  }
  function render() {
    if (!oturum) return;
    var s = sayfaAdi(), app = $('#app'), yKonum = window.scrollY;
    var nav = SAYFALAR.filter(function (x) { return !x[5] || yonetici(); }).map(function (x) {
      var sayi = x[0] === 'musteriler' && db.length ? db.length : '';
      return '<button type="button" class="nav-item' + (s[0] === x[0] ? ' active' : '') + '" data-nav="' + x[0] + '" title="' + esc(x[1]) + '"' +
        (s[0] === x[0] ? ' aria-current="page"' : '') + '>' + ik(x[2]) + '<span class="nav-text">' + esc(x[1]) + '</span>' +
        (sayi !== '' ? '<span class="nav-count">' + sayi + '</span>' : '') + '</button>';
    }).join('');
    var icerik = ({ pano: pano, musteriler: musteriler, ziyaretler: ziyaretSayfasi, raporlar: raporSayfasi, fiyatlar: fiyatSayfasi, ayarlar: ayarSayfasi })[s[0]]();
    document.body.classList.toggle('k-wide', !!ayarlar.menuSabit);
    app.innerHTML =
      '<aside class="sidebar"><div class="brand"><div class="brand-mark" aria-hidden="true">S</div><div class="brand-text"><div class="brand-name">SİYA</div><div class="brand-sub">GÜZELLİK &amp; KUAFÖR</div></div></div>' +
      '<button type="button" class="k-pin" data-act="menu-sabit" title="Menüyü sabitle / daralt" aria-label="Menüyü sabitle">' + ik('panel') + '</button>' +
      '<div class="nav-label">ÇALIŞMA ALANI</div><nav aria-label="Ana gezinme">' + nav + '</nav>' +
      '<div class="sidebar-bottom"><div class="sidebar-user"><span class="avatar sm" style="' + renkler(oturum.ad) + '">' + esc(bas(oturum.ad)) + '</span>' +
      '<span class="who-t"><b>' + esc(oturum.ad) + '</b><small>' + (yonetici() ? 'Yönetici' : 'Personel') + '</small></span>' +
      '<button type="button" class="out" data-act="cikis" title="Çıkış yap" aria-label="Çıkış yap">' + ik('cikis') + '</button></div></div></aside>' +
      '<div class="shell"><header class="topbar"><div class="breadcrumb">' + ik('bina') + '<span>SİYA</span>' + ik('ok') + '<strong>' + esc(s[1]) + '</strong></div>' +
      '<button type="button" class="k-search" data-act="ara">' + ik('ara') + '<span>MÜŞTERİ, İŞLEM VEYA SAYFA ARA</span><kbd>Ctrl</kbd><kbd>K</kbd></button>' +
      '<div class="topbar-right"><span class="save-status">Kayıt bu cihazda</span>' +
      '<button type="button" class="hdr-btn" data-act="tema" title="Açık / koyu görünüm" aria-label="Görünümü değiştir">' + ik(ayarlar.tema === 'dark' ? 'gunes' : 'ay') + '</button>' +
      '<button type="button" class="hdr-btn solid" data-act="yeni-musteri">' + ik('arti') + '<span class="lbl-d">Yeni Müşteri</span></button></div></header>' +
      '<main id="main">' + yedekHatirlat() + icerik + '<footer class="foot">SİYA Güzellik &amp; Kuaför · Veriler bu cihazın tarayıcısında saklanır · <button class="k-link" type="button" data-act="yedek"' + (yonetici() ? '' : ' hidden') + '>Yedekle</button></footer></main></div>';
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
  function halka(parcalar, orta, altYazi) {
    var top = parcalar.reduce(function (s, p) { return s + p.d; }, 0), ac = 0, cg = [];
    parcalar.forEach(function (p, i) {
      var y = top ? p.d / top * 100 : 0;
      cg.push(RENKLER[i % RENKLER.length] + ' ' + ac + '% ' + (ac + y) + '%'); ac += y;
    });
    return '<div class="donut-wrap"><div class="donut" style="background:' + (top ? 'conic-gradient(' + cg.join(',') + ')' : 'var(--line)') + '"><div><b>' + orta + '</b><small>' + altYazi + '</small></div></div>' +
      '<ul class="legend">' + parcalar.map(function (p, i) {
        return '<li><i style="background:' + RENKLER[i % RENKLER.length] + '"></i>' + esc(p.ad) + '<b>' + (p.e || '') + '</b></li>';
      }).join('') + '</ul></div>';
  }
  function bos(yazi) { return '<div class="empty">' + ik('tik') + esc(yazi) + '</div>'; }

  /* ---------- PANO ---------- */
  function pano() {
    var b = bugun(), tum = tumZ(), ay = aralikta(tum, donemAraligi('ay')), gun = aralikta(tum, [b, b]);
    var oAy = ozetle(ay), oGun = ozetle(gun), adm = yonetici();
    var sa = new Date().getHours(), selam = sa < 12 ? 'Günaydın' : sa < 18 ? 'İyi günler' : 'İyi akşamlar';
    var ilkAd = (oturum.ad || '').trim().split(/\s+/)[0];
    var yakin = db.filter(dogumYakin).sort(function (a, c) { return sonrakiDogum(a.dogum) - sonrakiDogum(c.dogum); });
    var gelmeyen = db.filter(riskli).sort(function (a, c) { return sonZiyaret(a).localeCompare(sonZiyaret(c)); });
    var stat = function (d, e, c) { return '<div class="k-stat"><b>' + d + '</b><i' + (c ? ' style="background:' + c + '"' : '') + '></i><span>' + e + '</span></div>'; };
    var hero = '<div class="heading k-hero"><div><div class="k-hi">' + selam.toUpperCase() + (ilkAd ? ', ' + esc(ilkAd.toLocaleUpperCase('tr')) : '') + '</div>' +
      '<h1>Salonun bugünkü durumu</h1><div class="k-date">' + uzunTarih(b).toLocaleUpperCase('tr') + '</div></div>' +
      '<div class="k-stats"><span class="k-stats-label">BUGÜN</span>' + stat(oGun.adet, 'ZİYARET') +
      (adm ? stat(para(oGun.ciro), 'CİRO', '#e6b36e') : stat(oAy.adet, 'BU AY ZİYARET', '#e6b36e')) +
      stat(db.length, 'MÜŞTERİ', '#f4a7bb') + stat(yakin.length, 'DOĞUM GÜNÜ', '#c4b5fd') + '</div>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="yeni-ziyaret">' + ik('arti') + ' Ziyaret Ekle</button>' +
      '<button class="btn" type="button" data-act="yeni-musteri">Yeni Müşteri</button><button class="btn" type="button" data-nav="musteriler">Müşteriler</button></div></div>';

    if (!db.length) {
      return hero + '<section class="panel"><div class="welcome"><div class="big">Hoş geldiniz 👋</div><p>SİYA müşteri kayıt sistemi hazır. Başlamak için şu adımları izleyin:</p>' +
        '<ol><li><b>Fiyat listesi</b> Excel dosyanızdan aktarıldı' + (yonetici() ? ' — <button class="k-link" type="button" data-nav="fiyatlar">kontrol edin</button>' : '') + '.</li>' +
        '<li><button class="k-link" type="button" data-act="yeni-musteri">İlk müşterinizi ekleyin</button>.</li>' +
        '<li>Ziyaret ekleyin: işlemleri seçin, tutar otomatik hesaplanır.</li>' +
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

    var bugunTablo = gun.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Müşteri</th><th>İşlemler</th><th>Uzman</th><th class="r">Tutar</th></tr></thead><tbody>' +
      gun.map(function (x) {
        return '<tr data-act="ac" data-id="' + esc(x.m.id) + '"><td><b>' + esc(x.m.ad) + '</b></td><td>' + esc((x.z.hizmetler || []).join(', ')) + '</td><td>' + esc(x.z.personel || '—') + '</td><td class="r"><b>' + para(x.z.tutar) + '</b></td></tr>';
      }).join('') + '</tbody></table></div>' : bos('Bugün henüz ziyaret kaydı yok. “Ziyaret Ekle” ile başlayın.');
    var dogumListe = yakin.length ? '<ul class="mini">' + yakin.slice(0, 5).map(function (m) {
      var d = sonrakiDogum(m.dogum);
      return '<li><button type="button" data-act="ac" data-id="' + esc(m.id) + '"><span class="avatar xs" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><b>' + esc(m.ad) + '</b><small>' +
        (d === 0 ? 'Bugün 🎂' : d + ' gün · ' + dObj(m.dogum).getDate() + ' ' + AYLAR[dObj(m.dogum).getMonth()]) + '</small></button></li>';
    }).join('') + '</ul>' : bos('Önümüzdeki 30 günde doğum günü yok.');
    var gelmeyenListe = gelmeyen.length ? '<ul class="mini">' + gelmeyen.slice(0, 5).map(function (m) {
      return '<li><button type="button" data-act="ac" data-id="' + esc(m.id) + '"><span class="avatar xs" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><b>' + esc(m.ad) + '</b><small>' + gunFarki(sonZiyaret(m)) + ' gündür yok</small></button></li>';
    }).join('') + '</ul>' : bos(GUN_RISK + '+ gündür gelmeyen müşteri yok.');
    var alt = '<div class="k-cards two">' +
      kart('BUGÜNÜN ZİYARETLERİ', gun.length + ' KAYIT', bugunTablo, 'wide') +
      '<div class="stack">' + kart('YAKLAŞAN DOĞUM GÜNLERİ', yakin.length ? '<button class="k-link" type="button" data-nav="musteriler" data-f="dogum">TÜMÜ</button>' : '', dogumListe) +
      kart('UZUN SÜREDİR GELMEYENLER', gelmeyen.length ? '<button class="k-link" type="button" data-nav="musteriler" data-f="risk">TÜMÜ</button>' : '', gelmeyenListe) + '</div></div>';
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
    return sayfaBasligi(SAYFALAR[1], csv + '<button class="btn primary" type="button" data-act="yeni-musteri">' + ik('arti') + ' Yeni Müşteri</button>') +
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
        return '<button type="button" class="mcard" data-act="ac" data-id="' + esc(m.id) + '"><span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span>' +
          '<b>' + esc(m.ad) + '</b><span class="tags">' + rozet(m) + '</span><small>' + esc(m.tel || 'Telefon yok') + '</small>' +
          '<span class="mrow"><span><small>Son ziyaret</small><b>' + (son ? tarihGoster(son) : '—') + '</b></span><span><small>Ziyaret</small><b>' + (m.ziyaretler || []).length + '</b></span><span><small>Harcama</small><b>' + para(toplam(m)) + '</b></span></span></button>';
      }).join('') + '</div>';
    } else {
      html = '<div class="tbl-wrap"><table class="tbl click"><thead><tr><th>Müşteri</th><th>Telefon</th><th>Son ziyaret</th><th class="r">Ziyaret</th><th class="r">Harcama</th></tr></thead><tbody>' +
        goster.map(function (m) {
          var son = sonZiyaret(m);
          return '<tr data-act="ac" data-id="' + esc(m.id) + '"><td><div class="cust"><span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span><span><b>' + esc(m.ad) + '</b><span class="tags">' + rozet(m) + '</span></span></div></td>' +
            '<td>' + esc(m.tel || '—') + '</td><td>' + (son ? tarihGoster(son) : '—') + '</td><td class="r">' + (m.ziyaretler || []).length + '</td><td class="r"><b>' + para(toplam(m)) + '</b></td></tr>';
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
    var csv = yonetici() ? '<button class="btn" type="button" data-act="csv-ziyaret">' + ik('indir') + ' Excel (.csv)</button>' : '';
    return sayfaBasligi(SAYFALAR[2], csv + '<button class="btn primary" type="button" data-act="yeni-ziyaret">' + ik('arti') + ' Ziyaret Ekle</button>') +
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
    kutu.innerHTML = s + sira.map(function (t) {
      var top = gruplar[t].reduce(function (a, x) { return a + (Number(x.z.tutar) || 0); }, 0);
      return '<div class="dayblock"><div class="dayhead"><b>' + uzunTarih(t) + (t === bugun() ? ' <span class="tag dogum">Bugün</span>' : '') + '</b><span>' + gruplar[t].length + ' ziyaret' + (adm ? ' · <b>' + para(top) + '</b>' : '') + '</span></div>' +
        '<div class="tbl-wrap"><table class="tbl click"><tbody>' + gruplar[t].map(function (x) {
          return '<tr data-act="ac" data-id="' + esc(x.m.id) + '"><td class="c1"><div class="cust"><span class="avatar sm" style="' + renkler(x.m.ad) + '">' + esc(bas(x.m.ad)) + '</span><b>' + esc(x.m.ad) + '</b></div></td>' +
            '<td>' + (x.z.hizmetler || []).map(function (h) { return '<span class="pill">' + esc(h) + '</span>'; }).join('') + (x.z.not ? '<div class="znote">' + esc(x.z.not) + '</div>' : '') + '</td>' +
            '<td class="hm">' + esc(x.z.personel || '—') + '</td><td class="hm"><span class="odeme">' + esc(x.z.odeme || '') + '</span></td><td class="r"><b>' + para(x.z.tutar) + '</b></td>' +
            '<td class="r"><button class="link" type="button" data-act="z-duzenle" data-id="' + esc(x.m.id) + '" data-z="' + esc(x.z.id) + '">Düzenle</button></td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }).join('');
  }

  /* ---------- RAPORLAR ---------- */
  function raporSayfasi() {
    var d = durum.r, r = donemAraligi(d.donem, d.bas, d.bit), l = aralikta(tumZ(), r), o = ozetle(l);
    var yeni = db.filter(function (m) { var t = (m.olusturma || '').slice(0, 10); return t >= r[0] && t <= r[1]; }).length;
    var kk = Number(ayarlar.kartKesinti) || 0, kesinti = o.ciro - o.net;
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
    return sayfaBasligi(SAYFALAR[3], '<button class="btn" type="button" data-act="yazdir">Yazdır</button><button class="btn" type="button" data-act="csv-ziyaret">' + ik('indir') + ' Excel (.csv)</button>') +
      '<section class="panel pad"><div class="toolbar col flat">' + donemSecici('r', d) + '</div><div class="periodname">' + esc(donemAdi(d.donem, r)) + '</div>' +
      '<div class="kpis">' + kpi('BRÜT CİRO', para(o.ciro), o.adet + ' ziyaret') + kpi('NET CİRO', para(o.net), kesinti ? 'kart kesintisi −' + para(kesinti) : 'kesinti yok') +
      kpi('ORTALAMA SEPET', para(o.adet ? o.ciro / o.adet : 0), 'ziyaret başına') + kpi('MÜŞTERİ', Object.keys(o.musteri).length, yeni + ' yeni kayıt') + '</div></section>' +
      '<div class="k-cards r2">' + gunlukSeri +
      '<section class="k-card"><div class="k-card-h">ÖDEME TÜRÜ</div>' + (o.ciro ? halka(odeme, o.adet, 'ZİYARET') : bos('Bu dönemde ödeme yok.')) + '</section>' +
      '<section class="k-card"><div class="k-card-h">GRUP DAĞILIMI</div>' + (o.ciro ? halka(gr, para(o.ciro), 'CİRO') : bos('Bu dönemde işlem yok.')) + '</section>' + hak +
      '<section class="k-card wide"><div class="k-card-h">İŞLEM BAZLI<b>İLK 15</b></div>' + (hz.length ? tablo(['İşlem', 'Adet', 'Ciro'], hz.map(function (x) { return '<tr><td>' + esc(x.ad) + '</td><td class="r">' + x.adet + '</td><td class="r"><b>' + para(x.ciro) + '</b></td></tr>'; }).join('')) : bos('Bu dönemde işlem yok.')) + '</section>' +
      '<section class="k-card"><div class="k-card-h">UZMAN BAZLI</div>' + (uz.length ? tablo(['Uzman', 'Ziyaret', 'Ciro'], uz.map(function (x) { return '<tr><td>' + esc(x.ad) + '</td><td class="r">' + x.adet + '</td><td class="r"><b>' + para(x.ciro) + '</b></td></tr>'; }).join('')) : bos('Bu dönemde kayıt yok.')) + '</section></div>';
  }

  /* ---------- FİYAT LİSTESİ ---------- */
  function fiyatSayfasi() {
    return sayfaBasligi(SAYFALAR[4], yonetici() ? '<button class="btn primary" type="button" data-act="fiyat-duzenle">Fiyatları Düzenle</button>' : '') +
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
  function ayarSayfasi() {
    var adm = yonetici();
    var seg = function (anahtar, secenekler, deger) {
      return '<div class="seg">' + secenekler.map(function (o) { return '<button type="button" data-act="ayar" data-k="' + anahtar + '" data-v="' + o[0] + '" aria-pressed="' + (String(deger) === String(o[0])) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    };
    var satir = function (b, a, s) { return '<div class="setrow"><div><b>' + b + '</b><small>' + a + '</small></div><div class="ctl">' + s + '</div></div>'; };
    var grupSec = KATEGORILER.concat(['Diğer']);
    var depo = 0; try { depo = Math.round((JSON.stringify(db).length + JSON.stringify(hizmetler).length) / 1024); } catch (e) { depo = 0; }
    return sayfaBasligi(SAYFALAR[5], '') + '<div class="setgrid">' +
      '<section class="k-card"><div class="k-card-h">HESABIM</div><div class="hero tight"><span class="avatar" style="' + renkler(oturum.ad) + '">' + esc(bas(oturum.ad)) + '</span><div><h3>' + esc(oturum.ad) + '</h3><p>' + esc(oturum.kullanici) + ' · ' + (adm ? 'Yönetici' : 'Personel') + '</p></div></div>' +
      '<div class="btnrow"><button class="btn" type="button" data-act="sifre">Şifre Değiştir</button><button class="btn danger" type="button" data-act="cikis">Çıkış Yap</button></div></section>' +
      '<section class="k-card"><div class="k-card-h">GÖRÜNÜM</div>' +
      satir('Tema', 'Açık ya da koyu görünüm', seg('tema', [['light', 'Açık'], ['dark', 'Koyu']], ayarlar.tema)) +
      satir('Yan menü', 'Daralan menü üzerine gelince açılır', seg('menuSabit', [['false', 'Daralan'], ['true', 'Sabit']], ayarlar.menuSabit)) +
      satir('Müşteri listesi', 'Varsayılan görünüm', seg('gorunum', [['tablo', 'Tablo'], ['kart', 'Kart']], ayarlar.gorunum)) + '</section>' +
      (adm ? '<section class="k-card"><div class="k-card-h">ÖDEME VE HAKEDİŞ</div>' +
        satir('Kredi kartı kesintisi (%)', 'Kartla ödemelerde net tutar = tutar ÷ (1 + oran). Excel dosyanızda %20.', '<input class="num" type="number" min="0" max="100" step="0.1" data-in="ay-kartKesinti" value="' + esc(ayarlar.kartKesinti) + '">') +
        satir('Ortak / uzman adı', 'Hakediş paylaşılan kişi (boşsa hakediş hesabı kapalı)', '<input class="txt" maxlength="40" placeholder="Örn. Hakan" data-in="ay-ortakAd" value="' + esc(ayarlar.ortakAd) + '">') +
        satir('Ortak payı (%)', 'Seçili grubun net cirosundan ayrılan pay', '<input class="num" type="number" min="0" max="100" step="1" data-in="ay-ortakPay" value="' + esc(ayarlar.ortakPay) + '">') +
        satir('Hakediş grubu', 'Payın hesaplandığı işlem grubu', '<select data-in="ay-ortakGrup">' + grupSec.map(function (g) { return '<option' + (ayarlar.ortakGrup === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select>') + '</section>' +
        '<section class="k-card"><div class="k-card-h">KULLANICILAR<b>' + kullanicilar.length + ' HESAP</b></div><p class="hint">Personel müşteri ve ziyaret ekleyip düzenleyebilir; silme, fiyat listesi, ciro, raporlar ve yedekleme yönetici işidir.</p><div class="btnrow"><button class="btn primary" type="button" data-act="kullanicilar">Kullanıcıları Yönet</button></div></section>' +
        '<section class="k-card"><div class="k-card-h">VERİ VE YEDEK</div><p class="hint">' + db.length + ' müşteri · ' + tumZ().length + ' ziyaret · yaklaşık ' + depo + ' KB. Son yedek: <b>' + (ayarlar.sonYedek ? tarihGoster(ayarlar.sonYedek.slice(0, 10)) : 'hiç alınmadı') + '</b></p>' +
        '<div class="btnrow"><button class="btn primary" type="button" data-act="yedek">Yedekle / Aktar</button><button class="btn danger" type="button" data-act="sifirla">Tüm Verileri Sil</button></div></section>' : '') + '</div>';
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
      var m = bul(b.getAttribute('data-id')); detay(m.id); ziyaretForm(m, null);
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
    var eylemler = [['Yeni müşteri ekle', 'arti', function () { musteriForm(); }], ['Ziyaret ekle', 'arti', hizliZiyaret]];
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
    var t = prompt('Tüm müşteri ve ziyaret kayıtları silinecek. Geri alınamaz.\nDevam etmek için SİL yazın:');
    if (t === null || tr(t.trim()) !== 'sil') return;
    db = []; kaydet(); render(); bildir('Tüm müşteri kayıtları silindi.');
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
    if (act === 'z-duzenle') { e.stopPropagation(); var m = bul(a.getAttribute('data-id')); detay(m.id); ziyaretForm(m, (m.ziyaretler || []).filter(function (z) { return z.id === a.getAttribute('data-z'); })[0]); return; }
    var is = {
      'yeni-musteri': function () { musteriForm(); }, 'yeni-ziyaret': hizliZiyaret, 'ara': qsAc, 'cikis': cikis, 'yedek': yedekEkrani,
      'fiyat-duzenle': fiyatEkrani, 'kullanicilar': kullaniciEkrani, 'sifre': function () { sifreFormu(oturum, true, kapat); },
      'sifirla': tumVeriyiSil, 'yazdir': function () { window.print(); }, 'csv-musteri': csvMusteriler,
      'csv-ziyaret': function () { csvZiyaretler(sayfaAdi()[0] === 'raporlar' ? aralikta(tumZ(), donemAraligi(durum.r.donem, durum.r.bas, durum.r.bit)) : ziyaretListesi()); },
      'tema': function () { ayarlar.tema = ayarlar.tema === 'dark' ? 'light' : 'dark'; kaydetAyar(); temaUygula(); render(); },
      'menu-sabit': function () { ayarlar.menuSabit = !ayarlar.menuSabit; kaydetAyar(); render(); },
      'gorunum': function () { ayarlar.gorunum = a.getAttribute('data-g'); kaydetAyar(); render(); },
      'filtre': function () { durum.m.filtre = a.getAttribute('data-f'); durum.m.limit = 50; musteriListe(); },
      'daha': function () { durum.m.limit += 50; musteriListe(); },
      'gun': function () { durum.z.donem = 'ozel'; durum.z.bas = durum.z.bit = a.getAttribute('data-gun'); git('ziyaretler'); },
      'donem': function () { var k = a.getAttribute('data-k'); durum[k].donem = a.getAttribute('data-d'); if (durum[k].donem === 'ozel' && !durum[k].bas) { durum[k].bas = durum[k].bit = bugun(); } render(); },
      'ayar': function () {
        var k = a.getAttribute('data-k'), v = a.getAttribute('data-v');
        ayarlar[k] = v === 'true' ? true : v === 'false' ? false : v; kaydetAyar();
        if (k === 'tema') temaUygula();
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
    else if (k.indexOf('ay-') === 0 && e.type === 'change') {
      var an = k.slice(3);
      ayarlar[an] = (an === 'kartKesinti' || an === 'ortakPay') ? Math.min(100, Math.max(0, Number(v) || 0)) : v.trim();
      kaydetAyar(); bildir('Ayar kaydedildi.');
    }
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
      '<div class="m-foot">' + (id && yonetici() ? '<button type="button" class="btn danger left" id="sil">Müşteriyi Sil</button>' : '') +
      '<button type="button" class="btn" id="vazgec">Vazgeç</button><button class="btn primary" type="submit">Kaydet</button></div></form>');
    $('#vazgec').onclick = function () { id ? detay(id) : kapat(); };
    if (id && yonetici()) $('#sil').onclick = function () { sil(id); };
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
    if (!yonetici()) return;
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
      '<div class="sec">Ziyaret Geçmişi</div><div id="vform"></div>' +
      (zs.length ? zs.map(function (z) {
        return '<div class="visit"><span class="d">' + tarihGoster(z.tarih) + '</span><span class="money">' + para(z.tutar) + '</span>' +
          '<span class="svc">' + (z.hizmetler || []).map(function (s) { return '<i>' + esc(s) + '</i>'; }).join('') + '</span>' +
          '<span class="meta">' + [z.personel && 'Uzman: ' + z.personel, z.odeme, z.not, z.ekleyen && 'Kaydeden: ' + z.ekleyen].filter(Boolean).map(esc).join(' · ') + '</span>' +
          '<span class="acts"><button class="link" data-zd="' + esc(z.id) + '" type="button">Düzenle</button>' +
          (yonetici() ? '<button class="link d" data-zs="' + esc(z.id) + '" type="button">Sil</button>' : '') + '</span></div>';
      }).join('') : '<p style="color:var(--muted)">Henüz ziyaret kaydı yok.</p>') +
      '</div><div class="m-foot"><button class="btn" id="yazdir" type="button">Yazdır</button>' +
      '<button class="btn" id="duzenle" type="button">Bilgileri Düzenle</button>' +
      '<button class="btn primary" id="zekle" type="button">+ Ziyaret Ekle</button></div>';
    ac(h);
    $('#duzenle').onclick = function () { musteriForm(id); };
    $('#yazdir').onclick = function () { window.print(); };
    $('#zekle').onclick = function () { ziyaretForm(m, null); };
    Array.prototype.forEach.call(modal.querySelectorAll('[data-zd]'), function (b) {
      b.onclick = function () {
        ziyaretForm(m, (m.ziyaretler || []).filter(function (z) { return z.id === b.getAttribute('data-zd'); })[0]);
      };
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-zs]'), function (b) {
      b.onclick = function () {
        if (!yonetici() || !confirm('Bu ziyaret kaydı silinsin mi?')) return;
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
  function ziyaretForm(m, z) {
    var kalemler = (z && z.kalemler) || [];
    var secili = (z && z.hizmetler) || [];
    var katalog = hizmetler.map(function (h) { return { ad: h.ad, fiyat: Number(h.fiyat) || 0, kategori: h.kategori || 'Diğer' }; });
    var adlar = katalog.map(function (h) { return h.ad; });
    secili.forEach(function (ad) {
      if (adlar.indexOf(ad) > -1) return;
      var k = kalemler.filter(function (x) { return x.ad === ad; })[0];
      katalog.push({ ad: ad, fiyat: k ? Number(k.fiyat) || 0 : 0, kategori: 'Diğer' });
    });
    var kutu = $('#vform');
    kutu.className = 'vform f';
    kutu.innerHTML = '<div class="grid">' +
      '<div><label for="z-t">Tarih *</label><input id="z-t" type="date" required value="' + esc(z ? z.tarih : bugun()) + '"></div>' +
      '<div><label for="z-tu">Tutar (₺) <button type="button" class="link" id="z-oto" hidden>otomatik hesapla</button></label>' +
      '<input id="z-tu" type="number" min="0" step="1" inputmode="numeric" value="' + esc(z ? z.tutar : '') + '"></div>' +
      '<div class="full"><span class="lbl">Yapılan işlemler <span id="z-top" class="hint"></span></span>' +
      '<input id="z-ara" type="search" class="pickara" placeholder="İşlem ara…" aria-label="İşlem ara" autocomplete="off">' +
      '<div id="z-h">' + kategoriler(katalog).map(function (k) {
        return '<div class="grp"><div class="grp-ad">' + esc(k.ad) + '</div><div class="pick">' + k.liste.map(function (h) {
          return '<label data-ad="' + esc(tr(h.ad)) + '"><input type="checkbox" value="' + esc(h.ad) + '" data-fiyat="' + h.fiyat + '" data-grup="' + esc(h.kategori) + '"' + (secili.indexOf(h.ad) > -1 ? ' checked' : '') + '><span>' +
            esc(h.ad) + (h.fiyat ? ' <em>' + para(h.fiyat) + '</em>' : '') + '</span></label>';
        }).join('') + '</div></div>';
      }).join('') + '</div></div>' +
      '<div><label for="z-o">Listede olmayan işlem</label><input id="z-o" maxlength="60" placeholder="İşlem adı"></div>' +
      '<div><label for="z-of">Fiyatı (₺)</label><input id="z-of" type="number" min="0" step="1" inputmode="numeric"></div>' +
      '<div><label for="z-p">Uzman</label><input id="z-p" list="z-pl" maxlength="60" value="' + esc(z ? z.personel : (oturum && oturum.ad)) + '">' +
      '<datalist id="z-pl">' + kullanicilar.filter(function (u) { return u.aktif !== false; }).map(function (u) { return '<option value="' + esc(u.ad) + '">'; }).join('') + '</datalist></div>' +
      '<div><label for="z-od">Ödeme</label><select id="z-od">' + ODEMELER.map(function (o) {
        return '<option' + (z && z.odeme === o ? ' selected' : '') + '>' + o + '</option>';
      }).join('') + '</select></div>' +
      '<div class="full"><label for="z-n">Not (kullanılan ürün, renk kodu, sonuç…)</label><textarea id="z-n" maxlength="500">' + esc(z ? z.not : '') + '</textarea></div>' +
      '</div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">' +
      '<button class="btn sm" type="button" id="z-v">Vazgeç</button><button class="btn sm primary" type="button" id="z-k">Kaydet</button></div>';

    function secilenler() {
      return Array.prototype.slice.call(document.querySelectorAll('#z-h input:checked')).map(function (c) {
        return { ad: c.value, fiyat: Number(c.getAttribute('data-fiyat')) || 0, grup: c.getAttribute('data-grup') || 'Diğer' };
      });
    }
    function hesap() {
      var t = secilenler().reduce(function (x, k) { return x + k.fiyat; }, 0);
      if ($('#z-o').value.trim()) t += Math.max(0, Number($('#z-of').value) || 0);
      return t;
    }
    var elle = false;
    if (z) {
      var onceki = (z.kalemler || []).reduce(function (x, k) { return x + (Number(k.fiyat) || 0); }, 0);
      elle = !z.kalemler || onceki !== Number(z.tutar);
    }
    function guncelle() {
      var t = hesap();
      $('#z-top').textContent = t ? '· seçilen toplam: ' + para(t) : '';
      if (!elle) $('#z-tu').value = t || '';
      $('#z-oto').hidden = !elle || Number($('#z-tu').value) === t;
    }
    $('#z-h').addEventListener('change', guncelle);
    $('#z-ara').addEventListener('input', function (e) {
      var q = tr(e.target.value).trim();
      Array.prototype.forEach.call(document.querySelectorAll('#z-h label'), function (l) {
        l.hidden = !!q && l.getAttribute('data-ad').indexOf(q) < 0 && !l.querySelector('input').checked;
      });
      Array.prototype.forEach.call(document.querySelectorAll('#z-h .grp'), function (g) {
        g.hidden = !g.querySelector('label:not([hidden])');
      });
    });
    $('#z-o').addEventListener('input', guncelle);
    $('#z-of').addEventListener('input', guncelle);
    $('#z-tu').addEventListener('input', function () { elle = true; guncelle(); });
    $('#z-oto').onclick = function () { elle = false; guncelle(); };
    guncelle();

    $('#z-v').onclick = function () { detay(m.id); };
    $('#z-k').onclick = function () {
      var tarih = $('#z-t').value;
      if (!tarih) { bildir('Tarih seçin.'); return; }
      var ks = secilenler(), ek = $('#z-o').value.trim();
      if (ek && !ks.some(function (k) { return k.ad === ek; })) ks.push({ ad: ek, fiyat: Math.max(0, Number($('#z-of').value) || 0), grup: 'Diğer' });
      if (!ks.length) { bildir('En az bir işlem seçin.'); return; }
      var kayit = z || { id: yeniId(), ekleyen: oturum ? oturum.ad : '' };
      kayit.tarih = tarih; kayit.tutar = Math.max(0, Number($('#z-tu').value) || 0);
      kayit.kalemler = ks; kayit.hizmetler = ks.map(function (k) { return k.ad; });
      kayit.personel = $('#z-p').value.trim(); kayit.odeme = $('#z-od').value; kayit.not = $('#z-n').value.trim();
      if (!z) { m.ziyaretler = m.ziyaretler || []; m.ziyaretler.push(kayit); }
      if (kaydet()) { tazele(); detay(m.id); bildir('Ziyaret kaydedildi.'); }
    };
    kutu.scrollIntoView({ block: 'nearest' });
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
  function girisEkrani() {
    var g = $('#giris'), ilk = !kullanicilar.length;
    document.body.classList.add('kilitli');
    g.hidden = false;
    if (!(window.crypto && crypto.subtle)) {
      g.innerHTML = '<div class="login"><h2>Güvenli bağlantı gerekli</h2><p>Giriş için sayfayı https:// adresinden açın.</p></div>';
      return;
    }
    g.innerHTML = '<form class="login f" id="gf" autocomplete="off"><span class="mark" aria-hidden="true">S</span><h2>SİYA</h2>' +
      '<p class="sub">' + (ilk ? 'İlk kurulum: yönetici hesabını oluşturun' : 'Güzellik &amp; Kuaför · Giriş') + '</p>' +
      (ilk ? '<label for="g-ad">Ad Soyad</label><input id="g-ad" required maxlength="60">' : '') +
      '<label for="g-k">Kullanıcı adı</label><input id="g-k" required maxlength="30" autocapitalize="none" autocomplete="username">' +
      '<label for="g-s">Şifre</label><input id="g-s" type="password" required autocomplete="' + (ilk ? 'new-password' : 'current-password') + '">' +
      (ilk ? '<label for="g-s2">Şifre (tekrar)</label><input id="g-s2" type="password" required autocomplete="new-password">' : '') +
      '<p class="err" id="g-err" hidden></p><button class="btn primary" type="submit">' + (ilk ? 'Hesabı Oluştur' : 'Giriş Yap') + '</button>' +
      (ilk ? '<p class="hint">Bu hesap yöneticidir: fiyatları ve diğer kullanıcıları yönetir. Şifrenizi unutmayın; unutulursa bu cihazda sıfırlanamaz.</p>' : '') + '</form>';
    function hata(t) { var e = $('#g-err'); e.textContent = t; e.hidden = false; }
    $('#gf').onsubmit = function (e) {
      e.preventDefault();
      var kadi = tr($('#g-k').value.trim()), sifre = $('#g-s').value;
      if (ilk) {
        var ad = $('#g-ad').value.trim();
        if (!/^[a-z0-9._-]{3,30}$/.test(kadi)) return hata('Kullanıcı adı 3–30 karakter; harf, rakam, nokta, tire ya da alt çizgi olabilir.');
        if (sifre.length < 6) return hata('Şifre en az 6 karakter olmalı.');
        if (sifre !== $('#g-s2').value) return hata('Şifreler aynı değil.');
        kullaniciYap(kadi, ad, sifre, 'yonetici').then(function (u) {
          kullanicilar.push(u); kaydetKul(); oturumAc(u);
        });
        return;
      }
      var u = kullanicilar.filter(function (x) { return x.kullanici === kadi; })[0];
      if (!u || u.aktif === false) { hashle(sifre, '00'.repeat(16)).then(function () { hata('Kullanıcı adı ya da şifre hatalı.'); }); return; }
      hashle(sifre, u.tuz).then(function (h) {
        if (h !== u.hash) return hata('Kullanıcı adı ya da şifre hatalı.');
        oturumAc(u);
      });
    };
    setTimeout(function () { $(ilk ? '#g-ad' : '#g-k').focus(); }, 30);
  }
  function oturumAc(u) {
    oturum = u;
    try { sessionStorage.setItem(OTURUM_KEY, u.id); } catch (e) { /* oturum kalıcı olmaz */ }
    $('#giris').hidden = true; $('#giris').innerHTML = '';
    document.body.classList.remove('kilitli');
    if (!location.hash) location.hash = '#/pano';
    kapat(); render();
  }
  function cikis() {
    try { sessionStorage.removeItem(OTURUM_KEY); } catch (e) { /* yok */ }
    oturum = null; kapat(); $('#app').innerHTML = ''; girisEkrani();
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
      '<p>Kayıtlar yalnızca bu tarayıcıda durur. Yedek müşterileri ve fiyat listesini içerir; kullanıcı hesapları yedeğe girmez. Tarayıcı verisi silinirse kaybolur; bu yüzden düzenli yedek alın.</p>' +
      '<div class="sec">Dışa aktar</div><div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn primary" id="y-json" type="button">Yedek dosyası (.json)</button>' +
      '<button class="btn" id="y-csv" type="button">Excel için liste (.csv)</button></div>' +
      '<div class="sec">İçe aktar</div><p>Daha önce aldığınız yedek dosyasını seçin. Aynı kayıtlar güncellenir, yenileri eklenir; mevcut kayıt silinmez.</p>' +
      '<button class="btn" id="y-ice" type="button">Yedek dosyası seç…</button></div>');
    $('#y-json').onclick = function () {
      ayarlar.sonYedek = new Date().toISOString(); kaydetAyar(); render();
      indir('siya-yedek-' + bugun() + '.json', JSON.stringify({ uygulama: 'siya', surum: 2, tarih: new Date().toISOString(), musteriler: db, hizmetler: hizmetler }, null, 2), 'application/json');
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
        kaydet(); tazele(); kapat();
        bildir(yeni + ' yeni, ' + guncel + ' güncellenen müşteri aktarıldı.');
      } catch (err) { bildir('Dosya okunamadı: geçerli bir SİYA yedeği değil.'); }
    };
    r.readAsText(f);
  });

  function baslat() {
    temaUygula();
    document.body.classList.add('kilitli');
    var id = null;
    try { id = sessionStorage.getItem(OTURUM_KEY); } catch (e) { /* yok */ }
    var u = kullanicilar.filter(function (x) { return x.id === id && x.aktif !== false; })[0];
    if (u && window.crypto && crypto.subtle) oturumAc(u); else girisEkrani();
  }
  baslat();
})();
