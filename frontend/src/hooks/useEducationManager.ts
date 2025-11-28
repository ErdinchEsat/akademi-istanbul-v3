import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lmsService } from '../services/lmsService';
import { Course, Category } from '../types/lms';
import { EducationCategory } from '../features/lms/pages/MyEducation';


interface UseEducationManagerProps {
    initialCategory: EducationCategory;
}

export const useEducationManager = ({ initialCategory }: UseEducationManagerProps) => {
    const navigate = useNavigate();

    // Normalize category: "ebooks" (legacy) -> "documents" (new)
    const normalizeCategory = (cat: string): EducationCategory => {
        return (cat === 'ebooks' ? 'documents' : cat) as EducationCategory;
    };

    // State: UI Control
    const [activeCategory, setActiveCategory] = useState(normalizeCategory(initialCategory));
    const [isWizardOpen, setWizardOpen] = useState(false);
    const [isContentModalOpen, setContentModalOpen] = useState(false);

    // State: Data
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // State: Selection
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // State: Content Form
    const [contentData, setContentData] = useState<any>({});
    const [modalContentType, setModalContentType] = useState<EducationCategory>('videos');

    // Update activeCategory when prop changes
    useEffect(() => {
        setActiveCategory(normalizeCategory(initialCategory));
    }, [initialCategory]);

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // API: Fetch courses and categories
    const fetchData = async () => {
        try {
            const [coursesData, categoriesData] = await Promise.all([
                lmsService.getMyCourses(),
                lmsService.getCategories()
            ]);
            setCourses(coursesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    // API: Create or Update Content
    const handleContentSubmit = async () => {
        if (!selectedCourseId || !selectedWeek || !contentData.title) return;

        setLoading(true);
        try {
            const lessonData: any = {
                title: contentData.title,
                resourcetype: modalContentType === 'videos' ? 'VideoLesson' :
                    modalContentType === 'documents' ? 'DocumentLesson' :
                        modalContentType === 'live' ? 'LiveLesson' :
                            modalContentType === 'quizzes' ? 'QuizLesson' :
                                modalContentType === 'assignments' ? 'Assignment' : 'HTMLLesson'
            };

            // Add category-specific fields
            if (modalContentType === 'videos') {
                if (contentData.useUrl && contentData.video_url) {
                    lessonData.video_url = contentData.video_url;
                } else if (contentData.file) {
                    lessonData.source_file = contentData.file;
                }
            } else if (modalContentType === 'documents' && contentData.file) {
                lessonData.file = contentData.file;
            } else if (modalContentType === 'live') {
                lessonData.start_time = contentData.start_time;
                lessonData.meeting_link = contentData.meeting_link;
                lessonData.duration = contentData.duration;
            } else if (modalContentType === 'quizzes') {
                lessonData.duration_minutes = Number(contentData.duration_minutes);
                lessonData.passing_score = Number(contentData.passing_score);
            }

            if (editingLessonId) {
                lessonData.module = Number(selectedWeek);
                await lmsService.updateLesson(editingLessonId, lessonData);
            } else {
                lessonData.order = 1;
                const onProgress = (progress: number) => {
                    // Progress tracking (can be used for UI progress bar in future)
                };
                await lmsService.createLesson(Number(selectedWeek), lessonData, onProgress);
            }

            // Success
            alert('İçerik başarıyla kaydedildi!');

            // CRITICAL: Reset state to prevent next open being in UPDATE mode
            setContentModalOpen(false);
            setContentData({});
            setEditingLessonId(null);  // MUST reset to null for next CREATE

            // Refresh course data immediately
            if (editingCourse) {
                const updatedCourse = await lmsService.getCourse(editingCourse.id);
                setEditingCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
            } else {
                await fetchData();
            }
        } catch (error: any) {
            console.error('Content save failed', error);

            // User-friendly error messages
            let errorMessage = 'İçerik kaydedilirken bir hata oluştu.';

            if (error.response?.data) {
                // Backend validation errors
                if (error.response.data.source_file) {
                    errorMessage = error.response.data.source_file[0];
                } else if (error.response.data.file) {
                    errorMessage = error.response.data.file[0];
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.status === 413) {
                    errorMessage = 'Dosya boyutu çok büyük. Lütfen 100MB\'dan küçük bir dosya yükleyin.';
                }
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // API: Delete Course
    const handleDelete = async (id: number) => {
        try {
            await lmsService.deleteCourse(id);
            setDeletingId(null);
            fetchData();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    // API: Toggle Course Publish Status
    const handleTogglePublish = async (course: Course) => {
        try {
            await lmsService.updateCourse(course.id, { is_published: !course.is_published });
            fetchData();
        } catch (error) {
            console.error('Failed to update publish status', error);
            alert('Durum güncellenirken bir hata oluştu.');
        }
    };

    // Helper: Open Edit Modal
    const handleEditLesson = (lesson: any, courseId?: number) => {
        const cId = courseId || editingCourse?.id;

        if (cId) {
            setEditingLessonId(lesson.id);
            setSelectedCourseId(cId.toString());

            const currentCourse = (editingCourse && editingCourse.id === cId)
                ? editingCourse
                : courses.find(c => c.id === cId);

            if (currentCourse) {
                const module = currentCourse.modules?.find(m => m.lessons?.some(l => l.id === lesson.id));
                if (module) setSelectedWeek(module.id!.toString());
            }

            const newData: any = { title: lesson.title };

            if (lesson.resourcetype === 'VideoLesson') {
                setModalContentType('videos');
                if (lesson.video_url) {
                    newData.useUrl = true;
                    newData.video_url = lesson.video_url;
                } else {
                    newData.useUrl = false;
                }
            } else if (lesson.resourcetype === 'DocumentLesson') {
                setModalContentType('documents');
                // Preserve file reference if exists
                if (lesson.file || lesson.source_file) {
                    newData.existingFile = lesson.file || lesson.source_file;
                }
            } else if (lesson.resourcetype === 'LiveLesson') {
                setModalContentType('live');
                newData.start_time = lesson.start_time;
                newData.meeting_link = lesson.meeting_link;
                newData.duration = lesson.duration;
            } else if (lesson.resourcetype === 'QuizLesson') {
                setModalContentType('quizzes');
                newData.duration_minutes = lesson.duration_minutes;
                newData.passing_score = lesson.passing_score;
            } else if (lesson.resourcetype === 'Assignment') {
                setModalContentType('assignments');
            } else {
                setModalContentType('exams');
            }

            setContentData(newData);
            setContentModalOpen(true);
        }
    };

    // Helper: Delete Lesson
    const handleDeleteLesson = async (lessonId: number) => {
        try {
            await lmsService.deleteLesson(lessonId);
            if (editingCourse) {
                const updatedCourse = await lmsService.getCourse(editingCourse.id);
                setEditingCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
            }
        } catch (error) {
            console.error('Failed to delete lesson', error);
        }
    };

    return {
        // State
        activeCategory,
        isWizardOpen,
        isContentModalOpen,
        courses,
        categories,
        loading,
        selectedCourseId,
        selectedWeek,
        editingCourse,
        editingLessonId,
        deletingId,
        contentData,
        modalContentType,

        // Setters
        setActiveCategory,
        setWizardOpen,
        setContentModalOpen,
        setSelectedCourseId,
        setSelectedWeek,
        setEditingCourse,
        setEditingLessonId,
        setDeletingId,
        setContentData,
        setModalContentType,
        setCourses,

        // Actions
        fetchData,
        handleContentSubmit,
        handleDelete,
        handleTogglePublish,
        handleEditLesson,
        handleDeleteLesson,

        // Helpers
        normalizeCategory,
        navigate
    };
};
