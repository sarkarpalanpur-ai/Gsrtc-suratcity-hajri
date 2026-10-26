import { Employee, CompensatoryOffCredit, MusterMetadata } from '../types/attendance';

export const INITIAL_METADATA: MusterMetadata = {
  unitName: 'GSRTC - પાલનપુર વિભાગ / વર્કશોપ (SRC MECHANIC)',
  depotName: 'મિકેનિક સ્ટાફ હાજરી પત્રક / STAFF ATTENDANCE MUSTER',
  month: '2026-10',
  division: 'પાલનપુર વિભાગ (PALANPUR DIVISION)',
  section: 'મિકેનિકલ અને મેન્ટેનન્સ શાખા (MECHANICAL SECTION)',
  authorizedOfficer: 'ડેપો મેનેજર / ડી.એમ.ઇ. / ટાઇમ કીપર',
};

export const INITIAL_STAFF: Employee[] = [
  {
    id: 'emp-1',
    srNo: 1,
    tokenNo: 'M-101',
    name: 'પટેલ રમેશભાઈ કે. (Ramesh Patel)',
    designation: 'હેડ મિકેનિક (Head Mechanic)',
    weeklyOffDay: 0, // Sunday
    clTotalYearly: 12,
    clUsedPrior: 3,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'OFF', 5: 'P', 6: 'P', 7: 'P',
      8: 'P', 9: 'P', 10: 'P', 11: 'OFF+P', // Worked on Off! Round circle
      12: 'P', 13: 'P', 14: 'P', 15: 'P', 16: 'CL', 17: 'P', 18: 'OFF',
      19: 'P', 20: 'P', 21: 'H', // Holiday
      22: 'P', 23: 'P', 24: 'P', 25: 'OFF', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: 'ઓફમાં ૧ ડ્યુટી જમા',
  },
  {
    id: 'emp-2',
    srNo: 2,
    tokenNo: 'M-102',
    name: 'ચૌધરી દિનેશભાઈ બી. (Dinesh Chaudhari)',
    designation: 'મિકેનિક - ૧ (Mechanic-I)',
    weeklyOffDay: 1, // Monday
    clTotalYearly: 12,
    clUsedPrior: 2,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'OFF+PN', // Worked night on Off! Round circle
      6: 'PN', 7: 'PN', 8: 'PN', 9: 'P', 10: 'P', 11: 'P',
      12: 'OFF', 13: 'P', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P',
      19: 'OFF', 20: 'P', 21: 'H+P', // Worked on Holiday! Earns holiday credit
      22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'OFF', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: 'તહેવાર + ઓફ ડ્યુટી જમા',
  },
  {
    id: 'emp-3',
    srNo: 3,
    tokenNo: 'M-103',
    name: 'પરમાર રાજેશકુમાર એચ. (Rajesh Parmar)',
    designation: 'ઓટો ઇલેક્ટ્રિશિયન (Auto Electrician)',
    weeklyOffDay: 2, // Tuesday
    clTotalYearly: 12,
    clUsedPrior: 4,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'OFF', 7: 'P',
      8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'OFF',
      14: 'P', 15: 'P+PN', // Double duty!
      16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'OFF', 21: 'H',
      22: 'P', 23: 'P', 24: 'CL', 25: 'CL', 26: 'P', 27: 'OFF', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: '૧૫ તારીખે ડબલ ડ્યુટી (P+PN)',
  },
  {
    id: 'emp-4',
    srNo: 4,
    tokenNo: 'M-104',
    name: 'ઠાકોર વિક્રમજી એસ. (Vikramji Thakor)',
    designation: 'ડીઝલ ફીટર (Diesel Fitter)',
    weeklyOffDay: 3, // Wednesday
    clTotalYearly: 12,
    clUsedPrior: 1,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'OFF',
      8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'OFF+P',
      15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'OFF',
      22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'OFF', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: '૧૪મી ઓફ હાજર',
  },
  {
    id: 'emp-5',
    srNo: 5,
    tokenNo: 'M-105',
    name: 'જોશી મહેશકુમાર ડી. (Mahesh Joshi)',
    designation: 'વેલ્ડર / બ્લેકસમિથ (Welder)',
    weeklyOffDay: 4, // Thursday
    clTotalYearly: 12,
    clUsedPrior: 5,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P',
      8: 'OFF', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
      15: 'OFF', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H',
      22: 'OFF', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P', 29: 'OFF', 30: 'P', 31: 'P'
    },
    remarks: 'નિયમિત હાજરી',
  },
  {
    id: 'emp-6',
    srNo: 6,
    tokenNo: 'M-106',
    name: 'પ્રજાપતિ સંજયભાઈ એમ. (Sanjay Prajapati)',
    designation: 'ટાયર વલ્કનાઇઝર (Vulcanizer)',
    weeklyOffDay: 5, // Friday
    clTotalYearly: 12,
    clUsedPrior: 2,
    days: {
      1: 'P', 2: 'OFF', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P',
      8: 'P', 9: 'OFF', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
      15: 'P', 16: 'OFF', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H',
      22: 'P', 23: 'OFF', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'OFF', 31: 'P'
    },
    remarks: '',
  },
  {
    id: 'emp-7',
    srNo: 7,
    tokenNo: 'M-107',
    name: 'સોલંકી વિજયભાઈ પી. (Vijay Solanki)',
    designation: 'મોટર મિકેનિક (Motor Mechanic)',
    weeklyOffDay: 6, // Saturday
    clTotalYearly: 12,
    clUsedPrior: 0,
    days: {
      1: 'P', 2: 'P', 3: 'OFF+PN', 4: 'PN', 5: 'PN', 6: 'PN', 7: 'P',
      8: 'P', 9: 'P', 10: 'OFF', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
      15: 'P', 16: 'P', 17: 'OFF', 18: 'P', 19: 'P', 20: 'P', 21: 'H+PN',
      22: 'P', 23: 'P', 24: 'OFF', 25: 'P', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'OFF'
    },
    remarks: 'નાઇટ શિફ્ટ + C-OFF',
  },
  {
    id: 'emp-8',
    srNo: 8,
    tokenNo: 'M-108',
    name: 'મેવાડા ભરતકુમાર આર. (Bharat Mevada)',
    designation: 'બોડી ફીટર / કારપેન્ટર (Body Fitter)',
    weeklyOffDay: 0, // Sunday
    clTotalYearly: 12,
    clUsedPrior: 4,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'OFF', 5: 'P', 6: 'P', 7: 'P',
      8: 'P', 9: 'P', 10: 'P', 11: 'OFF', 12: 'C-OFF', // Redeemed a C-Off!
      13: 'P', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'OFF',
      19: 'P', 20: 'P', 21: 'H', 22: 'P', 23: 'P', 24: 'P', 25: 'OFF', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: '૧૨ તારીખે C-OFF વાપરેલ',
  },
  {
    id: 'emp-9',
    srNo: 9,
    tokenNo: 'M-109',
    name: 'રાઠોડ પ્રકાશજી કે. (Prakash Rathod)',
    designation: 'વર્કશોપ હેલ્પર (Workshop Helper)',
    weeklyOffDay: 1, // Monday
    clTotalYearly: 12,
    clUsedPrior: 6,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'OFF', 6: 'P', 7: 'P',
      8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'OFF', 13: 'P', 14: 'P',
      15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'OFF', 20: 'A', // Absent
      21: 'H', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'OFF', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: '૨૦ તારીખે ગેરહાજર (A)',
  },
  {
    id: 'emp-10',
    srNo: 10,
    tokenNo: 'M-110',
    name: 'શાહ અતુલભાઈ સી. (Atul Shah)',
    designation: 'ઇન્વેન્ટરી / સ્ટોર કીપર (Store Keeper)',
    weeklyOffDay: 0, // Sunday
    clTotalYearly: 12,
    clUsedPrior: 1,
    days: {
      1: 'P', 2: 'P', 3: 'P', 4: 'OFF', 5: 'P', 6: 'P', 7: 'P',
      8: 'P', 9: 'P', 10: 'P', 11: 'OFF', 12: 'P', 13: 'P', 14: 'P',
      15: 'P', 16: 'P', 17: 'P', 18: 'OFF', 19: 'P', 20: 'P', 21: 'H',
      22: 'P', 23: 'P', 24: 'P', 25: 'OFF', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    remarks: 'સંપૂર્ણ હાજરી',
  },
];

