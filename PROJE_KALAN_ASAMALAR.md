# 🚧 Akademi İstanbul - Kalan Aşamalar ve Kurallar

Bu dosya, projenin tamamlanması için gereken kalan adımları ve her adımda uyulması gereken **Altın Kuralları** içerir.

## 🎨 Faz 8: Frontend Entegrasyonu (Sıradaki İş)

Backend API'leri hazır. Şimdi React arayüzlerinin bu API'lere bağlanması gerekiyor.

### 8.1. Kimlik ve Kurum UI
- [ ] **Tenant Resolver**: Frontend açıldığında subdomain'e göre logoyu ve renkleri değiştiren `TenantProvider` yazılacak.
- [ ] **Login/Register**: JWT token alıp `localStorage`'da saklayan ve `axios` interceptor ile her isteğe ekleyen yapı kurulacak.
- [ ] **Kural**: Kullanıcı rolü (`IsInstructor` vb.) sadece UI'da değil, Backend'den gelen veriyle doğrulanmalı.

### 8.2. LMS (Eğitim) UI
- [ ] **Video Player**: Kaldığı yerden devam eden, izleme oranını backend'e raporlayan player bileşeni.
- [ ] **Kural**: Video %90 izlenmeden "Sonraki Ders" butonu aktif olmamalı (Backend kontrolü şart).
- [ ] **Ders Listesi**: Accordion yapısında Modül > Ders listesi.

### 8.3. Sınav Arayüzü
- [ ] **Sınav Modu**: Tam ekran, geri sayım sayacı olan sınav arayüzü.
- [ ] **Güvenlik Hook'u**: `useTabSecurity` hook'u ile sekme değişimi ve copy-paste engellenecek.
- [ ] **Kural**: Sınav bittiğinde sonuç anında gösterilmeli ve sertifika indirilebilir olmalı.

### 8.4. Realtime Sohbet
- [ ] **WebSocket Bağlantısı**: Ders sayfasında sağ altta açılan sohbet penceresi.
- [ ] **Kural**: Bağlantı koptuğunda otomatik tekrar bağlanmalı (Reconnection logic).

### 8.5. Ödeme ve Sepet
- [ ] **Sepet Sayfası**: Seçilen kursların özeti.
- [ ] **Ödeme Formu**: Iyzico iframe veya formu entegrasyonu.
- [ ] **Kural (KRİTİK)**: "Öde" butonuna basıldığında buton `disabled` olmalı ve `Idempotency-Key` header ile gönderilmeli. Çift çekim kesinlikle engellenmeli.

## 🧪 Faz 9: Test ve Güvenlik

### 9.1. Yük Testi (Load Testing)
- [ ] **Locust**: Ödeme ve Sınav sayfalarına anlık 1000+ kullanıcı simülasyonu.
- [ ] **Hedef**: "Race Condition" (Yarış durumu) olup olmadığı kontrol edilecek.

### 9.2. Güvenlik Taraması
- [ ] **OWASP ZAP**: Otomatik güvenlik taraması çalıştırılacak.
- [ ] **Kontrol**: SQL Injection, XSS ve CSRF açıklarına bakılacak.

## 🚀 Faz 10: Deploy ve CI/CD

### 10.1. CI/CD Pipeline
- [ ] **GitHub Actions**: Her `push` işleminde testleri çalıştıran ve Docker imajlarını build eden pipeline.
- [ ] **Kural**: Testler geçmeden `main` branch'e merge yapılamaz.

### 10.2. Production Ortamı
- [ ] **Nginx**: Reverse Proxy ve SSL (Let's Encrypt) ayarları.
- [ ] **CDN**: Statik dosyaların (CSS, JS, Resimler) CDN üzerinden sunulması.
- [ ] **Secret Management**: `.env` dosyalarının sunucuda güvenli yönetimi.

---

## ⚠️ Genel Geliştirme Kuralları (Hatırlatma)

1.  **Zero Trust**: Frontend'deki hiçbir veriye güvenme. Her şeyi Backend'de tekrar doğrula.
2.  **Clean Code**: Tekrar eden kodları (`DRY`) bileşenlere veya hook'lara taşı.
3.  **Performans**: Gereksiz `re-render`lardan kaçın (`useMemo`, `useCallback`). Büyük kütüphaneleri `lazy load` ile yükle.
4.  **Estetik**: UI tasarımı "Premium" hissettirmeli. Animasyonlar ve geçişler akıcı olmalı.
