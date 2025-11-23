# Akademi İstanbul Platformu - Proje Durum Raporu

Bu belge, Akademi İstanbul Platformu projesinin mevcut durumunu, mimari yapısını ve dosya organizasyonunu özetlemektedir. Yapay zeka analizleri için referans olarak hazırlanmıştır.

## 1. Proje Özeti
Akademi İstanbul, İstanbul Büyükşehir Belediyesi ve iştirakleri için geliştirilen kapsamlı bir Eğitim Yönetim Sistemi (LMS) ve Kariyer Merkezi platformudur. Çok kiracılı (multi-tenant) bir yapıya sahiptir ve farklı kurumların (İBB, İSMEK, vb.) tek bir çatı altında eğitim vermesini sağlar.

**Temel Özellikler:**
*   **Modüler Mimari:** Özellik tabanlı (feature-based) klasör yapısı.
*   **Rol Tabanlı Erişim:** Öğrenci, Eğitmen, Kurum Yöneticisi ve Süper Admin rolleri.
*   **Eğitim Modülleri:** Video dersler, canlı sınıflar, sınavlar ve sertifikalar.
*   **Kariyer Merkezi:** İş ilanları, CV oluşturma ve yapay zeka destekli eşleşme.
*   **Gerçek Zamanlı İletişim:** Canlı dersler ve AI sohbet asistanı.

## 2. Teknoloji Yığını
*   **Frontend:** React (TypeScript), Vite
*   **Stil:** Tailwind CSS (Vanilla CSS ile özelleştirmeler), Lucide React (İkonlar)
*   **State Yönetimi:** React Context API (AuthContext, TenantContext)
*   **Veri Görselleştirme:** Recharts
*   **HTTP İstemcisi:** Axios

## 3. Mimari Yapı
Proje, "Service-Oriented Modular Monolith" (Servis Odaklı Modüler Monolit) prensiplerine uygun olarak yeniden yapılandırılmıştır. Kod tabanı, işlevsel alanlara (domain) göre ayrılmıştır.

### Temel Dizinler (`src/`)
*   **`api/`**: Backend servisleriyle iletişim kuran Axios istemcileri. Her servis kümesi için ayrı dosya bulunur (`auth.ts`, `core.ts`, `lms.ts`, `career.ts`).
*   **`components/`**: Uygulama genelinde kullanılan, iş mantığından arındırılmış UI bileşenleri (`ui/`) ve layout bileşenleri (`layout/`).
*   **`contexts/`**: Global durum yönetimi (`AuthContext`, `TenantContext`).
*   **`features/`**: İş mantığını barındıran ana modüller. Her modül kendi içinde `pages`, `components` ve `hooks` barındırabilir.
*   **`layouts/`**: Sayfa düzenleri (`DashboardLayout`, `AuthLayout`).
*   **`types/`**: TypeScript tip tanımları.
*   **`utils/`**: Yardımcı fonksiyonlar ve sabitler (`constants.ts`).

## 4. Detaylı Dosya Ağacı

```
src/
├── api/                    # API İstemcileri
│   ├── auth.ts             # Kimlik doğrulama servisleri
│   ├── axios.ts            # Base Axios konfigürasyonu
│   ├── career.ts           # Kariyer merkezi servisleri
│   ├── core.ts             # Çekirdek servisler (Tenant vb.)
│   └── lms.ts              # LMS servisleri
├── components/             # Paylaşılan Bileşenler
│   ├── layout/             # Header, Sidebar
│   └── ui/                 # AccessibilityWidget vb.
├── contexts/               # Global State
│   ├── AuthContext.tsx     # Kullanıcı oturum yönetimi
│   └── TenantContext.tsx   # Kurum (Tenant) seçimi yönetimi
├── features/               # Özellik Modülleri
│   ├── auth/               # Kimlik Doğrulama
│   │   └── components/     # AuthModal.tsx
│   ├── career/             # Kariyer Merkezi
│   │   └── pages/          # CareerCenter, ReportsAnalytics, StudentAnalytics
│   ├── core/               # Çekirdek Sayfalar
│   │   └── pages/          # LandingPage, AcademySelection, Settings, SystemLogs, UserManagement
│   ├── lms/                # Eğitim Yönetim Sistemi
│   │   └── pages/          # Dashboard (Student/Admin), CourseCatalog, CoursePlayer, MyEducation, Certificates
│   └── realtime/           # Gerçek Zamanlı Özellikler
│       └── components/     # LiveClassroom, AIChatAssistant
├── layouts/                # Sayfa Düzenleri
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── types/                  # Tip Tanımları (index.ts)
├── utils/                  # Araçlar (constants.ts)
├── App.tsx                 # Ana Uygulama Bileşeni (Routing)
└── index.tsx               # Giriş Noktası
```

## 5. Mevcut Durum ve Notlar
*   **Refactoring:** Proje kısa süre önce köklü bir yeniden yapılandırma sürecinden geçmiştir. Klasör yapısı modernize edilmiş ve temiz kod prensiplerine uygun hale getirilmiştir.
*   **Mock Veri:** Şu anda backend entegrasyonu tam olmadığı için `src/utils/constants.ts` dosyasındaki mock veriler kullanılmaktadır.
*   **Importlar:** Tüm importlar `@/` alias'ı kullanacak şekilde güncellenmiştir.
*   **Çalışır Durum:** Proje `npm run dev` komutu ile hatasız çalışmaktadır.
