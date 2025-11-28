import React, { useState, useEffect } from 'react';
import {
  Plus, X, HelpCircle, Clock, Save, Edit2, Trash2,
  Users, CheckCircle, BarChart3, Settings
} from 'lucide-react';
import { lmsService } from '../../../../services/lmsService';
import { Course } from '../../../../types/lms';
import clsx from 'clsx';

interface Quiz {
  id: number;
  title: string;
  course_id: number;
  course_name: string;
  module_id: number;
  module_name: string;
  duration_minutes: number;
  passing_score: number;
  question_count: number;
  attempts_count: number;
}

const QuizManager: React.FC = () => {
  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterCourse, setFilterCourse] = useState('all');
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    module_id: '',
    duration_minutes: 15,
    passing_score: 60
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesData = await lmsService.getMyCourses();
      setCourses(coursesData);
      
      // Mock data
      setQuizzes([
        {
          id: 1,
          title: 'HTML Temelleri Quiz',
          course_id: 1,
          course_name: 'Web Geliştirme',
          module_id: 1,
          module_name: '1. Hafta',
          duration_minutes: 15,
          passing_score: 60,
          question_count: 10,
          attempts_count: 45
        },
        {
          id: 2,
          title: 'CSS Seçiciler Quiz',
          course_id: 1,
          course_name: 'Web Geliştirme',
          module_id: 2,
          module_name: '2. Hafta',
          duration_minutes: 20,
          passing_score: 70,
          question_count: 15,
          attempts_count: 32
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    filterCourse === 'all' || q.course_id.toString() === filterCourse
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      course_id: '',
      module_id: '',
      duration_minutes: 15,
      passing_score: 60
    });
    setModalOpen(true);
  };

  const openEditModal = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setFormData({
      title: quiz.title,
      course_id: quiz.course_id.toString(),
      module_id: quiz.module_id.toString(),
      duration_minutes: quiz.duration_minutes,
      passing_score: quiz.passing_score
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course_id || !formData.module_id) return;

    try {
      const lessonData = {
        resourcetype: 'QuizLesson' as const,
        title: formData.title,
        duration_minutes: formData.duration_minutes,
        passing_score: formData.passing_score,
        order: 1
      };

      if (editingId) {
        await lmsService.updateLesson(editingId, {
          ...lessonData,
          module: Number(formData.module_id)
        });
      } else {
        await lmsService.createLesson(Number(formData.module_id), lessonData);
      }

      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save quiz', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu quiz\'i silmek istediğinizden emin misiniz?')) return;
    
    try {
      await lmsService.deleteLesson(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete quiz', error);
    }
  };

  const selectedCourse = courses.find(c => c.id.toString() === formData.course_id);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl text-white shadow-lg shadow-teal-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Quiz Yönetimi</h1>
              <p className="text-slate-500 text-sm">Konu tarama testleri oluşturun</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
          >
            <Plus className="w-5 h-5" />
            Yeni Quiz
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{quizzes.length}</div>
              <div className="text-xs text-gray-500">Toplam Quiz</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {quizzes.reduce((acc, q) => acc + q.attempts_count, 0)}
              </div>
              <div className="text-xs text-gray-500">Toplam Deneme</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {quizzes.reduce((acc, q) => acc + q.question_count, 0)}
              </div>
              <div className="text-xs text-gray-500">Toplam Soru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tüm Kurslar</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500">
            {filteredQuizzes.length} quiz
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="p-6">
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Henüz quiz bulunmuyor</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-5 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-teal-500 text-white rounded-lg">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(quiz)}
                        className="p-1.5 hover:bg-teal-100 text-teal-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{quiz.course_name} • {quiz.module_name}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-600">{quiz.question_count}</div>
                      <div className="text-gray-500">Soru</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-600">{quiz.duration_minutes} dk</div>
                      <div className="text-gray-500">Süre</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-600">%{quiz.passing_score}</div>
                      <div className="text-gray-500">Geçme</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2 text-center">
                      <div className="font-bold text-teal-600">{quiz.attempts_count}</div>
                      <div className="text-gray-500">Deneme</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-500" />
                {editingId ? 'Quiz Düzenle' : 'Yeni Quiz Oluştur'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Başlığı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Örn: HTML Temelleri Quiz"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kurs</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value, module_id: '' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seçiniz</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hafta</label>
                  <select
                    value={formData.module_id}
                    onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    disabled={!selectedCourse}
                  >
                    <option value="">Seçiniz</option>
                    {selectedCourse?.modules?.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value={10}>10 dakika</option>
                    <option value={15}>15 dakika</option>
                    <option value={20}>20 dakika</option>
                    <option value={30}>30 dakika</option>
                    <option value={45}>45 dakika</option>
                    <option value={60}>60 dakika</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geçme Notu (%)</label>
                  <input
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManager;

