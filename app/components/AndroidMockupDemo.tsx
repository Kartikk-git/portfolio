"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Home,
  BookOpen,
  CheckSquare,
  Calendar as CalendarIcon,
  User,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Database,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  AlertCircle,
  Clock,
  Layers,
  X,
  Send,
} from "lucide-react";

interface CourseItem {
  id: string;
  code: string;
  name: string;
  instructor: string;
  room: string;
  progress: number;
}

interface AssignmentItem {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  isDone: boolean;
  priority: "high" | "urgent" | "medium";
}

interface AttendanceDay {
  day: number;
  status: "present" | "absent" | "none";
}

const INITIAL_COURSES: CourseItem[] = [
  { id: "c1", code: "CS301", name: "Data Structures & Algorithms", instructor: "Prof. R. Mehta", room: "302", progress: 68 },
  { id: "c2", code: "MA201", name: "Advanced Mathematics", instructor: "Dr. A. Verma", room: "204", progress: 82 },
  { id: "c3", code: "EE202", name: "Digital Electronics", instructor: "Prof. S. Rao", room: "108", progress: 55 },
  { id: "c4", code: "CS302", name: "Operating Systems", instructor: "Dr. K. Nair", room: "305", progress: 73 },
  { id: "c5", code: "HS101", name: "Professional Communication", instructor: "Prof. L. Sen", room: "401", progress: 90 },
];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  { id: "a1", title: "Binary Tree Traversal Implementation", courseCode: "CS301", dueDate: "Oct 28", isDone: false, priority: "high" },
  { id: "a2", title: "Fourier Series Problem Set 4", courseCode: "MA201", dueDate: "Oct 25", isDone: false, priority: "urgent" },
  { id: "a3", title: "Logic Gates Simulation Report", courseCode: "EE202", dueDate: "Nov 02", isDone: false, priority: "medium" },
  { id: "a4", title: "Process Scheduling Algorithms", courseCode: "CS302", dueDate: "Oct 20", isDone: true, priority: "high" },
];

const INITIAL_ATTENDANCE: Record<number, "present" | "absent"> = {
  1: "present", 2: "present", 3: "present", 4: "absent",
  7: "present", 8: "present", 9: "present", 10: "present", 11: "absent",
  14: "present", 15: "present", 16: "present", 17: "present", 18: "present",
  21: "present", 22: "absent", 23: "present", 24: "present", 25: "present",
};

