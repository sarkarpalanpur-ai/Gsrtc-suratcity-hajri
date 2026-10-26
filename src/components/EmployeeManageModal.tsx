import React, { useState, useEffect } from 'react';
import { Employee } from '../types/attendance';
import { GUJARATI_DAYS_FULL } from '../utils/calculations';
import { UserCheck, X } from 'lucide-react';

interface EmployeeManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit: Employee | null;
  onSave: (employeeData: Partial<Employee>) => void;
}

export const EmployeeManageModal: React.FC<EmployeeManageModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
  onSave,
}) => {
  const [tokenNo, setTokenNo] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [weeklyOffDay, setWeeklyOffDay] = useState(0);
  const [clTotalYearly, setClTotalYearly] = useState(12);
  const [clUsedPrior, setClUsedPrior] = useState(0);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (employeeToEdit) {
      setTokenNo(employeeToEdit.tokenNo);
      setName(employeeToEdit.name);
      setDesignation(employeeToEdit.designation);
      setWeeklyOffDay(employeeToEdit.weeklyOffDay ?? 0);
      setClTotalYearly(employeeToEdit.clTotalYearly ?? 12);
      setClUsedPrior(employeeToEdit.clUsedPrior ?? 0);
      setRemarks(employeeToEdit.remarks || '');
    } else {
      setTokenNo(`M-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setDesignation('મિકેનિક (Mechanic)');
      setWeeklyOffDay(0);
      setClTotalYearly(12);
      setClUsedPrior(0);
      setRemarks('');
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      tokenNo,
      name,
      designation,
      weeklyOffDay,
      clTotalYearly,
      clUsedPrior,
      remarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {employeeToEdit ? 'કર્મચારીની વિગત સુધારો' : 'નવો કર્મચારી ઉમેરો'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ટોકન નં / બિલ્લા નં (Token):
              </label>
              <input
                type="text"
                value={tokenNo}
                onChange={(e) => setTokenNo(e.target.value)}
                placeholder="દા.ત. M-112"
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                અઠવાડિક નિયત ઓફ વાર:
              </label>
              <select
                value={weeklyOffDay}
                onChange={(e) => setWeeklyOffDay(Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              >
                {GUJARATI_DAYS_FULL.map((dayName, idx) => (
                  <option key={idx} value={idx}>
                    {dayName} (Day {idx})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              કર્મચારીનું નામ (Employee Name):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="દા.ત. રમેશભાઈ પટેલ / Ramesh Patel"
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              હોદ્દો / શાખા (Designation):
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="દા.ત. ડીઝલ મિકેનિક, ઓટો ઇલેક્ટ્રિશિયન, ફીટર, ડ્રાઈવર..."
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">
                વાર્ષિક મંજૂર CL કોટા:
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={clTotalYearly}
                onChange={(e) => setClTotalYearly(Number(e.target.value))}
                className="w-full text-xs p-2 border border-blue-300 rounded-lg bg-white font-bold"
              />
              <span className="text-[10px] text-blue-700 font-medium">નિયમ મુજબ વાર્ષિક ૧૨ CL</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">
                અગાઉ વપરાયેલ CL:
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={clUsedPrior}
                onChange={(e) => setClUsedPrior(Number(e.target.value))}
                className="w-full text-xs p-2 border border-blue-300 rounded-lg bg-white font-bold"
              />
              <span className="text-[10px] text-blue-700 font-medium">ચાલુ વર્ષે અગાઉ ભોગવેલ</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">નોંધ (Remarks):</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="દા.ત. નાઇટ શિફ્ટ ઇન્ચાર્જ, સ્પેશિયલ ડ્યુટી..."
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              {employeeToEdit ? 'વિગત સાચવો' : 'કર્મચારી ઉમેરો'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
