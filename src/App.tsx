/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Employee,
  AttendanceCode,
  MusterMetadata,
  CompensatoryOffCredit,
  COffDutyType,
} from './types/attendance';
import {
  INITIAL_STAFF,
  INITIAL_METADATA,
  INITIAL_C_OFF_CREDITS,
} from './data/sampleStaff';
import { MusterHeader } from './components/MusterHeader';
import { MusterToolbar } from './components/MusterToolbar';
import { AttendanceLegend } from './components/AttendanceLegend';
import { MusterGrid } from './components/MusterGrid';
import { MobileDailyAttendance } from './components/MobileDailyAttendance';
import { CompensatoryOffLedger } from './components/CompensatoryOffLedger';
import { PayrollAndLeaveSummary } from './components/PayrollAndLeaveSummary';
import { AutoOffModal } from './components/AutoOffModal';
import { EmployeeManageModal } from './components/EmployeeManageModal';
import { QuickHelpModal } from './components/QuickHelpModal';
import { exportToExcel, exportToCsv } from './utils/excelExport';
import {
  calculateEmployeeSummary,
  getDaysInMonth,
  getDayOfWeek,
} from './utils/calculations';

const STORAGE_KEY_METADATA = 'gsrtc_muster_metadata_v2';
const STORAGE_KEY_EMPLOYEES = 'gsrtc_muster_employees_v2';
const STORAGE_KEY_COFF = 'gsrtc_muster_coff_credits_v2';

