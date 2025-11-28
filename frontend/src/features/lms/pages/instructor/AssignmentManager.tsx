import React, { useState, useEffect } from 'react';
import {
  Plus, X, ClipboardList, Calendar, Clock, Save,
  Edit2, Trash2, FileText, Users, CheckCircle, AlertCircle
} from 'lucide-react';
import { lmsService } from '../../../../services/lmsService';
import { Course, Module } from '../../../../types/lms';
import clsx from 'clsx';

interface Assignment {
  id: number;
  title: string;
  course_id: number;
  course_name: string;
  module_id: number;
  module_name: string;
  due_date: string;
  max_score: number;
  submissions_count: number;
  description?: string;
}

const AssignmentManager: React.FC = () => {
  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    module_id: '',
    due_date: '',
    max_score: 100,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesData = await lmsService.getMyCourses();
      setCourses(coursesData);
      
      // TODO: Fetch assignments from backend
      // For now, using mock data
      setAssignments([
        {
          id: 1,
          title: 'E-Ticaret Sitesi Tasarımı',
          course_id: 1,
          course_name: 'Web Tasarım',
          module_id: 1,
          module_name: '2. Hafta',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          max_score: 100,
          submissions_count: 12,
          description: 'Figma veya Adobe XD kullanarak bir e-ticaret sitesi anasayfa tasarımı yapınız.'
        },
        {
          id: 2,
          title: 'JavaScript Algoritma Soruları',
          course_id: 1,
          course_name: 'Web Geliştirme',
          module_id: 2,
          module_name: '3. Hafta',
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          max_score: 50,
          submissions_count: 25,
          description: '5 adet algoritma sorusunu çözünüz.'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (dueDate: string) => new Date(dueDate) < new Date();

  const filteredAssignments = assignments.filter(a => {
    const matchesCourse = filterCourse === 'all' || a.course_id.toString() === filterCourse;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && !isExpired(a.due_date)) ||
      (filterStatus === 'expired' && isExpired(a.due_date));
    return matchesCourse && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      course_id: '',
      module_id: '',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      max_score: 100,
      description: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setFormData({
      title: assignment.title,
      course_id: assignment.course_id.toString(),
      module_id: assignment.module_id.toString(),
      due_date: assignment.due_date.split('T')[0],
      max_score: assignment.max_score,
      description: assignment.description || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course_id || !formData.module_id) return;

    try {
      const lessonData = {
        resourcetype: 'Assignment' as const,
        title: formData.title,
        due_date: new Date(formData.due_date).toISOString(),
        max_score: formData.max_score,
        description: formData.description,
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
      console.error('Failed to save assignment', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ödevi silmek istediğinizden emin misiniz?')) return;
    
    try {
      await lmsService.deleteLesson(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete assignment', error);
    }
  };

  const selectedCourse = courses.find(c => c.id.toString() === formData.course_id);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg shadow-purple-200">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Ödev Yönetimi</h1>
              <p className="text-slate-500 text-sm">Ödevleri oluşturun ve teslimleri takip edin</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
          >
            <Plus className="w-5 h-5" />
            Yeni Ödev
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{assignments.length}</div>
              <div className="text-xs text-gray-500">Toplam Ödev</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {assignments.filter(a => !isExpired(a.due_date)).length}
              </div>
              <div className="text-xs text-gray-500">Aktif Ödev</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {assignments.reduce((acc, a) => acc + a.submissions_count, 0)}
              </div>
              <div className="text-xs text-gray-500">Toplam Teslim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Kurslar</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'expired')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="expired">Süresi Dolmuş</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {filteredAssignments.length} ödev
          </div>
        </div>

        {/* Assignments List */}
        <div className="divide-y divide-gray-100">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Henüz ödev bulunmuyor</p>
            </div>
          ) : (
            filteredAssignments.map(assignment => {
              const daysRemaining = getDaysRemaining(assignment.due_date);
              const expired = isExpired(assignment.due_date);
              
              return (
                <div key={assignment.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={clsx(
                        "p-3 rounded-xl",
                        expired ? "bg-gray-100 text-gray-500" : "bg-purple-100 text-purple-600"
                      )}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{assignment.title}</h3>
                          {expired ? (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Süresi Doldu
                            </span>
                          ) : daysRemaining <= 3 ? (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {daysRemaining} gün kaldı
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {assignment.course_name} • {assignment.module_name}
                        </p>
                        {assignment.description && (
                          <p className="text-sm text-gray-400 line-clamp-1">{assignment.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Son Teslim: {formatDate(assignment.due_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {assignment.submissions_count} teslim
                          </span>
                          <span className="font-medium text-purple-600">
                            {assignment.max_score} puan
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-500" />
                {editingId ? 'Ödev Düzenle' : 'Yeni Ödev Oluştur'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Örn: E-Ticaret Sitesi Tasarımı"
                  required
                />
              </div>

              {/* Course & Module */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kurs</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value, module_id: '' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

              {/* Due Date & Max Score */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Son Teslim Tarihi</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maksimum Puan</label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (Opsiyonel)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  placeholder="Ödev hakkında detaylı açıklama..."
                />
              </div>

              {/* Actions */}
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
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
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

export default AssignmentManager;

