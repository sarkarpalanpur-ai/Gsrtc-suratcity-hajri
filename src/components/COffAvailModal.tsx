import React, { useState, useEffect } from 'react';
import { Employee, CompensatoryOffCredit, COffDutyType, AttendanceCode } from '../types/attendance';
import {
  formatCOffDateBadge,
  ATTENDANCE_CODE_META,
  getDayOfWeek,
  getDaysInMonth,
  GUJARATI_DAYS_SHORT,
} from '../utils/calculations';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  X,
  PlusCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
} from 'lucide-react';

interface COffAvailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  day: number;
  month: string;
  credits: CompensatoryOffCredit[];
  onConfirmAvail: (
    employeeId: string,
    day: number,
    creditId: string,
    earnedDate: string,
    dutyType: string,
    targetCode?: AttendanceCode
  ) => void;
  onRemoveAvail?: (employeeId: string, day: number) => void;
}

export const COffAvailModal: React.FC<COffAvailModalProps> = ({
  isOpen,
  onClose,
  employee,
  day,
  month,
  credits,
  onConfirmAvail,
  onRemoveAvail,
}) => {
  if (!isOpen || !employee) return null;

  // Selected Attendance Code (defaults to current day's code or C-OFF)
  const currentCellCode = employee.days[day] || 'C-OFF';
  const currentUsage = employee.cOffAvailRef?.[day];

  const [selectedCode, setSelectedCode] = useState<AttendanceCode>(currentCellCode || 'C-OFF');

  // Find all AVAILABLE credits for this employee
  const availableCredits = credits.filter(
    (c) => c.employeeId === employee.id && c.status === 'AVAILABLE'
  );

  // Calendar Picker State
  const defaultEarnedDate = currentUsage?.earnedDate || '2026-10-08';
  const [selectedEarnedDate, setSelectedEarnedDate] = useState<string>(defaultEarnedDate);
  const [selectedCreditId, setSelectedCreditId] = useState<string>(currentUsage?.creditId || '');
  const [selectedDutyType, setSelectedDutyType] = useState<string>(currentUsage?.dutyType || 'OFF+P');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Calendar Interactive View State
  const [calendarViewMonth, setCalendarViewMonth] = useState<string>(() => {
    if (defaultEarnedDate && defaultEarnedDate.length >= 7) {
      return defaultEarnedDate.slice(0, 7);
    }
    return month;
  });

  // Re-sync when modal opens or day/employee changes
  useEffect(() => {
    const existingUsage = employee.cOffAvailRef?.[day];
    const initialCode = employee.days[day] || 'C-OFF';
    setSelectedCode(initialCode);

    if (existingUsage) {
      setSelectedEarnedDate(existingUsage.earnedDate);
      setSelectedCreditId(existingUsage.creditId);
      setSelectedDutyType(existingUsage.dutyType || 'OFF+P');
      if (existingUsage.earnedDate && existingUsage.earnedDate.length >= 7) {
        setCalendarViewMonth(existingUsage.earnedDate.slice(0, 7));
      }
    } else {
      setSelectedEarnedDate('2026-10-08');
      setSelectedCreditId('');
      setSelectedDutyType('OFF+P');
    }
  }, [employee, day, month, isOpen]);

  // All codes available for selection with scrolling buttons
  const allCodes: AttendanceCode[] = [
    'C-OFF',
    'P',
    'PN',
    'CL',
    'OFF',
    'OFF+P',
    'OFF+PN',
    'P+PN',
    'H',
    'H+P',
    'H+PN',
    'L',
    'A',
    '',
  ];

  // Quick Select an existing credit from book
  const handleSelectExistingCredit = (credit: CompensatoryOffCredit) => {
    setSelectedCreditId(credit.id);
    setSelectedEarnedDate(credit.dutyDate);
    setSelectedDutyType(credit.dutyType);
    if (credit.dutyDate && credit.dutyDate.length >= 7) {
      setCalendarViewMonth(credit.dutyDate.slice(0, 7));
    }
  };

  // Submit and Apply
  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedEarnedDate) return;

    const creditId = selectedCreditId || `coff-custom-${Date.now()}`;
    onConfirmAvail(
      employee.id,
      day,
      creditId,
      selectedEarnedDate,
      selectedDutyType,
      selectedCode
    );
    onClose();
  };

  // Remove linked date
  const handleRemove = () => {
    if (onRemoveAvail) {
      onRemoveAvail(employee.id, day);
    }
    onClose();
  };

  // Calendar computation
  const daysInCalMonth = getDaysInMonth(calendarViewMonth);
  const [calYear, calMonthNum] = calendarViewMonth.split('-').map(Number);
  const firstDayOfWeek = getDayOfWeek(calendarViewMonth, 1);

  const handlePrevCalMonth = () => {
    const prevDate = new Date(calYear, calMonthNum - 2, 1);
    const y = prevDate.getFullYear();
    const m = String(prevDate.getMonth() + 1).padStart(2, '0');
    setCalendarViewMonth(`${y}-${m}`);
  };

  const handleNextCalMonth = () => {
    const nextDate = new Date(calYear, calMonthNum, 1);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    setCalendarViewMonth(`${y}-${m}`);
  };

  const handleSelectCalendarDay = (dayNum: number) => {
    const dayStr = String(dayNum).padStart(2, '0');
    const fullDate = `${calendarViewMonth}-${dayStr}`;
    setSelectedEarnedDate(fullDate);

    // Check if this date matches any available credit
    const matchingCredit = availableCredits.find((c) => c.dutyDate === fullDate);
    if (matchingCredit) {
      setSelectedCreditId(matchingCredit.id);
      setSelectedDutyType(matchingCredit.dutyType);
    } else {
      setSelectedCreditId('');
    }
  };

  const formattedBadge = formatCOffDateBadge(selectedEarnedDate);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-700 max-w-xl w-full p-4 sm:p-5 my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-2.5 mb-2.5 border-b-2 border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shadow-xs shrink-0 text-sm">
              {selectedCode || 'રજા'}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                હાજરી કોડ અને જમા રજા તારીખ પત્રક (કેલેન્ડર સાથે)
              </h3>
              <p className="text-xs text-slate-700 font-bold mt-0.5">
                તારીખ: <b className="text-blue-900 font-black">{day}/{month.split('-')[1]}</b> · કર્મચારી:{' '}
                <b className="text-slate-900">{employee.name}</b> ({employee.tokenNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* 1. SCROLLABLE ATTENDANCE CODE BUTTONS STRIP */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-black text-slate-900 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ૧. આ દિવસ માટે હાજરી / રજા કોડ પસંદ કરો (Scroll to Choose):
              </label>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                પસંદ કરેલ: <b>{selectedCode || 'ખાલી'}</b>
              </span>
            </div>

            {/* Horizontally scrollable code strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {allCodes.map((c) => {
                const meta = ATTENDANCE_CODE_META[c];
                const isSelected = selectedCode === c;

                return (
                  <button
                    key={c || 'blank'}
                    type="button"
                    onClick={() => setSelectedCode(c)}
                    className={`shrink-0 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-w-[72px] ${
                      isSelected
                        ? 'bg-blue-950 text-white border-black scale-105 shadow-md ring-2 ring-blue-500'
                        : `${meta.badgeClass} hover:border-slate-500`
                    }`}
                  >
                    <span className="font-black text-xs leading-none">{c || 'ખાલી'}</span>
                    <span
                      className={`text-[8.5px] font-bold mt-1 truncate max-w-[68px] ${
                        isSelected ? 'text-amber-300' : 'opacity-85'
                      }`}
                    >
                      {meta.labelGu.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currently Linked Date Notification (if already set) */}
          {currentUsage && (
            <div className="p-2.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-emerald-800">
                  આ સેલ પર હાલમાં લિંક કરેલી જમા તારીખ:
                </span>
                <div className="text-xs font-black text-emerald-950 mt-0.5 flex items-center gap-2">
                  <span className="bg-emerald-200 border border-emerald-500 px-2 py-0.5 rounded-md font-mono">
                    {formatCOffDateBadge(currentUsage.earnedDate)}
                  </span>
                  <span>({currentUsage.dutyType || 'ડ્યુટી'})</span>
                  <span className="text-slate-600">→ કોડ: {employee.days[day]}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-400 rounded-lg cursor-pointer shrink-0"
                title="તારીખ હટાવો અને ખાતામાં પુનઃ જમા કરો"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                તારીખ રદ (Restore)
              </button>
            </div>
          )}

          {/* 2. AVAILABLE CREDITS FROM PASSBOOK (P, PN, OFF+P, H, etc.) */}
          {availableCredits.length > 0 && (
            <div>
              <label className="block font-black text-slate-900 mb-1">
                ૨. ખાતામાં જમા અગાઉની વધારાની નોકરી / રજાઓ ({availableCredits.length} ઉપલબ્ધ):
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {availableCredits.map((credit) => {
                  const isChosen = selectedCreditId === credit.id || selectedEarnedDate === credit.dutyDate;
                  const formatted = formatCOffDateBadge(credit.dutyDate);

                  return (
                    <button
                      key={credit.id}
                      type="button"
                      onClick={() => handleSelectExistingCredit(credit)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border-2 transition-all text-left cursor-pointer ${
                        isChosen
                          ? 'border-emerald-600 bg-emerald-100 ring-2 ring-emerald-400'
                          : 'border-slate-300 bg-slate-50 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950 font-black text-xs border border-emerald-400">
                          {credit.dutyType}
                        </span>
                        <div>
                          <div className="font-black text-slate-950 flex items-center gap-1.5">
                            <span>તારીખ: {credit.dutyDate}</span>
                            <span className="text-[11px] font-mono text-emerald-900 font-black">
                              [{formatted}]
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-600 truncate max-w-[260px]">
                            {credit.notes || 'અગાઉ કરેલ વધારાની ફરજ'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 text-xs font-black rounded-lg border ${
                          isChosen
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-white text-emerald-900 border-slate-300'
                        }`}
                      >
                        {isChosen ? '✓ પસંદ કરેલ' : 'આ પસંદ કરો'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. INTERACTIVE VISUAL CALENDAR (CELENDAR SATHE) */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
                <CalendarIcon className="w-4 h-4 text-blue-900" />
                ૩. કેલેન્ડરમાંથી તારીખ પસંદ કરો (Pick Earned/Credit Date):
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevCalMonth}
                  className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  title="અગાઉનો મહિનો"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-black text-blue-950 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs">
                  {calendarViewMonth}
                </span>
                <button
                  type="button"
                  onClick={handleNextCalMonth}
                  className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  title="આગામી મહિનો"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays header */}
            <div className="grid grid-cols-7 gap-1 text-center font-black text-[10px] text-slate-600 mb-1">
              {['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'].map((dw, i) => (
                <div key={dw} className={i === 0 ? 'text-amber-700 font-black' : ''}>
                  {dw}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-7"></div>
              ))}

              {/* Day buttons 1 to daysInCalMonth */}
              {Array.from({ length: daysInCalMonth }, (_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${calendarViewMonth}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedEarnedDate === dateStr;
                const dow = (firstDayOfWeek + idx) % 7;
                const isSun = dow === 0;

                // Check if employee has credit on this day
                const hasCredit = availableCredits.some((c) => c.dutyDate === dateStr);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectCalendarDay(dayNum)}
                    className={`h-7 rounded-lg text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center relative border ${
                      isSelected
                        ? 'bg-blue-900 text-white border-black ring-2 ring-blue-400 font-black scale-105 z-10'
                        : hasCredit
                        ? 'bg-amber-100 text-amber-950 border-amber-500 font-extrabold hover:bg-amber-200'
                        : isSun
                        ? 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasCredit && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 absolute bottom-0.5"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct date and duty type input row */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-black text-slate-800 mb-1">
                  પસંદ કરેલ તારીખ (Date):
                </label>
                <input
                  type="date"
                  value={selectedEarnedDate}
                  onChange={(e) => {
                    setSelectedEarnedDate(e.target.value);
                    if (e.target.value && e.target.value.length >= 7) {
                      setCalendarViewMonth(e.target.value.slice(0, 7));
                    }
                  }}
                  className="w-full text-xs font-bold p-1.5 border-2 border-slate-400 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-800 mb-1">
                  કરેલી કામગીરીનો પ્રકાર (Duty Type):
                </label>
                <select
                  value={selectedDutyType}
                  onChange={(e) => setSelectedDutyType(e.target.value)}
                  className="w-full text-xs font-bold p-1.5 border-2 border-slate-400 rounded-lg bg-white"
                >
                  <option value="OFF+P">OFF+P (ઓફ દિવસે દિવસ ડ્યુટી)</option>
                  <option value="OFF+PN">OFF+PN (ઓફ દિવસે નાઇટ ડ્યુટી)</option>
                  <option value="P">P (ડબલ / વધારાની દિવસ નોકરી)</option>
                  <option value="PN">PN (ડબલ / વધારાની નાઇટ નોકરી)</option>
                  <option value="P+PN">P+PN (દિવસ + નાઇટ ડબલ નોકરી)</option>
                  <option value="H+P">H+P (તહેવારે દિવસ ફરજ)</option>
                  <option value="H+PN">H+PN (તહેવારે નાઇટ ફરજ)</option>
                </select>
              </div>
            </div>

            {/* Live Preview Badge */}
            <div className="mt-2.5 p-2 bg-blue-50 border border-blue-300 rounded-lg flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">મસ્ટર સેલમાં લખાશે:</span>
              <div className="flex items-center gap-1.5 font-black text-blue-950 font-mono">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-400">
                  {selectedCode || 'ખાલી'}
                </span>
                <span className="text-slate-400">+</span>
                <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded border border-emerald-500">
                  {formattedBadge || '8/10/26'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-3 pt-3 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            બંધ કરો
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // Apply code only without linking date
                if (onRemoveAvail) onRemoveAvail(employee.id, day);
                onConfirmAvail(employee.id, day, '', '', '', selectedCode);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-black text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-lg cursor-pointer"
              title="તારીખ વગર માત્ર કોડ નોંધો"
            >
              માત્ર કોડ ({selectedCode})
            </button>

            <button
              type="button"
              onClick={() => handleApply()}
              className="px-4 py-1.5 text-xs font-black text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              ✓ કોડ {selectedCode} + તારીખ [{formattedBadge}] લિંક કરો
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
