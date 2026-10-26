import React from 'react';
import { Employee, MusterMetadata, CompensatoryOffCredit } from '../types/attendance';
import { calculateEmployeeSummary, getDaysInMonth } from '../utils/calculations';
import { ShieldCheck, Printer, FileSpreadsheet, CheckCircle, AlertCircle, Award } from 'lucide-react';

interface PayrollAndLeaveSummaryProps {
  metadata: MusterMetadata;
  employees: Employee[];
  cOffCredits: CompensatoryOffCredit[];
  onExportExcel: () => void;
}

export const PayrollAndLeaveSummary: React.FC<PayrollAndLeaveSummaryProps> = ({
  metadata,
  employees,
  cOffCredits,
  onExportExcel,
}) => {
  const daysInMonth = getDaysInMonth(metadata.month);

  // Totals across depot
  let depotTotalDuties = 0;
  let depotTotalPayableDays = 0;
  let depotTotalOffDuties = 0;
  let depotTotalDoubleDuties = 0;
  let depotTotalClUsed = 0;
  let depotTotalAbsent = 0;

  const rows = employees.map((emp, index) => {
    const summary = calculateEmployeeSummary(emp, daysInMonth);

    // Active C-Offs available for this employee
    const empCredits = cOffCredits.filter((c) => c.employeeId === emp.id);
    const availableCOff = empCredits.filter((c) => c.status === 'AVAILABLE').length;

    depotTotalDuties += summary.totalDutiesDone;
    depotTotalPayableDays += summary.payableDays;
    depotTotalOffDuties += summary.offWorkedDayCount + summary.offWorkedNightCount;
    depotTotalDoubleDuties += summary.doubleDutyCount;
    depotTotalClUsed += summary.clMonthCount;
    depotTotalAbsent += summary.absentCount;

    return {
      emp,
      index,
      summary,
      availableCOff,
    };
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border-2 border-slate-400 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-300">
          <div>
            <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-900" />
              માસિક પગાર અને રજા હિસાબ પત્રક (Monthly Payroll &amp; Leave Ledger)
            </h2>
            <p className="text-xs text-slate-800 font-bold mt-0.5">
              માસ: {metadata.month} ({daysInMonth} દિવસ) · વિભાગ: {metadata.division} · સ્ટાફ: {employees.length}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-600 rounded-lg cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              એક્સેલ ડાઉનલોડ
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-blue-900 hover:bg-blue-800 border border-blue-950 rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              પ્રિન્ટ રિપોર્ટ
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-xl">
            <div className="text-xs font-black text-blue-950">કુલ પગારપાત્ર દિવસો</div>
            <div className="text-2xl font-black text-blue-950 mt-1 tabular-nums">
              {depotTotalPayableDays}{' '}
              <span className="text-xs font-bold text-blue-800">દિવસો</span>
            </div>
            <div className="text-[11px] text-blue-900 font-bold mt-0.5">પગાર બિલ ગણતરી માટે માન્ય</div>
          </div>

          <div className="p-3 bg-slate-100 border-2 border-slate-400 rounded-xl">
            <div className="text-xs font-black text-slate-950">કુલ થયેલ ડ્યુટી શિફ્ટ</div>
            <div className="text-2xl font-black text-slate-950 mt-1 tabular-nums">
              {depotTotalDuties}{' '}
              <span className="text-xs font-bold text-slate-700">શિફ્ટ</span>
            </div>
            <div className="text-[11px] text-slate-800 font-bold mt-0.5">દિવસ + રાત્રિ + વધારાની ફરજો</div>
          </div>

          <div className="p-3 bg-amber-100 border-2 border-amber-400 rounded-xl">
            <div className="text-xs font-black text-amber-950">ઓફમાં કરેલ ફરજ (C-OFF)</div>
            <div className="text-2xl font-black text-amber-950 mt-1 tabular-nums">
              {depotTotalOffDuties}{' '}
              <span className="text-xs font-bold text-amber-800">ફરજો</span>
            </div>
            <div className="text-[11px] text-amber-900 font-bold mt-0.5">ઓફ દિવસે કરેલ કામગીરી</div>
          </div>

          <div className="p-3 bg-purple-100 border-2 border-purple-400 rounded-xl">
            <div className="text-xs font-black text-purple-950">ડબલ નોકરી (P+PN)</div>
            <div className="text-2xl font-black text-purple-950 mt-1 tabular-nums">
              {depotTotalDoubleDuties}{' '}
              <span className="text-xs font-bold text-purple-800">ડબલ ડ્યુટી</span>
            </div>
            <div className="text-[11px] text-purple-900 font-bold mt-0.5">ઓવરટાઇમ / વિશેષ ડ્યુટી</div>
          </div>
        </div>
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white border-2 border-slate-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-[#0f386b] text-white border-b-2 border-slate-700 font-black text-[11px]">
              <tr className="divide-x divide-slate-500">
                <th className="py-2.5 px-2 w-10">ક્રમ</th>
                <th className="py-2.5 px-2 w-16">ટોકન</th>
                <th className="py-2.5 px-3 text-left min-w-[180px]">કર્મચારીનું નામ અને હોદ્દો</th>
                <th className="py-2.5 px-2 w-12 bg-emerald-900 text-emerald-100">P (દિવસ)</th>
                <th className="py-2.5 px-2 w-12 bg-indigo-900 text-indigo-100">PN (નાઇટ)</th>
                <th className="py-2.5 px-2 w-12 bg-sky-900 text-sky-100">OFF</th>
                <th className="py-2.5 px-2 w-14 bg-amber-400 text-amber-950 font-black">
                  ઓફ ડ્યુટી (OFF+P/N)
                </th>
                <th className="py-2.5 px-2 w-12 bg-purple-900 text-purple-100 font-black">
                  ડબલ (P+PN)
                </th>
                <th className="py-2.5 px-2 w-10 bg-teal-50 text-teal-900">H</th>
                <th className="py-2.5 px-2 w-12 bg-blue-50 text-blue-900">આ માસ CL</th>
                <th className="py-2.5 px-2 w-16 bg-blue-100 text-blue-950 font-black">
                  CL બાકી (12 માંથી)
                </th>
                <th className="py-2.5 px-2 w-12 bg-emerald-50 text-emerald-900">C-OFF લીધેલ</th>
                <th className="py-2.5 px-2 w-10 bg-red-50 text-red-900">ગેરહાજર</th>
                <th className="py-2.5 px-2 w-14 bg-amber-100 text-amber-950 font-black">
                  હાજર જમા ઓફ
                </th>
                <th className="py-2.5 px-3 w-16 bg-blue-900 text-white font-extrabold text-xs">
                  કુલ પગાર દિવસ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {rows.map(({ emp, index, summary, availableCOff }) => (
                <tr
                  key={emp.id}
                  className={`hover:bg-slate-50 transition-colors divide-x divide-slate-200 ${
                    index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                  }`}
                >
                  <td className="py-2 px-1 text-slate-500 font-medium tabular-nums">
                    {index + 1}
                  </td>
                  <td className="py-2 px-2 font-mono font-bold text-slate-700">
                    {emp.tokenNo}
                  </td>
                  <td className="py-2 px-3 text-left">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] text-slate-500">{emp.designation}</div>
                  </td>
                  <td className="py-2 px-2 text-emerald-800 font-bold tabular-nums">
                    {summary.presentDayCount}
                  </td>
                  <td className="py-2 px-2 text-indigo-800 font-bold tabular-nums">
                    {summary.presentNightCount}
                  </td>
                  <td className="py-2 px-2 text-sky-800 font-medium tabular-nums">
                    {summary.offCount}
                  </td>
                  <td className="py-2 px-2 text-amber-900 font-black bg-amber-50/50 tabular-nums">
                    {summary.offWorkedDayCount + summary.offWorkedNightCount > 0 ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400">
                        {summary.offWorkedDayCount + summary.offWorkedNightCount}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-2 text-purple-900 font-black bg-purple-50/50 tabular-nums">
                    {summary.doubleDutyCount > 0 ? (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 border border-purple-400">
                        {summary.doubleDutyCount}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-2 text-teal-800 font-bold tabular-nums">
                    {summary.holidayCount}
                  </td>
                  <td className="py-2 px-2 text-blue-800 font-bold tabular-nums">
                    {summary.clMonthCount}
                  </td>
                  <td className="py-2 px-2 font-black tabular-nums bg-blue-50/80">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded ${
                        summary.clRemaining <= 2
                          ? 'bg-rose-100 text-rose-800 font-black'
                          : 'bg-blue-100 text-blue-900 font-bold'
                      }`}
                    >
                      {summary.clRemaining} / 12
                    </span>
                  </td>
                  <td className="py-2 px-2 text-emerald-800 tabular-nums">
                    {summary.cOffAvailedCount || '-'}
                  </td>
                  <td className="py-2 px-2 text-red-700 font-bold tabular-nums">
                    {summary.absentCount > 0 ? summary.absentCount : '-'}
                  </td>
                  <td className="py-2 px-2 font-black text-amber-950 bg-amber-50 tabular-nums">
                    {availableCOff > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400">
                        {availableCOff} બાકી
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-3 font-black text-blue-950 bg-blue-100/90 tabular-nums text-sm">
                    {summary.payableDays}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 text-slate-900 font-extrabold border-t-2 border-slate-400">
              <tr className="divide-x divide-slate-300">
                <td colSpan={3} className="py-2.5 px-3 text-left font-black bg-slate-200 text-xs">
                  કુલ સરવાળો (DEPOT TOTALS):
                </td>
                <td colSpan={3} className="py-2 px-2 text-slate-700 text-[11px]">
                  કુલ ફરજો: {depotTotalDuties}
                </td>
                <td className="py-2 px-2 text-amber-900 text-xs">{depotTotalOffDuties}</td>
                <td className="py-2 px-2 text-purple-900 text-xs">{depotTotalDoubleDuties}</td>
                <td className="py-2 px-2 text-teal-800">-</td>
                <td className="py-2 px-2 text-blue-800 text-xs">{depotTotalClUsed}</td>
                <td colSpan={3} className="py-2 px-2 text-slate-600 text-[11px]">
                  ગેરહાજર: {depotTotalAbsent}
                </td>
                <td className="py-2 px-2 text-amber-950">-</td>
                <td className="py-2 px-3 text-blue-950 bg-blue-200 font-black text-sm tabular-nums">
                  {depotTotalPayableDays}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