export const INITIAL_C_OFF_CREDITS: CompensatoryOffCredit[] = [
  {
    id: 'coff-1',
    employeeId: 'emp-1',
    employeeName: 'પટેલ રમેશભાઈ કે. (Ramesh Patel)',
    tokenNo: 'M-101',
    dutyDate: '2026-10-11',
    dutyType: 'OFF+P',
    month: '2026-10',
    status: 'AVAILABLE',
    notes: 'ઓફના દિવસે ડેપોમાં એમર્જન્સી બસ રિપેરિંગ ડ્યુટી',
    createdAt: '2026-10-11T18:00:00Z',
  },
  {
    id: 'coff-2',
    employeeId: 'emp-2',
    employeeName: 'ચૌધરી દિનેશભાઈ બી. (Dinesh Chaudhari)',
    tokenNo: 'M-102',
    dutyDate: '2026-10-05',
    dutyType: 'OFF+PN',
    month: '2026-10',
    status: 'AVAILABLE',
    notes: 'ઓફના દિવસે નાઇટ શિફ્ટ એક્સ્ટ્રા ફરજ',
    createdAt: '2026-10-05T07:00:00Z',
  },
  {
    id: 'coff-3',
    employeeId: 'emp-2',
    employeeName: 'ચૌધરી દિનેશભાઈ બી. (Dinesh Chaudhari)',
    tokenNo: 'M-102',
    dutyDate: '2026-10-21',
    dutyType: 'H+P',
    month: '2026-10',
    status: 'AVAILABLE',
    notes: 'દિવાળી / જાહેર રજાના દિવસે સ્પેશિયલ બસ શિડ્યુલ ડ્યુટી',
    createdAt: '2026-10-21T17:00:00Z',
  },
  {
    id: 'coff-4',
    employeeId: 'emp-3',
    employeeName: 'પરમાર રાજેશકુમાર એચ. (Rajesh Parmar)',
    tokenNo: 'M-103',
    dutyDate: '2026-10-15',
    dutyType: 'P+PN',
    month: '2026-10',
    status: 'AVAILABLE',
    notes: 'દિવસ + નાઇટ ડબલ નોકરી',
    createdAt: '2026-10-15T23:00:00Z',
  },
  {
    id: 'coff-5',
    employeeId: 'emp-4',
    employeeName: 'ઠાકોર વિક્રમજી એસ. (Vikramji Thakor)',
    tokenNo: 'M-104',
    dutyDate: '2026-10-14',
    dutyType: 'OFF+P',
    month: '2026-10',
    status: 'AVAILABLE',
    notes: 'બ્રેકડાઉન એટેન્ડ કરવા માટે ઓફ દિવસે બોલાવેલ',
    createdAt: '2026-10-14T19:00:00Z',
  },
  {
    id: 'coff-6',
    employeeId: 'emp-8',
    employeeName: 'મેવાડા ભરતકુમાર આર. (Bharat Mevada)',
    tokenNo: 'M-108',
    dutyDate: '2026-09-20',
    dutyType: 'OFF+P',
    month: '2026-09',
    status: 'AVAILED',
    availedDate: '2026-10-12',
    availedInMonth: '2026-10',
    notes: 'સપ્ટેમ્બરમાં કરેલ ઓફ ડ્યુટી ૧૨-૧૦-૨૦૨૬ ના રોજ C-OFF તરીકે વાપરી લીધી',
    createdAt: '2026-09-20T18:00:00Z',
  },
];
