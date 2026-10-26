import { AttendanceCode, Employee, EmployeeRowSummary } from '../types/attendance';

export const ATTENDANCE_CODE_META: Record<
  AttendanceCode,
  {
    code: AttendanceCode;
    labelGu: string;
    labelEn: string;
    description: string;
    isCircled?: boolean; // For Off na divas nokri (Off ni ma round thay)
    badgeClass: string;
    shortKey: string;
  }
> = {
  '': {
    code: '',
    labelGu: 'ખાલી',
    labelEn: 'Blank',
    description: 'કોઈ એન્ટ્રી નથી',
    badgeClass: 'text-slate-400 bg-transparent font-normal',
    shortKey: 'Space',
  },
  P: {
    code: 'P',
    labelGu: 'હાજર (દિવસ)',
    labelEn: 'Present Day',
    description: 'દિવસની નિયમિત ફરજ / શિફ્ટ',
    badgeClass: 'text-emerald-950 bg-emerald-100 font-black border-2 border-emerald-600 shadow-2xs',
    shortKey: 'P',
  },
  PN: {
    code: 'PN',
    labelGu: 'હાજર (રાત્રિ)',
    labelEn: 'Present Night',
    description: 'રાત્રિ શિફ્ટ ફરજ (Night Duty)',
    badgeClass: 'text-indigo-950 bg-indigo-100 font-black border-2 border-indigo-600 shadow-2xs',
    shortKey: 'N',
  },
  OFF: {
    code: 'OFF',
    labelGu: 'ઓફ રજા',
    labelEn: 'Weekly Off',
    description: 'અઠવાડિક નિયત રજા (પગારપાત્ર)',
    badgeClass: 'text-sky-950 bg-sky-100 font-black border-2 border-sky-500 shadow-2xs',
    shortKey: 'O',
  },
  'OFF+P': {
    code: 'OFF+P',
    labelGu: 'ઓફમાં ફરજ (દિવસ)',
    labelEn: 'Off + Day Duty',
    description: 'ઓફના દિવસે કામ કર્યું (રાઉન્ડ માર્કેડ - ૧ જમા ઓફ મળે)',
    isCircled: true,
    badgeClass: 'text-amber-950 bg-amber-200 font-black ring-3 ring-amber-600 border-2 border-amber-700 rounded-full shadow-xs',
    shortKey: 'W',
  },
  'OFF+PN': {
    code: 'OFF+PN',
    labelGu: 'ઓફમાં ફરજ (રાત્રિ)',
    labelEn: 'Off + Night Duty',
    description: 'ઓફના દિવસે નાઇટ ફરજ (રાઉન્ડ માર્કેડ - ૧ જમા ઓફ મળે)',
    isCircled: true,
    badgeClass: 'text-rose-950 bg-rose-200 font-black ring-3 ring-rose-600 border-2 border-rose-700 rounded-full shadow-xs',
    shortKey: 'X',
  },
  'P+PN': {
    code: 'P+PN',
    labelGu: 'ડબલ નોકરી (P+PN)',
    labelEn: 'Double Duty',
    description: 'એક જ દિવસે દિવસ + નાઇટ સતત ફરજ',
    badgeClass: 'text-purple-950 bg-purple-200 font-black border-2 border-purple-700 ring-2 ring-purple-500 shadow-xs',
    shortKey: 'D',
  },
  H: {
    code: 'H',
    labelGu: 'જાહેર રજા (તહેવાર)',
    labelEn: 'Public Holiday',
    description: 'તહેવાર રજા - પગાર કપાત થતી નથી',
    badgeClass: 'text-teal-950 bg-teal-100 font-black border-2 border-teal-600 shadow-2xs',
    shortKey: 'H',
  },
  'H+P': {
    code: 'H+P',
    labelGu: 'તહેવારે ફરજ (દિવસ)',
    labelEn: 'Holiday + Day',
    description: 'જાહેર રજાના દિવસે દિવસ ફરજ (૧ જમા રજા મળે)',
    isCircled: true,
    badgeClass: 'text-cyan-950 bg-cyan-200 font-black ring-3 ring-cyan-600 border-2 border-cyan-700 rounded-full shadow-xs',
    shortKey: 'J',
  },
  'H+PN': {
    code: 'H+PN',
    labelGu: 'તહેવારે ફરજ (રાત્રિ)',
    labelEn: 'Holiday + Night',
    description: 'જાહેર રજાના દિવસે નાઇટ ફરજ (૧ જમા રજા મળે)',
    isCircled: true,
    badgeClass: 'text-teal-950 bg-teal-200 font-black ring-3 ring-teal-600 border-2 border-teal-700 rounded-full shadow-xs',
    shortKey: 'K',
  },
  CL: {
    code: 'CL',
    labelGu: 'પરચૂરણ રજા (CL)',
    labelEn: 'Casual Leave',
    description: 'કેઝ્યુઅલ લીવ (વાર્ષિક ૧૨ મંજૂર)',
    badgeClass: 'text-blue-950 bg-blue-100 font-black border-2 border-blue-600 shadow-2xs',
    shortKey: 'C',
  },
  L: {
    code: 'L',
    labelGu: 'લીવ / અન્ય રજા',
    labelEn: 'Leave / EL',
    description: 'અર્જિત રજા / મેડિકલ / અન્ય રજા',
    badgeClass: 'text-orange-950 bg-orange-100 font-black border-2 border-orange-600 shadow-2xs',
    shortKey: 'L',
  },
  'C-OFF': {
    code: 'C-OFF',
    labelGu: 'વપરાયેલ જમા ઓફ',
    labelEn: 'Compensatory Off Taken',
    description: 'અગાઉ જમા થયેલી બદલી ઓફ રજાનો ઉપભોગ',
    badgeClass: 'text-emerald-950 bg-emerald-200 font-black border-2 border-emerald-700 shadow-2xs',
    shortKey: 'V',
  },
  A: {
    code: 'A',
    labelGu: 'ગેરહાજર',
    labelEn: 'Absent',
    description: 'બિનઅધિકૃત ગેરહાજરી (પગાર કપાત)',
    badgeClass: 'text-white bg-red-600 font-black border-2 border-red-800 shadow-xs',
    shortKey: 'A',
  },
};

