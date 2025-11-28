Akademi İstanbul — Güncelleme Planı (Project Manager Scope)

Amaç: Mevcut projeyi bozmadan, SaaS çok-tenant, güvenli, ölçeklenebilir (1M kullanıcı hedefi) ve temiz-kod/solid prensiplerine uygun şekilde güncellemek. Her ana madde için Kontrol → Planlama → Uygulama → Test adımlarını verdim. Claude Sonnet 4.5 her maddeyi tamamladığında ilgili kutucuğu [ ] → [x] yapacak şekilde tasarlandı.

Nasıl kullanmalı

Her bir numaralı madde kendi başına bir teslimat (deliverable) olarak ele alınsın.

Her madde için aşağıdaki dört aşama tamamlanıp onaylandığında Claude kutucuğu işaretlesin.

Demo/Ücretli opsiyonlar ayrı alt-maddelerde verildi — önce demo, sonra pilot ve ölçeklendirme.

Genel teknik varsayımlar (tüm maddelere uygulanır)

Backend: Django + DRF (mevcut), DB: Postgres (Row Level Security tercih edilir).

Object storage: AWS S3 (veya GCS), CDN: CloudFront/Cloud CDN.

Queue: Celery + Redis veya managed alternatif.

Auth: JWT/Session + RBAC, tenant_id tüm sorgularda zorunlu.

Kod kalitesi: SOLID, single responsibility, temiz modüler servisler, unit/integration testleri, CI/CD.

Güvenlik: Principle of Least Privilege, signed URLs, audit logs, rate limiting, vulnerability scanning.

Madde 1 — Akademiler birbirinin ne yaptığını göremeyecek

 Claude kontrolü: Madde 1 tamamlandı

Kontrol

Mevcut kullanıcı ve tenant modelini incele (user → tenant ilişkisi).

Kontrol kriteri: Her sorgu tenant_id ile filtreleniyor mu? UI’da başka akademilerin herhangi bir içeriği görünmüyor mu?

Planlama

DB: tenant_id zorunlu alanı tüm content tablolarında (Course, Module, Lesson, Reservation vb.).

Postgres RLS kullanımı önerisi (Row-Level Security) — tenant izolasyonunu DB seviyesinde garanti eder.

Backend: tüm endpoint’lerde tenant bağlamı (middleware veya request-scoped context).

Frontend: tenant-aware routing; listeler tenant scope ile çekilsin.

Uygulama

Migration: tüm content tablolarına tenant_id ekle ve NOT NULL/foreign key.

RLS politika: CREATE POLICY tenant_isolation ON courses USING (tenant_id = current_setting('app.tenant_id')::int). (opsiyonel)

Middleware: her request için request.tenant_id set et (JWT veya subdomain-based tenant resolution).

Unit tests: tenant isolation testleri (A akademisi içeriği B akademisinde görünmüyor).

Frontend: API çağrılarına tenant param ekle, global store’da activeTenant sakla.

Test

Oturum açmış farklı tenant kullanıcıları ile manuel + otomatik test: veri izolasyonu doğrulanmalı.

Penetration test: tenant ID enjeksiyon senaryoları.

Performance test: RLS etkisini ölç.

Madde 2 — Her akademinin öğretmenleri, öğrencileri, akademi yöneticileri ayrı olacak

 Claude kontrolü: Madde 2 tamamlandı

Kontrol

Varsayılan roller kontrolü: user.role tek başına yeterli mi yoksa tenant-scoped role mı kullanılmalı?

Planlama

RBAC modeli: Role (student, teacher, academy_admin, coordinator, studio_manager vb.) + UserRole pivot tablosu (user_id, tenant_id, role_id).

Permissions: capability-based (create_course, create_lesson, grade_homework, book_studio...).

UI: Yönetici panelinde sadece tenant-admin kendi tenant kullanıcılarını yönetebilsin.

Uygulama

Modeller: Role, Permission, UserRole(tenant-scoped) oluştur.

Backend: permission decorator/middleware (e.g. @permission_required('courses.create')) .

Frontend: izin bazlı render (butonlar, menüler).

Sync: invite/accept flow (akademi yöneticisi kullanıcı ekleyip role atayabilsin).

Audit: role değişiklikleri loglanacak.

Test

