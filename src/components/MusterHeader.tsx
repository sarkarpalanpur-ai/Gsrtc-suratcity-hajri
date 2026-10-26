import React from 'react';
import { MusterMetadata } from '../types/attendance';
import { Calendar, Building2, UserCheck, ShieldCheck, Printer, FileSpreadsheet, Sparkles, BookOpen } from 'lucide-react';

interface MusterHeaderProps {
  metadata: MusterMetadata;
  onChangeMetadata: (updated: Partial<MusterMetadata>) => void;
  activeTab: 'muster' | 'daily' | 'coff-ledger' | 'payroll-summary';
  onSelectTab: (tab: 'muster' | 'daily' | 'coff-ledger' | 'payroll-summary') => void;
  totalEmployees: number;
  totalCOffAvailable: number;
  totalPayableDaysDepot: number;
  onPrint: () => void;
  onExportExcel: () => void;
}

export const MusterHeader: React.FC<MusterHeaderProps> = ({
  metadata,
  onChangeMetadata,
  activeTab,
  onSelectTab,
  totalEmployees,
  totalCOffAvailable,
  totalPayableDaysDepot,
  onPrint,
  onExportExcel,
}) => {
  return (
    <header className="bg-white border-b-2 border-slate-400 shadow-sm print:border-none print:shadow-none">
      {/* Top Banner */}
      <div className="max-w-[1720px] mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Organization Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-[#0c2340] text-white flex flex-col items-center justify-center font-black shadow-md shrink-0 border-2 border-[#1e3a63]">
              <span className="text-sm tracking-widest text-amber-300">GSRTC</span>
              <span className="text-[10px] tracking-normal font-bold">SRC</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-['Noto_Sans_Gujarati','Plus_Jakarta_Sans',sans-serif]">
                  હાજરી પત્રક અને જમા ઓફ રજીસ્ટર
                </h1>
                <span className="inline-block px-2.5 py-0.5 text-xs font-black bg-blue-900 text-white rounded-md shadow-2xs">
                  GSRTC સ્ટાન્ડર્ડ મસ્ટર
                </span>
              </div>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                {metadata.unitName} · <span className="text-blue-900 font-black">૭-દિવસ ઓફ ઓટો ગણતરી</span> · <span className="text-amber-800 font-black">OFF+P / OFF+PN રાઉન્ડ માર્કિંગ</span> · <span className="text-emerald-800 font-black">૧૨ CL કોટા</span>
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            {/* Month Picker - High Contrast */}
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border-2 border-blue-400 shadow-2xs">
              <Calendar className="w-4 h-4 text-blue-900 shrink-0" />
              <label htmlFor="month-picker" className="text-xs font-black text-blue-950 whitespace-nowrap">
                મહિનો:
              </label>
              <input
                id="month-picker"
                type="month"
                value={metadata.month}
                onChange={(e) => onChangeMetadata({ month: e.target.value })}
                className="bg-white border-2 border-blue-600 rounded-lg px-2.5 py-1 text-xs font-black text-slate-950 focus:outline-blue-700 cursor-pointer shadow-2xs"
              />
            </div>

            {/* Quick Stat: Staff Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border-2 border-slate-300 rounded-xl text-xs shadow-2xs">
              <UserCheck className="w-4 h-4 text-slate-800" />
              <div>
                <span className="text-slate-600 font-bold">કર્મચારીઓ:</span>{' '}
                <span className="font-black text-slate-950 text-sm tabular-nums">{totalEmployees}</span>
              </div>
            </div>

            {/* Quick Stat: Available C-Offs */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 border-2 border-amber-400 rounded-xl text-xs shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-amber-900 font-bold">હાજર જમા ઓફ:</span>{' '}
                <span className="font-black text-amber-950 text-sm tabular-nums">{totalCOffAvailable} દિવસ</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <button
                onClick={onExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-600 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Excel (.xlsx) ફાઇલ ડાઉનલોડ કરો"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>એક્સેલ ડાઉનલોડ</span>
              </button>

              <button
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-blue-900 hover:bg-blue-800 border-2 border-blue-950 rounded-xl shadow-xs transition-colors cursor-pointer"
                title="મસ્ટર પ્રિન્ટ અથવા PDF સેવ કરો (Legal Landscape)"
              >
                <Printer className="w-4 h-4" />
                <span>પ્રિન્ટ / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t-2 border-slate-200 print:hidden overflow-x-auto">
          <button
            onClick={() => onSelectTab('muster')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'muster'
                ? 'bg-blue-900 text-white shadow-sm border-2 border-blue-950 ring-2 ring-blue-300'
                : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>📋 આખી એક્સેલ શીટ (Spreadsheet)</span>
          </button>

          <button
            onClick={() => onSelectTab('daily')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-blue-900 text-white shadow-sm border-2 border-blue-950 ring-2 ring-blue-300'
                : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>📱 મોબાઇલ દૈનિક હાજરી (Daily View)</span>
          </button>

          <button
            onClick={() => onSelectTab('coff-ledger')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'coff-ledger'
                ? 'bg-amber-600 text-white shadow-sm border-2 border-amber-800 ring-2 ring-amber-300'
                : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>⭐ જમા ઓફ ખાતાવહી (C-Off Bank)</span>
            {totalCOffAvailable > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'coff-ledger' ? 'bg-white text-amber-800' : 'bg-amber-300 text-amber-950 border border-amber-500'
              }`}>
                {totalCOffAvailable}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('payroll-summary')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payroll-summary'
                ? 'bg-blue-900 text-white shadow-sm border-2 border-blue-950 ring-2 ring-blue-300'
                : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>📊 પગાર અને CL રજા રિપોર્ટ (Payroll Summary)</span>
          </button>
        </div>
      </div>

      {/* Official Print Header (Visible ONLY during print) */}
      <div className="hidden print:block text-center mb-2 px-4">
        <h2 className="text-base font-extrabold uppercase tracking-wide text-black">
          ગુજરાત રાજ્ય માર્ગ વાહન વ્યવહાર નિગમ (GSRTC)
        </h2>
        <h3 className="text-sm font-bold text-black">{metadata.unitName}</h3>
        <p className="text-xs font-medium text-black">
          માસિક સ્ટાફ હાજરી પત્રક / STAFF ATTENDANCE MUSTER ROLL · માસ: {metadata.month} · વિભાગ: {metadata.division}
        </p>
      </div>
    </header>
  );
};
