import React from 'react';
import { ATTENDANCE_CODE_META } from '../utils/calculations';
import { AttendanceCode } from '../types/attendance';
import { HelpCircle } from 'lucide-react';

interface AttendanceLegendProps {
  onOpenHelp?: () => void;
}

export const AttendanceLegend: React.FC<AttendanceLegendProps> = ({ onOpenHelp }) => {
  const codes: AttendanceCode[] = [
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
  ];

  return (
    <div className="bg-white border-2 border-slate-400 rounded-xl p-3 mb-3 shadow-xs print:border-slate-600 print:p-1 print:mb-1">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 border-b-2 border-slate-200 pb-2 print:hidden">
        <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-900 ring-2 ring-blue-300"></span>
          હાજરી સંકેતો અને નિયમો (Attendance Codes &amp; Rules):
        </span>
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
            કીબોર્ડ શોર્ટકટ અને નિયમો માર્ગદર્શિકા
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        {codes.map((code) => {
          const meta = ATTENDANCE_CODE_META[code];
          return (
            <div
              key={code}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 whitespace-nowrap"
            >
              <span
                className={`inline-flex items-center justify-center min-w-7 h-5 px-1.5 text-[11px] font-bold ${
                  meta.badgeClass
                } ${meta.isCircled ? 'shadow-xs' : 'rounded'}`}
                title={meta.description}
              >
                {code}
              </span>
              <span className="font-semibold text-slate-900">{meta.labelGu}</span>
              <span className="text-[10px] text-slate-400 hidden lg:inline">
                ({meta.labelEn})
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2 text-xs font-semibold text-slate-800 border-t-2 border-slate-200 flex flex-wrap gap-x-5 gap-y-1.5 print:text-[9px] print:mt-0.5 print:pt-0.5">
        <span className="text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
          ● <b>ઓફ રાઉન્ડ (OFF+P / OFF+PN):</b> ઓફ દિવસે નોકરી કરેલ હોય તો લાલ/પીળા રાઉન્ડમાં દર્શાવેલ છે અને ખાતામાં ૧ જમા ઓફ મળે છે.
        </span>
        <span className="text-purple-950 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-300">
          ● <b>ડબલ નોકરી (P+PN):</b> એક જ દિવસે દિવસ + નાઇટ સતત ફરજ.
        </span>
        <span className="text-blue-950 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
          ● <b>CL (પરચૂરણ રજા):</b> વર્ષમાં ૧૨ માન્ય રજા છે.
        </span>
        <span className="text-teal-950 bg-teal-100/80 px-2 py-0.5 rounded border border-teal-300">
          ● <b>તહેવાર (H):</b> કામ ન કર્યું હોય તો પણ પગારના દિવસમાંથી ઓછો થતો નથી.
        </span>
      </div>
    </div>
  );
};
