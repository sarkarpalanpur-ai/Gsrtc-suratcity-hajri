import React from 'react';
import {
  UserPlus,
  CalendarCheck,
  Zap,
  Search,
  RotateCcw,
  Download,
  Upload,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

interface MusterToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddEmployee: () => void;
  onOpenAutoOffModal: () => void;
  onBulkFillPresent: () => void;
  onBulkFillSundaysOff: () => void;
  onExportCsv: () => void;
  onExportJsonBackup: () => void;
  onImportJsonBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToSample: () => void;
  totalFiltered: number;
  totalAll: number;
}

export const MusterToolbar: React.FC<MusterToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onAddEmployee,
  onOpenAutoOffModal,
  onBulkFillPresent,
  onBulkFillSundaysOff,
  onExportCsv,
  onExportJsonBackup,
  onImportJsonBackup,
  onResetToSample,
  totalFiltered,
  totalAll,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white border-2 border-slate-400 rounded-xl p-3 mb-3 shadow-xs print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search & Filters */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="કર્મચારીનું નામ, ટોકન નં અથવા હોદ્દો શોધો..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold bg-slate-50 border-2 border-slate-400 rounded-lg text-slate-950 placeholder-slate-500 focus:outline-blue-700 focus:bg-white"
            />
          </div>
          {searchTerm && (
            <span className="text-xs font-black text-blue-900 bg-blue-100 border border-blue-300 px-2 py-1 rounded-md whitespace-nowrap">
              {totalFiltered} / {totalAll}
            </span>
          )}
        </div>

        {/* Right: Core Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Staff */}
          <button
            onClick={onAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-blue-900 hover:bg-blue-800 border border-blue-950 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + નવો કર્મચારી
          </button>

          {/* Auto Calculate 7-Day Offs (Key User Request) */}
          <button
            onClick={onOpenAutoOffModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-amber-950 bg-amber-200 hover:bg-amber-300 border-2 border-amber-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="૭-દિવસ રોટેશન અથવા વાર પ્રમાણે આપમેળે ઓફ રજા સેટ કરો"
          >
            <CalendarCheck className="w-4 h-4 text-amber-800" />
            ૭-દિવસ ઓફ ઓટો-કેલ્ક્યુલેટ
          </button>

          {/* Quick Fill Dropdown Actions */}
          <div className="relative inline-block text-left group">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="ઝડપી એન્ટ્રી સાધનો"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              ઝડપી ભરો
              <SlidersHorizontal className="w-3 h-3 text-slate-600" />
            </button>
            <div className="hidden group-hover:block hover:block absolute right-0 mt-1 w-64 bg-white border-2 border-slate-400 rounded-xl shadow-xl py-1.5 z-50">
              <button
                onClick={onBulkFillPresent}
                className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-emerald-50 flex items-center gap-2.5 cursor-pointer"
              >
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                ખાલી ખાનામાં 'P' (હાજર) ભરો
              </button>
              <button
                onClick={onBulkFillSundaysOff}
                className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-sky-50 flex items-center gap-2.5 cursor-pointer"
              >
                <span className="w-3 h-3 rounded-full bg-sky-600"></span>
                બધા રવિવારે 'OFF' ભરો
              </button>
            </div>
          </div>

          {/* CSV Export */}
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-400 rounded-lg transition-colors cursor-pointer"
            title="CSV ફાઇલ એક્સપોર્ટ"
          >
            <FileText className="w-4 h-4 text-slate-700" />
            CSV
          </button>

          {/* Data Backup */}
          <button
            onClick={onExportJsonBackup}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-400 rounded-lg transition-colors cursor-pointer"
            title="સંપૂર્ણ ડેટા બેકઅપ ફાઇલ ડાઉનલોડ"
          >
            <Download className="w-4 h-4 text-slate-700" />
            બેકઅપ
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportJsonBackup}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-400 rounded-lg transition-colors cursor-pointer"
            title="બેકઅપ ફાઇલમાંથી ડેટા પુનઃસ્થાપિત કરો"
          >
            <Upload className="w-4 h-4 text-slate-700" />
            ખોલો
          </button>

          {/* Reset sample */}
          <button
            onClick={onResetToSample}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors cursor-pointer"
            title="ડિફોલ્ટ સેમ્પલ સ્ટાફ ડેટા ફરીથી લોડ કરો"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            રીસેટ
          </button>
        </div>
      </div>
    </div>
  );
};
