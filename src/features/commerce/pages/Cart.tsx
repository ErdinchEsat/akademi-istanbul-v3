import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { commerceApi, CartItem } from '@/api/commerce';

interface CartProps {
    onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCart = async () => {
            const data = await commerceApi.getCart();
            setItems(data);
            setLoading(false);
        };
        loadCart();
    }, []);

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    if (loading) return <div className="p-8 text-center">Sepet yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-indigo-600" />
                Alışveriş Sepeti
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">Sepetinizde ürün bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    Img
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                                    <p className="text-sm text-slate-500">{item.product.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">₺{item.product.price}</div>
                                    <button className="text-red-500 hover:text-red-700 p-2 mt-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="h-fit bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4">Sipariş Özeti</h3>
                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Ara Toplam</span>
                                <span>₺{total}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>KDV (%20)</span>
                                <span>₺{(total * 0.2).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-slate-900">
                                <span>Toplam</span>
                                <span>₺{(total * 1.2).toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Ödemeye Geç
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
