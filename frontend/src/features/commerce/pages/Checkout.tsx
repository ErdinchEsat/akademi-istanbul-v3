import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
    onSuccess?: () => void;
    onFailure?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock payment processing
        setTimeout(() => {
            setLoading(false);
            // Random success/failure for demo purposes (mostly success)
            if (Math.random() > 0.1) {
                if (onSuccess) onSuccess();
            } else {
                if (onFailure) onFailure();
            }
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-indigo-600" />
                Güvenli Ödeme
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg text-slate-800">Kart Bilgileri</h2>
                            <div className="flex gap-2">
                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Üzerindeki İsim</label>
                                <input
                                    type="text"
                                    placeholder="Ad Soyad"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Numarası</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pl-12"
                                        required
                                    />
                                    <CreditCard className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Son Kullanma Tarihi</label>
                                    <input
                                        type="text"
                                        placeholder="AA/YY"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pl-10"
                                            required
                                        />
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 justify-center">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>256-bit SSL ile güvenli ödeme</span>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4">Sipariş Özeti</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Ara Toplam</span>
                                <span className="font-medium">₺12,500.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">KDV (%20)</span>
                                <span className="font-medium">₺2,500.00</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-slate-900">Toplam</span>
                                <span className="font-bold text-xl text-indigo-600">₺15,000.00</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Ödeme işleminiz tamamlandıktan sonra faturanız e-posta adresinize gönderilecektir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
