import React, { useState } from 'react';
import { Course, UserProfile, NavScreen } from '../../types';
import { COURSES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { CourseDetailModal } from './CourseDetailModal';
import { 
  Play, 
  Terminal, 
  Code2, 
  Database, 
  Layout, 
  GitBranch, 
  Gamepad2, 
  Clock, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface CoursesViewProps {
  user: UserProfile;
  onNavigate: (screen: NavScreen, opts?: { courseId?: string; lessonId?: string; exerciseId?: string; quizId?: string }) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [inspectedCourse, setInspectedCourse] = useState<Course | null>(null);

  const filterTags = ['All', 'Beginner', 'Practical', 'Popular', 'Interactive', 'Web', 'Data'];

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = 
      selectedTag === 'All' || 
      course.tags.includes(selectedTag) || 
      course.badge === selectedTag || 
      course.difficulty === selectedTag;

    return matchesSearch && matchesTag;
  });

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-6 h-6 text-indigo-500" />;
      case 'Code': return <Code2 className="w-6 h-6 text-sky-500" />;
      case 'Database': return <Database className="w-6 h-6 text-emerald-500" />;
      case 'Layout': return <Layout className="w-6 h-6 text-amber-500" />;
      case 'GitBranch': return <GitBranch className="w-6 h-6 text-rose-500" />;
      default: return <Gamepad2 className="w-6 h-6 text-purple-500" />;
    }
  };

  const handleStartOrContinue = (course: Course) => {
    soundFx.playClick();
    if (course.id === 'python-beginners') {
      onNavigate('lesson', { lessonId: user.activeLessonId || 'python-13', courseId: course.id });
    } else {
      // Open course syllabus modal to see available modules
      setInspectedCourse(course);
    }
  };

  return (
    <div id="courses-screen" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learning Paths & Curricula
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose your programming discipline with step-by-step interactive exercises and immediate feedback.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="courses-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {filterTags.map((tag) => (
          <button
            key={tag}
            id={`course-filter-${tag.toLowerCase()}`}
            onClick={() => {
              soundFx.playClick();
              setSelectedTag(tag);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          // Calculate progress
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const completedCount = allLessons.filter((l) => user.completedLessons.includes(l.id)).length;
          const progressPercent = course.id === 'python-beginners' 
            ? Math.round((12 / 28) * 100) 
            : Math.round((completedCount / (course.totalLessons || 1)) * 100);
          
          const hasStarted = progressPercent > 0;

          return (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Icon & Badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {getCourseIcon(course.iconName)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={course.badge === 'Popular' ? 'purple' : 'primary'} size="sm">
                      {course.badge}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Course Title & Description */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Action Bottom Section */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Metrics */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.totalLessons} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{course.estimatedHours} Hours
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {progressPercent}%
                    </span>
                  </div>
                  <ProgressBar value={progressPercent} color="indigo" size="sm" />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`btn-course-action-${course.id}`}
                    onClick={() => handleStartOrContinue(course)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{hasStarted ? 'Continue Learning' : 'Start Learning'}</span>
                  </button>
                  <button
                    id={`btn-course-syllabus-${course.id}`}
                    onClick={() => setInspectedCourse(course)}
                    title="View full curriculum syllabus"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={inspectedCourse}
        isOpen={!!inspectedCourse}
        onClose={() => setInspectedCourse(null)}
        user={user}
        onNavigate={onNavigate}
      />
    </div>
  );
};
