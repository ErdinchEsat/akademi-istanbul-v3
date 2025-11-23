import React, { useState } from 'react';
import { KeyRound, ArrowRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authApi } from '@/api/auth';

interface ActivationCodeInputProps {
    onSuccess: (tenantId: string) => void;
}

const ActivationCodeInput: React.FC<ActivationCodeInputProps> = ({ onSuccess }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await authApi.validateActivationCode(code);
            if (response.valid && response.tenantId) {
                setSuccessMsg(response.message || 'Başarılı!');
                setTimeout(() => {
                    onSuccess(response.tenantId!);
                }, 1000);
            } else {
                setError(response.message || 'Geçersiz kod.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleVerify} className="space-y-4">
                <div>
                    <label htmlFor="activation-code" className="block text-sm font-medium text-slate-700 mb-1">
                        Eğitim Aktivasyon Kodu
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            id="activation-code"
                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase tracking-widest font-mono placeholder:normal-case placeholder:tracking-normal"
                            placeholder="Örn: IBB2024"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            disabled={loading || !!successMsg}
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !code || !!successMsg}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Doğrulanıyor...
                        </>
                    ) : successMsg ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Yönlendiriliyor...
                        </>
                    ) : (
                        <>
                            Kodu Doğrula
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-500">
                Belediye veya kurumunuzdan aldığınız kodu girerek eğitimlere ücretsiz erişebilirsiniz.
            </p>
        </div>
    );
};

export default ActivationCodeInput;
