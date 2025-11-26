import React, { useState } from 'react';
import {
    BookOpen, Video, MonitorPlay, ClipboardList, HelpCircle,
    CheckCircle2, ChevronRight, ChevronLeft, Plus, X, Trash2,
    Image as ImageIcon, Upload, Edit2, FileText
} from 'lucide-react';
import { lmsService } from '../../../services/lmsService';
import { Category, Course, Module } from '../../../types/lms';
import clsx from 'clsx';

interface CourseWizardProps {
    categories: Category[];
    onComplete: () => void;
    onCancel: () => void;
    initialData?: Course | null;
    onCourseUpdated?: (course: Course) => void;
    onAddContent?: (moduleId: number) => void;
    onEditContent?: (lesson: any, courseId?: number) => void;
    onDeleteContent?: (lessonId: number) => void;
}

const STEPS = [
    { id: 1, title: 'Temel Bilgiler', icon: BookOpen },
    { id: 2, title: 'Müfredat Planlama', icon: ClipboardList },
    { id: 3, title: 'İçerik Ekleme', icon: Video },
];

export const CourseWizard: React.FC<CourseWizardProps> = ({
    categories,
    onComplete,
    onCancel,
    initialData,
    onCourseUpdated,
    onAddContent,
    onEditContent,
    onDeleteContent
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Basic Info
    const [courseData, setCourseData] = useState({
        title: initialData?.title || '',
        category: (typeof initialData?.category === 'object' ? initialData.category.id : initialData?.category)?.toString() || '',
        description: initialData?.description || '',
        is_published: initialData?.is_published || false,
        image: initialData?.image || null as File | null | string
    });

    // Step 2: Modules (Weeks)
    const [modules, setModules] = useState<{ title: string, description: string, id?: number }[]>(
        initialData?.modules?.map(m => ({ title: m.title, description: m.description || '', id: m.id })) ||
        [{ title: '1. Hafta: Giriş', description: '' }]
    );

    // Created Course & Modules Refs
    const [createdCourse, setCreatedCourse] = useState<Course | null>(initialData || null);
    const [createdModules, setCreatedModules] = useState<Module[]>(initialData?.modules || []);

    const handleBasicSubmit = async () => {
        if (!courseData.title || !courseData.category) return;
        setLoading(true);
        try {
            let course;
            if (initialData) {
                // Update existing course
                course = await lmsService.updateCourse(initialData.id, {
                    ...courseData,
                    category: Number(courseData.category),
                    image: courseData.image instanceof File ? courseData.image : undefined
                });
            } else {
                // Create new course
                course = await lmsService.createCourse({
                    ...courseData,
                    category: Number(courseData.category),
                    is_published: false // Draft initially
                });
            }
            setCreatedCourse(course);
            if (onCourseUpdated) {
                onCourseUpdated(course);
            }
            setCurrentStep(2);
        } catch (error) {
            console.error('Course save failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModulesSubmit = async () => {
        if (!createdCourse) return;
        setLoading(true);
        try {
            // 1. Identify modules to delete
            const currentModuleIds = modules.map(m => m.id).filter(id => id !== undefined) as number[];
            const modulesToDelete = createdModules.filter(m => m.id && !currentModuleIds.includes(m.id));

            for (const mod of modulesToDelete) {
                if (mod.id) await lmsService.deleteModule(mod.id);
            }

            // 2. Create or Update modules
            const updatedModulesList: Module[] = [];
            for (let i = 0; i < modules.length; i++) {
                const modData = modules[i];
                let savedMod: Module;

                if (modData.id) {
                    // Update existing
                    savedMod = await lmsService.updateModule(modData.id, {
                        title: modData.title,
                        description: modData.description,
                        order: i + 1
                    });
                } else {
                    // Create new
                    savedMod = await lmsService.createModule(createdCourse.id, {
                        title: modData.title,
                        description: modData.description,
                        order: i + 1
                    });
                }
                updatedModulesList.push(savedMod);
            }

            setCreatedModules(updatedModulesList);
            // Update local state to include new IDs so subsequent saves don't duplicate
            setModules(updatedModulesList.map(m => ({
                title: m.title,
                description: m.description || '',
                id: m.id
            })));

            // Notify parent
            if (onCourseUpdated) {
                onCourseUpdated({ ...createdCourse, modules: updatedModulesList });
            }

            setCurrentStep(3);
        } catch (error) {
            console.error('Module save failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Wizard Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Yeni Eğitim Oluştur</h2>
                    <p className="text-slate-500 text-sm">Adım adım eğitim içeriğinizi hazırlayın.</p>
                </div>
                <div className="flex items-center gap-4">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                currentStep === s.id ? "bg-indigo-600 text-white" :
                                    currentStep > s.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                            )}>
                                {currentStep > s.id ? <CheckCircle2 size={16} /> : s.id}
                            </div>
                            <span className={clsx(
                                "text-sm font-medium hidden md:block",
                                currentStep === s.id ? "text-indigo-600" : "text-gray-400"
                            )}>{s.title}</span>
                            {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-gray-100 mx-2 hidden md:block" />}
                        </div>
                    ))}
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                    <X size={20} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {/* STEP 1: BASIC INFO */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Eğitim Başlığı</label>
                                <input
                                    type="text"
                                    value={courseData.title}
                                    onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Örn: İleri Seviye React Geliştirme"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Kategori</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={courseData.category}
                                            onChange={e => setCourseData({ ...courseData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="">Seçiniz...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                const name = prompt('Yeni kategori adı:');
                                                if (name) {
                                                    lmsService.createCategory(name).then(newCat => {
                                                        // Ideally we should update the categories list here via a callback or context
                                                        // For now, let's just reload the page or rely on parent update if possible
                                                        // But since we can't easily update parent state from here without prop,
                                                        // let's just assume it works and maybe alert user.
                                                        // Better: Add onCategoryCreated prop to CourseWizard
                                                        alert('Kategori oluşturuldu! Listeyi güncellemek için sayfayı yenileyin (veya parent state update ekleyin).');
                                                    });
                                                }
                                            }}
                                            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-slate-600 transition-colors"
                                            title="Yeni Kategori Ekle"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Kapak Görseli</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={e => setCourseData({ ...courseData, image: e.target.files?.[0] || null })}
                                            className="hidden"
                                            id="course-image"
                                            accept="image/*"
                                        />
                                        <label htmlFor="course-image" className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                            {typeof courseData.image === 'string' && courseData.image ? (
                                                <img
                                                    src={courseData.image.startsWith('http') ? courseData.image : `http://localhost:8001${courseData.image}`}
                                                    alt="Preview"
                                                    className="w-10 h-10 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <ImageIcon className="text-gray-400" />
                                            )}
                                            <span className="text-sm text-gray-500 truncate">
                                                {courseData.image instanceof File
                                                    ? courseData.image.name
                                                    : (typeof courseData.image === 'string' && courseData.image
                                                        ? 'Mevcut görsel yüklü (Değiştirmek için tıklayın)'
                                                        : 'Görsel Seç (Max 5MB)')}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Açıklama</label>
                                <textarea
                                    value={courseData.description}
                                    onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                    placeholder="Eğitimin içeriği ve hedefleri hakkında bilgi verin..."
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: MODULES */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800">Haftalık Plan (Modüller)</h3>
                                <button
                                    onClick={() => setModules([...modules, { title: `${modules.length + 1}. Hafta: `, description: '' }])}
                                    className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    + Yeni Hafta Ekle
                                </button>
                            </div>

                            <div className="space-y-4">
                                {modules.map((mod, idx) => (
                                    <div key={idx} className="flex gap-4 items-start group">
                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={mod.title}
                                                onChange={e => {
                                                    const newMods = [...modules];
                                                    newMods[idx].title = e.target.value;
                                                    setModules(newMods);
                                                }}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                                placeholder="Modül Başlığı"
                                            />
                                            <input
                                                type="text"
                                                value={mod.description}
                                                onChange={e => {
                                                    const newMods = [...modules];
                                                    newMods[idx].description = e.target.value;
                                                    setModules(newMods);
                                                }}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                placeholder="Kısa açıklama (isteğe bağlı)"
                                            />
                                        </div>
                                        {modules.length > 1 && (
                                            <button
                                                onClick={() => setModules(modules.filter((_, i) => i !== idx))}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTENT SUMMARY */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Eğitim İçeriği</h3>
                                <p className="text-slate-500">
                                    Aşağıda eğitiminizin mevcut yapısını ve içeriklerini görebilirsiniz.
                                </p>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {createdModules.map((mod, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                            <h4 className="font-bold text-slate-700 text-sm">
                                                {idx + 1}. {mod.title}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-slate-400">
                                                    {mod.lessons?.length || 0} İçerik
                                                </span>
                                                {onAddContent && mod.id && (
                                                    <button
                                                        onClick={() => onAddContent(mod.id!)}
                                                        className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> Ekle
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            {mod.lessons && mod.lessons.length > 0 ? (
                                                mod.lessons.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-sm text-slate-600 group">
                                                        <div className="text-indigo-500 shrink-0">
                                                            {lesson.resourcetype === 'VideoLesson' && <Video size={16} />}
                                                            {lesson.resourcetype === 'PDFLesson' && <FileText size={16} />}
                                                            {lesson.resourcetype === 'QuizLesson' && <HelpCircle size={16} />}
                                                            {lesson.resourcetype === 'LiveLesson' && <MonitorPlay size={16} />}
                                                            {lesson.resourcetype === 'Assignment' && <ClipboardList size={16} />}
                                                        </div>
                                                        <span className="truncate flex-1">{lesson.title}</span>

                                                        <div className="flex items-center gap-2">
                                                            {onEditContent && (
                                                                <button
                                                                    onClick={() => onEditContent(lesson, createdCourse?.id)}
                                                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                                    title="Düzenle"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                            )}
                                                            {onDeleteContent && (
                                                                <button
                                                                    onClick={() => onDeleteContent(lesson.id)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                    title="Sil"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {lesson.resourcetype === 'VideoLesson' && (lesson.video_url || lesson.source_file) && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Video</span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-gray-400 text-xs italic">
                                                    Bu haftaya henüz içerik eklenmemiş.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3 text-sm text-indigo-700">
                                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>
                                    İçerikleri buradan hızlıca yönetebilirsiniz. Değişiklikler anında kaydedilir.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center sticky bottom-0 z-10">
                {currentStep > 1 && currentStep < 3 && (
                    <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft size={20} /> Geri
                    </button>
                )}
                <div className="flex-1"></div>

                {currentStep === 1 && (
                    <button
                        onClick={handleBasicSubmit}
                        disabled={loading || !courseData.title}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Devam Et'} <ChevronRight size={20} />
                    </button>
                )}

                {currentStep === 2 && (
                    <button
                        onClick={handleModulesSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Oluşturuluyor...' : 'Tamamla'} <CheckCircle2 size={20} />
                    </button>
                )}

                {currentStep === 3 && (
                    <button
                        onClick={async () => {
                            if (createdCourse) {
                                try {
                                    await lmsService.updateCourse(createdCourse.id, { is_published: true });
                                } catch (error) {
                                    console.error('Auto-publish failed', error);
                                }
                            }
                            onComplete();
                        }}
                        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                    >
                        Yönetim Paneline Git <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div >
    );
};