export default function App() {
  // 1. Metadata State
  const [metadata, setMetadata] = useState<MusterMetadata>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_METADATA);
      return saved ? JSON.parse(saved) : INITIAL_METADATA;
    } catch {
      return INITIAL_METADATA;
    }
  });

  // 2. Employees State
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // 3. Compensatory Off Ledger State
  const [cOffCredits, setCOffCredits] = useState<CompensatoryOffCredit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COFF);
      return saved ? JSON.parse(saved) : INITIAL_C_OFF_CREDITS;
    } catch {
      return INITIAL_C_OFF_CREDITS;
    }
  });

  // 4. UI View States
  const [activeTab, setActiveTab] = useState<'muster' | 'daily' | 'coff-ledger' | 'payroll-summary'>('muster');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLedgerEmpId, setSelectedLedgerEmpId] = useState<string | null>(null);

  // Modals
  const [isAutoOffModalOpen, setIsAutoOffModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_METADATA, JSON.stringify(metadata));
    } catch (e) {
      console.error('Failed to save metadata', e);
    }
  }, [metadata]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to save employees', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COFF, JSON.stringify(cOffCredits));
    } catch (e) {
      console.error('Failed to save C-Off credits', e);
    }
  }, [cOffCredits]);

  // Handle Attendance Change & Auto Sync with C-Off Ledger
  const handleUpdateAttendance = (
    employeeId: string,
    day: number,
    code: AttendanceCode
  ) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const dayStr = String(day).padStart(2, '0');
    const dutyDate = `${metadata.month}-${dayStr}`;

    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== employeeId) return e;
        const newDays = { ...e.days, [day]: code };
        return { ...e, days: newDays };
      })
    );

    // Auto synchronize C-OFF Credit when duty was done on OFF day, Holiday or Double duty
    const isEarnableType =
      code === 'OFF+P' ||
      code === 'OFF+PN' ||
      code === 'H+P' ||
      code === 'H+PN' ||
      code === 'P+PN';

    if (isEarnableType) {
      // Check if already in ledger
      const existing = cOffCredits.find(
        (c) => c.employeeId === employeeId && c.dutyDate === dutyDate
      );

      if (!existing) {
        const newCredit: CompensatoryOffCredit = {
          id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          employeeId: emp.id,
          employeeName: emp.name,
          tokenNo: emp.tokenNo,
          dutyDate,
          dutyType: code as COffDutyType,
          month: metadata.month,
          status: 'AVAILABLE',
          notes:
            code === 'OFF+P'
              ? 'ઓફ દિવસે દિવસ શિફ્ટ કામગીરી બદલ જમા'
              : code === 'OFF+PN'
              ? 'ઓફ દિવસે નાઇટ શિફ્ટ કામગીરી બદલ જમા'
              : code.startsWith('H')
              ? 'જાહેર રજાના દિવસે વિશેષ ફરજ બદલ જમા'
              : 'ડબલ નોકરી બદલ વિશેષ જમા',
          createdAt: new Date().toISOString(),
        };

        setCOffCredits((prev) => [newCredit, ...prev]);
      }
    } else {
      // If code was changed from an earnable type to something else, remove the auto credit if still AVAILABLE
      setCOffCredits((prev) =>
        prev.filter((c) => !(c.employeeId === employeeId && c.dutyDate === dutyDate && c.status === 'AVAILABLE'))
      );
    }
  };

  // Add / Edit Employee
  const handleSaveEmployee = (empData: Partial<Employee>) => {
    if (employeeToEdit) {
      // Update existing
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === employeeToEdit.id ? ({ ...e, ...empData } as Employee) : e
        )
      );
    } else {
      // Add new
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        srNo: employees.length + 1,
        tokenNo: empData.tokenNo || `M-${100 + employees.length}`,
        name: empData.name || 'નવો કર્મચારી',
        designation: empData.designation || 'મિકેનિક (Mechanic)',
        weeklyOffDay: empData.weeklyOffDay ?? 0,
        clTotalYearly: empData.clTotalYearly ?? 12,
        clUsedPrior: empData.clUsedPrior ?? 0,
        days: {},
        remarks: empData.remarks || '',
      };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setEmployeeToEdit(null);
  };

  const handleDeleteEmployee = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    if (window.confirm(`શું તમે કર્મચારી '${emp.name}' (${emp.tokenNo}) ને રદ કરવા માંગો છો?`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
    }
  };

  // Fast Bulk Fill Helpers
  const handleBulkFillPresent = () => {
    const daysInMonth = getDaysInMonth(metadata.month);
    setEmployees((prev) =>
      prev.map((emp) => {
        const newDays = { ...emp.days };
        for (let d = 1; d <= daysInMonth; d++) {
          if (!newDays[d]) {
            newDays[d] = 'P';
          }
        }
        return { ...emp, days: newDays };
      })
    );
  };

  const handleBulkFillSundaysOff = () => {
    const daysInMonth = getDaysInMonth(metadata.month);
    setEmployees((prev) =>
      prev.map((emp) => {
        const newDays = { ...emp.days };
        for (let d = 1; d <= daysInMonth; d++) {
          if (getDayOfWeek(metadata.month, d) === 0) {
            // Sunday
            if (newDays[d] === 'P') {
              newDays[d] = 'OFF+P';
            } else if (newDays[d] === 'PN') {
              newDays[d] = 'OFF+PN';
            } else if (!newDays[d]) {
              newDays[d] = 'OFF';
            }
          }
        }
        return { ...emp, days: newDays };
      })
    );
  };

  // Backup & Restore
  const handleExportJsonBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      metadata,
      employees,
      cOffCredits,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GSRTC_Muster_Backup_${metadata.month}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.employees && Array.isArray(parsed.employees)) {
          setEmployees(parsed.employees);
          if (parsed.metadata) setMetadata(parsed.metadata);
          if (parsed.cOffCredits && Array.isArray(parsed.cOffCredits)) {
            setCOffCredits(parsed.cOffCredits);
          }
          alert('બેકઅપ ફાઇલ સફળતાપૂર્વક લોડ થઈ ગઈ છે!');
        } else {
          alert('અમાન્ય બેકઅપ ફાઇલ ફોર્મેટ.');
        }
      } catch (err) {
        alert('ફાઇલ વાંચવામાં ભૂલ આવી: ' + String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToSample = () => {
    if (window.confirm('શું તમે ડિફોલ્ટ સેમ્પલ સ્ટાફ ડેટા ફરીથી લોડ કરવા માંગો છો? વર્તમાન ફેરફારો રીસેટ થશે.')) {
      setEmployees(INITIAL_STAFF);
      setMetadata(INITIAL_METADATA);
      setCOffCredits(INITIAL_C_OFF_CREDITS);
    }
  };

  // C-Off Management Handlers
  const handleAddManualCredit = (
    newCredit: Omit<CompensatoryOffCredit, 'id' | 'createdAt'>
  ) => {
    const credit: CompensatoryOffCredit = {
      ...newCredit,
      id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setCOffCredits((prev) => [credit, ...prev]);
  };

  const handleAvailCredit = (
    creditId: string,
    availedDate: string,
    notes?: string
  ) => {
    setCOffCredits((prev) =>
      prev.map((c) => {
        if (c.id !== creditId) return c;
        return {
          ...c,
          status: 'AVAILED',
          availedDate,
          availedInMonth: availedDate.slice(0, 7),
          notes: notes || c.notes,
        };
      })
    );

    // If availed date is in current month, mark C-OFF in muster grid automatically!
    if (availedDate.startsWith(metadata.month)) {
      const dayNum = parseInt(availedDate.split('-')[2], 10);
      const targetCredit = cOffCredits.find((c) => c.id === creditId);
      if (targetCredit && dayNum >= 1 && dayNum <= 31) {
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.id !== targetCredit.employeeId) return emp;
            return {
              ...emp,
              days: {
                ...emp.days,
                [dayNum]: 'C-OFF',
              },
            };
          })
        );
      }
    }
  };

  const handleDeleteCredit = (creditId: string) => {
    setCOffCredits((prev) => prev.filter((c) => c.id !== creditId));
  };

  const handleViewEmployeeLedger = (emp: Employee) => {
    setSelectedLedgerEmpId(emp.id);
    setActiveTab('coff-ledger');
  };

  // Filtered employees by search
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.tokenNo.toLowerCase().includes(term) ||
        e.designation.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  // Aggregate Stats
  const totalCOffAvailable = useMemo(() => {
    return cOffCredits.filter((c) => c.status === 'AVAILABLE').length;
  }, [cOffCredits]);

  const totalPayableDaysDepot = useMemo(() => {
    const daysInMonth = getDaysInMonth(metadata.month);
    return employees.reduce((acc, emp) => {
      const summary = calculateEmployeeSummary(emp, daysInMonth);
      return acc + summary.payableDays;
    }, 0);
  }, [employees, metadata.month]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Noto_Sans_Gujarati','Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header with Depot Details, Tabs & Quick Actions */}
      <MusterHeader
        metadata={metadata}
        onChangeMetadata={(up) => setMetadata((prev) => ({ ...prev, ...up }))}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalEmployees={employees.length}
        totalCOffAvailable={totalCOffAvailable}
        totalPayableDaysDepot={totalPayableDaysDepot}
        onPrint={() => window.print()}
        onExportExcel={() => exportToExcel(metadata, employees, cOffCredits)}
      />

      {/* 2. Main Work Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-2 sm:px-4 py-3">
        {/* Toolbar (Only for Muster View) */}
        {activeTab === 'muster' && (
          <MusterToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddEmployee={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
            onOpenAutoOffModal={() => setIsAutoOffModalOpen(true)}
            onBulkFillPresent={handleBulkFillPresent}
            onBulkFillSundaysOff={handleBulkFillSundaysOff}
            onExportCsv={() => exportToCsv(metadata, employees)}
            onExportJsonBackup={handleExportJsonBackup}
            onImportJsonBackup={handleImportJsonBackup}
            onResetToSample={handleResetToSample}
            totalFiltered={filteredEmployees.length}
            totalAll={employees.length}
          />
        )}

        {/* Legend (Only for Muster View) */}
        {activeTab === 'muster' && (
          <AttendanceLegend onOpenHelp={() => setIsHelpModalOpen(true)} />
        )}

        {/* Tab 1: Attendance Muster Grid */}
        {activeTab === 'muster' && (
          <MusterGrid
            metadata={metadata}
            employees={filteredEmployees}
            onUpdateAttendance={handleUpdateAttendance}
            onEditEmployee={(emp) => {
              setEmployeeToEdit(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onViewEmployeeLedger={handleViewEmployeeLedger}
          />
        )}

        {/* Tab 2: Mobile Daily View */}
        {activeTab === 'daily' && (
          <MobileDailyAttendance
            metadata={metadata}
            employees={filteredEmployees}
            onUpdateAttendance={handleUpdateAttendance}
            onSwitchToSpreadsheet={() => setActiveTab('muster')}
          />
        )}

        {/* Tab 3: Compensatory Off Ledger Page */}
        {activeTab === 'coff-ledger' && (
          <CompensatoryOffLedger
            credits={cOffCredits}
            employees={employees}
            selectedEmployeeId={selectedLedgerEmpId}
            onSelectEmployeeFilter={setSelectedLedgerEmpId}
            onAddCredit={handleAddManualCredit}
            onAvailCredit={handleAvailCredit}
            onDeleteCredit={handleDeleteCredit}
          />
        )}

        {/* Tab 3: Monthly Payroll & Leave Summary */}
        {activeTab === 'payroll-summary' && (
          <PayrollAndLeaveSummary
            metadata={metadata}
            employees={employees}
            cOffCredits={cOffCredits}
            onExportExcel={() => exportToExcel(metadata, employees, cOffCredits)}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ગુજરાત રાજ્ય માર્ગ વાહન વ્યવહાર નિગમ (GSRTC) · સ્ટાફ હાજરી પત્રક અને રજા એકાઉન્ટ
          </span>
          <span className="text-[11px] text-slate-400">
            તમામ ડેટા આપના બ્રાઉઝરમાં આપમેળે સેવ થાય છે · એક્સેલ (.xlsx) અને CSV સપોર્ટ
          </span>
        </div>
      </footer>

      {/* Modals */}
      <AutoOffModal
        isOpen={isAutoOffModalOpen}
        onClose={() => setIsAutoOffModalOpen(false)}
        metadata={metadata}
        employees={employees}
        onApplyOffs={(updated) => setEmployees(updated)}
      />

      <EmployeeManageModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeToEdit={employeeToEdit}
        onSave={handleSaveEmployee}
      />

      <QuickHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
