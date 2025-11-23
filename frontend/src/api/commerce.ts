import api from './axios';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    type: 'course' | 'subscription' | 'service';
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    items: string[];
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
}

export const commerceApi = {
    getCart: () => {
        return new Promise<CartItem[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        product: { id: 'p1', name: 'İleri Seviye React Eğitimi', price: 499, description: 'Kapsamlı React kursu', type: 'course' },
                        quantity: 1
                    },
                    {
                        id: '2',
                        product: { id: 'p2', name: 'Yıllık Pro Üyelik', price: 1200, description: 'Tüm eğitimlere sınırsız erişim', type: 'subscription' },
                        quantity: 1
                    }
                ]);
            }, 500);
        });
    },

    getInvoices: () => {
        return new Promise<Invoice[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'INV-2024-001', date: '2024-01-15', amount: 499, status: 'paid', items: ['İleri Seviye React Eğitimi'] },
                    { id: 'INV-2023-128', date: '2023-12-20', amount: 1200, status: 'paid', items: ['Yıllık Pro Üyelik'] },
                ]);
            }, 500);
        });
    },

    getPlans: () => {
        return new Promise<Plan[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'basic',
                        name: 'Başlangıç',
                        price: 0,
                        features: ['Temel Dersler', 'Sertifika Yok', 'Topluluk Erişimi']
                    },
                    {
                        id: 'pro',
                        name: 'Profesyonel',
                        price: 199,
                        features: ['Tüm Dersler', 'Sertifikalar', 'Canlı Soru-Cevap', 'Kariyer Danışmanlığı'],
                        recommended: true
                    },
                    {
                        id: 'enterprise',
                        name: 'Kurumsal',
                        price: 999,
                        features: ['Sınırsız Kullanıcı', 'Özel Raporlama', 'API Erişimi', 'Özel Eğitmen Desteği']
                    }
                ]);
            }, 500);
        });
    }
};
