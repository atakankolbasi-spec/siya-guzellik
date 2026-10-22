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
  var HIZ_KEY = 'siya.hizmetler.v1', KUL_KEY = 'siya.kullanicilar.v1', OTURUM_KEY = 'siya.oturum';
  var ODEMELER = ['Nakit', 'Kredi Kartı', 'Havale / EFT'];
  var GUN_RISK = 60;

  var db = yukle();
  var hizmetler = yukleHiz();
  var kullanicilar = yukleKul();
  var oturum = null;
  var durum = { ara: '', filtre: 'hepsi', sirala: 'ad' };
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

  /* ---------- liste ---------- */
  function ozet() {
    var ay = bugun().slice(0, 7), ayZiyaret = 0, ayCiro = 0, yaklasan = 0, risk = 0;
    db.forEach(function (m) {
      (m.ziyaretler || []).forEach(function (z) {
        if ((z.tarih || '').slice(0, 7) === ay) { ayZiyaret++; ayCiro += Number(z.tutar) || 0; }
      });
      var d = sonrakiDogum(m.dogum); if (d !== null && d <= 30) yaklasan++;
      if (riskli(m)) risk++;
    });
    var kart = function (baslik, deger, alt, renk) {
      return '<div class="stat" style="--c:' + renk + '"><small>' + baslik + '</small><b>' + deger + '</b><span>' + alt + '</span></div>';
    };
    $('#stats').innerHTML =
      kart('Toplam Müşteri', db.length, db.filter(function (m) { return m.vip; }).length + ' VIP müşteri', '#b76e79') +
      kart('Bu Ay Ziyaret', ayZiyaret, 'İşlem yapılan randevu', '#b8935a') +
      (yonetici() ? kart('Bu Ay Ciro', para(ayCiro), 'Kayıtlı işlemlerden', '#3f8f6b') : '') +
      kart('Yaklaşan Doğum Günü', yaklasan, 'Önümüzdeki 30 gün', '#9a5560') +
      kart('Uzun Süredir Gelmeyen', risk, GUN_RISK + '+ gündür ziyaret yok', '#c27a2c');
  }
  function riskli(m) {
    var f = gunFarki(sonZiyaret(m));
    return f !== null && f >= GUN_RISK;
  }
  var FILTRELER = [
    ['hepsi', 'Tümü', function () { return true; }],
    ['vip', 'VIP', function (m) { return m.vip; }],
    ['dogum', 'Doğum günü yakın', function (m) { var d = sonrakiDogum(m.dogum); return d !== null && d <= 30; }],
    ['risk', GUN_RISK + '+ gün gelmeyen', riskli],
    ['alerji', 'Alerji notlu', function (m) { return !!(m.alerji && m.alerji.trim()); }]
  ];
  function aramaMetni(m) {
    return tr([m.ad, m.tel, m.eposta, m.not, m.alerji].concat((m.ziyaretler || []).map(function (z) {
      return (z.hizmetler || []).join(' ') + ' ' + (z.personel || '') + ' ' + (z.not || '');
    })).join(' '));
  }
  function liste() {
    var q = tr(durum.ara).trim();
    var f = FILTRELER.filter(function (x) { return x[0] === durum.filtre; })[0];
    var sirali = db.filter(function (m) { return f[2](m) && (!q || aramaMetni(m).indexOf(q) > -1 || telTemiz(m.tel).indexOf(telTemiz(q)) > -1 && telTemiz(q)); });
    var cmp = {
      ad: function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); },
      son: function (a, b) { return sonZiyaret(b).localeCompare(sonZiyaret(a)); },
      harcama: function (a, b) { return toplam(b) - toplam(a); },
      ziyaret: function (a, b) { return (b.ziyaretler || []).length - (a.ziyaretler || []).length; },
      yeni: function (a, b) { return (b.olusturma || '').localeCompare(a.olusturma || ''); }
    }[durum.sirala];
    sirali.sort(cmp);

    $('#filtreler').innerHTML = FILTRELER.map(function (x) {
      var n = db.filter(x[2]).length;
      return '<button type="button" class="chip" data-f="' + x[0] + '" aria-pressed="' + (durum.filtre === x[0]) + '">' +
        esc(x[1]) + '<span class="n">' + n + '</span></button>';
    }).join('');

    if (!sirali.length) {
      $('#liste').innerHTML = db.length
        ? '<div class="bos"><div class="big">Sonuç bulunamadı</div>Arama ya da filtreyi değiştirmeyi deneyin.</div>'
        : '<div class="bos"><div class="big">Henüz müşteri kaydı yok</div>İlk müşterinizi eklemek için “+ Yeni Müşteri” düğmesine basın.</div>';
      return;
    }
    $('#liste').innerHTML = sirali.map(function (m) {
      var son = sonZiyaret(m), fark = gunFarki(son), rozet = '';
      if (m.vip) rozet += '<span class="tag vip">★ VIP</span>';
      var d = sonrakiDogum(m.dogum);
      if (d !== null && d <= 30) rozet += '<span class="tag dogum">' + (d === 0 ? 'Bugün doğum günü' : '🎂 ' + d + ' gün') + '</span>';
      if (m.alerji && m.alerji.trim()) rozet += '<span class="tag alerji">Alerji</span>';
      if (riskli(m)) rozet += '<span class="tag risk">' + fark + ' gün</span>';
      return '<button type="button" class="row" data-id="' + esc(m.id) + '">' +
        '<span class="avatar" style="' + renkler(m.ad) + '">' + esc(bas(m.ad)) + '</span>' +
        '<span class="who"><b>' + esc(m.ad) + rozet + '</b><small>' + esc(m.tel || 'Telefon yok') + '</small>' +
        '<small class="mob">' + (son ? 'Son: ' + tarihGoster(son) + ' · ' : '') + para(toplam(m)) + '</small></span>' +
        '<span class="cell c2"><small>Son ziyaret</small><b>' + (son ? tarihGoster(son) : '—') + '</b></span>' +
        '<span class="cell c3"><small>Ziyaret</small><b>' + (m.ziyaretler || []).length + '</b></span>' +
        '<span class="cell c4"><small>Toplam harcama</small><b>' + para(toplam(m)) + '</b></span>' +
        '<span class="arrow" aria-hidden="true">›</span></button>';
    }).join('');
  }
  function tazele() { ozet(); liste(); }

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
    setTimeout(function () { $('#f-ad').focus(); }, 30);
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
          return '<label data-ad="' + esc(tr(h.ad)) + '"><input type="checkbox" value="' + esc(h.ad) + '" data-fiyat="' + h.fiyat + '"' + (secili.indexOf(h.ad) > -1 ? ' checked' : '') + '><span>' +
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
        return { ad: c.value, fiyat: Number(c.getAttribute('data-fiyat')) || 0 };
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
      if (ek && !ks.some(function (k) { return k.ad === ek; })) ks.push({ ad: ek, fiyat: Math.max(0, Number($('#z-of').value) || 0) });
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
        if (kaydetHiz()) { kapat(); bildir('Fiyat listesi kaydedildi.'); }
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
    Array.prototype.forEach.call(document.querySelectorAll('[data-yonetici]'), function (el) { el.hidden = !yonetici(); });
    $('#btn-hesap').textContent = u.ad + (yonetici() ? ' · Yönetici' : '');
    durum.ara = ''; $('#ara').value = '';
    kapat(); tazele();
  }
  function cikis() {
    try { sessionStorage.removeItem(OTURUM_KEY); } catch (e) { /* yok */ }
    oturum = null; kapat(); girisEkrani();
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

  /* olaylar */
  $('#btn-yeni').onclick = function () { musteriForm(); };
  $('#btn-yedek').onclick = yedekEkrani;
  $('#btn-fiyat').onclick = fiyatEkrani;
  $('#btn-kul').onclick = kullaniciEkrani;
  $('#btn-hesap').onclick = function () { if (oturum) hesapEkrani(); };
  $('#ara').addEventListener('input', function (e) { durum.ara = e.target.value; liste(); });
  $('#sirala').addEventListener('change', function (e) { durum.sirala = e.target.value; liste(); });
  $('#filtreler').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    durum.filtre = b.getAttribute('data-f'); liste();
  });
  $('#liste').addEventListener('click', function (e) {
    var r = e.target.closest('[data-id]'); if (r) detay(r.getAttribute('data-id'));
  });

  function baslat() {
    document.body.classList.add('kilitli');
    var id = null;
    try { id = sessionStorage.getItem(OTURUM_KEY); } catch (e) { /* yok */ }
    var u = kullanicilar.filter(function (x) { return x.id === id && x.aktif !== false; })[0];
    if (u && window.crypto && crypto.subtle) oturumAc(u); else girisEkrani();
  }
  baslat();
})();
