# İpek Gold — GitHub Pages

Depo: ipekgoldcafebistro/ipekgoldcafebistro.github.io

1. github-upload klasörünün içeriğini depo köküne yükleyin. Klasörün kendisini veya ZIP dosyasını yüklemeyin.
2. .github/workflows/deploy.yml dosyasının depoda bulunduğunu kontrol edin. Gizli klasör yüklenmediyse GitHub Add file > Create new file üzerinden bu tam adla oluşturup yerel dosyanın içeriğini yapıştırın.
3. Settings > Pages > Source: GitHub Actions.
4. Repository secrets: VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY.
5. main dalına commit sonrasında Actions ekranından yayını kontrol edin.

Site: https://ipekgoldcafebistro.github.io/
Yönetim: https://ipekgoldcafebistro.github.io/admin/login/

## Veritabanı adımı henüz tamamlanmadı

Giriş artık Supabase Auth e-posta ve şifresi kullanır. Eski sabit kullanıcı adı/şifre kaldırıldı.
Supabase üzerinde yönetici kullanıcısı oluşturulmalı; menu_data tablosunun RLS kuralları herkesin menüyü okumasına, yalnızca belirlenen yönetici UID'sinin ekleme ve güncelleme yapmasına izin vermelidir. Mevcut tablo ve politikalar incelenmeden üzerine SQL çalıştırılmamalıdır.
İlk canlı testte okuma, yetkisiz yazmanın reddi, yönetici girişi ve bir değişikliğin başka cihazda görünmesi doğrulanmalıdır.

Yerel derleme: npm ci ardından npm run build.
GitHub Pages özel düzenleme URL'lerinde 404.html uygulamayı açar; bu URL'lerde sunucunun HTTP durumu 404 kalabilir. Ana yönetim sayfaları için gerçek index.html dosyaları üretilir.
Yayın akışı: https://vite.dev/guide/static-deploy
