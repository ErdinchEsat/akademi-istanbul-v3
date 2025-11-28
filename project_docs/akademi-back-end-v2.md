🗓️ AŞAMA AŞAMA GELİŞTİRME PLANI
🏗️ FAZ 0: THE FOUNDATION (Altyapı ve Çekirdek)
Amaç: Sağlam, ölçeklenebilir ve çok kiracılı mimariyi ayağa kaldırmak.

[x] 0.1. Docker Ortamının Kurulumu:

PostgreSQL 15+ (Optimize edilmiş konfigürasyon ile).

Redis 7 (Cache ve Broker için ayrı instancelar).

MinIO (Local S3 simülasyonu).

Celery Worker & Beat kurulumu.

[x] 0.2. Django Proje İskeleti & Multi-tenancy:


django-tenants kurulumu.


Shared (Public) ve Tenant şemalarının ayrılması.

Tenant Model: Client (Belediye/Kurum) modeli oluşturulması (Logo, renk, domain config).

Domain Model: Alt alan adlarının (umraniye.akademi.istanbul) yönlendirilmesi.

[x] 0.3. Temel Güvenlik Katmanı:

CORS, X-Frame-Options, HSTS ayarları.

Rate Limiting (Throttling) altyapısının kurulması (DDoS koruması için).

🔐 FAZ 1: IDENTITY & ACCESS (Kimlik ve Yetki)
Amaç: Güvenli giriş, izolasyon ve KVKK uyumu.

[x] 1.1. Custom User Model & RBAC:

AbstractUser üzerinden özelleştirilmiş model.

Rol Sistemi: GlobalAdmin, TenantAdmin, Instructor, Student.

Kullanıcı verilerinin şifreli alanlarda tutulması (KVKK).

[x] 1.2. Authentication (Auth Service):

JWT implementasyonu (SimpleJWT).

Refresh Token rotasyonu (Güvenlik için).


Aktivasyon Kodu Sistemi: Kullanıcı giriş yaptıktan sonra eğitim tanımlama (LMS Fazında test edilecek).


Entegrasyon Testi: React login formu -> JWT alımı -> Token ile korumalı route'a erişim.

[ ] 1.3. E-Devlet & SSO Hazırlığı:

OAuth2 altyapısının kurulması.

E-Devlet entegrasyonu için "Placeholder" servis yapısı (Mock data ile).

- [x] 1.4. Audit Logging (Denetim İzi): <!-- id: 6 -->

AuditLog modelinin oluşturulması (Kim, Ne Zaman, Ne Yaptı?).

Middleware yazılarak kritik işlemlerin (Silme, Güncelleme) otomatik loglanması.

📚 FAZ 2: LMS ENGINE & MEDIA (Eğitim Motoru)
Amaç: İçerik sunumu ve video optimizasyonu.

- [x] 2.1. Kurs Hiyerarşisi:

    - [x] Modeller: Category -> Course -> Module -> Lesson.

    - [x] django-polymorphic ile Lesson tipleri: VideoLesson, DocumentLesson, QuizLesson, HTMLLesson, LiveLesson, Assignment.
    
    - [x] Polymorphic serializers ve ViewSet'ler (create/update type conversion).

- [x] 2.2. Video Transcoding Pipeline (Kritik Performans):

    - [x] Video yükleme API'si (Chunked Upload - FileField ile temel destek sağlandı).

    - [x] Celery Task: Yüklenen videoyu FFmpeg ile HLS (.m3u8) formatına çevir.

    - [x] CDN Entegrasyon simülasyonu (S3/MinIO public link - Yerel medya ile simüle edildi).
    
    - [x] YouTube embed video desteği (video_url field).

- [x] 2.3. Ders Materyali Yönetimi (Document Management):

    - [x] DocumentLesson modeli (PDF/DOCX/XLSX desteği).
    
    - [x] File type ve size auto-detection.
    
    - [x] 5MB file size limit validation.
    
    - [x] Media file serving (DEBUG mode).
    
    - [x] Frontend: Multi-format upload UI (.pdf, .docx, .xlsx).
    
    - [x] Frontend: CoursePlayer document download with file info display.

- [ ] 2.4. İlerleme Takibi (Progress Tracking):

    LessonProgress modeli.

    Video izleme süresinin saniyelik takibi ve backend'e "Heartbeat" gönderimi.

    Entegrasyon Testi: React Video Player yüklemesi -> İzleme -> Progress % güncellemesi.

