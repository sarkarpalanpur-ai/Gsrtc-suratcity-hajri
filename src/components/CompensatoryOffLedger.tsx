import React, { useState } from 'react';
import { CompensatoryOffCredit, Employee, COffDutyType } from '../types/attendance';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Plus,
  Filter,
  ArrowRight,
  Printer,
  FileSpreadsheet,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface CompensatoryOffLedgerProps {
  credits: CompensatoryOffCredit[];
  employees: Employee[];
  selectedEmployeeId?: string | null;
  onSelectEmployeeFilter: (empId: string | null) => void;
  onAddCredit: (newCredit: Omit<CompensatoryOffCredit, 'id' | 'createdAt'>) => void;
  onAvailCredit: (creditId: string, availedDate: string, notes?: string) => void;
  onDeleteCredit: (creditId: string) => void;
}

export const CompensatoryOffLedger: React.FC<CompensatoryOffLedgerProps> = ({
  credits,
  employees,
  selectedEmployeeId,
  onSelectEmployeeFilter,
  onAddCredit,
  onAvailCredit,
  onDeleteCredit,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'AVAILED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | COffDutyType>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedCreditForAvail, setSelectedCreditForAvail] = useState<CompensatoryOffCredit | null>(null);

  // Form states for adding manual credit
  const [formEmpId, setFormEmpId] = useState(employees[0]?.id || '');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formType, setFormType] = useState<COffDutyType>('OFF+P');
  const [formNotes, setFormNotes] = useState('');

  // Form states for availing credit
  const [availDate, setAvailDate] = useState(new Date().toISOString().slice(0, 10));
  const [availNotes, setAvailNotes] = useState('');

  // Filtered list
  const filteredCredits = credits.filter((credit) => {
    if (selectedEmployeeId && credit.employeeId !== selectedEmployeeId) return false;
    if (statusFilter !== 'ALL' && credit.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && credit.dutyType !== typeFilter) return false;
    return true;
  });

  // Aggregated Stats
  const totalCredits = credits.length;
  const availableCredits = credits.filter((c) => c.status === 'AVAILABLE').length;
  const availedCredits = credits.filter((c) => c.status === 'AVAILED').length;

  const handleOpenAvailModal = (credit: CompensatoryOffCredit) => {
    setSelectedCreditForAvail(credit);
    setAvailDate(new Date().toISOString().slice(0, 10));
    setAvailNotes(`C-OFF રજા તરીકે લીધેલ (${credit.dutyDate} ના બદલામાં)`);
    setIsAvailModalOpen(true);
  };

  const handleConfirmAvail = () => {
    if (!selectedCreditForAvail) return;
    onAvailCredit(selectedCreditForAvail.id, availDate, availNotes);
    setIsAvailModalOpen(false);
    setSelectedCreditForAvail(null);
  };

  const handleCreateCredit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === formEmpId);
    if (!emp) return;

    onAddCredit({
      employeeId: emp.id,
      employeeName: emp.name,
      tokenNo: emp.tokenNo,
      dutyDate: formDate,
      dutyType: formType,
      month: formDate.slice(0, 7),
      status: 'AVAILABLE',
      notes: formNotes || `ઓફ / હોલીડે ફરજ બદલ જમા રજા`,
    });

    setIsAddModalOpen(false);
    setFormNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Page Title & KPI Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              જમા ઓફ અને જાહેર રજા ખાતાવહી (Compensatory Off Passbook)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ઓફ દિવસે નોકરી (OFF+P / OFF+PN), તહેવારે નોકરી (H+P / H+PN) અને ડબલ ડ્યુટી (P+PN) થી જમા થયેલી રજાઓનો સત્તાવાર હિસાબ, જે ભવિષ્યમાં વાપરી શકાય છે.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + નવી જમા રજા નોંધો
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              પ્રિન્ટ રજીસ્ટર
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">હાજર ઉપલબ્ધ બાકી (Available)</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950 mt-1 tabular-nums">
              {availableCredits} <span className="text-xs font-bold text-amber-700">દિવસ જમા</span>
            </div>
            <p className="text-[11px] text-amber-700/90 mt-0.5">કર્મચારીઓ આ રજાઓ ભવિષ્યમાં C-OFF તરીકે વાપરી શકે છે</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">વાપરેલ રજાઓ (Availed / Redeemed)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-1 tabular-nums">
              {availedCredits} <span className="text-xs font-bold text-emerald-700">દિવસ વપરાયેલ</span>
            </div>
            <p className="text-[11px] text-emerald-700/90 mt-0.5">અગાઉ મંજૂર કરીને ભોગવી લીધેલ બદલી ઓફ રજાઓ</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">કુલ નોંધાયેલ જમા રજાઓ (Total Earned)</span>
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
              {totalCredits} <span className="text-xs font-bold text-slate-600">કુલ એન્ટ્રીઓ</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">ઓફ ડ્યુટી + તહેવાર ડ્યુટી + ડબલ નોકરીનું કુલ પ્રમાણ</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Employee Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <label className="text-[11px] font-semibold text-slate-600">કર્મચારી:</label>
            <select
              value={selectedEmployeeId || ''}
              onChange={(e) => onSelectEmployeeFilter(e.target.value || null)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="">બધા કર્મચારીઓ (All Staff)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.tokenNo} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              બધા ({credits.length})
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'AVAILABLE' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              જમા બાકી ({availableCredits})
            </button>
            <button
              onClick={() => setStatusFilter('AVAILED')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'AVAILED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              વપરાયેલ ({availedCredits})
            </button>
          </div>

          {/* Duty Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">બધા પ્રકાર (ઓફ/હોલીડે/ડબલ)</option>
            <option value="OFF+P">OFF+P (ઓફ દિવસ ફરજ)</option>
            <option value="OFF+PN">OFF+PN (ઓફ નાઇટ ફરજ)</option>
            <option value="H+P">H+P (તહેવાર દિવસ)</option>
            <option value="H+PN">H+PN (તહેવાર નાઇટ)</option>
            <option value="P+PN">P+PN (ડબલ નોકરી)</option>
          </select>
        </div>

        {selectedEmployeeId && (
          <button
            onClick={() => onSelectEmployeeFilter(null)}
            className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
          >
            ફિલ્ટર હટાવો
          </button>
        )}
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border-2 border-slate-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#0f386b] text-white border-b-2 border-slate-700 font-black text-[11px]">
              <tr className="divide-x divide-slate-500">
                <th className="py-2.5 px-3 w-12 text-center">ક્રમ</th>
                <th className="py-2.5 px-3 w-20">ટોકન નં</th>
                <th className="py-2.5 px-3 min-w-[180px]">કર્મચારીનું નામ</th>
                <th className="py-2.5 px-3 w-28">ફરજ તારીખ</th>
                <th className="py-2.5 px-3 w-32">ફરજનો પ્રકાર</th>
                <th className="py-2.5 px-3 w-24">સ્થિતિ</th>
                <th className="py-2.5 px-3 w-32">ક્યારે વાપરી</th>
                <th className="py-2.5 px-3 min-w-[200px]">વિગત / મંજૂરી નોંધ</th>
                <th className="py-2.5 px-3 w-28 text-center print:hidden">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-300 text-slate-950 font-bold">
              {filteredCredits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500 font-black">
                    કોઈ જમા રજાનો રેકોર્ડ મળ્યો નથી.
                  </td>
                </tr>
              ) : (
                filteredCredits.map((credit, idx) => {
                  const isAvailable = credit.status === 'AVAILABLE';

                  return (
                    <tr
                      key={credit.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isAvailable ? 'bg-amber-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {credit.tokenNo}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {credit.employeeName}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {credit.dutyDate}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black ${
                            credit.dutyType.startsWith('OFF')
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-1 ring-amber-500 rounded-full'
                              : credit.dutyType.startsWith('H')
                              ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}
                        >
                          {credit.dutyType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            જમા (બાકી)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            વપરાયેલ
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {credit.availedDate ? (
                          <span className="font-semibold text-emerald-800">{credit.availedDate}</span>
                        ) : (
                          <span className="text-slate-400 italic">વાપરવાની બાકી</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-xs">
                        {credit.notes || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center print:hidden">
                        {isAvailable ? (
                          <button
                            onClick={() => handleOpenAvailModal(credit)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-2xs transition-colors cursor-pointer"
                            title="આ જમા રજાનો ઉપભોગ નોંધો"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            વાપરો
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">સંપન્ન</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Manual Credit */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-5 max-w-md w-full">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-600" />
              નવી જમા રજા (C-OFF) ઉમેરો
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ઓફ કે તહેવારના દિવસે કરેલી ફરજ બદલ કર્મચારીના ખાતામાં ૧ જમા રજા ઉમેરો.
            </p>

            <form onSubmit={handleCreateCredit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">કર્મચારી:</label>
                <select
                  value={formEmpId}
                  onChange={(e) => setFormEmpId(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.tokenNo} - {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ફરજ તારીખ (Duty Date):</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ફરજનો પ્રકાર:</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as COffDutyType)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                >
                  <option value="OFF+P">OFF+P (ઓફ દિવસે દિવસ ફરજ)</option>
                  <option value="OFF+PN">OFF+PN (ઓફ દિવસે રાત્રિ ફરજ)</option>
                  <option value="H+P">H+P (જાહેર રજા/તહેવારે દિવસ ફરજ)</option>
                  <option value="H+PN">H+PN (જાહેર રજા/તહેવારે રાત્રિ ફરજ)</option>
                  <option value="P+PN">P+PN (ડબલ નોકરી / દિવસ + નાઇટ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">નોંધ / કારણ:</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="દા.ત. બસ બ્રેકડાઉન રિપેરિંગ ડ્યુટી, સ્ટાફ ઘટ હોવાથી વિશેષ ફરજ..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white h-18 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                >
                  ખાતામાં જમા કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Avail / Redeem C-Off */}
      {isAvailModalOpen && selectedCreditForAvail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-5 max-w-md w-full">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              જમા ઓફ રજાનો ઉપભોગ નોંધો (Redeem C-OFF)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              કર્મચારી: <b>{selectedCreditForAvail.employeeName}</b> ({selectedCreditForAvail.tokenNo})<br />
              ફરજ તારીખ: <b>{selectedCreditForAvail.dutyDate}</b> ({selectedCreditForAvail.dutyType})
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  કઈ તારીખે રજા ભોગવી? (Availed Date):
                </label>
                <input
                  type="date"
                  value={availDate}
                  onChange={(e) => setAvailDate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">વિગત / શેરો:</label>
                <input
                  type="text"
                  value={availNotes}
                  onChange={(e) => setAvailNotes(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAvailModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAvail}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  વપરાયેલ તરીકે સેવ કરો
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
