import React, { useState } from 'react';
import { Employee, MusterMetadata } from '../types/attendance';
import { getDaysInMonth, getDayOfWeek, GUJARATI_DAYS_FULL, GUJARATI_DAYS_SHORT } from '../utils/calculations';
import { CalendarCheck, ShieldCheck, RefreshCw, X, Sparkles } from 'lucide-react';

interface AutoOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: MusterMetadata;
  employees: Employee[];
  onApplyOffs: (updatedEmployees: Employee[]) => void;
}

export const AutoOffModal: React.FC<AutoOffModalProps> = ({
  isOpen,
  onClose,
  metadata,
  employees,
  onApplyOffs,
}) => {
  const [calculationMode, setCalculationMode] = useState<'WEEKDAY' | 'ROLLING_7' | 'STAGGERED_ROSTER'>(
    'WEEKDAY'
  );
  const [preserveExistingWorked, setPreserveExistingWorked] = useState(true);
  const [defaultDayOfWeek, setDefaultDayOfWeek] = useState(0); // 0 = Sunday
  const [rollingStartDay, setRollingStartDay] = useState(7); // Day 7, 14, 21, 28

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(metadata.month);

  const handleApply = () => {
    const updatedEmployees = employees.map((emp, empIndex) => {
      const newDays = { ...emp.days };

      for (let day = 1; day <= daysInMonth; day++) {
        const existingCode = newDays[day];
        const isAlreadyWorked =
          existingCode &&
          ['P', 'PN', 'OFF+P', 'OFF+PN', 'P+PN', 'H', 'H+P', 'H+PN', 'CL', 'L', 'C-OFF'].includes(
            existingCode
          );

        // If preserving existing filled entries and it has a code, don't overwrite unless it's just 'OFF' or empty
        if (preserveExistingWorked && isAlreadyWorked && existingCode !== 'OFF') {
          continue;
        }

        const dow = getDayOfWeek(metadata.month, day);
        let shouldBeOff = false;

        if (calculationMode === 'WEEKDAY') {
          // Check employee's assigned off day (or default Sunday)
          const assignedOff = emp.weeklyOffDay !== undefined ? emp.weeklyOffDay : defaultDayOfWeek;
          if (dow === assignedOff) {
            shouldBeOff = true;
          }
        } else if (calculationMode === 'ROLLING_7') {
          // Rolling 7-day cycle: e.g. every 7th day for this employee
          const offset = empIndex % 7; // Staggered cycle start per employee
          if ((day + offset) % 7 === 0) {
            shouldBeOff = true;
          }
        } else if (calculationMode === 'STAGGERED_ROSTER') {
          // Even distribution across Sunday..Saturday
          const distributedDow = empIndex % 7;
          if (dow === distributedDow) {
            shouldBeOff = true;
          }
        }

        if (shouldBeOff) {
          // If employee actually worked on off day previously, keep it circled OFF+P
          if (existingCode === 'P') {
            newDays[day] = 'OFF+P';
          } else if (existingCode === 'PN') {
            newDays[day] = 'OFF+PN';
          } else if (!existingCode || existingCode === 'OFF') {
            newDays[day] = 'OFF';
          }
        }
      }

      return {
        ...emp,
        days: newDays,
      };
    });

    onApplyOffs(updatedEmployees);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-xl w-full p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                અઠવાડિક ઓફ ૭-દિવસ ઓટો કેલ્ક્યુલેટ (Weekly Off Auto-Fill)
              </h3>
              <p className="text-xs text-slate-500">
                માસ {metadata.month} માટે તમામ {employees.length} કર્મચારીઓની ઓફ રજાઓ આપમેળે સેટ કરો.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              ગણતરી પદ્ધતિ પસંદ કરો (Calculation Method):
            </label>
            <div className="space-y-2">
              {/* Option 1: Weekday based on profile */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  calculationMode === 'WEEKDAY'
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="calcMode"
                  value="WEEKDAY"
                  checked={calculationMode === 'WEEKDAY'}
                  onChange={() => setCalculationMode('WEEKDAY')}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    ૧. કર્મચારીના નિયત વાર પ્રમાણે (Employee Profile Off Day)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    દરેક કર્મચારીના ખાતામાં નિયુક્ત કરેલ વાર મુજબ (દા.ત. રમેશભાઈ: રવિવાર, દિનેશભાઈ: સોમવાર) આખા મહિનાના એ વાર આપમેળે 'OFF' થશે.
                  </div>
                </div>
              </label>

              {/* Option 2: Rolling 7 days */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  calculationMode === 'ROLLING_7'
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="calcMode"
                  value="ROLLING_7"
                  checked={calculationMode === 'ROLLING_7'}
                  onChange={() => setCalculationMode('ROLLING_7')}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    ૨. દર ૭ દિવસે રોટેશનલ ઓફ (Continuous 7-Day Cycle)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ૬ દિવસ સતત ફરજ પછી ૭મો દિવસ ફરજિયાત ઓફ આપવાનો નિયમ. સ્ટાફ રોટેશન મુજબ સેટ થશે.
                  </div>
                </div>
              </label>

              {/* Option 3: Staggered depot roster */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  calculationMode === 'STAGGERED_ROSTER'
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="calcMode"
                  value="STAGGERED_ROSTER"
                  checked={calculationMode === 'STAGGERED_ROSTER'}
                  onChange={() => setCalculationMode('STAGGERED_ROSTER')}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    ૩. ડેપો રોસ્ટર સપ્રમાણ વહેંચણી (Even 7-Day Distribution)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    વર્કશોપ/ડેપોમાં દરરોજ સમાન સ્ટાફ હાજર રહે તે માટે સોમથી રવિમાં કર્મચારીઓની સરખી વહેંચણી કરી આપમેળે ઓફ સેટ કરશે.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Safety Checkbox */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
              <input
                type="checkbox"
                checked={preserveExistingWorked}
                onChange={(e) => setPreserveExistingWorked(e.target.checked)}
                className="rounded border-amber-400"
              />
              પહેલેથી ભરેલી હાજરી (P, PN, CL, H) સુરક્ષિત રાખો
            </label>
            <p className="text-[11px] text-amber-800 mt-1 pl-5">
              જો ચેક રાખેલ હશે, તો જે દિવસે કર્મચારીએ પહેલાથી હાજરી ભરેલ હશે અને તે ઓફનો દિવસ બનશે, તો આપમેળે <b>'OFF+P' (રાઉન્ડ સાથે)</b> માર્ક થઈ જશે જેથી જમા ઓફ મળશે!
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            રદ કરો
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            ૭-દિવસ ઓફ લાગુ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
