import React, { useEffect, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { commerceApi, Plan } from '@/api/commerce';

const PlanSelector: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlans = async () => {
            const data = await commerceApi.getPlans();
            setPlans(data);
            setLoading(false);
        };
        loadPlans();
    }, []);

    if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl shadow-lg border p-8 flex flex-col ${plan.recommended ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' : 'border-slate-200'}`}
                >
                    {plan.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Önerilen
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-6">
                        {plan.price === 0 ? 'Ücretsiz' : `₺${plan.price}`}
                        <span className="text-base font-normal text-slate-500 ml-1">/ay</span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.recommended
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}>
                        Planı Seç
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PlanSelector;
