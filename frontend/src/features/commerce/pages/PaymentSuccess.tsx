import React from 'react';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';

interface PaymentSuccessProps {
    onContinue: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onContinue }) => {
    return (
        <div className="max-w-2xl mx-auto p-8 text-center pt-20">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">Ödeme Başarılı!</h1>
            <p className="text-slate-600 mb-8 text-lg">
                Siparişiniz başarıyla alındı. Teşekkür ederiz.
                <br />
                Sipariş numaranız: <span className="font-mono font-bold text-slate-900">#ORD-2024-8392</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onContinue}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                    Alışverişe Devam Et
                    <ArrowRight className="w-5 h-5" />
                </button>

                <button className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Faturayı İndir
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
