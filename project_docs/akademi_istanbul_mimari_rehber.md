# Akademi Istanbul: Büyük Ölçekli Web Uygulama Mimarisi, Güvenlik ve Optimizasyon Rehberi

Bu teknik doküman, **Akademi Istanbul** projesi örneğinde büyük web uygulamalarının nasıl yapılandırıldığı, güvenliğinin nasıl sağlandığı, performans optimizasyonlarının nasıl yapıldığı ve tekrar eden kod bloklarından kaçınmak için nasıl sade, hızlı ve doğru bir yapı kurulduğu konularını detaylı şekilde açıklar. Her aşama bir proje yöneticisi gözünden adım adım ele alınmış, hiçbir nokta atlanmamıştır.

## Proje Anayasası (Altın Kurallar)

### Güvenlik ve Zero Trust

- Her veri doğrulanmalı (input sanitizasyon)
- OAuth2, JWT, CSRF koruması aktif olmalı
- API seviyesinde RBAC uygulanmalı
- Tenant izolasyonu sağlanmalı (schema tabanlı tenancy önerilir)

### Ödeme Güvenliği

- `Idempotency-Key` ile çift ödeme engellenmeli
- `transaction.atomic()` ile bütün işlemler birlikte kaydedilmeli

### Clean Code Prensipleri

- DRY: Kod tekrarından kaçın
- SRP: Her modül tek sorumluluğa sahip olsun
- SOLID prensipleri genel olarak uygulanmalı

### Performans

- ORM için `select_related`, `prefetch_related` kullan
- Lazy loading, CDN, Redis cache gibi yaklaşımlar uygulanmalı
- Arka plan işlemleri Celery ile yürütülmeli

---

## Aşama Aşama Proje Planı

### FAZ 0: Foundation

- Monorepo (frontend/backend/infra)
- Docker Compose ile PostgreSQL, Redis, Celery, MinIO
- Django schema-based multitenancy (django-tenants)
- Modüler halinde backend/React frontend iskeleti

### FAZ 1: Auth & Tenant

- Subdomain bazlı tenant resolver middleware
- User model + role + tenant
- JWT auth, refresh token
- Aktivasyon kodu ile tenant atanması
- React Context: AuthProvider + TenantProvider

### FAZ 2: LMS

- Course > Module > Lesson model hiyerarşisi
- Polymorphic content yapısı (video, pdf, test vb.)
- Video asenkron optimize (FFmpeg, Celery)
- Video izleme takibi
- Studio takvim rezervasyonu
- React video player, ders listesi

### FAZ 3: Sınav & Sertifika

- Quiz, Question, Attempt modeli
- useTabSecurity hook (sekme değişimi kontrolü)
- Sertifika PDF + QR Code (WeasyPrint, reportlab)
- Zamanlı quiz arayüzü (React Router + timer)

### FAZ 4: Realtime

- Django Channels + Daphne (ASGI)
- Zoom API Server-to-Server OAuth
- WebSocket chat/notification consumer
- React WebSocket context

### FAZ 5: Commerce

- Idempotency Redis decorator
- Ödeme API (Stripe/Iyzico + `transaction.atomic()`)
- Dinamik JSON form (Application model)
- Sepet/checkout arayüzü + spinner + disabled button

### FAZ 6: Veri & Raporlama

- Audit log (ElasticSearch + Celery sinyali)
- Gece ETL batch (raporlar, user metrics)
- Kariyer eşleştirme algoritması
- Dashboard: React + Recharts

### FAZ 7: Deploy & CI/CD

- Locust ile yük testi (`Idempotency-Key` testi)
- OWASP ZAP ile sızma testi
- CDN: S3 + Vite çıktılarını CDN'e yükleme
- GitHub Actions ile test + deploy pipeline

---

## Ekstra Notlar

- Django REST Framework ile auth ve permissions merkezi yönetilir
- Vite + Tailwind ile çok hızlı React geliştirme deneyimi sağlanır
- Redis, Celery, Docker yapısı yerelleşmeden önce mutlaka test edilmelidir

---

Bu doküman, sıfırdan profesyonel bir SaaS projesi inşa etmek isteyen yazılımcılara yön vermesi için hazırlandı. Her faz, sektörde kabul görümüş en iyi uygulamalar, örnek mimariler ve deneyime dayalı gözlemlerle desteklenmiştir.

