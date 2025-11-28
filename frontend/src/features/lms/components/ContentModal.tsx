import React, { useEffect } from 'react';
import { X, Video, FileText, MonitorPlay, ClipboardList, HelpCircle, Upload } from 'lucide-react';
import clsx from 'clsx';
import { Course } from '../../../types/lms';
import { EducationCategory } from '../pages/MyEducation';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalContentType: EducationCategory;
    setModalContentType: (type: EducationCategory) => void;
    contentData: any;
    setContentData: (data: any) => void;
    onSubmit: () => void;
    courses: Course[];
    selectedCourseId: string;
    setSelectedCourseId: (id: string) => void;
    selectedWeek: string;
    setSelectedWeek: (week: string) => void;
    editingLessonId: number | null;
    setEditingLessonId: (id: number | null) => void;
    loading: boolean;
    actionText: string;
}

export const ContentModal: React.FC<ContentModalProps> = ({
    isOpen,
    onClose,
    modalContentType,
    setModalContentType,
    contentData,
    setContentData,
    onSubmit,
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedWeek,
    setSelectedWeek,
    editingLessonId,
    setEditingLessonId,
    loading,
    actionText
}) => {
    // CRITICAL FIX: Reset editingLessonId when opening modal for NEW content
    useEffect(() => {
        if (isOpen && !contentData.title && editingLessonId !== null) {
            setEditingLessonId(null);
        }
    }, [isOpen, contentData.title, editingLessonId, setEditingLessonId]);

    if (!isOpen) return null;

    const selectedCourseData = courses.find(c => c.id.toString() === selectedCourseId);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">{actionText}</h3>
                    <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-lg transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Course Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Hangi Ders İçin?</label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Ders Seçiniz...</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Module Selection */}
                    {selectedCourseId && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Hangi Hafta/Modül?</label>
                            <select
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Modül Seçiniz...</option>
                                {selectedCourseData?.modules?.map(m => (
                                    <option key={m.id} value={m.id}>{m.title}</option>
                                ))}
                            </select>
                            {(!selectedCourseData?.modules?.length) && (
                                <p className="text-xs text-red-500">Bu derse ait modül bulunamadı. Önce dersi düzenleyip modül ekleyin.</p>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">İçerik Başlığı</label>
                        <input
                            type="text"
                            value={contentData.title || ''}
                            onChange={e => setContentData({ ...contentData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Örn: React Giriş Dersi"
                        />
                    </div>

                    {/* Content Type Tabs */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">İçerik Tipi</label>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setModalContentType('videos')}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                                    modalContentType === 'videos'
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <Video size={16} className="inline mr-2" />
                                Video
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalContentType('documents')}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                                    modalContentType === 'documents'
                                        ? "bg-orange-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <FileText size={16} className="inline mr-2" />
                                Ders Materyali
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalContentType('live')}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                                    modalContentType === 'live'
                                        ? "bg-red-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <MonitorPlay size={16} className="inline mr-2" />
                                Canlı Ders
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalContentType('quizzes')}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                                    modalContentType === 'quizzes'
                                        ? "bg-teal-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <HelpCircle size={16} className="inline mr-2" />
                                Quiz
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalContentType('assignments')}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                                    modalContentType === 'assignments'
                                        ? "bg-purple-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <ClipboardList size={16} className="inline mr-2" />
                                Ödev
                            </button>
                        </div>
                    </div>

                    {/* Content Type Specific Fields */}
                    {modalContentType === 'videos' && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={contentData.useUrl === true}
                                        onChange={() => setContentData({ ...contentData, useUrl: true, file: null })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">YouTube URL</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={contentData.useUrl === false}
                                        onChange={() => setContentData({ ...contentData, useUrl: false, video_url: '' })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Dosya Yükle</span>
                                </label>
                            </div>

                            {contentData.useUrl ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">YouTube Video URL</label>
                                    <input
                                        type="url"
                                        value={contentData.video_url || ''}
                                        onChange={e => setContentData({ ...contentData, video_url: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Video Dosyası</label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Client-side validation (100MB limit)
                                                const maxSize = 100 * 1024 * 1024;
                                                if (file.size > maxSize) {
                                                    alert(
                                                        `Video boyutu 100MB'dan küçük olmalıdır.\n` +
                                                        `Seçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`
                                                    );
                                                    e.target.value = '';
                                                    return;
                                                }
                                                // CRITICAL: Clear video_url when file is selected
                                                setContentData({
                                                    ...contentData,
                                                    file,
                                                    useUrl: false,
                                                    video_url: '' // Clear URL to prevent conflicts
                                                });
                                            }
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Maksimum dosya boyutu: 100MB. Desteklenen formatlar: MP4, MOV, AVI, MKV, WEBM
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {modalContentType === 'documents' && (
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                            <label className="text-sm font-medium text-slate-700">Dosya Yükle (PDF, DOCX, XLSX - Max 5MB)</label>
                            {contentData.existingFile && (
                                <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-900">Mevcut Dosya</p>
                                        <a
                                            href={typeof contentData.existingFile === 'string' && contentData.existingFile.startsWith('http')
                                                ? contentData.existingFile
                                                : `http://localhost:8001${contentData.existingFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-indigo-600 hover:underline"
                                        >
                                            Dosyayı Görüntüle
                                        </a>
                                    </div>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={e => setContentData({ ...contentData, file: e.target.files?.[0] })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {contentData.existingFile && (
                                <p className="text-xs text-slate-500">Yeni dosya seçerseniz mevcut dosya değiştirilecektir.</p>
                            )}
                        </div>
                    )}

                    {modalContentType === 'live' && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Başlangıç Zamanı</label>
                                <input
                                    type="datetime-local"
                                    value={contentData.start_time || ''}
                                    onChange={e => setContentData({ ...contentData, start_time: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Toplantı Linki</label>
                                <input
                                    type="url"
                                    value={contentData.meeting_link || ''}
                                    onChange={e => setContentData({ ...contentData, meeting_link: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="https://zoom.us/j/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Süre (dakika)</label>
                                <input
                                    type="number"
                                    value={contentData.duration || ''}
                                    onChange={e => setContentData({ ...contentData, duration: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="60"
                                />
                            </div>
                        </div>
                    )}

                    {modalContentType === 'quizzes' && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Süre (dakika)</label>
                                <input
                                    type="number"
                                    value={contentData.duration_minutes || ''}
                                    onChange={e => setContentData({ ...contentData, duration_minutes: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Geçme Puanı (%)</label>
                                <input
                                    type="number"
                                    value={contentData.passing_score || ''}
                                    onChange={e => setContentData({ ...contentData, passing_score: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="70"
                                />
                            </div>
                        </div>
                    )}

                    {modalContentType === 'assignments' && (
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">Ödev detayları ders tamamlandıktan sonra düzenlenebilir.</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-gray-100 transition"
                    >
                        İptal
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading || !selectedCourseId || !selectedWeek || !contentData.title}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};
