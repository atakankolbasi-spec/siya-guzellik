# SİYA | Güzellik & Kuaför — Müşteri Kayıtları

Kurulum gerektirmeyen statik müşteri kayıt sayfası. Veriler tarayıcıda (localStorage) tutulur; düzenli olarak "Yedekle / Aktar" ile JSON yedeği alın.

Dosyalar: `index.html`, `siya.css`, `siya.js`, `siya.svg`. GitHub Pages: Settings > Pages > main / root.

## Özellikler

- **Fiyat listesi** (yönetici): işlemleri ve fiyatlarını belirleyin; ziyarette işlem seçilince tutar otomatik yazılır (elle değiştirilebilir). Fiyat değişikliği geçmiş ziyaretleri etkilemez.
- **Kullanıcılar**: ilk açılışta yönetici hesabı kurulur; yönetici personel hesapları açar. Personel müşteri ve ziyaret ekler/düzenler; silme, fiyat listesi, ciro ve yedekleme yöneticiye aittir.
- Giriş şifreleri tarayıcıda PBKDF2 ile özetlenerek saklanır. Veriler sunucuda olmadığı için bu giriş, ortak bilgisayarda kayıtları kötü niyetli birinden korumaz; gerçek güvenlik için sonraki adım Supabase'tir.
