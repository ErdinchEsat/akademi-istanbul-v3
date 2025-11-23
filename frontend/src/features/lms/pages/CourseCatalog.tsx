
import React, { useState } from 'react';
import { Search, Filter, BookOpen, PlayCircle, Star, Clock, Award, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { MOCK_COURSES } from '@/utils/constants';
import { Course } from '@/types';
import clsx from 'clsx';

interface CourseCatalogProps {
  onCourseClick: (courseId: string) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onCourseClick }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my_courses'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique categories
  const categories = ['Tümü', ...Array.from(new Set(MOCK_COURSES.map(c => c.category)))];

  // Filter Logic
  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || course.category === selectedCategory;
    const matchesTab = activeTab === 'all' || (activeTab === 'my_courses' && (course.progress || 0) > 0);

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eğitim Kataloğu</h1>
          <p className="text-slate-500 mt-1">Kariyeriniz için en uygun eğitimleri keşfedin.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx("p-2 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700")}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx("p-2 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700")}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-4 z-10">

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              "flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'all' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Tüm Kurslar
          </button>
          <button
            onClick={() => setActiveTab('my_courses')}
            className={clsx(
              "flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'my_courses' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Kurslarım
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-1 w-full lg:w-auto gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kurs, eğitmen veya konu ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtrele</span>
            </button>
            {/* Simple Dropdown for Categories (Desktop) */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 hidden group-hover:block z-20">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedCategory === cat ? "bg-indigo-50 text-indigo-600 font-bold" : "text-slate-600 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Scroll (Mobile/Tablet friendly) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all",
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className={clsx(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onClick={() => onCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sonuç bulunamadı</h3>
          <p className="text-slate-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
        </div>
      )}

    </div>
  );
};

interface CourseCardProps {
  course: Course;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, viewMode, onClick }) => {
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
      >
        <div className="w-48 h-32 shrink-0 rounded-xl overflow-hidden relative">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {course.isLive && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> CANLI
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {course.category}
                </span>
                {course.tenantId === 'ibb' && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">İBB</span>}
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" /> {course.rating}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{course.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-1">{course.description}</p>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BookOpen size={16} /> {course.totalModules} Modül</span>
              <span className="flex items-center gap-1"><Award size={16} /> Sertifikalı</span>
            </div>
            {course.progress !== undefined && course.progress > 0 ? (
              <div className="flex flex-col items-end gap-1 min-w-[120px]">
                <span className="text-xs font-bold text-indigo-600">%{course.progress} Tamamlandı</span>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            ) : (
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors">
                Kursa Başla
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            <PlayCircle className="w-6 h-6 fill-current" />
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-current" /> {course.rating}
        </div>
        {course.isLive && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div> CANLI
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {course.category}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {course.title}
        </h3>

        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {course.instructor.charAt(0)}
          </span>
          {course.instructor}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          {course.progress !== undefined && course.progress > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>İlerleme</span>
                <span className="text-indigo-600">%{course.progress}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock size={14} /> {course.totalModules} Ders</span>
              </div>
              <span className="font-bold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
                İncele <ChevronRight size={14} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
