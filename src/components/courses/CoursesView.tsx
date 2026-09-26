import React, { useState } from 'react';
import { Course, UserProfile, NavScreen } from '../../types';
import { COURSES } from '../../data/mockData';
import { ProgressBar } from '../common/ProgressBar';
import { CourseDetailModal } from './CourseDetailModal';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Play, 
  Terminal, 
  Code2, 
  Database, 
  Layout, 
  GitBranch, 
  Gamepad2, 
  Search, 
  Filter,
  ChevronRight,
  BookOpen
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
      case 'Terminal': return <Terminal className="w-6 h-6 text-[#58A700]" />;
      case 'Code': return <Code2 className="w-6 h-6 text-[#1CB0F6]" />;
      case 'Database': return <Database className="w-6 h-6 text-[#58A700]" />;
      case 'Layout': return <Layout className="w-6 h-6 text-[#FF9600]" />;
      case 'GitBranch': return <GitBranch className="w-6 h-6 text-[#FF4B4B]" />;
      default: return <Gamepad2 className="w-6 h-6 text-[#CE82FF]" />;
    }
  };

  const handleStartOrContinue = (course: Course) => {
    soundFx.playClick();
    if (course.id === 'python-beginners') {
      onNavigate('lesson', { lessonId: user.activeLessonId || 'python-13', courseId: course.id });
    } else {
      setInspectedCourse(course);
    }
  };

  return (
    <div id="courses-screen" className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C] tracking-tight">
            Learning Paths & Curricula
          </h1>
          <p className="text-sm text-[#777777] font-semibold mt-1">
            Choose your programming discipline with step-by-step interactive exercises and immediate feedback.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#AFAFAF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="courses-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language or skill..."
            className="cose-input w-full pl-10 pr-4 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-extrabold uppercase text-[#AFAFAF] flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          FILTER:
        </span>
        {filterTags.map((tag) => (
          <button
            key={tag}
            id={`course-filter-${tag.toLowerCase()}`}
            onClick={() => {
              soundFx.playClick();
              setSelectedTag(tag);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-[#58CC02] text-white shadow-xs'
                : 'bg-white text-[#777777] border-2 border-[#E5E5E5] hover:border-[#AFAFAF]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const completedCount = allLessons.filter((l) => user.completedLessons.includes(l.id)).length;
          const progressPercent = course.id === 'python-beginners' 
            ? Math.round((12 / 28) * 100) 
            : Math.round((completedCount / (course.totalLessons || 1)) * 100);

          return (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="cose-card cose-card-hover p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F7F7F7] border-2 border-[#E5E5E5] flex items-center justify-center">
                    {getCourseIcon(course.iconName)}
                  </div>
                  {course.badge && (
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFFBE6] text-[#CC9900] border border-[#FFE885]">
                      {course.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#3C3C3C] group-hover:text-[#58CC02] transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-xs text-[#777777] font-semibold mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#777777]">
                    <span>{course.totalLessons} Lessons • {course.estimatedHours} hrs</span>
                    <span className="text-[#58A700]">{progressPercent}%</span>
                  </div>
                  <ProgressBar value={progressPercent} size="sm" color="green" />
                </div>
              </div>

              <div className="pt-5 mt-4 border-t-2 border-[#E5E5E5]">
                <button
                  onClick={() => handleStartOrContinue(course)}
                  className="w-full btn-primary text-xs font-extrabold !py-2.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{progressPercent > 0 ? 'Continue Path' : 'Start Path'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Modal */}
      {inspectedCourse && (
        <CourseDetailModal
          course={inspectedCourse}
          user={user}
          onClose={() => setInspectedCourse(null)}
          onStartLesson={(lessonId) => {
            setInspectedCourse(null);
            onNavigate('lesson', { lessonId, courseId: inspectedCourse.id });
          }}
        />
      )}
    </div>
  );
};
