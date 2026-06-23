import { formatHours } from './parseHours';
import { getCompensatoryStatus, formatDisplayDate } from './statusUtils';

export function exportToCSV(data, filename = 'weekend_work_report.csv') {
  const headers = [
    'Date', 'Employee Name', 'Start Time', 'End Time',
    'Total Hours', 'Muneeb Approval', 'Compensatory Date', 'Status'
  ];

  const rows = data.map(row => [
    formatDisplayDate(row.date),
    row.employeeName,
    row.startTime,
    row.endTime,
    formatHours(row.totalHoursNumeric),
    row.muneebApproval,
    row.compensatoryDate ? formatDisplayDate(row.compensatoryDate) : '',
    getCompensatoryStatus(row.compensatoryDate),
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printReport() {
  window.print();
}