export function AndroidMockupDemo() {
  const [activeTab, setActiveTab] = useState<"home" | "courses" | "assignments" | "calendar" | "profile">("home");
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<Record<number, "present" | "absent">>(INITIAL_ATTENDANCE);
  const [showRoomDb, setShowRoomDb] = useState(false);
  const [selectedDbTable, setSelectedDbTable] = useState<"assignments" | "courses" | "attendance">("assignments");

  // New item modal / form state
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentCourse, setNewAssignmentCourse] = useState("CS301");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [doubtText, setDoubtText] = useState("");
  const [doubtReply, setDoubtReply] = useState<string | null>(null);

  // Assignment filter
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "pending" | "submitted">("all");

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("demo_student_courses");
      const savedAssignments = localStorage.getItem("demo_student_assignments");
      const savedAttendance = localStorage.getItem("demo_student_attendance");

      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
    } catch {}
  }, []);

  // Save changes to localStorage (offline-first simulation)
  const persistState = useCallback((c: CourseItem[], a: AssignmentItem[], att: Record<number, "present" | "absent">) => {
    try {
      localStorage.setItem("demo_student_courses", JSON.stringify(c));
      localStorage.setItem("demo_student_assignments", JSON.stringify(a));
      localStorage.setItem("demo_student_attendance", JSON.stringify(att));
    } catch {}
  }, []);

  const resetDemo = () => {
    setCourses(INITIAL_COURSES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAttendance(INITIAL_ATTENDANCE);
    persistState(INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_ATTENDANCE);
  };

  const toggleAssignmentDone = (id: string) => {
    setAssignments((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      );
      persistState(courses, updated, attendance);
      return updated;
    });
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistState(courses, updated, attendance);
      return updated;
    });
  };

  const addAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;

    const newItem: AssignmentItem = {
      id: "a_" + Date.now(),
      title: newAssignmentTitle.trim(),
      courseCode: newAssignmentCourse,
      dueDate: "Nov 0" + (Math.floor(Math.random() * 8) + 1),
      isDone: false,
      priority: "high",
    };

    setAssignments((prev) => {
      const updated = [newItem, ...prev];
      persistState(courses, updated, attendance);
      return updated;
    });

    setNewAssignmentTitle("");
    setShowAddModal(false);
  };

  const toggleAttendanceDay = (day: number) => {
    setAttendance((prev) => {
      const current = prev[day];
      const next: "present" | "absent" = current === "present" ? "absent" : "present";
      const updated: Record<number, "present" | "absent"> = { ...prev, [day]: next };
      persistState(courses, assignments, updated);
      return updated;
    });
  };

  // Compute attendance stats
  const attendanceRate = useMemo(() => {
    const values = Object.values(attendance);
    if (!values.length) return 87;
    const present = values.filter((v) => v === "present").length;
    return Math.round((present / values.length) * 100);
  }, [attendance]);

  const pendingAssignmentsCount = useMemo(() => {
    return assignments.filter((a) => !a.isDone).length;
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    if (assignmentFilter === "pending") return assignments.filter((a) => !a.isDone);
    if (assignmentFilter === "submitted") return assignments.filter((a) => a.isDone);
    return assignments;
  }, [assignments, assignmentFilter]);

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtReply(
      `Room AI indexed: "${doubtText.slice(0, 30)}..." Query stored in offline Room table. Response logged from syllabus cache!`
    );
    setDoubtText("");
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Top Floating Room DB Toggle Button */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 max-w-[340px] sm:max-w-[360px]">
        <button
          type="button"
          onClick={() => setShowRoomDb((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-mono text-[11px] font-medium transition-colors cursor-pointer border ${
            showRoomDb
              ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
              : "bg-[var(--surface)] text-[var(--ink)] border-[var(--rule)] hover:border-[var(--accent)]"
          }`}
          title="Toggle Room DB live inspector table"
        >
          <Database size={13} className={showRoomDb ? "text-white" : "text-[var(--accent)]"} />
          <span>Room DB Inspector</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>

        <button
          type="button"
          onClick={resetDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] font-mono text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--ink)] bg-[var(--surface-subtle)] transition-colors cursor-pointer"
          title="Reset demo data back to defaults"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Container: Phone + Slide-out Room DB Panel */}
      <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-4">
        {/* Realistic Android Phone Device Shell */}
        <div
          className="relative w-[310px] sm:w-[330px] h-[620px] bg-[#1E2024] rounded-[42px] p-3 shadow-2xl border-4 border-[#2D3139] ring-1 ring-white/10 select-none flex flex-col shrink-0"
          style={{
            boxShadow:
              "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Top Notch / Camera Island */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
            <span className="w-8 h-1 bg-[#1a1a1a] rounded-full" />
          </div>

          {/* Android Screen Container */}
          <div className="relative w-full h-full bg-[#F9FAFB] text-[#111827] rounded-[32px] overflow-hidden flex flex-col">
            {/* Android Status Bar */}
            <div className="h-7 shrink-0 px-6 flex items-center justify-between text-[10px] font-mono font-semibold bg-[#1F1F1F] text-white pt-1.5 z-30 select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-[9px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* App Charcoal Header (Persistent) */}
            <div className="bg-[#1F1F1F] text-white px-4 pt-1 pb-3 shrink-0 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#374151] border border-white/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                    PS
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 leading-tight">Good morning,</div>
                    <div className="text-xs font-semibold leading-tight text-white">Priya Sharma</div>
                    <div className="text-[9px] text-gray-400 font-mono">B.Tech CSE • Sem 5</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-300">
                  <button
                    type="button"
                    onClick={() => setShowDoubtModal(true)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    title="Ask Doubt"
                  >
                    <MessageSquare size={13} className="text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative"
                    title="Notifications"
                  >
                    <Bell size={13} />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
              {/* TAB 1: HOME DASHBOARD */}
              {activeTab === "home" && (
                <div className="space-y-3 animate-fadeIn">
                  {/* System Announcement Pill */}
                  <div className="p-2 bg-emerald-50 border border-emerald-200/60 rounded-[8px] text-[10.5px] text-emerald-800 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-emerald-600 shrink-0" />
                    <span className="truncate">Exam schedule updated • Check calendar</span>
                  </div>

                  {/* 3 Metrics Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      onClick={() => setActiveTab("calendar")}
                      className="p-2.5 bg-white border border-gray-200 rounded-[10px] text-center shadow-2xs cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <div className="text-[15px] font-bold text-[#111827] flex items-center justify-center gap-0.5">
                        <span>{attendanceRate}%</span>
                        <span className="text-[10px] text-emerald-600">↗</span>
                      </div>
                      <div className="text-[9.5px] text-gray-500 font-medium mt-0.5">Attendance</div>
                    </div>

                    <div
                      onClick={() => setActiveTab("assignments")}
                      className="p-2.5 bg-white border border-gray-200 rounded-[10px] text-center shadow-2xs cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <div className="text-[15px] font-bold text-[#111827]">
                        {pendingAssignmentsCount}
                      </div>
                      <div className="text-[9.5px] text-gray-500 font-medium mt-0.5">Due Tasks</div>
                    </div>

                    <div
                      onClick={() => setActiveTab("calendar")}
                      className="p-2.5 bg-white border border-gray-200 rounded-[10px] text-center shadow-2xs cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <div className="text-[15px] font-bold text-blue-600">5d</div>
                      <div className="text-[9.5px] text-gray-500 font-medium mt-0.5">Mid-Terms</div>
                    </div>
                  </div>

                  {/* Quick Courses Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-gray-900 text-[11.5px]">My Courses</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("courses")}
                        className="text-[10px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {courses.slice(0, 3).map((course) => (
                        <div
                          key={course.id}
                          className="p-2.5 bg-white border border-gray-200 rounded-[10px] shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[3px] bg-gray-100 font-semibold text-gray-800">
                              {course.code}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-600">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="font-semibold text-[11px] text-gray-900 truncate">
                            {course.name}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tasks Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-gray-900 text-[11.5px]">Pending Tasks</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("assignments")}
                        className="text-[10px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {assignments.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleAssignmentDone(item.id)}
                          className="p-2 bg-white border border-gray-200 rounded-[8px] flex items-center justify-between gap-2 cursor-pointer hover:border-emerald-500 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div
                              className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 ${
                                item.isDone
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-gray-300 bg-gray-50"
                              }`}
                            >
                              {item.isDone && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span
                              className={`text-[11px] truncate ${
                                item.isDone ? "line-through text-gray-400" : "text-gray-800 font-medium"
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-gray-400 shrink-0">
                            {item.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeTab === "courses" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-gray-900">All Courses</h2>
                      <div className="text-[10px] text-gray-500">Semester 5 • 2024-25</div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-[4px] font-semibold border border-emerald-200">
                      {courses.length} Active
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 bg-white border border-gray-200 rounded-[12px] shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-gray-100 font-bold text-gray-800">
                              {course.code}
                            </span>
                            <div className="font-semibold text-xs text-gray-900 mt-1">
                              {course.name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {course.instructor} • Room {course.room}
                            </div>
                          </div>
                          <span className="text-[10.5px] font-bold text-emerald-700 font-mono">
                            {course.progress}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[9.5px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                            Overview
                          </span>
                          <span className="text-[9.5px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                            Materials
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCourses((prev) =>
                                prev.map((c) =>
                                  c.id === course.id
                                    ? { ...c, progress: Math.min(100, c.progress + 5) }
                                    : c
                                )
                              );
                            }}
                            className="text-[9.5px] ml-auto text-emerald-700 font-semibold hover:underline cursor-pointer"
                          >
                            +5% Study
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ASSIGNMENTS */}
              {activeTab === "assignments" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-gray-900">Assignments</h2>
                      <div className="text-[10px] text-gray-500">
                        {pendingAssignmentsCount} pending • Room SQLite
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1F1F1F] text-white rounded-full text-[10px] font-semibold hover:bg-black transition-colors cursor-pointer"
                    >
                      <Plus size={11} strokeWidth={2.5} />
                      <span>New</span>
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5">
                    {(["all", "pending", "submitted"] as const).map((flt) => (
                      <button
                        key={flt}
                        type="button"
                        onClick={() => setAssignmentFilter(flt)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize transition-colors cursor-pointer ${
                          assignmentFilter === flt
                            ? "bg-[#1F1F1F] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>

                  {/* Assignments List with Click Ripple, Strikethrough, Delete */}
                  <div className="space-y-2">
                    {filteredAssignments.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 bg-white border rounded-[10px] shadow-2xs transition-all flex items-start justify-between gap-2 ${
                          item.isDone ? "border-gray-200 bg-gray-50/60" : "border-gray-200 hover:border-emerald-500"
                        }`}
                      >
                        <div
                          onClick={() => toggleAssignmentDone(item.id)}
                          className="flex items-start gap-2.5 flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                              item.isDone
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {item.isDone && <Check size={11} strokeWidth={3} />}
                          </div>

                          <div className="space-y-0.5">
                            <div
                              className={`text-[11.5px] font-medium leading-tight transition-all ${
                                item.isDone ? "line-through text-gray-400" : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </div>
                            <div className="flex items-center gap-2 text-[9.5px] font-mono text-gray-500">
                              <span className="font-semibold text-gray-700">{item.courseCode}</span>
                              <span>•</span>
                              <span>Due {item.dueDate}</span>
                              <span>•</span>
                              <span
                                className={`uppercase font-bold ${
                                  item.priority === "urgent"
                                    ? "text-red-600"
                                    : item.priority === "high"
                                    ? "text-amber-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {item.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteAssignment(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete from Room DB"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CALENDAR & ATTENDANCE */}
              {activeTab === "calendar" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-gray-900">Attendance Tracker</h2>
                      <div className="text-[10px] text-gray-500">October 2024 • Tap to mark</div>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-[4px] border ${
                        attendanceRate >= 75
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                      }`}
                    >
                      {attendanceRate}%
                    </span>
                  </div>

                  {attendanceRate < 75 && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-[8px] text-[10px] text-red-700 flex items-center gap-1.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>Warning: Attendance below 75% minimum threshold!</span>
                    </div>
                  )}

                  {/* Calendar Grid (Days 1 to 28) */}
                  <div className="p-2.5 bg-white border border-gray-200 rounded-[12px] shadow-2xs">
                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-gray-400 mb-1 font-semibold">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
                        const status = attendance[d];
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleAttendanceDay(d)}
                            className={`h-7 rounded-[4px] font-mono text-[10px] font-medium transition-colors cursor-pointer flex flex-col items-center justify-center ${
                              status === "present"
                                ? "bg-emerald-600 text-white font-bold"
                                : status === "absent"
                                ? "bg-amber-500 text-white font-bold"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                            title={`Day ${d}: ${status || "unmarked"}`}
                          >
                            <span>{d}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[9.5px] font-mono text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500" />
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3 bg-white border border-gray-200 rounded-[12px] shadow-2xs text-center space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#1F1F1F] text-emerald-400 text-base font-bold flex items-center justify-center border-2 border-emerald-500/40">
                      PS
                    </div>
                    <div className="font-bold text-xs text-gray-900">Priya Sharma</div>
                    <div className="text-[10px] text-gray-500 font-mono">Roll: 22BCSE104</div>
                    <div className="text-[9.5px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold">
                      B.Tech CSE • Semester 5
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-2 bg-white border border-gray-200 rounded-[8px]">
                      <div className="text-xs font-bold text-gray-900">8.42</div>
                      <div className="text-[9px] text-gray-400">Current CGPA</div>
                    </div>
                    <div className="p-2 bg-white border border-gray-200 rounded-[8px]">
                      <div className="text-xs font-bold text-emerald-700">{attendanceRate}%</div>
                      <div className="text-[9px] text-gray-400">Attendance</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-gray-200 rounded-[10px] space-y-1 text-[10.5px]">
                    <div className="font-semibold text-gray-800">Architecture Features:</div>
                    <div className="text-[10px] text-gray-600">• MVVM Architecture with Kotlin Coroutines</div>
                    <div className="text-[10px] text-gray-600">• Room SQLite on-device persistence</div>
                    <div className="text-[10px] text-gray-600">• 100% Offline-first, zero remote cloud leaks</div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Action Button (FAB) for Doubt */}
            <button
              type="button"
              onClick={() => setShowDoubtModal(true)}
              className="absolute bottom-16 right-4 w-9 h-9 rounded-full bg-[#1F1F1F] text-white shadow-lg flex items-center justify-center hover:bg-black transition-colors cursor-pointer z-30"
              title="Ask Doubt"
            >
              <MessageSquare size={15} className="text-emerald-400" />
            </button>

            {/* Bottom Navigation Bar (Persistent 5 Tabs) */}
            <div className="h-14 shrink-0 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-30">
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors cursor-pointer ${
                  activeTab === "home" ? "text-[#1F1F1F] font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <Home size={15} strokeWidth={activeTab === "home" ? 2.5 : 1.75} />
                <span className="text-[9px]">Home</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("courses")}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors cursor-pointer ${
                  activeTab === "courses" ? "text-[#1F1F1F] font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <BookOpen size={15} strokeWidth={activeTab === "courses" ? 2.5 : 1.75} />
                <span className="text-[9px]">Courses</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("assignments")}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors cursor-pointer relative ${
                  activeTab === "assignments" ? "text-[#1F1F1F] font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <CheckSquare size={15} strokeWidth={activeTab === "assignments" ? 2.5 : 1.75} />
                <span className="text-[9px]">Tasks</span>
                {pendingAssignmentsCount > 0 && (
                  <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white font-mono text-[8px] flex items-center justify-center font-bold">
                    {pendingAssignmentsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors cursor-pointer ${
                  activeTab === "calendar" ? "text-[#1F1F1F] font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <CalendarIcon size={15} strokeWidth={activeTab === "calendar" ? 2.5 : 1.75} />
                <span className="text-[9px]">Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors cursor-pointer ${
                  activeTab === "profile" ? "text-[#1F1F1F] font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <User size={15} strokeWidth={activeTab === "profile" ? 2.5 : 1.75} />
                <span className="text-[9px]">Profile</span>
              </button>
            </div>

            {/* Gesture Navigation Pill Bar */}
            <div className="h-4 shrink-0 flex items-center justify-center bg-white z-30 pb-1">
              <span className="w-24 h-1 bg-[#111827]/30 rounded-full" />
            </div>

            {/* Add Assignment Mini Modal */}
            {showAddModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
                <form
                  onSubmit={addAssignment}
                  className="w-full bg-white rounded-[16px] p-4 space-y-3 text-xs shadow-xl animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">Add New Assignment</span>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="p-1 text-gray-400 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Assignment title..."
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-[6px] text-xs text-gray-900 focus:outline-emerald-600"
                    autoFocus
                  />

                  <div className="flex items-center gap-2">
                    <select
                      value={newAssignmentCourse}
                      onChange={(e) => setNewAssignmentCourse(e.target.value)}
                      className="p-1.5 border border-gray-300 rounded-[6px] text-xs text-gray-800 bg-gray-50"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="ml-auto px-3 py-1.5 bg-[#1F1F1F] text-white rounded-[6px] font-semibold text-xs hover:bg-black"
                    >
                      Save to Room DB
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ask Doubt Modal */}
            {showDoubtModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
                <div className="w-full bg-white rounded-[16px] p-4 space-y-2.5 text-xs shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-emerald-600" />
                      <span>Ask Doubt (Offline Assistant)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDoubtModal(false);
                        setDoubtReply(null);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {doubtReply ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[8px] text-[11px] text-emerald-900 leading-relaxed">
                      {doubtReply}
                    </div>
                  ) : (
                    <form onSubmit={handleAskDoubt} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Type question or formula..."
                        value={doubtText}
                        onChange={(e) => setDoubtText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-[6px] text-xs text-gray-900 focus:outline-emerald-600"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-[#1F1F1F] text-white rounded-[6px] font-semibold text-xs flex items-center justify-center gap-1"
                      >
                        <Send size={11} />
                        <span>Query Local Cache</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slide-out Room DB Telemetry Panel */}
        {showRoomDb && (
          <div className="w-full max-w-[340px] sm:max-w-[400px] bg-[var(--surface)] border border-[var(--rule)] rounded-[12px] p-4 font-mono text-xs shadow-xl animate-fadeIn space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--rule)] pb-2">
              <div className="flex items-center gap-1.5">
                <Database size={13} className="text-[var(--accent)]" />
                <span className="font-bold text-[var(--ink)]">Room SQLite Telemetry</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                Live Data
              </span>
            </div>

            {/* Table Selector Tabs */}
            <div className="flex items-center gap-1">
              {(["assignments", "courses", "attendance"] as const).map((tbl) => (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => setSelectedDbTable(tbl)}
                  className={`px-2.5 py-1 rounded-[4px] text-[10px] uppercase font-semibold transition-colors cursor-pointer ${
                    selectedDbTable === tbl
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--rule)]"
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            {/* Live Table Rows */}
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto border border-[var(--rule)] rounded-[6px] text-[10px]">
              {selectedDbTable === "assignments" && (
                <table className="w-full text-left divide-y divide-[var(--rule)]">
                  <thead className="bg-[var(--surface-subtle)] text-[var(--ink-muted)]">
                    <tr>
                      <th className="p-1.5">id</th>
                      <th className="p-1.5">title</th>
                      <th className="p-1.5">code</th>
                      <th className="p-1.5">done</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rule)] text-[var(--ink)]">
                    {assignments.map((a) => (
                      <tr key={a.id} className="hover:bg-[var(--surface-subtle)]">
                        <td className="p-1.5 text-gray-500 font-mono">{a.id.slice(-4)}</td>
                        <td className="p-1.5 truncate max-w-[120px]">{a.title}</td>
                        <td className="p-1.5">{a.courseCode}</td>
                        <td className="p-1.5 font-bold">
                          <span className={a.isDone ? "text-emerald-400" : "text-amber-400"}>
                            {a.isDone ? "1" : "0"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedDbTable === "courses" && (
                <table className="w-full text-left divide-y divide-[var(--rule)]">
                  <thead className="bg-[var(--surface-subtle)] text-[var(--ink-muted)]">
                    <tr>
                      <th className="p-1.5">code</th>
                      <th className="p-1.5">name</th>
                      <th className="p-1.5">progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rule)] text-[var(--ink)]">
                    {courses.map((c) => (
                      <tr key={c.id} className="hover:bg-[var(--surface-subtle)]">
                        <td className="p-1.5 font-bold text-[var(--accent)]">{c.code}</td>
                        <td className="p-1.5 truncate max-w-[140px]">{c.name}</td>
                        <td className="p-1.5">{c.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedDbTable === "attendance" && (
                <table className="w-full text-left divide-y divide-[var(--rule)]">
                  <thead className="bg-[var(--surface-subtle)] text-[var(--ink-muted)]">
                    <tr>
                      <th className="p-1.5">day</th>
                      <th className="p-1.5">status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rule)] text-[var(--ink)]">
                    {Object.entries(attendance).map(([day, st]) => (
                      <tr key={day} className="hover:bg-[var(--surface-subtle)]">
                        <td className="p-1.5">Oct {day}</td>
                        <td className="p-1.5 uppercase font-bold">
                          <span className={st === "present" ? "text-emerald-400" : "text-amber-400"}>
                            {st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="text-[9.5px] text-[var(--ink-muted)] pt-1 flex items-center justify-between">
              <span>SQLite Schema v2.1</span>
              <span>100% On-Device</span>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Caption Under the Phone Mockup */}
      <p className="mt-3 font-mono text-xs text-[var(--ink-muted)] text-center">
        This is a live demo of my Student Organizer app. Try it.
      </p>
    </div>
  );
}
