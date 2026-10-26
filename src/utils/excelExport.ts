import * as XLSX from 'xlsx';
import { Employee, CompensatoryOffCredit, MusterMetadata } from '../types/attendance';
import { calculateEmployeeSummary, getDaysInMonth, getDayOfWeek, GUJARATI_DAYS_SHORT } from './calculations';

export function exportToExcel(
  metadata: MusterMetadata,
  employees: Employee[],
  cOffCredits: CompensatoryOffCredit[]
) {
  const daysInMonth = getDaysInMonth(metadata.month);
  const workbook = XLSX.utils.book_new();

  // 1. MUSTER ROLL SHEET
  const musterHeaders = [
    'ક્રમ (No.)',
    'ટોકન નં (Token)',
    'નામ (Employee Name)',
    'હોદ્દો (Designation)',
    ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1} (${GUJARATI_DAYS_SHORT[getDayOfWeek(metadata.month, i + 1)]})`),
    'હાજર દિવસ (P)',
    'હાજર નાઇટ (PN)',
    'ઓફ (OFF)',
    'ઓફ ડ્યુટી દિવસ (OFF+P)',
    'ઓફ ડ્યુટી નાઇટ (OFF+PN)',
    'ડબલ ડ્યુટી (P+PN)',
    'તહેવાર (H)',
    'તહેવાર ડ્યુટી (H+P/PN)',
    'CL વપરાયેલ (CL Month)',
    'બાકી CL (12 માંથી)',
    'અન્ય લીવ (L)',
    'C-OFF વપરાયેલ',
    'ગેરહાજર (A)',
    'કુલ ડ્યુટી (Total Shifts)',
    'કુલ પગારપાત્ર દિવસો (Payable Days)',
    'નવી જમા રજા (C-OFF Earned)',
    'નોંધ (Remarks)',
  ];

  const musterRows: (string | number)[][] = [];

  // Title rows
  musterRows.push([metadata.unitName]);
  musterRows.push([metadata.depotName, '', '', `મહિનો: ${metadata.month}`]);
  musterRows.push([]);
  musterRows.push(musterHeaders);

  employees.forEach((emp, index) => {
    const summary = calculateEmployeeSummary(emp, daysInMonth);
    const dayCells = Array.from({ length: daysInMonth }, (_, i) => emp.days[i + 1] || '');

    musterRows.push([
      index + 1,
      emp.tokenNo,
      emp.name,
      emp.designation,
      ...dayCells,
      summary.presentDayCount,
      summary.presentNightCount,
      summary.offCount,
      summary.offWorkedDayCount,
      summary.offWorkedNightCount,
      summary.doubleDutyCount,
      summary.holidayCount,
      summary.holidayWorkedCount,
      summary.clMonthCount,
      summary.clRemaining,
      summary.leaveCount,
      summary.cOffAvailedCount,
      summary.absentCount,
      summary.totalDutiesDone,
      summary.payableDays,
      summary.cOffEarnedThisMonth,
      emp.remarks || '',
    ]);
  });

  const musterSheet = XLSX.utils.aoa_to_sheet(musterRows);
  XLSX.utils.book_append_sheet(workbook, musterSheet, 'હાજરી પત્રક (Muster)');

  // 2. C-OFF / COMPENSATORY OFF LEDGER SHEET
  const ledgerHeaders = [
    'ક્રમ (No.)',
    'ટોકન નં (Token)',
    'કર્મચારીનું નામ (Name)',
    'ફરજ તારીખ (Duty Date)',
    'ફરજનો પ્રકાર (Duty Type)',
    'મહિનો (Month)',
    'સ્થિતિ (Status)',
    'ક્યારે વાપરી (Availed Date)',
    'નોંધ / વિગત (Notes)',
  ];

  const ledgerRows: (string | number)[][] = [];
  ledgerRows.push(['જમા ઓફ અને જાહેર રજા ખાતાવહી (COMPENSATORY OFF LEDGER)']);
  ledgerRows.push([`વિભાગ: ${metadata.division}`, '', '', `રિપોર્ટ મહિનો: ${metadata.month}`]);
  ledgerRows.push([]);
  ledgerRows.push(ledgerHeaders);

  cOffCredits.forEach((credit, idx) => {
    ledgerRows.push([
      idx + 1,
      credit.tokenNo,
      credit.employeeName,
      credit.dutyDate,
      credit.dutyType,
      credit.month,
      credit.status === 'AVAILABLE' ? 'જમા (Available)' : credit.status === 'AVAILED' ? 'વપરાયેલ (Availed)' : 'એક્સપાયર',
      credit.availedDate || '-',
      credit.notes || '',
    ]);
  });

  const ledgerSheet = XLSX.utils.aoa_to_sheet(ledgerRows);
  XLSX.utils.book_append_sheet(workbook, ledgerSheet, 'જમા ઓફ ખાતાવહી (C-Off Bank)');

  // Trigger file download
  const fileName = `Hajari_Patrak_${metadata.month}_${metadata.depotName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportToCsv(metadata: MusterMetadata, employees: Employee[]) {
  const daysInMonth = getDaysInMonth(metadata.month);
  const rows: (string | number)[][] = [];

  rows.push([
    'NO',
    'TOKEN',
    'NAME',
    'DESIGNATION',
    ...Array.from({ length: daysInMonth }, (_, i) => `DAY_${i + 1}`),
    'P_DAY',
    'P_NIGHT',
    'OFF',
    'OFF_P',
    'OFF_PN',
    'P_PN_DOUBLE',
    'H_HOLIDAY',
    'H_DUTY',
    'CL_USED',
    'CL_REMAINING_OUT_OF_12',
    'LEAVE',
    'C_OFF_AVAILED',
    'ABSENT',
    'TOTAL_DUTIES',
    'PAYABLE_DAYS',
    'C_OFF_EARNED',
    'REMARKS',
  ]);

  employees.forEach((emp, i) => {
    const summary = calculateEmployeeSummary(emp, daysInMonth);
    const dayCells = Array.from({ length: daysInMonth }, (_, d) => emp.days[d + 1] || '');
    rows.push([
      i + 1,
      emp.tokenNo,
      emp.name,
      emp.designation,
      ...dayCells,
      summary.presentDayCount,
      summary.presentNightCount,
      summary.offCount,
      summary.offWorkedDayCount,
      summary.offWorkedNightCount,
      summary.doubleDutyCount,
      summary.holidayCount,
      summary.holidayWorkedCount,
      summary.clMonthCount,
      summary.clRemaining,
      summary.leaveCount,
      summary.cOffAvailedCount,
      summary.absentCount,
      summary.totalDutiesDone,
      summary.payableDays,
      summary.cOffEarnedThisMonth,
      emp.remarks || '',
    ]);
  });

  const csvContent =
    '\ufeff' +
    rows
      .map((r) =>
        r
          .map((cell) => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Hajari_Patrak_${metadata.month}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
