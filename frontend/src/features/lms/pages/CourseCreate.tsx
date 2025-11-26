import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Upload, Trash2, Video, FileText, HelpCircle, FileCode } from 'lucide-react';
import { lmsService } from '@/services/lmsService';
import { Category, Course, Module, Lesson } from '@/types/lms';
import clsx from 'clsx';

interface CourseWizardProps {
    categories: Category[];
    onComplete: () => void;
    onCancel: () => void;
    initialData?: Course | null;
}

export const CourseWizard: React.FC<CourseWizardProps> = ({ categories, onComplete, onCancel, initialData }) => {
    const navigate = useNavigate();
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
    // Initialize with existing modules or default empty one
    const [modules, setModules] = useState<Partial<Module>[]>(
        initialData?.modules && initialData.modules.length > 0
            ? initialData.modules
            : [{ title: '1. Hafta: Giriş', description: '', lessons: [] }]
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
                    is_published: false,
                    image: courseData.image instanceof File ? courseData.image : undefined
                });
            }
            setCreatedCourse(course);
            setCurrentStep(2);
        } catch (error) {
            console.error('Course save failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = async () => {
        if (!createdCourse) return;
        const title = prompt('Modül Başlığı:');
        if (!title) return;

        try {
            const newModule = await lmsService.createModule(createdCourse.id, {
                title,
                order: modules.length + 1
            });
            setModules([...modules, { ...newModule, lessons: [] }]);
        } catch (error) {
            console.error('Failed to create module', error);
        }
    };

    const handleAddLesson = async (moduleId: number, type: Lesson['resourcetype']) => {
        const title = prompt('Ders Başlığı:');
        if (!title) return;

        let file: File | null = null;
        if (type === 'VideoLesson') {
            // Simple file input trigger could be better, but for MVP prompt is hard for file.
            // Let's just create the lesson record first, or use a modal.
            // For MVP, let's assume we just create the record and maybe have a separate upload button?
            // Or better: use a hidden file input.
            alert("Lütfen bir sonraki adımda video dosyasını seçin.");
            // This is tricky with prompt. Let's simplify: 
            // Just add to list as "Pending Upload" or similar?
            // No, let's make a simple UI for adding lesson.
        }

        // For now, let's just create the lesson structure locally to show UI, 
        // but we need actual file upload for Video.
        // Let's implement a proper modal or inline form for lesson creation in a real app.
        // For this MVP step, I'll implement a simple file picker trigger.
    };

    // Improved Lesson Adder
    const [isUploading, setIsUploading] = useState(false);

    const uploadVideoLesson = async (moduleId: number, file: File) => {
        setIsUploading(true);
        try {
            const newLesson = await lmsService.createLesson(moduleId, {
                resourcetype: 'VideoLesson',
                title: file.name.split('.')[0], // Default title from filename
                order: 1, // Logic for order needed
                source_file: file
            });
            // Refresh modules or add to state
            updateModuleLessons(moduleId, newLesson);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Video yüklenemedi.');
        } finally {
            setIsUploading(false);
        }
    };

    const updateModuleLessons = (moduleId: number, newLesson: Lesson) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, lessons: [...(m.lessons || []), newLesson] };
            }
            return m;
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Yeni Kurs Oluştur</h1>

            {/* Steps */}
            <div className="flex items-center gap-4 mb-8">
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold", currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500")}>1</div>
                <div className="h-1 flex-1 bg-gray-200">
                    <div className={clsx("h-full bg-indigo-600 transition-all", currentStep >= 2 ? "w-full" : "w-0")}></div>
                </div>
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold", currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500")}>2</div>
            </div>

            {currentStep === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); handleBasicSubmit(); }} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kurs Başlığı</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={courseData.title}
                            onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={courseData.category}
                            onChange={e => setCourseData({ ...courseData, category: e.target.value })}
                        >
                            <option value="">Seçiniz</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={courseData.description}
                            onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kapak Görseli</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={e => setCourseData({ ...courseData, image: e.target.files?.[0] || null })}
                            />
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                                {courseData.image instanceof File ? courseData.image.name : (typeof courseData.image === 'string' ? 'Mevcut görsel yüklü' : "Görsel yüklemek için tıklayın veya sürükleyin")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="publish"
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                            checked={courseData.is_published}
                            onChange={e => setCourseData({ ...courseData, is_published: e.target.checked })}
                        />
                        <label htmlFor="publish" className="text-sm font-medium text-slate-700">Kursu Yayına Al</label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Kaydediliyor...' : 'Devam Et'}
                        </button>
                    </div>
                </form>
            )}

            {currentStep === 2 && createdCourse && (
                <div className="space-y-6">
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-between">
                        <span>Kurs başarıyla {initialData ? 'güncellendi' : 'oluşturuldu'}: <strong>{createdCourse.title}</strong></span>
                        <button onClick={onComplete} className="text-sm underline font-bold">Tamamla ve Listeye Dön</button>
                    </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Müfredat</h2>
                        <button
                            onClick={handleAddModule}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            <Plus size={18} /> Modül Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <div key={module.id || index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700">{module.title}</h3>
                                    <div className="flex gap-2">
                                        <label className={clsx(
                                            "cursor-pointer p-2 rounded-lg transition-colors",
                                            module.id ? "hover:bg-white text-slate-500 hover:text-indigo-600" : "opacity-50 cursor-not-allowed text-gray-400"
                                        )} title={module.id ? "Video Ekle" : "Önce modülü kaydedin"}>
                                            <Video size={18} />
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                disabled={!module.id}
                                                onChange={(e) => {
                                                    if (e.target.files?.[0] && module.id) {
                                                        uploadVideoLesson(module.id, e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <p className="text-sm text-gray-400 text-center py-2">Henüz ders eklenmedi.</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isUploading && (
                        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Video yükleniyor...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseWizard;