Role matrix testleri: her rolün allowed/forbidden eylemleri otomatik testlerle doğrulanacak.

Edge: aynı kullanıcı farklı tenant’larda farklı roller alabiliyor mu? (Checked)

Madde 3 — Admin (sistem yöneticisi) hepsini kontrol edebilecek

 Claude kontrolü: Madde 3 tamamlandı

Kontrol

Superadmin kullanıcı tipi var mı? Global erişim kriterleri tanımlı mı?

Planlama

is_superadmin flag veya global_admin rolü. Global admin tüm tenant'ları görebilir, tüm operasyonları yapabilir.

UI: Superadmin dashboard — tenant management (create, disable, branding, billing).

Audit & security: superadmin aktiviteleri daha sık loglanıp 2FA gerektirebilir.

Uygulama

Superadmin modelleme ve ayrı admin-only endpoints.

Admin-only RBAC kontrolleri.

Tenant provisioning API: create/clone tenant (madde 9 ile ilişkili).

Billing & quota control (opsiyonel, ücretli seçeneklerde).

Test

Superadmin erişim testleri: tüm tenant verilere erişim, tenant create/delete.

Security: superadmin oturumunda 2FA enforced.

Madde 4 — Yeni kurs oluşturulunca sadece o akademinin kişiler görebilecek (sistem yöneticisi hariç)

 Claude kontrolü: Madde 4 tamamlandı

Kontrol

Course row’da tenant_id zorunlu mu? Course list API tenant scope ile mi çalışıyor?

Planlama

Course creation API: tenant_id otomatik olarak request tenant’ından alınır; kullanıcı farklı tenant için course yaratamaz.

Visibility: public/private flag (akademi içi paylaşım için default private).

Search: global search varsa tenant filter opsiyonu zorunlu.

Uygulama

Course model & serializer enforce tenant on create.

Endpoint: list endpoint tenant-scoped. Superadmin special flag ile tümünü çekebilir.

Frontend: course discovery sadece tenant içinde gösterilir.

Tests: cross-tenant access denial scenarios.

Test

Yeni course oluştur → diğer tenant kullanıcıları göremez (manual + automated).

Superadmin görür ve yönetir.

Madde 5 — Öğretmen ders oluşturamaz; sadece akademi yöneticisi ders oluşturabilir; öğretmen ödev/quiz ekleyebilir

 Claude kontrolü: Madde 5 tamamlandı

Kontrol

Mevcut role-permission map’ini kontrol et.

Planlama

Permission matrix:

academy_admin: create_course, create_module, create_lesson, assign_teacher

teacher: create_assignment, create_quiz, grade, schedule_live_class

student: submit_assignment, take_quiz

UI/UX: create course butonu sadece admin’e gösterilir; teacher için create assignment modal.

Uygulama

Backend permission checks: create course API only for academy_admin.

Frontend: buton/route guard.

Workflow: admin oluşturur → teacher assign edilir → teacher içerik üretir (ödev/quiz) ve module’e ekler.

Notification: teacher assign edildikten sonra bildirim/email gider.

Test

Role-specific endpoint tests (teacher cannot create course).

Integration: admin creates course → teacher assigned → teacher adds assignment.

Madde 6 — Sisteme video yüklendi, wizard içinde sil işlemi yapılırsa video her yerden kaldırılacak

 Claude kontrolü: Madde 6 tamamlandı

Kontrol

Mevcut silme akışı: DB kaydı siliniyor mu? Dosya fiziksel olarak siliniyor mu?

Planlama

Soft-delete + background physical-delete job.

Eğer kullanıcı wizard içinde “sil” yaparsa:

Lesson rekord soft-delete (deleted_at set)

Enqueue job: S3 object delete, CDN invalidation, related thumbnails/artifacts sil.

Job success → hard-delete log. Fail → retry / alert.

Transactional guarantee: DB delete ve job enqueue atomik olmalı (outbox pattern veya transaction + post-commit hook).

Uygulama

Soft-delete implementation (django-soft-delete veya custom).

Outbox pattern: delete event kaydı → worker tarafından işlenir.

Worker: delete S3 key(s), invalidate CDN, delete thumbnails, remove DB associations.

File lifecycle: S3 lifecycle rules for retention (eğer isteniyorsa).

