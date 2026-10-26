import React, { useState } from 'react';
import { Employee, AttendanceCode, MusterMetadata } from '../types/attendance';
import {
  ATTENDANCE_CODE_META,
  getDaysInMonth,
  getDayOfWeek,
  GUJARATI_DAYS_FULL,
} from '../utils/calculations';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

interface MobileDailyAttendanceProps {
  metadata: MusterMetadata;
  employees: Employee[];
  onUpdateAttendance: (employeeId: string, day: number, code: AttendanceCode) => void;
  onSwitchToSpreadsheet: () => void;
}

export const MobileDailyAttendance: React.FC<MobileDailyAttendanceProps> = ({
  metadata,
  employees,
  onUpdateAttendance,
  onSwitchToSpreadsheet,
}) => {
  const daysInMonth = getDaysInMonth(metadata.month);
  const [selectedDay, setSelectedDay] = useState(1);
  const [filterSearch, setFilterSearch] = useState('');

  const dayOfWeek = getDayOfWeek(metadata.month, selectedDay);
  const isSunday = dayOfWeek === 0;

  // Filtered staff list
  const filteredStaff = employees.filter((e) => {
    if (!filterSearch.trim()) return true;
    const term = filterSearch.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.tokenNo.toLowerCase().includes(term) ||
      e.designation.toLowerCase().includes(term)
    );
  });

  // Calculate stats for this specific day
  let dayPresentCount = 0;
  let nightPresentCount = 0;
  let offCount = 0;
  let offDutyCount = 0;
  let leaveCount = 0;
  let absentCount = 0;

  employees.forEach((emp) => {
    const code = emp.days[selectedDay] || '';
    if (code === 'P' || code === 'H+P') dayPresentCount++;
    else if (code === 'PN' || code === 'H+PN') nightPresentCount++;
    else if (code === 'OFF') offCount++;
    else if (code === 'OFF+P') {
      dayPresentCount++;
      offDutyCount++;
    } else if (code === 'OFF+PN') {
      nightPresentCount++;
      offDutyCount++;
    } else if (code === 'P+PN') {
      dayPresentCount++;
      nightPresentCount++;
    } else if (code === 'CL' || code === 'L' || code === 'C-OFF') leaveCount++;
    else if (code === 'A') absentCount++;
  });

  // Common quick codes for 1-tap mobile entry
  const quickCodes: AttendanceCode[] = [
    'P',
    'PN',
    'OFF',
    'OFF+P',
    'OFF+PN',
    'P+PN',
    'H',
    'CL',
    'C-OFF',
    'A',
  ];

  return (
    <div className="space-y-3 pb-6">
      {/* Mobile Top Navigation & Date Picker */}
      <div className="bg-white border-2 border-slate-600 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-slate-200">
          <button
            onClick={() => setSelectedDay((prev) => Math.max(1, prev - 1))}
            disabled={selectedDay <= 1}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 border border-slate-400 font-black cursor-pointer"
            title="અગાઉની તારીખ"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                તારીખ: {selectedDay} / {daysInMonth}
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded border ${
                  isSunday
                    ? 'bg-amber-300 text-amber-950 border-amber-600'
                    : 'bg-slate-200 text-slate-900 border-slate-400'
                }`}
              >
                {GUJARATI_DAYS_FULL[dayOfWeek]}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-bold mt-0.5">
              માસ: {metadata.month}
            </div>
          </div>

          <button
            onClick={() => setSelectedDay((prev) => Math.min(daysInMonth, prev + 1))}
            disabled={selectedDay >= daysInMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 border border-slate-400 font-black cursor-pointer"
            title="પછીની તારીખ"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Date Selector Slider / Quick Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-thin">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const dow = getDayOfWeek(metadata.month, d);
            const isSun = dow === 0;
            const isCurrent = d === selectedDay;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`flex flex-col items-center justify-center min-w-[38px] h-11 rounded-lg border-2 font-black transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0f386b] text-white border-black scale-105 shadow-sm'
                    : isSun
                    ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs">{d}</span>
                <span className="text-[8px] opacity-80">
                  {isSun ? 'રવિ' : dow === 1 ? 'સોમ' : dow === 2 ? 'મંગળ' : dow === 3 ? 'બુધ' : dow === 4 ? 'ગુરુ' : dow === 5 ? 'શુક્ર' : 'શનિ'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Daily Summary Stats Pill Strip */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-xs">
          <div className="bg-emerald-100 border border-emerald-400 p-1 rounded-lg">
            <div className="text-[10px] font-bold text-emerald-900">દિવસ હાજર</div>
            <div className="font-black text-emerald-950 text-sm">{dayPresentCount}</div>
          </div>
          <div className="bg-indigo-100 border border-indigo-400 p-1 rounded-lg">
            <div className="text-[10px] font-bold text-indigo-900">નાઇટ હાજર</div>
            <div className="font-black text-indigo-950 text-sm">{nightPresentCount}</div>
          </div>
          <div className="bg-sky-100 border border-sky-400 p-1 rounded-lg">
            <div className="text-[10px] font-bold text-sky-900">ઓફ રજા</div>
            <div className="font-black text-sky-950 text-sm">{offCount}</div>
          </div>
          <div className="bg-amber-100 border border-amber-400 p-1 rounded-lg">
            <div className="text-[10px] font-bold text-amber-900">ઓફ ફરજ (C-Off)</div>
            <div className="font-black text-amber-950 text-sm">{offDutyCount}</div>
          </div>
        </div>
      </div>

      {/* Mode Switch & Search */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="કર્મચારીનું નામ શોધો..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-white border-2 border-slate-400 rounded-lg text-slate-950 placeholder-slate-400"
          />
        </div>

        <button
          onClick={onSwitchToSpreadsheet}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-black text-blue-950 bg-blue-100 hover:bg-blue-200 border-2 border-blue-500 rounded-lg shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <span>📋 આખી એક્સેલ શીટ</span>
        </button>
      </div>

      {/* Staff Attendance Cards */}
      <div className="space-y-2">
        {filteredStaff.map((emp, idx) => {
          const currentCode = emp.days[selectedDay] || '';
          const meta = ATTENDANCE_CODE_META[currentCode];

          return (
            <div
              key={emp.id}
              className="bg-white border-2 border-slate-400 rounded-xl p-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-200 border border-slate-400 text-slate-900 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                      <span className="text-blue-900 font-mono">[{emp.tokenNo}]</span>
                      <span>{emp.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-bold">
                      {emp.designation} · <span className="text-amber-800">ઓફ: {GUJARATI_DAYS_FULL[emp.weeklyOffDay % 7]}</span>
                    </div>
                  </div>
                </div>

                {/* Current Code Badge */}
                <div>
                  {currentCode ? (
                    <span
                      className={`inline-flex items-center justify-center min-w-8 h-8 px-2 text-xs font-black ${
                        meta.badgeClass
                      } ${
                        meta.isCircled
                          ? 'rounded-full ring-3 ring-amber-600 font-black shadow-xs'
                          : 'rounded-lg'
                      }`}
                    >
                      {currentCode}
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-300 rounded-lg">
                      ખાલી
                    </span>
                  )}
                </div>
              </div>

              {/* 1-Tap Attendance Buttons Strip */}
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[10px] font-black text-slate-600 mb-1">
                  હાજરી કોડ પસંદ કરો (Tap to Mark):
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {quickCodes.map((code) => {
                    const isSelected = currentCode === code;
                    const cMeta = ATTENDANCE_CODE_META[code];

                    return (
                      <button
                        key={code}
                        onClick={() => onUpdateAttendance(emp.id, selectedDay, code)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-black border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-900 text-white border-black scale-102 ring-2 ring-blue-400 shadow-xs'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className={code.startsWith('OFF+') ? 'text-amber-700 font-extrabold' : ''}>
                          {code}
                        </span>
                        <span className="text-[8px] opacity-75 truncate max-w-full">
                          {cMeta.labelGu.slice(0, 5)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