export const GUJARATI_DAYS_SHORT = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];
export const GUJARATI_DAYS_FULL = [
  'રવિવાર',
  'સોમવાર',
  'મંગળવાર',
  'બુધવાર',
  'ગુરુવાર',
  'શુક્રવાર',
  'શનિવાર',
];
export const ENGLISH_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDaysInMonth(yearMonth: string): number {
  if (!yearMonth) return 31;
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export function getDayOfWeek(yearMonth: string, day: number): number {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m - 1, day).getDay();
}

export function calculateEmployeeSummary(
  employee: Employee,
  totalDaysInMonth: number
): EmployeeRowSummary {
  let presentDayCount = 0;
  let presentNightCount = 0;
  let offCount = 0;
  let offWorkedDayCount = 0;
  let offWorkedNightCount = 0;
  let doubleDutyCount = 0;
  let holidayCount = 0;
  let holidayWorkedCount = 0;
  let clMonthCount = 0;
  let leaveCount = 0;
  let cOffAvailedCount = 0;
  let absentCount = 0;

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const code = employee.days[d] || '';
    switch (code) {
      case 'P':
        presentDayCount++;
        break;
      case 'PN':
        presentNightCount++;
        break;
      case 'OFF':
        offCount++;
        break;
      case 'OFF+P':
        offWorkedDayCount++;
        break;
      case 'OFF+PN':
        offWorkedNightCount++;
        break;
      case 'P+PN':
        doubleDutyCount++;
        break;
      case 'H':
        holidayCount++;
        break;
      case 'H+P':
        holidayWorkedCount++;
        break;
      case 'H+PN':
        holidayWorkedCount++;
        break;
      case 'CL':
        clMonthCount++;
        break;
      case 'L':
        leaveCount++;
        break;
      case 'C-OFF':
        cOffAvailedCount++;
        break;
      case 'A':
        absentCount++;
        break;
      default:
        break;
    }
  }

  // Total duties done (count of shifts worked)
  // P: 1, PN: 1, OFF+P: 1, OFF+PN: 1, P+PN: 2, H+P: 1, H+PN: 1
  const totalDutiesDone =
    presentDayCount +
    presentNightCount +
    offWorkedDayCount +
    offWorkedNightCount +
    doubleDutyCount * 2 +
    holidayWorkedCount;

  // New C-Off credits earned this month:
  // Off worked (OFF+P, OFF+PN) + Holiday worked (H+P, H+PN) + Double duties (P+PN gives 1 extra duty)
  const cOffEarnedThisMonth =
    offWorkedDayCount + offWorkedNightCount + holidayWorkedCount + doubleDutyCount;

  // CL calculations (Yearly quota usually 12)
  const clTotalYearly = employee.clTotalYearly ?? 12;
  const clTotalUsed = (employee.clUsedPrior || 0) + clMonthCount;
  const clRemaining = Math.max(0, clTotalYearly - clTotalUsed);

  // Payable days:
  // P + PN + OFF + (OFF+P) + (OFF+PN) + (P+PN) + H (paid holiday: "Na kari hoy to h pagar na divas mathi ochho na thay")
  // + (H+P) + (H+PN) + CL (paid leave) + C-OFF (paid comp off)
  const payableDays =
    presentDayCount +
    presentNightCount +
    offCount +
    offWorkedDayCount +
    offWorkedNightCount +
    doubleDutyCount + // counts as 1 day for basic presence, extra overtime is in duties/credits
    holidayCount +
    holidayWorkedCount +
    clMonthCount +
    cOffAvailedCount;

  return {
    presentDayCount,
    presentNightCount,
    offCount,
    offWorkedDayCount,
    offWorkedNightCount,
    doubleDutyCount,
    holidayCount,
    holidayWorkedCount,
    clMonthCount,
    clTotalUsed,
    clRemaining,
    leaveCount,
    cOffAvailedCount,
    absentCount,
    totalDutiesDone,
    payableDays,
    cOffEarnedThisMonth,
  };
}

