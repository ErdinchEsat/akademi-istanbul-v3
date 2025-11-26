🛡️ Akademi İstanbul: Entegrasyon, Debug ve Refactoring Protokolü
Yetki Seviyesi: Kırmızı (Kesin Uygulanmalı) Rol: Senior Architect & Code Auditor Amaç: Spagetti kodu engellemek, teknik borcu (technical debt) sıfıra indirmek ve %100 güvenli/optimize bir entegrasyon sağlamak.

🛑 BÖLÜM 1: ALTIN KURALLAR (THE GOLDEN RULES)
Bir hata düzeltilirken veya Frontend-Backend bağlanırken bu kuralların dışına çıkılamaz.

1.1. Zombi Kod Toleransı SIFIRDIR (Dead Code Elimination)
Kural: Eğer yeni bir fonksiyon, endpoint veya bileşen yazdıysan ve eskisi boşa çıktıysa, eskisi yorum satırına alınmaz, tamamen silinir.

Prosedür:

Eski kodun referanslarını tüm projede arat (grep / Ctrl+Shift+F).

Kullanım sayısı 0 ise, ilgili fonksiyonu, import satırını ve varsa testini sil.

Asla "belki lazım olur" diye kod saklama. Git geçmişinde zaten var.

1.2. Dosya Boyutu ve Sorumluluk Sınırı (The 500-Line Rule)
Kural: Bir dosya (özellikle views.py veya React Component.tsx) 500 satırı aşıyorsa "Code Smell" (Kod Kokusu) var demektir. 700 satır kesin refactor sebebidir.

Çözüm: Dosya şiştiyse böl:

Backend: İş mantığını services.py veya selectors.py dosyalarına taşı.

Frontend: useHook mantığını ayır veya alt bileşenleri (Sub-components) ayrı dosyalara taşı.

1.3. Yamama Değil, İyileştirme (Fix vs. Upgrade)
Kural: Bir hatayı düzeltirken "sadece çalışsın" mantığı yasaktır.

Soru: "Bu hatayı düzeltirken, bu bloğu daha güvenli ve daha performanslı hale getirebilir miyim?"

Örnek: Bir for döngüsünü düzeltiyorsan ve orada N+1 sorunu varsa, sadece bug'ı çözme; sorguyu prefetch_related ile optimize et.

1.4. DRY (Don't Repeat Yourself) Polisliği
Kural: Aynı mantığı (örneğin tarih formatlama veya yetki kontrolü) ikinci kez yazıyorsan dur.

Aksiyon: Ortak bir utils veya mixins fonksiyonu oluştur ve her iki yerden de orayı çağır.

🛠️ BÖLÜM 2: FRONTEND-BACKEND BAĞLAMA CHECKLIST'İ
Frontend'i Backend'e bağlarken adım adım bu listeyi takip et. Bir adım başarısızsa sonrakine geçme.

[ADIM 1] Backend Doğrulaması (The Contract)
[ ] Endpoint Testi: Postman veya cURL ile endpoint tek başına çalışıyor mu?

[ ] Veri Yapısı: Gelen JSON yanıtı, Frontend'deki Interface veya Type tanımıyla birebir eşleşiyor mu? (TypeScript zorunluluğu).

[ ] Hata Kodları: Backend sadece 200 değil; 400, 401, 403, 500 durumlarında doğru JSON formatı dönüyor mu?

[ADIM 2] Bağlantı ve State Yönetimi
[ ] Service Layer: API çağrısı doğrudan Component içinde yapılmamalı. api/services/courseService.ts gibi bir katmandan çağrılmalı.

[ ] Loading & Error States: İstek atılırken kullanıcıya Spinner (yükleniyor) gösteriliyor mu? Hata olursa Toast mesajı veya hata ekranı çıkıyor mu?

[ ] Clean Effect: useEffect kullanılıyorsa, abortController ile istek iptal mekanizması (cleanup) kuruldu mu? (Memory leak önlemi).

[ADIM 3] Entegrasyon Testi (Canlı Deneme)
[ ] Happy Path: Kullanıcı doğru veriyi girdiğinde akış tamamlanıyor mu?

[ ] Edge Cases: Kullanıcı boş veri yollarsa, interneti kesilirse veya token'ı düşerse sistem çöküyor mu yoksa yönetiyor mu?

[ ] Console Log Temizliği: Test bittiğinde console.log() bırakılmamalı.