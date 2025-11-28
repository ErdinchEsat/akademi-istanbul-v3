from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin, PolymorphicChildModelFilter
from .models import Category, Course, Module, Lesson, VideoLesson, DocumentLesson, QuizLesson, HTMLLesson

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    prepopulated_fields = {'slug': ('name',)}

class ModuleInline(admin.StackedInline):
    model = Module
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'is_published', 'created_at')
    list_filter = ('is_published', 'category', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ModuleInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    ordering = ('course', 'order')

class LessonChildAdmin(PolymorphicChildModelAdmin):
    base_model = Lesson

@admin.register(VideoLesson)
class VideoLessonAdmin(LessonChildAdmin):
    base_model = VideoLesson

@admin.register(DocumentLesson)
class DocumentLessonAdmin(LessonChildAdmin):
    base_model = DocumentLesson
    list_display = ('title', 'module', 'order', 'file_type', 'file_size')
    readonly_fields = ('file_type', 'file_size')

@admin.register(QuizLesson)
class QuizLessonAdmin(LessonChildAdmin):
    base_model = QuizLesson

@admin.register(HTMLLesson)
class HTMLLessonAdmin(LessonChildAdmin):
    base_model = HTMLLesson

@admin.register(Lesson)
class LessonParentAdmin(PolymorphicParentModelAdmin):
    base_model = Lesson
    child_models = (VideoLesson, DocumentLesson, QuizLesson, HTMLLesson)
    list_filter = (PolymorphicChildModelFilter, 'module__course')
    list_display = ('title', 'module', 'is_preview', 'polymorphic_ctype')
    ordering = ('module', 'order')
