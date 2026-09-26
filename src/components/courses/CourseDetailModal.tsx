import React from 'react';
import { Course, UserProfile, NavScreen } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { LESSONS } from '../../data/mockData';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen?: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate?: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
  onStartLesson?: (lessonId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen = true,
  onClose,
  user,
  onNavigate,
  onStartLesson,
}) => {
  if (!course) return null;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => user.completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (course.totalLessons || allLessons.length || 1)) * 100);

  const handleSelectLesson = (lessonId: string) => {
    onClose();
    if (onStartLesson) {
      onStartLesson(lessonId);
    } else if (onNavigate) {
      const targetId = LESSONS[lessonId] ? lessonId : 'python-13';
      onNavigate('lesson', { lessonId: targetId, courseId: course.id });
    }
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
        <div className="p-5 rounded-[16px] bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-3">
          <p className="text-xs sm:text-sm text-[#3C3C3C] font-semibold leading-relaxed">
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
            <div className="flex justify-between text-xs font-extrabold text-[#777777] mb-1.5">
              <span>Path Progress</span>
              <span className="text-[#58A700]">{progressPercent}% Completed</span>
            </div>
            <ProgressBar value={progressPercent} color="green" size="md" />
          </div>
        </div>

        {/* Modules & Lessons Curriculum */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF]">
            Course Curriculum & Syllabus
          </h4>

          {course.modules.map((module) => (
            <div
              key={module.id}
              className="rounded-[16px] border-2 border-[#E5E5E5] overflow-hidden bg-white"
            >
              <div className="px-4 py-3 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-[#3C3C3C]">
                    {module.title}
                  </h5>
                  <p className="text-xs text-[#777777] font-semibold">
                    {module.description}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#777777]">
                  {module.lessons.length} lessons
                </span>
              </div>

              <div className="divide-y-2 divide-[#E5E5E5]">
                {module.lessons.map((lesson) => {
                  const isCompleted = user.completedLessons.includes(lesson.id);
                  const isCurrent = user.activeLessonId === lesson.id && course.id === user.activeCourseId;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={`p-3.5 flex items-center justify-between hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
                        isCurrent ? 'bg-[#DBF8C5]/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center text-xs font-extrabold">
                              ✓
                            </div>
                          ) : isCurrent ? (
                            <div className="w-6 h-6 rounded-full bg-[#1CB0F6] text-white flex items-center justify-center text-[10px] font-extrabold">
                              ▶
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-[#E5E5E5] text-[#AFAFAF] flex items-center justify-center text-[10px] font-bold">
                              {lesson.order}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-extrabold text-[#3C3C3C] flex items-center gap-2">
                            <span>{lesson.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-[#58CC02] text-white">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#777777] font-semibold mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                            </span>
                            <span className="capitalize text-[11px] text-[#AFAFAF]">
                              {lesson.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="text-xs font-extrabold text-[#58A700] flex items-center gap-1 hover:underline cursor-pointer"
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
