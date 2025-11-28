
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, PlayCircle, Star, Clock, Award, ChevronRight, LayoutGrid, List, Plus } from 'lucide-react';
import { lmsService } from '@/services/lmsService';
import { Course, Category } from '@/types/lms';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import clsx from 'clsx';
import { LazyImage } from '../../../components/ui/LazyImage';

interface CourseCatalogProps {
  onCourseClick: (courseId: string) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onCourseClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'my_courses'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, categoriesData] = await Promise.all([
        lmsService.getCourses(),
        lmsService.getCategories()
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch catalog data', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.first_name + ' ' + course.instructor?.last_name).toLowerCase().includes(searchQuery.toLowerCase());

    // Category filtering needs logic depending on if we use ID or Name. 
    // Backend returns ID usually, but we might want to map it.
    // For now let's assume selectedCategory is ID or 'Tümü'.
    // If selectedCategory is string 'Tümü', show all.
    // If it's a number (category ID), compare.
    // But UI uses names currently. Let's map names.
    // Actually backend serializer returns `category_name`.
    const categoryName = (course as any).category_name || '';
    const matchesCategory = selectedCategory === 'Tümü' || categoryName === selectedCategory;

    // My Courses logic needs backend support for enrollment. 
    // For now, assume 'my_courses' tab shows nothing or all for demo if not implemented.
    const matchesTab = activeTab === 'all' || (activeTab === 'my_courses');

    return matchesSearch && matchesCategory && matchesTab;
  });

  const uniqueCategoryNames = ['Tümü', ...categories.map(c => c.name)];

  const canCreateCourse = user?.role === UserRole.ADMIN || user?.role === UserRole.INSTRUCTOR || user?.role === UserRole.TENANT_ADMIN;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eğitim Kataloğu</h1>
          <p className="text-slate-500 mt-1">Kariyeriniz için en uygun eğitimleri keşfedin.</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreateCourse && (
            <button
              onClick={() => navigate('/egitim/ekle')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm"
            >
              <Plus size={18} /> Kurs Ekle
            </button>
          )}
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
              {uniqueCategoryNames.map(cat => (
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
        {uniqueCategoryNames.map(cat => (
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
      {loading ? (
        <div className="text-center py-20">Yükleniyor...</div>
      ) : filteredCourses.length > 0 ? (
        <div className={clsx(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onClick={() => onCourseClick(course.slug || course.id.toString())}
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
  // Helper to get image URL safely
  const imageUrl = typeof course.image === 'string' ? course.image : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';
  const instructorName = course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : 'Eğitmen';
  const categoryName = (course as any).category_name || 'Genel';

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
      >
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          <LazyImage
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {categoryName}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{course.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-1">{course.description}</p>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BookOpen size={16} /> {course.total_modules || 0} Hafta</span>
              <span className="flex items-center gap-1"><Award size={16} /> Sertifikalı</span>
            </div>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors">
              Kursa Başla
            </button>
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
        <img src={imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            <PlayCircle className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {categoryName}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {course.title}
        </h3>

        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {instructorName.charAt(0)}
          </span>
          {instructorName}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={14} /> {course.total_modules || 0} Hafta</span>
            </div>
            <span className="font-bold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
              İncele <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
