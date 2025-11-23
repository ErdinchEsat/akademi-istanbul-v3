import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface PaymentFailureProps {
    onRetry: () => void;
    onCancel: () => void;
}

const PaymentFailure: React.FC<PaymentFailureProps> = ({ onRetry, onCancel }) => {
    return (
        <div className="max-w-2xl mx-auto p-8 text-center pt-20">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <XCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">Ödeme Başarısız</h1>
            <p className="text-slate-600 mb-8 text-lg">
                İşleminiz sırasında bir hata oluştu. Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz.
            </p>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-left max-w-md mx-auto">
                <p className="text-red-800 text-sm font-medium">Hata Kodu: ERR_PAYMENT_DECLINED</p>
                <p className="text-red-600 text-xs mt-1">Banka tarafından işlem reddedildi. Yetersiz bakiye veya güvenlik kısıtlaması olabilir.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onRetry}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    Tekrar Dene
                </button>

                <button
                    onClick={onCancel}
                    className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    İptal Et
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
