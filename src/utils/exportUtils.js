import { formatMinutes } from './parseHours';
import { formatDisplayDate } from './statusUtils';

export function exportToCSV(data, filename = 'weekend_work_report.csv') {
  const headers = [
    'Date', 'Employee Name', 'Start Time', 'End Time',
    'Earned Hours', 'Used Hours', 'Remaining Hours', 'Muneeb Approval', 'Status'
  ];

  const rows = data.map(row => [
    formatDisplayDate(row.date),
    row.employeeName,
    row.startTime,
    row.endTime,
    formatMinutes(row.earnedMinutes),
    formatMinutes(row.usedMinutes),
    formatMinutes(row.remainingMinutes),
    row.muneebApproval,
    row.compensatoryStatus,
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