- [ ] 2.6. Stüdyo Rezervasyon Modülü:

    İçerik üreticileri için takvim ve rezervasyon sistemi.

- [ ] 2.7. Aktivasyon Kodu Testi (LMS Entegrasyonu):

    Belediye kodunun girilmesi ve ilgili eğitimlerin hesaba tanımlanmasının uçtan uca testi.


📝 FAZ 3: ASSESSMENT & CERTIFICATION (Ölçme ve Değerlendirme)
Amaç: Sınav güvenliği ve başarı belgelendirme.

[ ] 3.1. Soru Bankası (Question Bank):


Question modeli (Etiketli, Zorluk seviyeli, Kazanım odaklı).

Ortak Havuz vs. Kurum Havuzu ayrımı (Public schema vs Tenant schema).

[ ] 3.2. Sınav Motoru (Quiz Engine):

Sınav oluşturma (Süre, Karıştırma, Rastgele soru seçimi).

Attempt modeli (Öğrenci denemesi).


Güvenlik: Sekme değiştirme (Tab visibility) loglama API'si.

[ ] 3.3. Sertifika Üretimi:

Başarılı olanlar için PDF oluşturma (WeasyPrint).

QR Kod ve Doğrulama Linki ekleme.

Entegrasyon Testi: Sınavı bitir -> Skoru gör -> Sertifikayı indir.

💬 FAZ 4: REALTIME & INTERACTION (Canlı Etkileşim)
Amaç: WebSocket ile anlık iletişim.

[ ] 4.1. ASGI & Django Channels:

Daphne sunucusu konfigürasyonu.

Redis Channel Layer kurulumu.

[ ] 4.2. Bildirim Sistemi:

Anlık bildirimler (Sınav başladı, Ödev notlandı).

Sohbet sistemi (Eğitmen - Öğrenci veya Sınıf Grubu).

[ ] 4.3. Canlı Ders Entegrasyonu:

Zoom/BBB API Wrapper yazılması.

Ders linklerinin oluşturulması ve katılım raporlarının (Webhook) işlenmesi.

💳 FAZ 5: COMMERCE & INTEGRATIONS (Ticaret ve Dış Sistemler)
Amaç: Gelir modeli ve kurumsal entegrasyonlar.

[ ] 5.1. Sepet ve Sipariş Yönetimi:

Cart, Order, OrderItem modelleri.

Idempotency: Çift ödemeyi önlemek için Idempotency-Key header kontrolü (Redis ile).

[ ] 5.2. Ödeme Entegrasyonu:

Iyzico / PayTR API entegrasyonu.

transaction.atomic() kullanımı (Para çekildi ama sipariş oluşmadı hatasına son).

E-Fatura tetikleme servisi.


[ ] 5.3. Kariyer Merkezi ve Başvurular:

İş ilanları ve Staj eşleştirme algoritmaları.

Başvuru formları (Dinamik JSON Field yapısı).

🧠 FAZ 6: DATA, ANALYTICS & SEARCH (Veri ve Raporlama)
Amaç: Performans izleme ve arama motoru.

[ ] 6.1. Elasticsearch Entegrasyonu:

django-elasticsearch-dsl ile Kurs ve İçerik indeksleme.

Full-text search API'si.

[ ] 6.2. Raporlama (ETL):

Gece çalışan Celery Beat görevleri: Günlük özet tabloları oluşturma.

Eğitmen, Kurum ve Öğrenci panoları için optimize edilmiş JSON çıktıları.

[ ] 6.3. Sistem Sağlığı ve Monitoring:

Prometheus & Grafana için metrik endpoint'leri.

Sentry entegrasyonu (Hata takibi).

🛠️ TEKNİK STANDARTLAR VE CHECKLIST
Geliştirici her Pull Request (PR) açtığında şunları kontrol etmelidir:

[ ] Code Quality: Kod ruff veya flake8 ile lint edildi mi?

[ ] Security: Hassas veriler loglanmadı değil mi? SQL Injection riski var mı?

[ ] Performance: Döngü içinde veritabanı sorgusu var mı? (N+1)

[ ] Testing: Yazılan modülün Unit Testleri (%80 coverage) ve Frontend entegrasyon testi yapıldı mı?

[ ] Cleanup: print() ifadeleri, yorum satırı halindeki kodlar silindi mi?