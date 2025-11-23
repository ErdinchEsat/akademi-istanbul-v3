Akademi İstanbul: Büyük Ölçekli Web Uygulama
Mimarisi, Güvenlik ve Optimizasyon Rehberi
Bu teknik doküman, Akademi İstanbul projesi örneğinde büyük web uygulamalarının nasıl
yapılandırıldığı, güvenliğinin nasıl sağlandığı, performans optimizasyonlarının nasıl yapıldığı ve tekrar
eden kod bloklarından kaçınmak için nasıl sade, hızlı ve doğru bir yapı kurulduğu konularını detaylı
şekilde açıklar. Her aşama bir proje yöneticisi gözünden adım adım ele alınmış, hiçbir nokta
atlanmamıştır.
Proje Anayasası (Altın Kurallar)
Büyük ölçekli projelerde uyulması zorunlu temel prensipler şunlardır:
Güvenlik ve Sıfır-Güven (Zero Trust): Web uygulaması her zaman içerden veya dışarıdan
gelebilecek tüm kötü niyetli girişimleri “güvenilmez” kabul etmelidir. Kullanıcıdan gelen her veri,
(API sorgu parametreleri, formlar vb.) mutlaka sanitize edilmelidir. Örneğin, Django şablon
sistemi özel karakterleri otomatik kaçarak çoğu XSS saldırısını önler . CSRF koruması
( CsrfViewMiddleware ) ve benzeri mekanizmalar hiçbir zaman devre dışı bırakılmamalıdır
(Sadece çok özel bir durumda gerekliyse dikkatlice kullanılır) . SQL sorguları ise her zaman
parametreli (bind variable) kullanılmalı; Django ORM varsayılan olarak SQL enjeksiyonuna karşı
parametreleştirme yapar . Ek güvenlik katmanı olarak şunlar uygulanır:
Giriş/Kimlik Doğrulama: Her kaynak isteğinde (örneğin bir API çağrısı) JWT veya benzeri token ile
kullanıcı kimliği doğrulanır. O anda geçerli oturum, cihaz durumu ve ağ konumu kontrol edilir
(Zero Trust prensibi: “asla iç ağda da tam güvenemezsin, her istekte yeniden doğrula” ).
Örneğin, bir kullanıcının yetki seviyesi ve o anda hangi kuruluş (tenant) altında çalıştığı API
katmanında daima kontrol edilmelidir. Kullanıcı arayüzünde sadece ilgili işlemler gösterilmesi
yetmez; backend’de request.user.role ve request.user.tenant gibi alanlara göre her
API isteği yetkilendirilir. Farklı tenant’a ait verilere erişim kesinlikle engellenir – bir öğrencinin
URL’de ID değiştirerek başka kurumun dersini görmesine müsaade edilmez (çok-kurumsal
altyapıda tenancy isolation kritik önemdedir ).
Güvenlik Duvarları ve Protokoller: Tüm iletişim şifreli (HTTPS/TLS 1.3 veya üstü) olmalı, açık kaynaklı
güvenlik duvarları veya WAF kullanılabilir. İç ağlarda bile veri izolasyonu sağlanmalıdır (örneğin
mikro-segmentasyon). Kısaca “hiçbir şeye otomatik güvenme”, her bağlantıya kimlik
doğrulama ve yetkilendirme uygula .
Hassas Verilerin Korunması: Şifre, API anahtarı, gizli token gibi değerler koddaki hiçbir dosyada
açık yazılmamalıdır. Bunun yerine, uygulama yapılandırması için .env dosyası veya güvenli
bir gizli yönetim sistemi (HashiCorp Vault gibi) kullanılmalı; Django SECRET_KEY ve diğer
anahtarlar ortam değişkenlerinden ( os.environ ) okunmalıdır . Böylece kaynak koduna
erişimi olan biri hassas bilgilere ulaşamaz. (OWASP’a göre de “her yerde gizli/şifreli veri tutma,
sadece güvendiğin yolda (örn. secrets manager) sakla” önerilir).
•
1
2
3
•
4
5
•
4
•
6
1
Ödeme Güvenliği ve İdempotency: E-ticaret ve ödeme süreçlerinde en hayati konu, çift işlem
riskini ortadan kaldırmaktır. Örneğin bir kullanıcı ödeme tuşuna arka arkaya basarsa ya da
tarayıcı yenilenirse karttan birden fazla çekim yapılmamalıdır. Bu amaçla:
Tekrarlı İsteklerin Önlenmesi (Idempotency): Ödeme isteklerine benzersiz bir Idempotency-Key
(örneğin UUID) eklenmelidir. Frontend, her yeni ödeme girişiminde bu anahtarı header olarak
gönderir. Backend tarafında, gelen bu anahtar Redis gibi hızlı bir önbellekte kontrol edilir. Eğer
aynı anahtarla daha önce işlenen bir ödeme varsa, yeni ödeme yapılmaz, önceki işlem sonucu
döndürülür. Böylece birden çok istek gönderilse bile sonuç tekilleşir. Örneğin bir banka işlemi
tutarı $100 ise, istemci bu isteği 5 kez gönderirse karttan sadece bir sefer $100 çekilir
(prensip: “aynı isteğin tekrarına karşı aynı sonucu dön, iki katına çıkarma”).
Transaction (İşlem) Saflığı: Ödeme onayı ile veritabanı güncellemesi (sipariş kaydetme vb.) birlikte
gerçekleştirilmelidir. Yani ödeme servisi başarılı dönmeden sipariş kaydı commit edilmemelidir.
Django’da bu transaction.atomic() bloğunda sağlanır. Böylece ödeme onaylansa da arada
hata çıkarsa, her şey geri alınabilir; veritabanı tutarlı kalır. (Aynı zamanda referans
idempotency’de de kullanışlıdır, çünkü aynı ödeme anahtarına ait veritabanı işlemi bir kez
işlendiyse, tekrar denenmez.)
SOLID ve Clean Code Prensipleri: Kodun okunabilir, sürdürülebilir ve hatasız olması için
sektörde kabul görmüş temiz kod kurallarına uyulur:
DRY (Don’t Repeat Yourself): Tekrar eden kod blokları veya iş mantığı katmanları tek bir noktada
toplanır . Eğer benzer işlevsellik birden çok yerde kullanılıyorsa, ortak fonksiyon/method ya
da servis haline getirilir. Böylece kod tekrarına ve sonraki güncellemelerde tutarsızlıklara sebep
olabilecek hatalar engellenir . Örneğin, ödeme işlemleri, görüntü işleme (video optimize) vb.
işlemler her uygulama içinde birkaç farklı yerden çağırılacaksa, hepsi bir yardımcı sınıfta veya
servis katmanında toplanabilir.
SRP (Single Responsibility Principle – Tek Sorumluluk): Her fonksiyon veya sınıf tek bir görevi yerine
getirir. Eğer bir fonksiyon 50 satırı geçmeye başlamışsa ya da bir sınıf çok sayıda özelliğe sahip
görünüyorsa, kod parçalara bölünür. Bunu uygularsak, bir modülün değiştirilme nedeni tek olur,
karmaşıklık azalır. (Örneğin büyük bir “UserProfile” sınıfını, kullanıcı verisi okuma/yazma,
doğrulama, e-posta gönderme gibi ayrı sorumluluklar altında alt sınıflara ayırırız.) Bu prensip,
kod bakımını ve test yazmayı kolaylaştırır .
Diğer SOLID İlkeleri: OCP (Open-Closed), LSP, ISP, DIP gibi prensipler de göz önünde bulundurulur.
Örneğin sınıflar genişletmeye açık, değiştirmeye kapalı olmalı; arayüzler müşteriye
özelleştirilebilir biçimde sunulmalı; yüksek seviye modüller soyutlamalara bağımlı olmalı
(Dependency Inversion) . Bu, projenin ölçeklenebilir ve değişime açık olmasını sağlar.
Performans ve Optimizasyon: Uygulama yüksek kullanıcı ve veri hacminde yanıt verebilmelidir.
Bunun için:
Veritabanı Optimizasyonu (N+1 Sorguları): ORM kullanıldığında ilişkili veriler çekerken
select_related ve prefetch_related gibi yöntemler mutlaka kullanılmalıdır. Aksi halde
bir liste çekildikten sonra her öğenin ilişkili alt verisini ayrı sorguyla almak (N+1 sorgu sorunu)
veritabanını gereksiz yere zorlar. Örneğin kitapları ve yazarlarını listeleyen bir sorguda her kitap
için ayrı yazar sorgusu yapmak yerine select_related('author') ile tek sorguda veriler
alınabilir . N+1 sorununu çözmek, yanıt sürelerini ciddi oranda iyileştirir.
•
•
7
•
•
•
8
8
•
8
•
9
•
•
10 11
2
Lazy Loading (Tembel Yükleme): Özellikle ön uçta, kullanıcıya ilk açılışta gerekli olmayan büyük
veya nadir kullanılan bileşenler gecikmeli yüklenir. Örneğin React’te React.lazy ve
Suspense kullanarak video oynatıcı, harita gibi ağır bileşenler ancak ihtiyaç duyuldukça indirilir
. Bu, başlangıçta yüklenen JavaScript büyüklüğünü azaltır, ilk render süresini kısaltır ve
kullanıcı deneyimini hızlandırır . Yine benzer şekilde resim, font gibi statik kaynaklar da “lazy”
yüklenebilir veya CDN’den sunulabilir.
Önbellekleme ve CDN Kullanımı: Sık erişilen veriler (örneğin sorgu sonuçları, sorgu sonuçlarının
özetleri) cache mekanizmalarına alınır (Redis, memcached vb.). Büyük statik dosyalar (CSS/JS
dosyaları, video, görüntü) için global bir CDN devreye sokulur. CDN (Content Delivery Network)
sunucuları, statik kaynakları kullanıcıya coğrafi olarak en yakın sunucudan ulaştırarak gecikmeyi
azaltır . Örneğin bir video veya JS dosyası kullanıcıya CDN üzerinden verildiğinde yükleme
süresi önemli ölçüde düşer . Böylece aynı anda çok sayıda kullanıcı için performans artar.
Veritabanı İndeksleri ve Sorgu Optimizasyonu: Sorgu sıklığı yüksek alanlar için uygun indeksler
oluşturulur. ORM düzeyinde sorgu sayısını azaltmak kadar, SQL tarafında da JOIN’ler, filtreler iyi
optimize edilir. Gerektiğinde hiyerarşik sorgularda materyalize edilmiş görünümler veya özet
tablolar (analytics) kullanılır.
Arka Plan İşleri (Asenkron): Uzun süren işlemler (video işleme, e-posta gönderimi, büyük veri
raporları) kullanıcı isteğine bağlı işlem hattından ayrılarak Celery gibi kuyruk sistemlerinde
çalıştırılır. Böylece kullanıcı etkileşimi ana süreç hızlı kalır. Örneğin video yükleme anında işletim
yükünü azaltmak için optimize etme işlemi bir arka plan görevinde yürütülebilir.
Adım Adım Uygulama Planı
Bu bölümde “Akademi İstanbul” projesinde her fazda yapılacak işler madde madde ele alınmıştır. Her faz
bir diğerinden tamamlanmadan başlanmamalıdır. Her maddenin yanına tamamlanınca [x] işareti
konacağı varsayılarak özetlendikten sonra detaylarıyla açıklanacaktır.
FAZ 0: Temel Atma ve DevOps (Foundation)
Proje altyapısı, kod yazımından önce hazırlanmalıdır.
0.1. Monorepo Kurulumu: Tüm kod tek bir monorepo içinde toplanır. Ana dizine backend/ ,
frontend/ , infra/ (örneğin altyapı ve DevOps scriptleri) klasörleri açılır. Monorepo
kullanımı, ekipler arası görünürlük ve kod paylaşımını artırır . Ortak yapılandırmalar
( .gitignore , .editorconfig , Prettier/ESLint ayarları) tüm projede tutarlı hale getirilir.
Böylece her geliştirici aynı kod stiliyle çalışır, sürüm kontrolünde çakışma ihtimali azalır.
0.2. Docker Orkestrasyonu: Geliştirme ve üretim ortamları için docker-compose.yml
hazırlanır. Hizmetler kapsül (container) olarak koşacak şekilde tanımlanır:
db servisi: PostgreSQL veritabanı (multi-tenant yapı için, örneğin schema tabanlı).
cache servisi: Redis (oturum yönetimi, önbellek, Celery broker için).
backend : Django uygulaması.
frontend : React (Vite/TS) uygulaması.
worker : Arka plan görevleri (Celery worker).
•
12
12
•
13
13
•
•
•
14
•
•
•
•
•
•
3
storage veya minio : S3 uyumlu nesne depolama (örneğin videolar, belgeler için lokal
çözüm).
Bu yapıda Docker Compose, tüm servisleri tek komutla ayağa kaldırmayı sağlar. Ayrıca servisler
arası özel ağ (network) ve environment değişkenleri güvenli şekilde tanımlanır. (Gelişmiş
dağıtımlarda Kubernetes vb. de kullanılabilir; ancak başlangıçta Compose basit ve yeterlidir.)
0.3. Veritabanı Mimarisi (Multi-Tenancy): Çok-kurumsallık için Django’da genellikle schema
tabanlı multi-tenancy tercih edilir. Örneğin django-tenants paketi ile her tenant için ayrı
PostgreSQL şeması kullanılır. Bu pakette, gelen isteklerin subdomain’ine (örn.
techincubator.akademi-istanbul.com ) göre uygun şema otomatik seçilir . Her tenant
kendi veritabanı alanında izole edilir, böylece bir tenant’ın diğerinin verisini görmesi engellenir.
(Diğer bir yöntem, her tablonun kendine ait tenant_id sütununa bakarak filtrelemektir; ancak
bu çok sayıda manuel filtre gerektireceğinden hata riski yüksektir. Schema tabanlı yaklaşımda
ORM otomatik olarak doğru şemayı kullandığı için güvenlik kuvvetlenir .) Tenant ve
Domain tabloları oluşturulur ve yeni tenant yaratılırken şema oluşturulup yönetilir.
0.4. Backend İskeleti: Django projesi başlatılır ( django-admin startproject ). Mimari
açısından modüler olunması için bir apps/ klasörü altında fonksiyonel alanlara göre
uygulamalar açılır. Örneğin:
core (ortak modeller, ayar vb.),
lms (eğitim motoru ile ilgili modeller ve iş mantığı),
commerce (ödeme, satın alma, başvuru formları),
realtime (WebSocket, canlı iletişim).
Her app kendi içinde modeller, görünümler, servisler gibi alt modüllere ayrılabilir. Bu sayede kod
tekrarı azalır; benzer yetenekler (örneğin ödeme doğrulama, yetkilendirme) ortak sınıflarda
toplanır. Projede ayrıca global ayarlar, URL yönlendirmeleri ve konfigürasyon dosyaları
( settings.py , urls.py ) tanımlanır.
0.5. Frontend İskeleti: React (TypeScript) ile proje kurulumu yapılır. Önerilen araçlar: Vite hız için
ve TS desteği için tercih edilir. Tailwind CSS entegrasyonu ile stil yazımı kolaylaşır. Proje yapısı
özellik (feature) temelli organize edilir; yani her fonksiyonel bileşen (ör. Auth, Kurslar, Ödeme)
altında kendi klasör ve dosya yapısı kurulur. src/features/ gibi bir yapı kullanılabilir. Ayrıca
Recoil veya Context API gibi global state yönetimi altyapısı baştan kurulur (örneğin AuthProvider,
TenantProvider).
FAZ 1: Kimlik, Kurum ve Erişim (Service Core)
Kullanıcı, kurum ve erişim yönetimi, sistemin kapı bekçisi işlevindedir.
1.1. Tenant Resolver Middleware: Django’ya gelen her istekte subdomain’e bakacak bir
middleware yazılır. Örneğin besiktas.akademi-istanbul.com geldiğinde, besiktas kısmı
ile Tenant modeli eşleştirilir ve o tenant’ın şeması aktif hale getirilir. Django-tenants
kullanıyorsak bu iş TenantMainMiddleware tarafından otomatik yapılır . Özetle her istekte
doğru veritabanı ayrımı yapılması sağlanır. Böylece tek bir domain altında birden çok kurum
idare edilebilir.
1.2. Kullanıcı Modeli & RBAC: AbstractUser sınıfından türeyen özel bir kullanıcı modeli
oluşturulur. Bu modele role (örn. Student, Instructor, Admin) gibi bir alan eklenir. Ayrıca her
•
•
15
15 5
•
•
•
•
•
•
•
15
•
4
kullanıcıya bir tenant/birim atanır (ForeignKey ile Tenant). Rol tabanlı erişim (RBAC) için gerekli
izinler (permissions) gruplanır. Her API ve view katmanında kullanıcının rolü kontrol edilerek
işlem yapılır. (Örneğin öğrenci sadece kendi derslerine erişebilir, eğitmen not girebilir, yönetici
tüm işlemleri görebilir.) Mümkünse bu kontrol, Django Rest Framework kullandıysa
permission_classes ile, ya da manuel olarak her endpoint’te if request.user.role !
= ... biçiminde uygulanır.
1.3. Kimlik Doğrulama (Auth) API: Kullanıcı kaydı ve girişi JWT temelli yapılır. Kullanıcılar girişte
şifre kontrolünden geçtikten sonra bir access ve refresh token üretir. Access token’lar kısa ömürlü
olurken, refresh token’larla yenileme sağlanır. Django Rest Framework JWT veya benzeri bir
kütüphane kullanılabilir. Gerekli endpoint’ler: /api/auth/register/ , /api/auth/
login/ , /api/auth/token/refresh/ gibi. Her başarılı giriş request.user oluşturur ve
sonraki isteklerde kullanılır. (Token güvenliği için HTTPS zorunlu, aynı zamanda HttpOnly
cookie veya Authorization header’da taşıma tercih edilir.)
1.4. Aktivasyon Kodu (Kart Sistemi): Projeye kayıtlı kullanıcıların bir kuruma bağlanması için
“ActivationCode” modeli tanımlanır. Bu modele code (string), tenant (Hangi kuruma ait
olduğu) ve uses_left (kalan kullanım sayısı) alanları eklenir. Yeni kullanıcı kodu gönderip /
api/activate/ endpoint’ine girdiğinde sistem şu işlemi yapar: Girilen kod mevcut mu ve hâlâ
kullanımla mı sahiport? İse uses_left bir azaltılır, kullanıcının request.user.tenant
alanına kodun ait olduğu tenant kaydedilir ve onay tamamlanır. Böylece sadece geçerli koda
sahip olanlar ilgili kuruma dahil edilmiş olur. Kodlar önceden bir yönetici tarafından üretilip
dağıtılabilir.
1.5. Frontend Kimlik (Auth): React tarafında, oturum yönetimi için bir AuthProvider
Context’i oluşturulur. Kullanıcı giriş yaptığında token’lar yerel depolamaya veya context’e
kaydedilir. Bir de TenantProvider ile tenant’a göre farklı logo/tema göstermek sağlanır (örn.
her kuruma özel renk veya başlık). Login formu hazırlanır; form gönderildiğinde ilgili auth
API’lerini çağırır. Başarılı giriş sonrası kullanıcı bilgileri global state’e alınır. (UX için giriş butonu
basıldıktan sonra disable edilip spinner gösterilebilir, böylece çoklu tıklama engellenir.)
FAZ 2: Eğitim Motoru (Service LMS)
Kurslar, dersler ve öğretimle ilgili işlevler burada ele alınır.
2.1. Katalog Mimarisi (Course-Module-Lesson): Kurs (Course) – Modül (Module) – Ders/İçerik
(Lesson/Content) hiyerarşisi oluşturulur. Bazen farklı içerik türleri olabileceğinden polymorphic
model kullanmak uygun olur. Örneğin django-polymorphic veya çok tablolama (multi-table
inheritance) ile, Content temel modelinden video, makale, test gibi türetilmiş alt modeller
oluşturulabilir. Bu sayede bir Kurs içinde hem video hem PDF hem de quiz içerebiliriz, hepsinin
ortak bir liste (content list) modeli paylaşır. Alternatif olarak her ders ayrı bir türde olacağından,
her içerik tipi farklı modele fakat tekil ilişkiyle bağlanabilir. Önemli olan, API’den kurs veri
çekildiğinde ilişkili modül ve derslerin yüklenmesidir (ör. select_related /
prefetch_related ile N+1 engellenmeli). Veritabanı tasarımında, Course , Module ,
Lesson modelleri oluşturulur ve uygun ForeignKey’lerle birbirine bağlanır.
2.2. Video İşleme (Asenkron): Eğitmen video yüklediğinde bu video sunucuya gelir. Ancak ham
video genellikle büyük boyutlu ve farklı formatlarda olur. Performans ve bant genişliği tasarrufu
için yüklenen video asenkron olarak optimize edilmeli (örn. çözünürlük düşürme, farklı kalite
seçenekleri). Bunun için Celery ile arka plan görevi yazılır. Örneğin bir Video modeli
•
•
•
•
•
5
FileField ile kayıt aldığında, Django sinyali (post_save) tetikler ve o videoyu optimize eden bir
Celery task’ına gönderir. Bu task içinde FFmpeg kullanılarak video yeniden encode edilir ve farklı
formatlarda saklanır. Optimize süreçleri bitmeden kullanıcıya sadece orijinal veya düşük kalite
alternatifleri gösterilir. Sonuçta, ders videoları kullanıcıya hızlı akmalı ve bant genişliği fazla
tüketilmemelidir.
2.3. İlerleme Takibi (Progress Tracking): Öğrencilerin bir dersi ne kadar tamamladığı izlenir.
Video örneğinde, tipik işleyiş: Video oynatıcısının %90’ı tamamlandığında ders tamamlandı kabul
edilir, LessonProgress modelindeki is_completed=True yapılır. Bu kontrol frontend’de
video oynatma olaylarından (örn. onTimeUpdate ) alınan süreye göre veya backend’e düzenli
olarak frontend’den bildirim gönderilerek yapılabilir. Django tarafında bir sinyal veya API
endpoint’i, videonun izlenme oranını alır ve eğer %90 ve üzerindeyse LessonProgress
günceller. Bu sayede öğrenci videoyu sonuna kadar izlememişse tamamlanmış olarak sayılmaz,
kopya geçiş yapılmamış olur.
2.4. Stüdyo Rezervasyonu: Eğitmenlerin kullanabileceği bir studio booking takvimi oluşturulur.
StudioBooking modeli: ( instructor , start_time , end_time , title , tenant ).
Rezervasyon eklerken aynı sürede çakışma olmaması gerekir. Bunu sağlamak için rezervasyon
kaydetmeden önce mevcut rezervasyonlarla saat aralıklarını kontrol eden bir fonksiyon yazılır.
Örneğin SQL’de range overlap kontrolü yapılabilir (ya da Django 4+ ile ExclusionConstraint
kullanarak Postgres’te zaman aralığı tekrarını önleyebilirsiniz). Basitçe backend’de “Başlangıç
zamanından önce biten kayıt yok mu / bitiş zamanından sonra başlayan kayıt yok mu” sorgulanır.
Eğer başka bir rezervasyonla zaman aralığı kesişiyorsa işlem engellenir ve kullanıcıya hata döner.
Bu yöntem ders programı içinde stüdyo çakışmalarını engeller.
2.5. Frontend Video Oynatıcı ve Ders Listesi: React’te bir video oynatıcı bileşeni kodlanır. Bu
oynatıcı hız kontrolü (0.5x, 1x, 1.5x vb.), kaldığı yerden devam etme (örneğin önceki oturumlarda
%50’de kaldıysa oradan başlama) gibi özellikler içermelidir. Kaldığı yer bilgisi backend’e veya
localStorage’a kaydedilebilir. Ders listesi arayüzü, kullanıcının kurs içindeki modülleri ve dersleri
görmesini sağlar. Bu liste sorunsuz, sayfa yenilemesiz bir deneyim için React Router ile sayfalara
bölünebilir. Ağır dersler (video) yer tutucu (thumbnail veya geçici metin) ile yüklendikten sonra
üzerine tıklayınca oynatıcı açılabilir.
FAZ 3: Sınav ve Sertifikasyon
Ölçme değerlendirme ve sertifika işlemleri.
3.1. Sınav Motoru: Çevrimiçi quiz sistemi kurulur. Modeller: Quiz , Question , Attempt
(kullanıcının sınava giriş denemesi). Bir quiz içinde çoktan seçmeli veya doğru/yanlış sorular
barındırabilir. Öğrenci sınavı bitirdiğinde cevapları gönderilir; backend’de bir otomatik puanlama
servisi soruları değerlendirir. Örneğin doğru cevap anahtarlarıyla karşılaştırarak puan hesaplanır
ve Attempt kaydı güncellenir. Her soruya puanlama mantığı (örnek: doğruysa 1 puan, yanlışsa
0 gibi) uygulanır. Başarı yüzdesine göre onaylanan bir sınav sonucu oluşur.
3.2. Sınav Güvenliği (Hook): Sınav sırasında öğrencinin başka sekmeye (tab) geçmesini
algılamak için frontend’de bir useTabSecurity hook’u yazılır. JavaScript’te visibilitychange
etkinliği dinlenir: Eğer sayfa odaktan çıkarsa (başka sekmeye geçilmişse), kullanıcıya “Sınav
esnasında başka sekmeye geçmek yasaktır” gibi bir uyarı gösterilir ve bu durum loglanır
(muhtemelen backend’e bir uyarı kaydı gönderilir). Bu yöntem tamamen kopya çekmeyi
engellemese de öğrenciyi uyaran ilk savunma hattıdır.
•
•
•
•
•
6
3.3. Sertifika Üretici: Kurs bitiminde (öğrenci ilgili kursa ait tüm sınavları geçip modülü
tamamladığında) dinamik olarak sertifika üretilir. Python tarafında örneğin reportlab veya
WeasyPrint gibi bir PDF kütüphanesi kullanılarak bir sertifika şablonu üzerinde; öğrenci adı,
kurs adı, tarih bilgisi gibi dinamik alanlar doldurulur. Sertifika üzerine bir QR kod eklenir; bu QR
kod, üzerinde öğrenci kimliği ve kurs bilgileri gibi veriler barındırabilir (böylece QR
okutulduğunda doğrulama yapılabilir). PDF üretim işi de arka planda, Celery task ile yapılabilir.
Hazır sertifika gerektiğinde (örn. sertifikalar listesi sayfası açıldığında) üretilen PDF öğrenciye
indirilebilir.
3.4. Frontend Quiz Arayüzü: React ile sınav arayüzü geliştirilir. Her soru bir alt sayfada gösterilir
ve sayfalı şekilde ilerlenir ( React Router veya kendi sayfalama bileşeni). Zamanlı quizlerde bir
sayaç (timer) eklenir; süre dolunca otomatik sınav bitişi yapılır. Soru cevaplamada geri sarma
veya ileri gitme imkanı verilir. Kullanıcı cevapları canlı kaydedilebilir veya sayfa değişiminde API’ye
gönderilebilir. Arayüz, kullanıcı deneyimini bozmayacak şekilde basit ve etkileşimli
tasarlanmalıdır.
FAZ 4: Realtime ve İletişim (Service Realtime)
Canlı etkileşim ve anlık bildirim servisi.
4.1. WebSocket Kurulumu: Django Channels ve Daphne (ASGI sunucusu) yapılandırılır.
channels paketinde Redis tabanlı channel layer ayarlanır ( CHANNEL_LAYERS içinde Redis
URL’si). Böylece WebSocket bağlantıları kanallar üzerinden yönetilebilir. Örneğin canlı ders odası
için bir kanal grubu oluşturulur. Channels ile yazacağımız consumer’lar (ChatConsumer,
NotificationConsumer gibi) gelen WebSocket mesajlarını işler. Infrastruktur için ayrıca Nginx veya
başka bir proxy, HTTP bağlantılarını Daphne’ye yönlendirir.
4.2. Zoom Entegrasyonu: Eğitimlerde canlı video dersi için Zoom API’si entegre edilir. Yaklaşım:
Zoom’un Server-to-Server OAuth uygulaması oluşturulur. Böylece arka planda API’ye erişim
sağlayacak bir OAuth access token alınır. Bir ZoomService sınıfı yazılır; bu sınıf, gerekli client
ID/secret bilgileriyle token’ı alıp saklar (genelde JWT veya OAuth token endpoint’i). Toplantı
oluşturma için Zoom’un API endpoint’i (örn. POST /users/{userId}/meetings ) kullanılır.
Sunucuda, eğitmen “Yeni canlı ders” dediğinde ZoomService’ten toplantı oluşturması istenir ve
dönen toplantı URL’si canlı ders modülüne kaydedilir. (Güvenlik için API anahtarı gizli tutulur ve
her çağrıda yeniden doğrulanır.)
4.3. Canlı Ders Sohbeti ve Bildirimler: WebSocket tüketicileri (Consumers) ile gerçek zamanlı
sohbet ve sistem bildirimleri kodlanır. Örneğin her dersin (kurs modülünün) bir chat grubu olur:
öğrenciler oraya mesaj atar, diğerleri anında görür. Channels ile AsyncWebsocketConsumer
genişletilerek basit chat mekanizmaları yazılabilir. Ayrıca NotificationConsumer ile sistemi
ilgilendiren uyarılar (örneğin “Yarın sınavınız var” gibi) ilgili kullanıcılara anlık gönderilebilir. Tüm
bu iletimler Redis channel layer üzerinden yapılır, böylece birden fazla Daphne örneği olsa bile
mesajlar tüm istemcilere ulaşır.
4.4. Frontend Socket Context: React tarafında tek bir global WebSocket bağlantısını yöneten bir
Context veya custom hook yazılır. Uygulamanın en üstünde WebSocketProvider kullanılarak
bir instance açılır; alt bileşenlerde bu context üzerinden send , onMessage gibi metodlar
çağrılır. Örneğin canlı sohbet bileşeni mount olduğunda ilgili odaya katılır, bağlantı bozulursa
otomatik yeniden bağlanma sağlanır. Böylece her bileşen ayrı bağlantı açmaz, tek bir socket
üzerinden mesajlar yönlendirilir.
•
•
•
•
•
•
7
FAZ 5: Ticaret ve Başvurular (Service Commerce)
Ödeme süreçleri, kayıt ve başvuru modülleri. En yüksek güvenlik gerektirir.
5.1. İdempotency Katmanı: Ödeme endpoint’lerinde tekrar eden ödemeleri engelleyen bir ara
katman (middleware veya dekoratör) yazılır. Örneğin her ödeme isteğinde gelen IdempotencyKey Redis’te kontrol edilip, daha önceden işlenmişse aynı cevap dönülür . Bu sayede kullanıcı
butona birden çok basarsa yalnızca bir kez ödeme alınır. Ara katman, Redis anahtarı kontrolünü
yapar; yoksa istek işlenir ve sonuç Redis’e kaydedilir. (Bazı payment sağlayıcıları kendi
idempotency destekler, fakat uygulama tarafında da garanti olması iyidir.)
5.2. Ödeme Entegrasyonu: Iyzico veya Stripe gibi bir ödeme servisinin sunucu entegrasyonu
yapılır. Ödeme işlem akışı aşağıdaki gibi olmalıdır: Önce kullanıcı sepetini onaylar, istek backend’e
gelir. Django’da ilgili işlemler transaction.atomic() bloğu içinde yürütülür. Ödemeyi
başlatmak için ödeme sağlayıcının API’sine çağrı yapılır. Başarılı dönüş alınırsa veritabanına
ödeme ve sipariş kaydı yazılır, aksi halde işlem rollback edilir. Bu sırada kullanıcıdan sürekli
payment_success durumunu sorgulamak yerine webhook kullanılabilir. Burada da
idempotency anahtarı kullanılır; aynı ödeme iki kez alınmaz. Örneğin Stripe’da ödeme isteği
yaratırken eşsiz bir idempotency anahtarı göndermek ödeme servisinin de birden çok çekimi
engellemesini sağlar. Genel olarak, ödeme işlemleri hem dış API hem de veritabanı kesin bir
şekilde finalize edilene kadar hiçbir başarı durumuna geçmez.
5.3. Hibe Başvuruları (Dinamik Form): Destek başvuru formu, tamamen dinamik olsun diye
JSON şemalı bir yapı kullanılır. Örneğin Application modeli içinde form_data =
JSONField() alanı oluşturulur. Yöneticiler yeni bir form şablonu (JSON) tanımlayabilir;
öğrenciler bu şablon bazlı formu doldurur. Ardından başvurular Pending olarak kaydedilir.
Onaylama sürecinde bir yönetici formu inceler, uygun bulursa status = Approved yapar. Bu
süreçte tüm değişiklikler loglanır ( AuditLog ). Bu dinamik yapı, form alanı değişse de backend
kodunu değiştirmeden her türlü formu destekler. Frontend’te de form oluşturucu veya form
renderer ile JSON’a göre form arayüzü sunulur.
5.4. Frontend Sepet & Ödeme: Kullanıcıların ürün/hizmet (örn. kurs) seçtikleri bir sepet arayüzü
hazırlanır. Sepet içeriği React state’inde tutulur (veya backend session’da). Ödeme formu,
kullanıcı bilgilerini ve kart bilgilerini alır. Ödeme butonuna tıklanınca gönder butonu devre dışı
kalır ( disabled ), böylece kullanıcı çift tıklayarak iki kez istek göndermez. Ödeme
tamamlandığında kullanıcıya teşekkür veya hata mesajı gösterilir. Sepet işlemleri (ürün ekle/
çıkar) anında güncellenen dinamik bir arayüz ile sağlanır.
FAZ 6: Veri ve Raporlama (Service Data)
Analiz, logging ve içgörü modülü.
6.1. Audit Logging: Kritik işlemler (kullanıcı girişi, veri silme, ödeme vb.) arka planda
ElasticSearch veya benzeri bir büyük veri deposuna asenkron gönderilir. Örneğin Django
sinyalleri veya manuel yazılan AuditLog modelinin savunuculuğunu Celery aracılığıyla Elastic’e
iletmek mantıklıdır. Böylece ileride Admin panelinde ya da özel araçlarda detaylı filtrelenebilir
loglar (kim ne zaman ne yaptı?) tutulmuş olur. Kayıtlar genelde JSON formatında Elastic’e
gönderilir. Bu, hataları incelerken veya güvenlik incelemelerinde geri dönük analiz imkanı sağlar.
•
7
•
•
•
•
8
6.2. ETL Görevleri (Gece Raporları): Veri tabanında ağır sorgular (örneğin günlük kurs
tamamlama oranları, kullanıcı sayıları) her sorgu talebinde dinamik hesaplanmak yerine, gece
çalışan Celery Beat görevleri ile özet tablolara yazılır (Analytics DB). Bu sefer-sınav gibi yüksek
hacimli sorguların her defasında veritabanını yorması önlenir. Bu arka plan işlemler sonuçları
önceden hesaplayıp saklar; frontend gerektiğinde bu küçük özet tablolardan hızlıca çekilir.
6.3. Kariyer Eşleştirme: Öğrencilerin kayıtlı yetenekleri ve sınav sonuçlarına göre iş ilanları
öneren bir algoritma yazılır. Örneğin her iş ilanının ihtiyaç duyduğu anahtar kelimelerle
öğrencinin kurs yetkinlikleri karşılaştırılır. Veya basit bir NLP benzeri yöntemle ilgi alanı eşleşmesi
yapılabilir. Amaç, öğrenci profiline uygun iş ilanlarını listelemektir. Bu algoritma düzenli aralıklarla
çalışıp öğrenci profilini güncelleyerek uygun ilanlar sıralar.
6.4. Frontend Dashboard: Yönetici ve eğitmenler için grafiksel gösterge panelleri hazırlanır.
Örneğin kurs başarı oranları, günlük kullanıcı sayısı, işlem hacmi gibi metrikler Recharts veya
Chart.js gibi kütüphanelerle sunulur. Bu paneller arka plandaki özet veritabanından veri çeker.
Çok sayıda grafik olması gerekirse, istenen metriklere göre önceden hesaplanmış raporlar
(6.2’deki ETL çıktılarını) kullanılır.
FAZ 7: Deploy ve Güvenlik (Final)
Canlıya geçiş aşaması.
7.1. Yük Testi: Locust gibi performans test aracı kullanılarak ödeme sistemine eş zamanlı istekler
gönderilir. Örneğin aynı anda 1000 kullanıcı ödeme isteği atar. Bu testte aynı
Idempotency-Key ile tekrarlı isteklere rağmen birden çok ödeme çekilmediği doğrulanır .
Aynı anda gelen çoklu ödeme denemeleri sırasında veritabanı tutarlılığı, kuyruk sağlığı ve işlem
süreleri izlenir. Yük testinden çıkan darboğazlar belirlenip (örn. DB yetersiz hızlıysa replica
ekleme) giderilir.
7.2. Sızma Testi (Penetrasyon Testi): Projeye OWASP ZAP veya benzeri araçlarla güvenlik
taraması yapılır . Otomatik araçlar SQL enjeksiyon, XSS, CSRF zafiyetleri tarar. Bulunan
güvenlik açıkları (ex: eski paket versiyonu, eksik input validasyonu vb.) düzeltilir. Ayrıca
mümkünse gerçek bir pentest uzmanıyla (gerçek bir saldırgan gibi) site taraması yapılarak
herhangi bir açıklık kalmadığı kontrol edilir.
7.3. CDN Entegrasyonu: Statik kaynaklar için CDN devreye alınır . Örneğin S3 bucket gibi bir
nesne deposu veya Vite’nin build çıktısı CDN’e yüklenir. Kullanıcılar bu kaynaklara doğrudan CDN
URL’leri ile erişir. Bu sayede farklı coğrafi konumlardaki kullanıcıların yükleme süreleri düşer.
CDN, önbelleğe aldığı dosyaları yakın lokasyondan sunarak yükü sunucu üzerinden kaldırır.
Örneğin CSS/JS dosyaları, fontlar, videolar ve görseller CDN üzerinden servis edilir .
7.4. CI/CD: GitHub Actions veya benzeri bir CI/CD pipeline hazırlanır. Kod her push’ta otomatik
test (birim test, entegrasyon testleri) çalışır. Başarılıysa otomatik olarak test sunucusuna deploy
edilir. Ana branşta birleştirme sonrası ise canlıya deploy sağlanır. Bu süreç Docker image
oluşturma, sürüm etiketi verme ve sunucuya/cluster’a güncel imajları çekme adımlarını içerir.
Pipeline’a güvenlik taramaları (e.g. SAST) eklenebilir. Tüm bu otomasyon, insan hatasını en aza
indirir ve hızlı tekrar üretilebilir teslimat sağlar.
Kaynaklar: Bu doküman güncel güvenlik tavsiyeleri (OWASP Cheat Sheet, Django dökümantasyonu
), mimari örnekleri ve modern uygulama geliştirme pratiklerine dayanmaktadır. Örneğin, “Zero Trust”
•
•
•
•
7
•
16
• 13
13
•
1
3
9
güvenlik modelinin temel kuralı “asla otomatik güvenme, her istekte doğrula” olarak özetlenir .
Benzer şekilde DRY prensibi “kodun tekrarından kaçın, tekrar eden mantığı tek yerde topla” demektir
. İdempotency ile aynı isteğin tekrarı sonucunun değişmemesi sağlanırken , CDN kullanımı
kullanıcıya yakın sunucudan içerik sunarak gecikmeyi azaltır . Bu ve benzeri en iyi uygulamalar,
Akademi İstanbul gibi büyük projelerde güvenli, hızlı ve sürdürülebilir bir yapı kurmayı mümkün kılar. 
