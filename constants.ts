
import { Tenant, Course, Badge, UserRole, Job, ForumPost, LeaderboardUser } from './types';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'umraniye',
    name: 'Ümraniye Akademi',
    logo: 'https://images.unsplash.com/photo-1555696958-c5049b866f63?auto=format&fit=crop&w=100&h=100&q=80',
    color: 'emerald',
    type: 'Municipality'
  },
  {
    id: 'ibb',
    name: 'Enstitü İstanbul İSMEK',
    logo: 'https://images.unsplash.com/photo-1565058159260-644a46d8f619?auto=format&fit=crop&w=100&h=100&q=80',
    color: 'blue',
    type: 'Municipality'
  },
  {
    id: 'tech',
    name: 'Yazılım Akademisi',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60211614d8?auto=format&fit=crop&w=100&h=100&q=80',
    color: 'violet',
    type: 'Corporate'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'YKS Matematik: İleri Düzey Fonksiyonlar',
    tenantId: 'umraniye',
    category: 'Sınav Hazırlık',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    progress: 75,
    instructor: 'Dr. Ahmet Yılmaz',
    totalModules: 24,
    completedModules: 18,
    rating: 4.8,
    isLive: true,
    nextLiveDate: 'Bugün, 14:00',
    description: 'Üniversite sınavına hazırlık kapsamında fonksiyonlar, limit ve türev konularının derinlemesine analizi.',
    modules: [
        { id: 1, title: "Fonksiyonlara Giriş", duration: "15 dk", type: "video", isCompleted: true },
        { id: 2, title: "Grafik Okuma Teknikleri", duration: "22 dk", type: "video", isCompleted: true },
        { 
          id: 3, 
          title: "Canlı Soru Çözüm Kampı", 
          duration: "Canlı", 
          type: "live", 
          isCompleted: false 
        },
        { 
          id: 4, 
          title: "Bölüm Sonu Testi", 
          duration: "30 dk", 
          type: "quiz", 
          isCompleted: false,
          quizData: [
            { id: 1, text: "f(x) = 2x + 5 ise f(3) kaçtır?", options: ["8", "9", "11", "13"], correctOption: 2 },
            { id: 2, text: "Bir fonksiyonun birebir olması için ne gereklidir?", options: ["Yatay doğru testi", "Dikey doğru testi", "Türev testi", "İntegral"], correctOption: 0 },
            { id: 3, text: "Limit x -> 0 iken sin(x)/x değeri nedir?", options: ["0", "1", "Tanımsız", "Sonsuz"], correctOption: 1 }
          ]
        },
        { id: 5, title: "Türevin Geometrik Yorumu", duration: "18 dk", type: "video", isCompleted: false },
    ]
  },
  {
    id: '2',
    title: 'Sıfırdan İleri Seviye React & Next.js',
    tenantId: 'tech',
    category: 'Yazılım',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    progress: 12,
    instructor: 'Zeynep Demir (Lead Dev)',
    totalModules: 40,
    completedModules: 5,
    rating: 4.9,
    description: 'Modern web geliştirme dünyasına adım atın. Hooklar, State yönetimi ve SSR konuları.',
    modules: [
        { id: 1, title: "React Ekosistemi", duration: "10 dk", type: "video", isCompleted: true },
        { id: 2, title: "Kurulum ve Konfigürasyon", duration: "15 dk", type: "video", isCompleted: true },
        { id: 3, title: "İlk Bileşen (Component)", duration: "20 dk", type: "video", isCompleted: false },
        { id: 4, title: "Ders Kaynak Kodları", duration: "PDF", type: "document", isCompleted: false },
    ]
  },
  {
    id: '3',
    title: 'Dijital Pazarlama ve Sosyal Medya Uzmanlığı',
    tenantId: 'ibb',
    category: 'Mesleki Gelişim',
    imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    progress: 0,
    instructor: 'Caner Öztürk',
    totalModules: 15,
    completedModules: 0,
    rating: 4.5,
    description: 'KOBİ\'ler ve girişimciler için marka yönetimi ve reklam stratejileri.'
  },
  {
    id: '4',
    title: 'LGS Fen Bilimleri: DNA ve Genetik Kod',
    tenantId: 'umraniye',
    category: 'Sınav Hazırlık',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    progress: 100,
    instructor: 'Elif Kaya',
    totalModules: 20,
    completedModules: 20,
    rating: 4.7,
    description: 'Liseye geçiş sınavı için kritik konuların animasyonlarla anlatımı.'
  },
  {
    id: '5',
    title: 'Sağlık Turizmi ve İngilizce İletişim',
    tenantId: 'ibb',
    category: 'Dil Eğitimi',
    imageUrl: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800&q=80',
    progress: 0,
    instructor: 'Michael Brown',
    totalModules: 12,
    completedModules: 0,
    rating: 4.6,
    description: 'Sağlık çalışanları için özel hazırlanmış, hasta iletişimi odaklı İngilizce eğitimi.'
  }
];

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Hızlı Başlangıç',
    icon: '🚀',
    description: 'Platformdaki ilk dersini başarıyla tamamladın.',
    earnedAt: '2024-01-10'
  },
  {
    id: 'b2',
    name: '7 Günlük Seri',
    icon: '🔥',
    description: 'Öğrenme azmi! 7 gün üst üste giriş yaptın.',
    earnedAt: '2024-01-17'
  },
  {
    id: 'b3',
    name: 'Sınav Canavarı',
    icon: '🏆',
    description: 'Türkiye geneli deneme sınavında %90 başarı sağladın.'
  },
  {
    id: 'b4',
    name: 'Yapay Zeka Meraklısı',
    icon: '🤖',
    description: 'Yapay Zeka ile ilgili 3 farklı modülü tamamladın.'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Junior Frontend Geliştirici',
    company: 'İstanbul Bilişim A.Ş.',
    location: 'Şişli, İstanbul',
    type: 'Tam Zamanlı',
    postedDate: '2 gün önce',
    matchScore: 95,
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&h=100&q=80'
  },
  {
    id: 'j2',
    title: 'Veri Analisti Stajyeri',
    company: 'İBB Veri Laboratuvarı',
    location: 'Maslak, İstanbul',
    type: 'Staj',
    postedDate: 'Yeni',
    matchScore: 88,
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=100&h=100&q=80'
  },
  {
    id: 'j3',
    title: 'Dijital Medya Uzmanı',
    company: 'Kültür A.Ş.',
    location: 'Beyoğlu, İstanbul',
    type: 'Tam Zamanlı',
    postedDate: '1 hafta önce',
    matchScore: 70,
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&h=100&q=80'
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    user: 'Ayşe K.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    date: '2 saat önce',
    content: '3. Modüldeki türev sorusunda x\'in değerini nasıl bulduk? Videoda orası biraz hızlı geçilmiş.',
    likes: 5,
    replies: 2
  },
  {
    id: '2',
    user: 'Mehmet T.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    date: '5 saat önce',
    content: 'Arkadaşlar bu konunun PDF notlarında sayfa 4 eksik gibi, sizde de öyle mi?',
    likes: 12,
    replies: 8
  }
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Selin Y.', points: 2450, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', trend: 'same' },
  { rank: 2, name: 'Burak Ö.', points: 2320, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80', trend: 'up' },
  { rank: 3, name: 'Ali Yılmaz', points: 2150, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80', trend: 'down' }, // Current User
  { rank: 4, name: 'Zeynep A.', points: 1980, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', trend: 'up' },
  { rank: 5, name: 'Can K.', points: 1850, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', trend: 'down' },
];

export const MOCK_USERS = {
  student: {
    id: 'u1',
    name: 'Ali Yılmaz',
    role: UserRole.STUDENT,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200&q=80',
    tenantId: 'umraniye',
    email: 'ali.yilmaz@student.com',
    title: 'Bilgisayar Müh. Öğrencisi',
    points: 2150
  },
  admin: {
    id: 'a1',
    name: 'Ayşe Yönetici',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    email: 'ayse@akademi.istanbul',
    title: 'Sistem Yöneticisi'
  },
  instructor: {
    id: 'i1',
    name: 'Mehmet Hoca',
    role: UserRole.INSTRUCTOR,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
    tenantId: 'tech',
    email: 'mehmet@tech.com',
    title: 'Kıdemli Yazılım Eğitmeni'
  }
};
