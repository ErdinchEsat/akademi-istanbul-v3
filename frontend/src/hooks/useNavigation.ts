import { useState } from 'react';
import { ViewState } from '../types/ui';

export const useNavigation = () => {
    const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
    const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | number | null>(null);

    const navigateTo = (view: ViewState, courseId?: string) => {
        if (courseId) setActiveCourseId(courseId);
        setCurrentView(view);
    };

    const selectStudent = (studentId: string | number) => {
        setSelectedStudentId(studentId);
        setCurrentView(ViewState.STUDENT_ANALYTICS);
    };

    return {
        currentView,
        activeCourseId,
        selectedStudentId,
        navigateTo,
        selectStudent,
        setCurrentView
    };
};
