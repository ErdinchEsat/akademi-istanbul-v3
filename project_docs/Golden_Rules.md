# 🏛️ AKADEMİ İSTANBUL - PROJE ANAYASASI VE UYGULAMA PLANI

Bu doküman, **Akademi İstanbul Eğitim Yönetim Sistemi (LMS)** projesinin teknik mimarisini, kodlama standartlarını ve adım adım uygulama planını içerir. 

**GÖREV:** Aşağıdaki kurallara ve fazlara sadık kalarak, Service-Oriented Modular Monolith mimarisinde, yüksek performanslı ve güvenli bir LMS platformu kodlanacaktır.

---

## 🚨 BÖLÜM 1: ALTIN KURALLAR (GOLDEN RULES)
*Kod yazarken bu kurallar tartışmaya kapalıdır. Her satır kod bu süzgeçten geçmelidir.*

### 1. 🛡️ Güvenlik ve "Zero-Trust" Yaklaşımı
* **OWASP Top 10:** SQL Injection, XSS ve CSRF açıklarına karşı tüm inputlar sanitize edilecektir. Django ORM ve React'in yerleşik korumaları devre dışı bırakılmamalıdır.
* **RBAC (Rol Tabanlı Erişim):** Her API isteğinde kullanıcının rolü (`IsInstructor`, `IsAdmin` vb.) ve Tenant'ı (`request.tenant`) kontrol edilecektir. Asla sadece UI'da butonu gizleyerek güvenlik sağlanmaz; Backend kontrolü şarttır.
* **Hassas Veri:** Şifreler, API anahtarları ve kişisel veriler (PII) asla loglara veya git reposuna "hard-coded" yazılmayacaktır. `.env` ve Secrets Management kullanılacaktır.

### 2. 💳 Ödeme Güvenliği ve Idempotency (KRİTİK)
* **Çifte Ödeme Engelleme:** Ödeme endpointlerinde **"Idempotency Key"** (Benzersiz İşlem Anahtarı) zorunludur.
    * Frontend, "Öde" butonuna basıldığında bir UUID üretir ve header ile gönderir.
    * Backend, bu UUID ile gelen isteği Redis'e kaydeder.
    * Aynı UUID ile 2. istek gelirse (ping, çift tıklama vb.), işlem yapılmadan önceki başarılı yanıt aynen dönülür.
* **Atomic Transactions:** Ödeme işlemi, veritabanı seviyesinde `transaction.atomic()` bloğu içinde yapılmalıdır. Ödeme başarılı dönmeden sipariş oluşmaz, sipariş oluşmadan bakiye düşmez.
* **Debounce/Throttle:** Frontend tarafında ödeme butonuna tıklandığı an buton `disabled` durumuna geçmeli ve yükleniyor animasyonu gösterilmelidir.

