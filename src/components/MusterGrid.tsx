import React, { useState, useEffect, useRef } from 'react';
import { Employee, AttendanceCode, MusterMetadata } from '../types/attendance';
import {
  ATTENDANCE_CODE_META,
  calculateEmployeeSummary,
  calculateDailyTotals,
  getDaysInMonth,
  getDayOfWeek,
  GUJARATI_DAYS_SHORT,
  ENGLISH_DAYS_SHORT,
} from '../utils/calculations';
import { Trash2, Edit2, ArrowRightCircle, ZoomIn, ZoomOut, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface MusterGridProps {
  metadata: MusterMetadata;
  employees: Employee[];
  onUpdateAttendance: (employeeId: string, day: number, code: AttendanceCode) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onViewEmployeeLedger: (employee: Employee) => void;
}

export const MusterGrid: React.FC<MusterGridProps> = ({
  metadata,
  employees,
  onUpdateAttendance,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployeeLedger,
}) => {
  const daysInMonth = getDaysInMonth(metadata.month);
  const [selectedCell, setSelectedCell] = useState<{ empId: string; day: number } | null>(null);
  const [popoverCell, setPopoverCell] = useState<{ empId: string; day: number; rect: DOMRect } | null>(null);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isExtraDarkBorders, setIsExtraDarkBorders] = useState(true);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Available codes list for selection
  const codesList: AttendanceCode[] = [
    'P',
    'PN',
    'OFF',
    'OFF+P',
    'OFF+PN',
    'P+PN',
    'H',
    'H+P',
    'H+PN',
    'CL',
    'L',
    'C-OFF',
    'A',
    '',
  ];

  // Excel-like Keyboard navigation and instant input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (!selectedCell) return;

      const empIndex = employees.findIndex((emp) => emp.id === selectedCell.empId);
      if (empIndex === -1) return;

      const currentDay = selectedCell.day;
      const key = e.key.toLowerCase();

      // Navigation keys
      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        if (currentDay < daysInMonth) {
          setSelectedCell({ empId: selectedCell.empId, day: currentDay + 1 });
        } else if (empIndex < employees.length - 1) {
          setSelectedCell({ empId: employees[empIndex + 1].id, day: 1 });
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentDay > 1) {
          setSelectedCell({ empId: selectedCell.empId, day: currentDay - 1 });
        } else if (empIndex > 0) {
          setSelectedCell({ empId: employees[empIndex - 1].id, day: daysInMonth });
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        if (empIndex < employees.length - 1) {
          setSelectedCell({ empId: employees[empIndex + 1].id, day: currentDay });
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (empIndex > 0) {
          setSelectedCell({ empId: employees[empIndex - 1].id, day: currentDay });
        }
        return;
      }

      if (e.key === 'Escape') {
        setSelectedCell(null);
        setPopoverCell(null);
        return;
      }

      // Single keystroke rapid entry (Excel style)
      let targetCode: AttendanceCode | null = null;
      if (key === 'p' || key === '1') targetCode = 'P';
      else if (key === 'n') targetCode = 'PN';
      else if (key === 'o') targetCode = 'OFF';
      else if (key === 'w') targetCode = 'OFF+P';
      else if (key === 'x') targetCode = 'OFF+PN';
      else if (key === 'd' || key === '2') targetCode = 'P+PN';
      else if (key === 'h') targetCode = 'H';
      else if (key === 'j') targetCode = 'H+P';
      else if (key === 'k') targetCode = 'H+PN';
      else if (key === 'c') targetCode = 'CL';
      else if (key === 'l') targetCode = 'L';
      else if (key === 'v') targetCode = 'C-OFF';
      else if (key === 'a' || key === '0') targetCode = 'A';
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ') targetCode = '';

      if (targetCode !== null) {
        e.preventDefault();
        onUpdateAttendance(selectedCell.empId, currentDay, targetCode);

        if (currentDay < daysInMonth) {
          setSelectedCell({ empId: selectedCell.empId, day: currentDay + 1 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, employees, daysInMonth, onUpdateAttendance]);

  // Quick horizontal scroll helper
  const scrollToOffset = (leftPx: number) => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollTo({ left: leftPx, behavior: 'smooth' });
    }
  };

  // Daily totals calculation for bottom row
  const dailyTotals = calculateDailyTotals(employees, daysInMonth);

  const handleCellClick = (empId: string, day: number, e: React.MouseEvent<HTMLTableCellElement>) => {
    setSelectedCell({ empId, day });
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverCell({ empId, day, rect });
  };

  const borderClass = isExtraDarkBorders ? 'border-slate-500' : 'border-slate-400';

  return (
    <div className="relative bg-white border-2 border-slate-700 rounded-xl shadow-md overflow-hidden">
      {/* 1. Top Contrast & Controls Bar */}
      <div className="bg-[#0c2340] text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 print:hidden text-xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-300" />
          <span className="font-black text-white text-xs sm:text-sm">
            સંપૂર્ણ એક્સેલ મસ્ટર રોલ (Full Spreadsheet Grid):
          </span>
          <span className="text-amber-200 text-[11px] hidden md:inline">
            (બધા ૧ થી ૩૧ દિવસો એક સાથે ઉપલબ્ધ)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Font Size */}
          <button
            onClick={() => setIsLargeFont(!isLargeFont)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs transition-colors cursor-pointer ${
              isLargeFont
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
            }`}
          >
            {isLargeFont ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{isLargeFont ? 'મોટા અક્ષરો (115%)' : 'અક્ષરો મોટા કરો'}</span>
          </button>

          {/* Toggle Extra Dark Borders */}
          <button
            onClick={() => setIsExtraDarkBorders(!isExtraDarkBorders)}
            className={`px-2.5 py-1 rounded-lg font-black text-xs transition-colors cursor-pointer ${
              isExtraDarkBorders
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            {isExtraDarkBorders ? '✓ ઘાટી બોર્ડર' : 'બોર્ડર ઘાટી કરો'}
          </button>
        </div>
      </div>

      {/* 2. Quick Horizontal Jump Bar for Mobile & Desktop */}
      <div className="bg-slate-100 border-b-2 border-slate-300 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 print:hidden text-xs font-bold text-slate-800">
        <div className="flex items-center gap-1 text-[11px] text-blue-900 font-black">
          <span>ઝડપી જુઓ:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => scrollToOffset(0)}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 rounded-md font-black text-slate-900 text-xs shadow-2xs whitespace-nowrap cursor-pointer"
          >
            ⏮️ ૧. કર્મચારી (Names)
          </button>
          <button
            onClick={() => scrollToOffset(240)}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 rounded-md font-black text-slate-900 text-xs shadow-2xs whitespace-nowrap cursor-pointer"
          >
            📅 ૨. તારીખ ૧ થી ૧૦
          </button>
          <button
            onClick={() => scrollToOffset(650)}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 rounded-md font-black text-slate-900 text-xs shadow-2xs whitespace-nowrap cursor-pointer"
          >
            📅 ૩. તારીખ ૧૧ થી ૨૦
          </button>
          <button
            onClick={() => scrollToOffset(1050)}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-400 rounded-md font-black text-slate-900 text-xs shadow-2xs whitespace-nowrap cursor-pointer"
          >
            📅 ૪. તારીખ ૨૧ થી ૩૧
          </button>
          <button
            onClick={() => scrollToOffset(1600)}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded-md font-black text-amber-950 text-xs shadow-2xs whitespace-nowrap cursor-pointer"
          >
            📊 ૫. માસિક સરવાળો (Totals) ⏩
          </button>
        </div>
      </div>

      {/* 3. Rock-Solid, Non-Overlapping Spreadsheet Table */}
      <div
        ref={gridContainerRef}
        className={`overflow-x-auto max-h-[76vh] focus:outline-none select-none scrollbar-thin ${
          isLargeFont ? 'text-[13px]' : 'text-xs'
        }`}
      >
        <table className={`min-w-[1680px] w-max text-center border-collapse ${borderClass} font-mono tracking-tight`}>
          {/* Table Header */}
          <thead className="sticky top-0 z-30 shadow-md">
            {/* Top Header Row */}
            <tr className={`border-b-2 border-slate-700 text-white font-black ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
              <th className="py-2.5 px-1 w-11 bg-[#0c2340] border-r-2 border-slate-500">
                ક્રમ
              </th>
              <th className="py-2.5 px-2 w-20 bg-[#0c2340] border-r-2 border-slate-500">
                ટોકન નં
              </th>
              <th className="py-2.5 px-3 w-56 text-left bg-[#0c2340] border-r-3 border-black">
                કર્મચારીનું નામ અને હોદ્દો
              </th>

              {/* 31 Days Header */}
              <th
                colSpan={daysInMonth}
                className="py-2 bg-[#0f386b] text-white border-r-3 border-black tracking-wider text-xs font-black uppercase"
              >
                તારીખ પ્રમાણે દૈનિક હાજરી પત્રક (માસ: {metadata.month})
              </th>

              {/* Summary Columns Header */}
              <th
                colSpan={13}
                className="py-2 bg-[#17487d] text-amber-200 border-r-2 border-slate-700 text-xs font-black uppercase tracking-wider"
              >
                માસિક હિસાબ અને રજા ગણતરી (Monthly Summary)
              </th>

              <th className="py-2.5 px-2 w-20 bg-[#0c2340] print:hidden">ક્રિયા</th>
            </tr>

            {/* Sub-Header: Day Numbers and Summary Column Names */}
            <tr className={`border-b-2 border-slate-700 text-slate-950 font-black ${isLargeFont ? 'text-[11px]' : 'text-[10px]'}`}>
              <th className={`py-2 w-11 bg-slate-200 border-r-2 ${borderClass}`}>No.</th>
              <th className={`py-2 w-20 bg-slate-200 border-r-2 ${borderClass}`}>Tok</th>
              <th className={`py-2 px-3 w-56 text-left bg-slate-200 border-r-3 border-black`}>
                Staff Member
              </th>

              {/* Individual Days 1 to 31 */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const dow = getDayOfWeek(metadata.month, dayNum);
                const isSunday = dow === 0;
                return (
                  <th
                    key={dayNum}
                    className={`py-1.5 w-9 min-w-[36px] max-w-[36px] border ${borderClass} ${
                      isSunday
                        ? 'bg-amber-300 text-amber-950 font-black border-x-2 border-amber-600'
                        : 'bg-slate-200 text-slate-950 font-black'
                    }`}
                    title={`${dayNum} - ${GUJARATI_DAYS_SHORT[dow]} (${ENGLISH_DAYS_SHORT[dow]})`}
                  >
                    <div className="text-xs font-black leading-tight text-slate-950">{dayNum}</div>
                    <div
                      className={`text-[9px] font-bold ${
                        isSunday ? 'text-amber-950 underline' : 'text-slate-800'
                      }`}
                    >
                      {GUJARATI_DAYS_SHORT[dow]}
                    </div>
                  </th>
                );
              })}

              {/* Summary Columns Header */}
              <th className={`py-1.5 w-10 bg-emerald-100 text-emerald-950 font-black border-l-3 border-black border-r ${borderClass}`} title="દિવસ હાજર">
                P
              </th>
              <th className={`py-1.5 w-10 bg-indigo-100 text-indigo-950 font-black border-r ${borderClass}`} title="રાત્રિ હાજર">
                PN
              </th>
              <th className={`py-1.5 w-10 bg-sky-100 text-sky-950 font-black border-r ${borderClass}`} title="ઓફ રજા">
                OFF
              </th>
              <th className={`py-1.5 w-12 bg-amber-200 text-amber-950 font-black border-2 border-amber-500`} title="ઓફ દિવસે કામ કર્યું (દિવસ) - ૧ જમા ઓફ">
                OFF+P
              </th>
              <th className={`py-1.5 w-12 bg-rose-200 text-rose-950 font-black border-2 border-rose-500`} title="ઓફ દિવસે કામ કર્યું (રાત્રિ) - ૧ જમા ઓફ">
                OFF+PN
              </th>
              <th className={`py-1.5 w-12 bg-purple-200 text-purple-950 font-black border-2 border-purple-500`} title="ડબલ નોકરી (P+PN)">
                P+PN
              </th>
              <th className={`py-1.5 w-9 bg-teal-100 text-teal-950 font-black border-r ${borderClass}`} title="જાહેર રજા (તહેવાર)">
                H
              </th>
              <th className={`py-1.5 w-10 bg-blue-100 text-blue-950 font-black border-r ${borderClass}`} title="આ મહિને વપરાયેલ CL">
                CL
              </th>
              <th className={`py-1.5 w-14 bg-blue-200 text-blue-950 font-black border-2 border-blue-600`} title="વાર્ષિક ૧૨ માંથી બાકી CL">
                CL બાકી
              </th>
              <th className={`py-1.5 w-11 bg-emerald-100 text-emerald-950 font-black border-r ${borderClass}`} title="વપરાયેલ જમા ઓફ">
                C-OFF
              </th>
              <th className={`py-1.5 w-9 bg-red-100 text-red-950 font-black border-r ${borderClass}`} title="ગેરહાજર">
                A
              </th>
              <th className={`py-1.5 w-12 bg-slate-300 text-slate-950 font-black border-r ${borderClass}`} title="કુલ ડ્યુટી શિફ્ટ">
                ડ્યુટી
              </th>
              <th className="py-1.5 w-16 bg-blue-950 text-white font-black border-r-3 border-black text-xs" title="કુલ પગારપાત્ર દિવસો">
                પગાર દિવસ
              </th>

              <th className="py-1.5 w-20 bg-slate-200 text-slate-950 font-black print:hidden">ક્રિયા</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-slate-950 font-bold">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 17} className="py-12 text-center text-slate-500 font-bold text-base">
                  કોઈ કર્મચારી મળ્યા નથી. ઉપરથી '+ નવો કર્મચારી' બટન દબાવો.
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => {
                const summary = calculateEmployeeSummary(emp, daysInMonth);

                return (
                  <tr
                    key={emp.id}
                    className={`transition-colors border-b ${borderClass} ${
                      index % 2 === 1 ? 'bg-slate-100/90' : 'bg-white'
                    } hover:bg-yellow-50/70`}
                  >
                    {/* Col 1: Sr No */}
                    <td className={`py-1.5 px-1 w-11 font-black text-slate-900 bg-inherit text-center tabular-nums border-r-2 ${borderClass}`}>
                      {index + 1}
                    </td>

                    {/* Col 2: Token No */}
                    <td className={`py-1.5 px-1 w-20 font-mono font-black text-blue-900 bg-inherit text-center text-xs border-r-2 ${borderClass}`}>
                      {emp.tokenNo}
                    </td>

                    {/* Col 3: Name & Designation */}
                    <td className={`py-1.5 px-3 w-56 text-left bg-inherit border-r-3 border-black font-sans`}>
                      <div className="font-black text-slate-950 text-xs truncate max-w-[210px]" title={emp.name}>
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-slate-700 font-bold truncate max-w-[210px]">
                        {emp.designation} · <span className="text-blue-900 font-extrabold">ઓફ: {GUJARATI_DAYS_SHORT[emp.weeklyOffDay % 7]}</span>
                      </div>
                    </td>

                    {/* 31 Day Attendance Cells */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const dayNum = i + 1;
                      const code = emp.days[dayNum] || '';
                      const isSelected = selectedCell?.empId === emp.id && selectedCell?.day === dayNum;
                      const dow = getDayOfWeek(metadata.month, dayNum);
                      const isSunday = dow === 0;
                      const meta = ATTENDANCE_CODE_META[code];

                      return (
                        <td
                          key={dayNum}
                          onClick={(e) => handleCellClick(emp.id, dayNum, e)}
                          className={`p-0 h-9 w-9 min-w-[36px] max-w-[36px] cursor-pointer transition-colors relative border ${borderClass} ${
                            isSunday ? 'bg-amber-100/50 border-x-2 border-amber-300' : ''
                          } ${
                            isSelected
                              ? 'ring-3 ring-blue-700 z-10 bg-blue-100 font-black'
                              : 'hover:bg-blue-50'
                          }`}
                          title={`તારીખ ${dayNum}: ${code ? `${code} (${meta.labelGu})` : 'ખાલી'}`}
                        >
                          <div className="w-full h-full flex items-center justify-center p-0.5">
                            {code ? (
                              <span
                                className={`inline-flex items-center justify-center text-[10.5px] w-full h-full ${
                                  meta.badgeClass
                                } ${
                                  meta.isCircled
                                    ? 'w-7 h-7 rounded-full ring-3 ring-amber-600 font-black shadow-xs'
                                    : 'rounded'
                                }`}
                              >
                                {code}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-black text-xs select-none">·</span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Row Summary Columns - High Contrast */}
                    <td className={`py-1.5 px-1 w-10 font-black text-emerald-950 bg-emerald-50 border-l-3 border-black border-r ${borderClass} tabular-nums`}>
                      {summary.presentDayCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-10 font-black text-indigo-950 bg-indigo-50 border-r ${borderClass} tabular-nums`}>
                      {summary.presentNightCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-10 font-black text-sky-950 bg-sky-50 border-r ${borderClass} tabular-nums`}>
                      {summary.offCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-12 font-black text-amber-950 bg-amber-100 border-r ${borderClass} tabular-nums`}>
                      {summary.offWorkedDayCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-300 text-amber-950 border-2 border-amber-600 font-black">
                          {summary.offWorkedDayCount}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={`py-1.5 px-1 w-12 font-black text-rose-950 bg-rose-100 border-r ${borderClass} tabular-nums`}>
                      {summary.offWorkedNightCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-300 text-rose-950 border-2 border-rose-600 font-black">
                          {summary.offWorkedNightCount}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={`py-1.5 px-1 w-12 font-black text-purple-950 bg-purple-100 border-r ${borderClass} tabular-nums`}>
                      {summary.doubleDutyCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-300 text-purple-950 border-2 border-purple-600 font-black">
                          {summary.doubleDutyCount}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={`py-1.5 px-1 w-9 font-black text-teal-950 bg-teal-50 border-r ${borderClass} tabular-nums`}>
                      {summary.holidayCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-10 font-black text-blue-950 bg-blue-50 border-r ${borderClass} tabular-nums`}>
                      {summary.clMonthCount || '-'}
                    </td>
                    {/* Remaining CL out of 12 */}
                    <td
                      className={`py-1.5 px-1 w-14 font-black tabular-nums border-r ${borderClass} ${
                        summary.clRemaining <= 2
                          ? 'bg-rose-200 text-rose-950 font-black border-2 border-rose-500'
                          : 'bg-blue-100 text-blue-950'
                      }`}
                      title={`૧૨ માંથી વપરાયેલ: ${summary.clTotalUsed}, બાકી: ${summary.clRemaining}`}
                    >
                      {summary.clRemaining} / 12
                    </td>
                    <td className={`py-1.5 px-1 w-11 font-black text-emerald-950 bg-emerald-100 border-r ${borderClass} tabular-nums`}>
                      {summary.cOffAvailedCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-9 font-black text-red-700 bg-red-100 border-r ${borderClass} tabular-nums`}>
                      {summary.absentCount || '-'}
                    </td>
                    <td className={`py-1.5 px-1 w-12 font-black text-slate-950 bg-slate-200 border-r ${borderClass} tabular-nums`}>
                      {summary.totalDutiesDone}
                    </td>
                    {/* Total Payable Days */}
                    <td className="py-1.5 px-1 w-16 font-black text-white bg-[#0c2340] border-r-3 border-black tabular-nums text-xs">
                      {summary.payableDays}
                    </td>

                    {/* Actions */}
                    <td className="py-1.5 px-1 w-20 print:hidden whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewEmployeeLedger(emp)}
                          className="p-1 text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded cursor-pointer"
                          title="જમા ઓફ ખાતાવહી / C-Off પાસબુક જુઓ"
                        >
                          <ArrowRightCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1 text-blue-800 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded cursor-pointer"
                          title="વિગત સુધારો"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="p-1 text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-400 rounded cursor-pointer"
                          title="કર્મચારી રદ કરો"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Bottom Totals Summary Row */}
          <tfoot className="bg-slate-200 text-slate-950 font-black border-t-3 border-black sticky bottom-0 z-30">
            {/* Daily Total Working Staff (Day Shift) */}
            <tr className={`border-b ${borderClass} ${isLargeFont ? 'text-[11px]' : 'text-[10px]'}`}>
              <td colSpan={3} className="py-2 px-3 text-left font-black bg-slate-300 border-r-3 border-black">
                દૈનિક દિવસ હાજર (Day Duty P + OFF+P):
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const tot = dailyTotals[dayNum];
                return (
                  <td key={dayNum} className={`py-1 px-0.5 text-emerald-950 bg-emerald-100 font-black border ${borderClass} tabular-nums`}>
                    {tot?.dayPresentTotal || '-'}
                  </td>
                );
              })}
              <td colSpan={14} className="bg-slate-200 text-left px-2 text-[11px] text-slate-800 font-black">
                કુલ દિવસીય ફરજ શિફ્ટ
              </td>
            </tr>

            {/* Daily Total Working Staff (Night Shift) */}
            <tr className={`border-b ${borderClass} ${isLargeFont ? 'text-[11px]' : 'text-[10px]'}`}>
              <td colSpan={3} className="py-1.5 px-3 text-left font-black bg-slate-300 border-r-3 border-black">
                દૈનિક નાઇટ હાજર (Night Duty PN + OFF+PN):
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const tot = dailyTotals[dayNum];
                return (
                  <td key={dayNum} className={`py-1 px-0.5 text-indigo-950 bg-indigo-100 font-black border ${borderClass} tabular-nums`}>
                    {tot?.nightPresentTotal || '-'}
                  </td>
                );
              })}
              <td colSpan={14} className="bg-slate-200 text-left px-2 text-[11px] text-slate-800 font-black">
                કુલ નાઇટ ફરજ શિફ્ટ
              </td>
            </tr>

            {/* Daily Total Staff on Weekly OFF */}
            <tr className={isLargeFont ? 'text-[11px]' : 'text-[10px]'}>
              <td colSpan={3} className="py-1.5 px-3 text-left font-black bg-slate-300 border-r-3 border-black">
                દૈનિક ઓફ રજા (Total Weekly OFF):
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const tot = dailyTotals[dayNum];
                return (
                  <td key={dayNum} className={`py-1 px-0.5 text-sky-950 bg-sky-100 font-black border ${borderClass} tabular-nums`}>
                    {tot?.offTotal || '-'}
                  </td>
                );
              })}
              <td colSpan={14} className="bg-slate-200 text-left px-2 text-[11px] text-slate-800 font-black">
                ઓફ રજા સંખ્યા
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quick Code Selection Popover when a cell is clicked */}
      {popoverCell && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 print:hidden"
          onClick={() => setPopoverCell(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-slate-700 p-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-slate-200">
              <div>
                <div className="text-xs font-black text-slate-950">
                  તારીખ {popoverCell.day} - હાજરી પસંદ કરો
                </div>
                <div className="text-[11px] text-blue-900 font-bold">
                  {employees.find((e) => e.id === popoverCell.empId)?.name}
                </div>
              </div>
              <button
                onClick={() => setPopoverCell(null)}
                className="text-slate-500 hover:text-slate-950 text-base font-black px-2 py-0.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
              {codesList.map((code) => {
                const meta = ATTENDANCE_CODE_META[code];
                return (
                  <button
                    key={code || 'clear'}
                    onClick={() => {
                      onUpdateAttendance(popoverCell.empId, popoverCell.day, code);
                      setPopoverCell(null);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      meta.badgeClass
                    } hover:scale-102 hover:shadow-sm`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 text-xs font-black ${
                        meta.isCircled ? 'rounded-full ring-3 ring-amber-600' : 'rounded'
                      }`}
                    >
                      {code || '-'}
                    </span>
                    <div className="truncate">
                      <div className="font-black text-xs">{meta.labelGu}</div>
                      <div className="text-[10px] font-bold opacity-80">{meta.labelEn}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t-2 border-slate-200 text-[11px] text-slate-700 font-bold text-center">
              ટિપ: સેલ પસંદ કરી કીબોર્ડથી <b className="text-blue-900 bg-blue-100 px-1 py-0.5 rounded">P, N, O, W, X, D, H, C, L, A</b> સીધું ટાઈપ કરો.
            </div>
          </div>
        </div>
      )}

      {/* Official Signatures Row for Print (bottom of paper) */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-8 mt-6 border-t-2 border-black text-center text-xs font-bold text-black">
        <div>
          <div className="h-10"></div>
          <div>તૈયાર કરનાર / ટાઇમ કીપર</div>
          <div className="font-normal text-[10px]">TIME KEEPER / CLERK</div>
        </div>
        <div>
          <div className="h-10"></div>
          <div>મિકેનિકલ સુપરવાઇઝર / ફોરમેન</div>
          <div className="font-normal text-[10px]">FOREMAN / SUPERVISOR</div>
        </div>
        <div>
          <div className="h-10"></div>
          <div>ડેપો મેનેજર / ડીવીઝનલ મિકેનિકલ એન્જિનિયર</div>
          <div className="font-normal text-[10px]">DEPOT MANAGER / D.M.E.</div>
        </div>
      </div>
    </div>
  );
};
