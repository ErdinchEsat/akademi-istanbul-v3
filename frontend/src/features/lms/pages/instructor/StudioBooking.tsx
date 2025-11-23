import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { lmsApi } from '@/api/lms';

const StudioBooking: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<{ id: string; time: string; available: boolean }[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await lmsApi.getStudioSlots(selectedDate);
            setSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (slotId: string) => {
        setBookingLoading(slotId);
        setMessage(null);
        try {
            const response = await lmsApi.bookStudio(slotId, selectedDate);
            if (response.success) {
                setMessage({ type: 'success', text: response.message });
                // Refresh slots to show updated availability (mock logic would need state update)
                setSlots(prev => prev.map(s => s.id === slotId ? { ...s, available: false } : s));
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Rezervasyon sırasında bir hata oluştu.' });
        } finally {
            setBookingLoading(null);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Stüdyo Rezervasyonu</h1>
                <p className="text-slate-600">İçerik üretimi için profesyonel stüdyolarımızdan yer ayırtın.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Date Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Tarih Seçin
                    </h3>
                    <input
                        type="date"
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* Slots */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            Müsait Saatler ({selectedDate})
                        </h3>

                        {message && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        disabled={!slot.available || bookingLoading !== null}
                                        onClick={() => handleBook(slot.id)}
                                        className={`
                      relative p-4 rounded-xl border text-center transition-all
                      ${slot.available
                                                ? 'border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer bg-white'
                                                : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'}
                      ${bookingLoading === slot.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                    `}
                                    >
                                        <span className="block text-lg font-bold mb-1">{slot.time}</span>
                                        <span className="text-xs font-medium">
                                            {slot.available ? 'Müsait' : 'Dolu'}
                                        </span>
                                        {bookingLoading === slot.id && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                                                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudioBooking;
