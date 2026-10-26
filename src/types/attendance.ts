export type AttendanceCode =
  | ''
  | 'P'       // Present Day (હાજર - દિવસ)
  | 'PN'      // Present Night (હાજર - રાત્રિ)
  | 'OFF'     // Weekly Off (અઠવાડિક રજા)
  | 'OFF+P'   // Worked on Off - Day (ઓફ દિવસે હાજર - દિવસ - Round/Circle) -> Earns C-OFF
  | 'OFF+PN'  // Worked on Off - Night (ઓફ દિવસે હાજર - રાત્રિ - Round/Circle) -> Earns C-OFF
  | 'P+PN'    // Double Duty - Day + Night (ડબલ નોકરી)
  | 'H'       // Holiday - Paid Holiday (જાહેર રજા - પગાર કપાત નહીં)
  | 'H+P'     // Worked on Holiday - Day (તહેવારે હાજર - દિવસ) -> Earns Holiday Credit
  | 'H+PN'    // Worked on Holiday - Night (તહેવારે હાજર - રાત્રિ) -> Earns Holiday Credit
  | 'CL'      // Casual Leave (પરચૂરણ રજા - વાર્ષિક ૧૨)
  | 'L'       // Leave / Earned Leave / Medical Leave (અન્ય રજા)
  | 'C-OFF'   // Availed Compensatory Off (વપરાયેલ જમા ઓફ)
  | 'A';      // Absent (ગેરહાજર)

export interface Employee {
  id: string;
  srNo: number;
  tokenNo: string;        // GSRTC / Staff Token or Badge No.
  name: string;           // Employee Name
  designation: string;    // Designation (Mechanic, Fitter, Driver, etc.)
  weeklyOffDay: number;   // 0 = Sun, 1 = Mon, ..., 6 = Sat, 7 = Rolling 7th day
  clTotalYearly: number;  // Yearly CL Quota (default: 12)
  clUsedPrior: number;    // CL used in previous months this year
  days: Record<number, AttendanceCode>; // Day 1 to 31 -> Code
  remarks: string;
}

export type COffDutyType = 'OFF+P' | 'OFF+PN' | 'H+P' | 'H+PN' | 'P+PN';

export interface CompensatoryOffCredit {
  id: string;
  employeeId: string;
  employeeName: string;
  tokenNo: string;
  dutyDate: string;       // YYYY-MM-DD
  dutyType: COffDutyType; // e.g. OFF+P, OFF+PN, H+P, H+PN, P+PN
  month: string;          // YYYY-MM
  status: 'AVAILABLE' | 'AVAILED' | 'EXPIRED'; // જમા / વપરાયેલ / મુદતવીતી
  availedDate?: string;   // Date when C-OFF was used (YYYY-MM-DD)
  availedInMonth?: string;
  notes?: string;
  createdAt: string;
}

export interface MusterMetadata {
  unitName: string;         // e.g. "GSRTC PALANPUR DIVISION - SRC MECHANIC WORKSHOP"
  depotName: string;        // e.g. "SRC MECHANIC DEPOT"
  month: string;            // e.g. "2026-10"
  division: string;         // e.g. "પાલનપુર વિભાગ / PALANPUR DIVISION"
  section: string;          // e.g. "મિકેનિકલ સેક્શન / વર્કશોપ"
  authorizedOfficer: string;// e.g. "વર્કશોપ મેનેજર / ડીએમઇ"
}

export interface EmployeeRowSummary {
  presentDayCount: number;    // P
  presentNightCount: number;  // PN
  offCount: number;           // OFF
  offWorkedDayCount: number;  // OFF+P
  offWorkedNightCount: number;// OFF+PN
  doubleDutyCount: number;    // P+PN
  holidayCount: number;       // H
  holidayWorkedCount: number; // H+P + H+PN
  clMonthCount: number;       // CL this month
  clTotalUsed: number;        // clUsedPrior + clMonthCount
  clRemaining: number;        // clTotalYearly - clTotalUsed
  leaveCount: number;         // L
  cOffAvailedCount: number;   // C-OFF
  absentCount: number;        // A
  totalDutiesDone: number;    // Total actual shifts performed
  payableDays: number;        // Total paid days for payroll
  cOffEarnedThisMonth: number;// New C-Offs generated this month
}