Test

Silme işlemi sonrası tüm referansların (db, s3, cdn cache) temizlendiğini doğrula.

Fail senaryosu: job başarısız olursa rollback policy / alert.

Madde 7 — Ders silindiyse o derse ait her şey silinecek (ilişkisel DB önerisi)

 Claude kontrolü: Madde 7 tamamlandı

Kontrol

Mevcut foreign-key on_delete davranışlarını incele.

Planlama

İlişkisel DB (Postgres) tercih et → foreign key + cascade / on delete.

Ancak fiziksel dosyalar cascade ile otomatik gitmez → soft-delete + background job.

Entities to cascade: Module → Lessons → Attachments (video/doc) → Assignments → Submissions → Grades → Comments → Notifications.

Uygulama

DB modellerinde on_delete=models.CASCADE uygulanır ancak dikkat: cascade DB-level soft-delete ile uyumsuz. Soft-delete pattern ile cascade job’ı tetikle.

Delete orchestration service: DeleteService.delete_course(course_id) —> orchestration: mark soft-delete, enqueue child-delete jobs, delete files.

Tests + DB constraints (unique/idx) temizlenmesi.

Test

End-to-end delete: kurs silindikten sonra hiçbir ilişkili row/asset erişilebilir olmasın.

Data recovery: soft-delete window (örn. 30 gün) içinde restore testi.

Madde 8 — Ana core: Akademi İstanbul, SaaS öğretmen rolü ücretli; alt akademilerde koordinatör yetkilendirmesi

 Claude kontrolü: Madde 8 tamamlandı

Kontrol

Mevcut tenant modelinin root/parent ilişkisinin olup olmadığına bak.

Planlama

Model: Academy (is_core boolean, parent_academy_id nullable).

SaaS: TeacherSubscription veya AccountType (free/demo/paid). Payment provider (Stripe) entegrasyonu.

Roles: core_academy öğretmenleri içerik oluşturabilir; alt akademilerde yalnızca coordinator veya admin ders oluşturur.

Coordinator scope: coordinator sadece kendi alt-academy tenant’ında role dağıtabilir.

Uygulama

Billing: Stripe integration (plans, trials). Teacher sign-up flow: create teacher account, select plan, payment flow, on success set teacher role with can_create_content true.

Permissions: can_create_course derived from role + subscription.

Admin UI: core academy dashboard for subscriptions, teacher approvals.

Test

Subscription lifecycle testleri (trial → active → cancel).

Permission derivation tests: paid teacher can create content in core academy; not in sub-academy unless explicitly permitted.

Madde 9 — Yeni akademi oluşturma: super admin için klon & brandable tenant provisioning

 Claude kontrolü: Madde 9 tamamlandı

Kontrol

Tenant provisioning flow var mı? Logo/isim/branding değişikliği destekleniyor mu?

Planlama

Tenant provisioning service: ProvisionTenant( template=core_template, branding={name, logo, colors}, owner)

Clone options: clean copy (no content) veya seeded template (ör. course placeholders).

UI: superadmin panel: create tenant form (branding fields), auto-provision portal entry (subdomain or path).

Multi-tenant routing: subdomain-based (academy.example.com) veya path-based (example.com/{academy}).

Uygulama

Provisioning job: create DB tenant row, create S3 prefix, create default admin user, optionally clone template content (shallow).

Branding storage: S3 paths for logos; CDN for static assets.

DNS / routing automation: if subdomain pattern, create DNS entries (or wildcard + tenant mapping).

Tenant onboarding email + initial admin.

Test

Provision end-to-end: create tenant → site accessible → admin can login → branding visible.

Clone options correctness.

Madde 10 — Stüdyo rezervasyon: sadece Akademi İstanbul ana gövdesinde olacak; talep -> onay workflow

 Claude kontrolü: Madde 10 tamamlandı

Kontrol

Mevcut rezervasyon modülü var mı? Takvim entegrasyonu (Google Calendar/CalDAV) var mı?

Planlama

Feature only for core tenant (is_core flag).

Flow: Teacher requests booking -> booking record status=“pending” (tenant_id = core) -> admin reviews on core admin panel -> approve/reject -> calendar event created.

Notifications: email + in-app notifications.

Optional: payment for booking (paid reservations).

