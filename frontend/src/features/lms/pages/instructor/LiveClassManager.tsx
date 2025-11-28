import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Video,
  Calendar as CalendarIcon, MonitorPlay, Link as LinkIcon, Save
} from 'lucide-react';
import { lmsService } from '../../../../services/lmsService';
import { Course, Module } from '../../../../types/lms';
import clsx from 'clsx';

interface LiveClass {
  id: number;
  title: string;
  course_id: number;
  course_name: string;
  module_id: number;
  module_name: string;
  start_time: string;
  duration: number;
  meeting_link: string;
}

const LiveClassManager: React.FC = () => {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  
  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    module_id: '',
    date: '',
    time: '09:00',
    duration: 60,
    meeting_link: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesData = await lmsService.getMyCourses();
      setCourses(coursesData);
      
      // TODO: Fetch live classes from backend
      // For now, using mock data
      setLiveClasses([
        {
          id: 1,
          title: 'React Hooks Canlı Ders',
          course_id: 1,
          course_name: 'React Geliştirme',
          module_id: 1,
          module_name: '1. Hafta',
          start_time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 14, 0).toISOString(),
          duration: 90,
          meeting_link: 'https://meet.google.com/abc-defg-hij'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getClassesForDate = (date: Date) => {
    return liveClasses.filter(lc => {
      const classDate = new Date(lc.start_time);
      return classDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const openAddModal = (date?: Date) => {
    setSelectedDate(date || new Date());
    setFormData({
      title: '',
      course_id: '',
      module_id: '',
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      meeting_link: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course_id || !formData.module_id) return;

    try {
      const startTime = new Date(`${formData.date}T${formData.time}`);
      
      await lmsService.createLesson(Number(formData.module_id), {
        resourcetype: 'LiveLesson',
        title: formData.title,
        start_time: startTime.toISOString(),
        duration: formData.duration,
        meeting_link: formData.meeting_link,
        order: 1
      });

      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create live class', error);
    }
  };

  const selectedCourse = courses.find(c => c.id.toString() === formData.course_id);

  const weekDays = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
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
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl text-white shadow-lg shadow-red-200">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Canlı Ders Yönetimi</h1>
              <p className="text-slate-500 text-sm">Canlı derslerinizi planlayın ve yönetin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('week')}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === 'week' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Hafta
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === 'month' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Ay
              </button>
            </div>

            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              <Plus className="w-5 h-5" />
              Canlı Ders Planla
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={() => navigateCalendar('prev')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-bold text-slate-800">
            {viewMode === 'week' 
              ? `${getWeekDays(currentDate)[0].getDate()} - ${getWeekDays(currentDate)[6].getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </h2>
          
          <button
            onClick={() => navigateCalendar('next')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {viewMode === 'week' ? (
            // Week View
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {getWeekDays(currentDate).map((day, idx) => (
                <div key={idx} className="text-center pb-2 border-b border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">{weekDays[day.getDay()]}</div>
                  <div className={clsx(
                    "text-lg font-bold mt-1",
                    isToday(day) ? "text-red-600" : "text-slate-800"
                  )}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
              
              {/* Day Content */}
              {getWeekDays(currentDate).map((day, idx) => {
                const classes = getClassesForDate(day);
                return (
                  <div
                    key={idx}
                    onClick={() => openAddModal(day)}
                    className={clsx(
                      "min-h-[200px] p-2 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                      isToday(day) 
                        ? "bg-red-50/50 border-red-200 hover:border-red-300" 
                        : "bg-gray-50/50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                    )}
                  >
                    {classes.map(lc => (
                      <div
                        key={lc.id}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-red-500 text-white p-2 rounded-lg mb-2 text-xs shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <div className="font-bold truncate">{lc.title}</div>
                        <div className="flex items-center gap-1 mt-1 opacity-90">
                          <Clock className="w-3 h-3" />
                          {formatTime(lc.start_time)}
                        </div>
                      </div>
                    ))}
                    {classes.length === 0 && (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        <Plus className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Month View
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {weekDays.map(day => (
                <div key={day} className="text-center py-2 text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getDaysInMonth(currentDate).map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="aspect-square" />;
                }
                
                const classes = getClassesForDate(day);
                return (
                  <div
                    key={idx}
                    onClick={() => openAddModal(day)}
                    className={clsx(
                      "aspect-square p-1 rounded-lg border cursor-pointer transition-all relative",
                      isToday(day)
                        ? "bg-red-50 border-red-200 hover:border-red-300"
                        : "hover:bg-indigo-50 border-gray-100 hover:border-indigo-200"
                    )}
                  >
                    <div className={clsx(
                      "text-xs font-medium",
                      isToday(day) ? "text-red-600" : "text-gray-700"
                    )}>
                      {day.getDate()}
                    </div>
                    {classes.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="bg-red-500 text-white text-[10px] px-1 py-0.5 rounded truncate">
                          {classes.length} ders
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Classes List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-red-500" />
          Yaklaşan Canlı Dersler
        </h3>
        
        {liveClasses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MonitorPlay className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Planlanmış canlı ders bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {liveClasses.map(lc => (
              <div key={lc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{lc.title}</h4>
                    <p className="text-sm text-gray-500">{lc.course_name} • {lc.module_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">
                    {new Date(lc.start_time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </div>
                  <div className="text-xs text-gray-500">{formatTime(lc.start_time)} • {lc.duration} dk</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-red-500" />
                Canlı Ders Planla
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ders Başlığı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Örn: React Hooks Canlı Ders"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={30}>30 dakika</option>
                  <option value={45}>45 dakika</option>
                  <option value={60}>60 dakika</option>
                  <option value={90}>90 dakika</option>
                  <option value={120}>120 dakika</option>
                </select>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplantı Linki</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
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
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClassManager;