export interface DayColumnTotal {
  dayPresentTotal: number; // P, OFF+P, H+P, P+PN
  nightPresentTotal: number; // PN, OFF+PN, H+PN, P+PN
  offTotal: number; // OFF
  leaveTotal: number; // CL, L, C-OFF
  absentTotal: number; // A
  totalOnDuty: number; // Total persons working this day
}

export function calculateDailyTotals(
  employees: Employee[],
  totalDaysInMonth: number
): Record<number, DayColumnTotal> {
  const totals: Record<number, DayColumnTotal> = {};

  for (let d = 1; d <= totalDaysInMonth; d++) {
    let dayPresentTotal = 0;
    let nightPresentTotal = 0;
    let offTotal = 0;
    let leaveTotal = 0;
    let absentTotal = 0;
    let totalOnDuty = 0;

    for (const emp of employees) {
      const c = emp.days[d] || '';
      if (c === 'P' || c === 'OFF+P' || c === 'H+P') {
        dayPresentTotal++;
        totalOnDuty++;
      } else if (c === 'PN' || c === 'OFF+PN' || c === 'H+PN') {
        nightPresentTotal++;
        totalOnDuty++;
      } else if (c === 'P+PN') {
        dayPresentTotal++;
        nightPresentTotal++;
        totalOnDuty++;
      } else if (c === 'OFF') {
        offTotal++;
      } else if (c === 'CL' || c === 'L' || c === 'C-OFF') {
        leaveTotal++;
      } else if (c === 'A') {
        absentTotal++;
      }
    }

    totals[d] = {
      dayPresentTotal,
      nightPresentTotal,
      offTotal,
      leaveTotal,
      absentTotal,
      totalOnDuty,
    };
  }

  return totals;
}
