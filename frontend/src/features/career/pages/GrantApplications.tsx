import React, { useEffect, useState } from 'react';
import { Lightbulb, Calendar, Building, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { careerApi } from '@/api/career';

interface Grant {
    id: string;
    title: string;
    organization: string;
    deadline: string;
    amount: string;
}

const GrantApplications: React.FC = () => {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const loadGrants = async () => {
            const data = await careerApi.getGrants();
            setGrants(data);
            setLoading(false);
        };
        loadGrants();
    }, []);

    const handleApply = async (grantId: string) => {
        setApplying(grantId);
        setMessage(null);
        try {
            const response = await careerApi.applyForGrant(grantId);
            if (response.success) {
                setMessage({ type: 'success', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Başvuru sırasında bir hata oluştu.' });
        } finally {
            setApplying(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Fırsatlar yükleniyor...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                    Fırsatlar ve Hibe Başvuruları
                </h1>
                <p className="text-slate-600">Girişimcilik ve proje fikirleriniz için destek programlarını keşfedin.</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    <CheckCircle2 className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grants.map((grant) => (
                    <div key={grant.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                                    {grant.organization}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900">{grant.title}</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-500">Destek Tutarı</div>
                                <div className="font-bold text-green-600">{grant.amount}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <Calendar className="w-4 h-4" />
                            Son Başvuru: <span className="font-medium text-slate-700">{grant.deadline}</span>
                        </div>

                        <button
                            onClick={() => handleApply(grant.id)}
                            disabled={applying === grant.id}
                            className="w-full py-2.5 rounded-xl font-semibold border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {applying === grant.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Başvuruluyor...
                                </>
                            ) : (
                                <>
                                    Başvur
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrantApplications;
