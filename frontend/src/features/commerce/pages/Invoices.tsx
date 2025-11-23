import React, { useEffect, useState } from 'react';
import { FileText, Download, Search } from 'lucide-react';
import { commerceApi, Invoice } from '@/api/commerce';

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInvoices = async () => {
            const data = await commerceApi.getInvoices();
            setInvoices(data);
            setLoading(false);
        };
        loadInvoices();
    }, []);

    if (loading) return <div className="p-8 text-center">Faturalar yükleniyor...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    Fatura Geçmişi
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Fatura Ara..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Fatura No</th>
                            <th className="p-4 font-semibold text-slate-600">Tarih</th>
                            <th className="p-4 font-semibold text-slate-600">Açıklama</th>
                            <th className="p-4 font-semibold text-slate-600">Tutar</th>
                            <th className="p-4 font-semibold text-slate-600">Durum</th>
                            <th className="p-4 font-semibold text-slate-600">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-sm text-slate-500">#{invoice.id}</td>
                                <td className="p-4 text-slate-900">{invoice.date}</td>
                                <td className="p-4 text-slate-600">{invoice.items.join(', ')}</td>
                                <td className="p-4 font-bold text-slate-900">₺{invoice.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {invoice.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium">
                                        <Download className="w-4 h-4" />
                                        PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