Uygulama

Model: StudioReservation( id, tenant_id, requester_id, timeslot, status, notes ).

Backend: endpoints for create_request, list_requests (admin), approve/reject actions.

Frontend: calendar UI for teachers (read-only for non-core).

Integration: on approve -> create calendar event + send invite.

Audit: who approved, when.

Test

Booking lifecycle tests: create -> pending -> approve -> calendar created.

Access control: only core tenant users see booking UI.

Ücretli opsiyonlar / Demo senaryosu (alt maddeler)

 Claude kontrolü: Ücretli opsiyonlar/demos tamamlandı

Demo (hızlı)

Minimal: YouTube unlisted veya S3 public + local DB multi-tenant flag. No billing.

İzin: Basit role-based front-end gating (show/hide) — backend enforcement opsiyonel demo safhasında.

Pilot / Ücretli (opsiyonlar)

Opsiyon A (Temel SaaS): Provisioning + Stripe, S3 + CloudFront, basic RBAC.

Opsiyon B (Kurumsal): White-labeling (branding), SLA, dedicated CDN endpoint, enhanced security audits.

Opsiyon C (Enterprise): Single-tenant dedicated infra, custom domain + strict compliance (SOC2, ISO).

Demo → Full rollout plan

Demo (YouTube/S3 public, tenant flag)

Pilot (S3 + simple CDN, Stripe sandbox, RLS disabled initially)

Scale (RLS on, Row-Level Security, full monitoring, autoscale workers)

Production (SLA, backups, DR plan)

Genel Test & QA Planı (tüm maddeler için ortak)

Unit tests (models, serializers, permission checks).

Integration tests (API flows: create course, assign teacher, delete course cascade).

E2E tests (Cypress/Playwright) tenant isolation flows.

Load tests (k6 or Locust) hedef: 1M kullanıcı senaryoları — baseline: CDN cache hit ratio %95.

Security tests: SAST, DAST, dependency scanning, pen tests.

Disaster recovery drills: restore DB, recover files.

Operasyonel & Monitoring Rehberi (kısa)

Logging: structured logs (request id, tenant_id, user_id).

Tracing: distributed tracing (OpenTelemetry).

Metrics: queue length, transcoder lag, 5xx rates per tenant, CDN cache hit.

Alerts: high queue backlog, failed delete jobs, suspicious auth patterns.

Deployment / Rollout önerisi (adım adım)

Sprint 0 — audit current codebase, create migration plan, add tenant_id where eksik.

Sprint 1 — Tenant isolation (DB + middleware) + Role model + basic RBAC.

Sprint 2 — Course creation + permission enforcement + UI guards.

Sprint 3 — Upload/Deletion orchestration (soft-delete + background jobs).

Sprint 4 — Tenant provisioning/cloning + superadmin UI.

Sprint 5 — Billing/Stripe + subscription flows (demo → paid).

Sprint 6 — Studio booking + calendar integration.

Hardening Sprint — RLS turn-on, pen test, load testing, optimizations.

Her sprint sonunda Claude Sonnet 4.5’in aşağıdaki checklist’i [ ] → [x] olarak güncellemesini iste:

- [ ] Madde 1 — Tenant isolation implemented
- [ ] Madde 2 — RBAC & tenant-scoped roles
- [ ] Madde 3 — Superadmin controls
- [ ] Madde 4 — Course visibility scoping
- [ ] Madde 5 — Role-restricted content creation
- [ ] Madde 6 — Delete orchestration (files + db)
- [ ] Madde 7 — Full cascade delete pattern
- [ ] Madde 8 — Core academy + SaaS teacher flow
- [ ] Madde 9 — Tenant provisioning & cloning
- [ ] Madde 10 — Studio reservation workflow
- [ ] Demo & Paid options prepared
- [ ] Load & Security tests ready for 1M users

Ek notlar & riskler

RLS performans: RLS kullanımı bazı sorgularda ek maliyet getirebilir — index ve planlama ile minimize edilir.

File delete atomicity: Outbox pattern önerilir aksi halde orphan files oluşabilir.

Billing compliance: PCI scope için Stripe kullan ve sensitive path’leri minimize et.

1M kullanıcı için CDN cache oranları ve transcode pipeline optimizasyonu kritik.