### 3. 🏗️ SOLID ve Clean Code Prensipleri
* **Single Responsibility (SRP):** Bir fonksiyon veya bileşen sadece tek bir iş yapmalıdır. 500 satırlık `views.py` dosyaları yasaktır; `services/`, `selectors/` katmanlarına bölünmelidir.
* **DRY (Don't Repeat Yourself):** Aynı kod bloğu iki kez yazıldıysa, hemen bir `utils` fonksiyonuna veya `shared component`e dönüştürülmelidir.
* **Dependency Injection:** Modüller birbirine sıkı sıkıya (tightly coupled) bağlanmamalıdır. Servisler birbirinden izole çalışabilmelidir.

### 4. 🚀 Performans ve Optimizasyon
* **N+1 Query Problemi:** Django tarafında `select_related` ve `prefetch_related` kullanılmadan ilişkisel veri çekilmeyecektir.
* **Frontend Optimizasyonu:** React bileşenleri gereksiz "re-render" olmamalıdır (`useMemo`, `useCallback` kullanımı). Görseller ve videolar "Lazy Load" ile yüklenecektir.
* **Caching:** Sık değişmeyen veriler (Kategoriler, Ayarlar) Redis üzerinde önbelleklenecektir.

### 5. 🧩 Modülerlik ve Klasör Yapısı
* Proje büyüdüğünde kaos oluşmaması için **Feature-Based** yapı bozulmayacaktır. Bir özelliğin (örn: Sınav) tüm dosyaları (API, UI, Hook, Utils) kendi klasörü altında duracaktır.

---

## 🗺️ BÖLÜM 2: SİSTEM MİMARİSİ

* **Mimari Tipi:** Service-Oriented Modular Monolith
* **Backend:** Python Django (DRF) + Celery + PostgreSQL + Redis
* **Frontend:** React (Vite) + TypeScript + Tailwind CSS
* **Altyapı:** Docker, Nginx, MinIO (S3), RabbitMQ

### Klasör Yapısı Özeti
```text
/apps (Backend Modülleri)      /src/features (Frontend Modülleri)
├── core (Auth, Tenant)  <---> ├── auth (Login, Register)
├── lms (Course, Quiz)   <---> ├── education (Course, Exam)
├── realtime (Chat)      <---> ├── community (Chat, Live)
├── commerce (Payment)   <---> ├── commerce (Cart, Invoice)
└── data (Logs, Career)  <---> ├── management (Stats, Logs)

📅 BÖLÜM 3: ADIM ADIM UYGULAMA PLANI (SPRINT TASLAĞI)
FAZ 0: Altyapı ve Temel Kurulum
Docker Orchestration: docker-compose.yml ile DB, Redis, Worker ve API servislerini ayağa kaldır.

Repo Setup: Monorepo yapısını kur, ESLint/Prettier ve PEP8 kurallarını zorunlu hale getir.

DB Schema: Multi-tenant (Schema-based veya Row-based) yapılandırmasını django-tenants ile yap.

FAZ 1: Kimlik, Kurum ve Erişim (Service 1)
Tenant Resolver: Gelen isteğin hangi belediyeye ait olduğunu anlayan Middleware'i yaz.

Auth API: JWT tabanlı Login/Register.

Aktivasyon Kodu Modülü: ActivationCode modelini ve doğrulama mantığını kur. (Belediye kartları için).

Frontend Auth: TenantProvider ile logoyu dinamik değiştir, LoginForm bileşenini kodla.

FAZ 2: Eğitim Motoru ve İçerik (Service 2)
Katalog Mimarisi: Course -> Module -> Lesson hiyerarşisini kur.

Polymorphic Content: Video, PDF ve Quiz içerik tiplerini destekle.

Stüdyo Rezervasyon: Eğitmenler için takvim tabanlı StudioBooking sistemi geliştir.

Progress Tracking: Video izleme oranını takip et, %90 izlenmeden geçişi engelle.

FAZ 3: Sınav ve Güvenlik
Quiz Engine: Soru bankası ve sınav oluşturma altyapısı.

Güvenlik Hook'u: React tarafında useTabSecurity yaz (Sekme değişirse sınavı kilitle/uyarı ver).

Sertifika: Kurs bitince otomatik PDF üreten servisi yaz.

FAZ 4: Realtime ve İletişim (Service 3)
WebSocket: Django Channels kur.

Zoom Entegrasyonu: Server-to-Server OAuth ile Zoom toplantısı oluşturan servisi yaz.

Chat UI: Canlı ders altında anlık sohbet bileşeni.

FAZ 5: Ticaret ve Başvurular (Service 5) - KRİTİK GÜVENLİK
Idempotency Layer: Ödeme butonuna tıklandığında backend'e Idempotency-Key header'ı gönderen yapıyı kur.

Payment API: Iyzico/Stripe entegrasyonu (Transaction Atomic).

Hibe Başvuruları: Dinamik form yapısı ile (JSONField) "Teknik Destek Başvurusu" modülünü kodla.

FAZ 6: Veri ve Analitik (Service 4)
Audit Logs: Kritik işlemleri ElasticSearch'e asenkron gönder.

ETL Jobs: Gece çalışan Celery taskları ile rapor tablolarını doldur (Dashboard'un hızlı açılması için).

FAZ 7: Deploy ve Hardening
Yük Testi: Locust ile ödeme ve sınav sistemine yük bindir, "Race Condition" var mı kontrol et.

CDN: Statik dosyaları CDN arkasına al.

CI/CD: Her push'ta testleri çalıştır.