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
    { id: 2, title: 'İçerik Yönetimi', icon: Video },
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
    const [addingWeek, setAddingWeek] = useState(false);

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

    // Update createdCourse and createdModules when initialData changes (e.g., after lesson update)
    React.useEffect(() => {
        if (initialData) {
            setCreatedCourse(initialData);
            setCreatedModules(initialData.modules || []);
        }
    }, [initialData]);

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

            // Step 2 is the last step now, no need to navigate
        } catch (error) {
            console.error('Module save failed', error);
        } finally {
            setLoading(false);
        }
    };

    // Add new week and immediately save to backend
    const handleAddWeek = async () => {
        if (!createdCourse) return;

        setAddingWeek(true);
        const newWeekTitle = `${modules.length + 1}. Hafta`;

        try {
            // Create module in backend immediately
            const newModule = await lmsService.createModule(createdCourse.id, {
                title: newWeekTitle,
                description: '',
                order: modules.length + 1
            });

            // Update both modules and createdModules states
            const newModuleData = { title: newModule.title, description: newModule.description || '', id: newModule.id };
            setModules(prev => [...prev, newModuleData]);
            setCreatedModules(prev => [...prev, newModule]);

            // Notify parent about the update
            if (onCourseUpdated && createdCourse) {
                onCourseUpdated({ ...createdCourse, modules: [...createdModules, newModule] });
            }

            // Scroll to new week
            setTimeout(() => {
                const weekCards = document.querySelectorAll('[data-week-card]');
                weekCards[weekCards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } catch (error) {
            console.error('Failed to add week', error);
        } finally {
            setAddingWeek(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Modal Header - Modernized with Navigation */}
            <div className="relative overflow-hidden p-6 border-b border-gray-100 bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/30">
                <div className="flex items-center justify-between">
                    {/* Left: Back Button */}
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ChevronLeft size={20} /> Geri
                        </button>
                    )}
                    {currentStep === 1 && <div className="w-24"></div>}

                    {/* Center: Step Progress */}
                    <div className="flex items-center gap-2">
                        {STEPS.map((s, i) => {
                            const StepIcon = s.icon;
                            const isActive = currentStep === s.id;
                            const isCompleted = currentStep > s.id;

                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex items-center gap-3 group">
                                        <div className={clsx(
                                            "relative w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300",
                                            isActive && "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 scale-110",
                                            isCompleted && "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
                                            !isActive && !isCompleted && "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                        )}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <StepIcon className="w-5 h-5" />
                                            )}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 animate-ping opacity-20" />
                                            )}
                                        </div>
                                        <div className="hidden md:block">
                                            <div className={clsx(
                                                "text-sm font-bold transition-colors",
                                                isActive && "text-indigo-600",
                                                isCompleted && "text-green-600",
                                                !isActive && !isCompleted && "text-gray-400"
                                            )}>
                                                {s.title}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Adım {s.id}/2
                                            </div>
                                        </div>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 bg-gray-100 rounded-full overflow-hidden min-w-[40px] max-w-[100px]">
                                            <div
                                                className={clsx(
                                                    "h-full rounded-full transition-all duration-500",
                                                    currentStep > s.id
                                                        ? "w-full bg-gradient-to-r from-green-400 to-emerald-400"
                                                        : "w-0 bg-gradient-to-r from-indigo-400 to-purple-400"
                                                )}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                        {currentStep === 1 && (
                            <button
                                onClick={handleBasicSubmit}
                                disabled={loading || !courseData.title || !courseData.category}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Devam Et <ChevronRight size={18} />
                            </button>
                        )}
                        {currentStep === 2 && (
                            <button
                                onClick={() => {
                                    handleModulesSubmit();
                                    onComplete();
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-md transition-all disabled:opacity-50"
                            >
                                Tamamla <CheckCircle2 size={18} />
                            </button>
                        )}
                        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area - More Spacious */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

                    {/* STEP 1: BASIC INFO */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Course Title - Full Width */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                                    Eğitim Başlığı
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={courseData.title}
                                        onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-300 text-lg placeholder:text-gray-400 group-hover:border-gray-300"
                                        placeholder="Örn: İleri Seviye React Geliştirme"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                                    Öğrencilerin göreceği ana başlık
                                </p>
                            </div>

                            {/* Category & Image - Side by Side */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                                        Kategori
                                    </label>
                                    <div className="flex gap-3">
                                        <select
                                            value={courseData.category}
                                            onChange={e => setCourseData({ ...courseData, category: e.target.value })}
                                            className="flex-1 px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-300 hover:border-gray-300 cursor-pointer"
                                        >
                                            <option value="">Kategori seçiniz...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                const name = prompt('Yeni kategori adı:');
                                                if (name) {
                                                    lmsService.createCategory(name).then(() => {
                                                        alert('Kategori oluşturuldu! Listeyi güncellemek için sayfayı yenileyin.');
                                                    });
                                                }
                                            }}
                                            className="group p-4 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl text-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                            title="Yeni Kategori Ekle"
                                        >
                                            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Cover Image */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                                        Kapak Görseli
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={e => setCourseData({ ...courseData, image: e.target.files?.[0] || null })}
                                            className="hidden"
                                            id="course-image"
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="course-image"
                                            className="group flex items-center gap-4 px-5 py-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 transition-all duration-300"
                                        >
                                            {typeof courseData.image === 'string' && courseData.image ? (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-indigo-200">
                                                    <img
                                                        src={courseData.image.startsWith('http') ? courseData.image : `http://localhost:8001${courseData.image}`}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                                                    <ImageIcon className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" size={28} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 truncate">
                                                    {courseData.image instanceof File
                                                        ? courseData.image.name
                                                        : (typeof courseData.image === 'string' && courseData.image
                                                            ? 'Görsel yüklü ✓'
                                                            : 'Görsel yükle')}
                                                </p>
                                                <p className="text-xs text-slate-500">Max 5MB • JPG, PNG</p>
                                            </div>
                                            <Upload className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" size={20} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Description - Full Width */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                                    Açıklama
                                </label>
                                <div className="relative group">
                                    <textarea
                                        value={courseData.description}
                                        onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-300 h-36 resize-none placeholder:text-gray-400 group-hover:border-gray-300"
                                        placeholder="Eğitimin içeriği, hedefleri ve öğrencilerin kazanacağı beceriler hakkında bilgi verin..."
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                                        Detaylı ve ilgi çekici bir açıklama yazın
                                    </span>
                                    <span className="text-slate-400">{courseData.description.length}/500</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CONTENT MANAGEMENT (MERGED MODULES + CONTENT) */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            {/* Header with Add Week Button */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">Haftalık İçerik Planı</h3>
                                    <p className="text-sm text-slate-500 mt-1">Haftaları oluşturun ve içerik ekleyin</p>
                                </div>
                                <button
                                    onClick={handleAddWeek}
                                    disabled={addingWeek}
                                    className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingWeek ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Ekleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                            Hafta Ekle
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Weeks/Modules List */}
                            <div className="space-y-4">
                                {modules.map((mod, idx) => {
                                    // Find corresponding created module to show lessons
                                    const createdMod = createdModules.find(cm => cm.title === mod.title || cm.id === mod.id);
                                    const lessons = createdMod?.lessons || [];

                                    return (
                                        <div key={idx} data-week-card className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-200 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            {/* Week Header */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 flex gap-3">
                                                        <input
                                                            type="text"
                                                            value={mod.title}
                                                            onChange={e => {
                                                                const newMods = [...modules];
                                                                newMods[idx].title = e.target.value;
                                                                setModules(newMods);
                                                            }}
                                                            className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none font-semibold text-slate-800"
                                                            placeholder={`${idx + 1}. Hafta Başlığı`}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={mod.description}
                                                            onChange={e => {
                                                                const newMods = [...modules];
                                                                newMods[idx].description = e.target.value;
                                                                setModules(newMods);
                                                            }}
                                                            className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none text-sm text-slate-600"
                                                            placeholder="Açıklama (isteğe bağlı)"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium">
                                                            {lessons.length} içerik
                                                        </span>
                                                        {createdMod?.id && onAddContent && (
                                                            <button
                                                                onClick={() => onAddContent(createdMod.id!)}
                                                                className="px-3 py-1.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-1 text-sm font-medium"
                                                            >
                                                                <Plus size={16} />
                                                                Ekle
                                                            </button>
                                                        )}
                                                        {modules.length > 1 && (
                                                            <button
                                                                onClick={() => setModules(modules.filter((_, i) => i !== idx))}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Week Content List */}
                                            <div className="p-4">
                                                {lessons.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {lessons.map((lesson, lIdx) => {
                                                            // Dynamic icon based on resource type
                                                            let Icon = Video;
                                                            if (lesson.resourcetype === 'DocumentLesson') Icon = FileText;
                                                            else if (lesson.resourcetype === 'QuizLesson') Icon = HelpCircle;
                                                            else if (lesson.resourcetype === 'LiveLesson') Icon = MonitorPlay;
                                                            else if (lesson.resourcetype === 'Assignment') Icon = ClipboardList;

                                                            return (
                                                                <div key={lIdx} className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors group">
                                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                                                        <Icon size={20} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-slate-800 truncate">{lesson.title}</p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {lesson.resourcetype === 'VideoLesson' && 'Video Ders'}
                                                                            {lesson.resourcetype === 'DocumentLesson' && 'Doküman'}
                                                                            {lesson.resourcetype === 'LiveLesson' && 'Canlı Ders'}
                                                                            {lesson.resourcetype === 'QuizLesson' && 'Quiz'}
                                                                            {lesson.resourcetype === 'Assignment' && 'Ödev'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {onEditContent && (
                                                                            <button
                                                                                onClick={() => onEditContent(lesson, createdCourse?.id)}
                                                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                                                                title="Düzenle"
                                                                            >
                                                                                <Edit2 size={16} />
                                                                            </button>
                                                                        )}
                                                                        {onDeleteContent && (
                                                                            <button
                                                                                onClick={() => onDeleteContent(lesson.id)}
                                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                                title="Sil"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-400">
                                                        <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                        <p className="text-sm">Bu haftaya henüz içerik eklenmemiş</p>
                                                        {createdMod?.id && onAddContent && (
                                                            <button
                                                                onClick={() => onAddContent(createdMod.id!)}
                                                                className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                                            >
                                                                + İçerik Ekle
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};
