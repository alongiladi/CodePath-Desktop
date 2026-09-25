import React from 'react';
import { Course, UserProfile, NavScreen } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  HelpCircle, 
  Lock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LESSONS } from '../../data/mockData';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  user,
  onNavigate,
}) => {
  if (!course) return null;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => user.completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (course.totalLessons || allLessons.length || 1)) * 100);

  const handleSelectLesson = (lessonId: string) => {
    onClose();
    // Check if lesson exists in our mock data or fallback to python-13
    const targetId = LESSONS[lessonId] ? lessonId : 'python-13';
    onNavigate('lesson', { lessonId: targetId, courseId: course.id });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`${course.difficulty} • ${course.totalLessons} Lessons • ${course.estimatedHours} Hours total`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Course Summary Header */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="primary" size="sm">{course.difficulty}</Badge>
            <Badge variant="purple" size="sm">{course.badge}</Badge>
            {course.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" size="sm">{tag}</Badge>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Path Progress</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progressPercent}% Completed</span>
            </div>
            <ProgressBar value={progressPercent} color="indigo" size="md" />
          </div>
        </div>

        {/* Modules & Lessons Curriculum */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Course Curriculum & Syllabus
          </h4>

          {course.modules.map((module, mIdx) => (
            <div
              key={module.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-3 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {module.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {module.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {module.lessons.length} topics
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {module.lessons.map((lesson) => {
                  const isCompleted = user.completedLessons.includes(lesson.id);
                  const isCurrent = user.activeLessonId === lesson.id && course.id === user.activeCourseId;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={`p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        isCurrent ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                              ▶
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                              {lesson.order}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>{lesson.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                            </span>
                            <span className="capitalize text-[11px] font-medium text-slate-400">
                              {lesson.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                      >
                        <span>{isCompleted ? 'Review' : 'Start'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
