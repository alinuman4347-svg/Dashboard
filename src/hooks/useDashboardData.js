import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, onSnapshot, addDoc, setDoc, deleteDoc, doc, getDocs, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { RAW_DATA } from '../data/sampleData';
import { parseHours } from '../utils/parseHours';
import {
  getCompensatoryStatus, isCompDateMissing, isApproved, getMonthYear,
  getMonthSortKey, parseDate, normalizeEmployee,
} from '../utils/statusUtils';

// Firestore collection that holds every dashboard record.
const COLLECTION = 'records';

// Strip the local-only id fields before writing a record to Firestore — the
// document id IS the identity, so we never store it inside the document.
function toFirestore(raw) {
  const rest = { ...raw };
  delete rest._id;
  delete rest.id;
  return rest;
}

function enrichRow(row) {
  return {
    ...row,
    id: row._id,
    employeeName: normalizeEmployee(row.employeeName),
    totalHoursNumeric: parseHours(row.totalHours),
    compensatoryStatus: getCompensatoryStatus(row.compensatoryDate),
    approved: isApproved(row.muneebApproval),
    monthYear: getMonthYear(row.date),
    monthSortKey: getMonthSortKey(row.date),
    parsedDate: parseDate(row.date),
  };
}

export function useDashboardData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Guard so the one-time seed of sample data only ever runs once.
  const seededRef = useRef(false);

  // Subscribe to Firestore. onSnapshot is the single source of truth: every
  // add/update/delete writes to Firestore, and this listener pushes the new
  // state back into React — so the UI always mirrors what's saved online.
  useEffect(() => {
    const col = collection(db, COLLECTION);
    const unsubscribe = onSnapshot(
      col,
      async (snapshot) => {
        // First load with an empty collection → seed the sample data once.
        if (snapshot.empty && !seededRef.current) {
          seededRef.current = true;
          try {
            console.log('[Firebase] No records found — seeding sample data…');
            const batch = writeBatch(db);
            RAW_DATA.forEach((row) => batch.set(doc(col), toFirestore(row)));
            await batch.commit();
            // The seed writes will retrigger this listener with the new docs.
          } catch (err) {
            console.error('[Firebase] Failed to seed sample data:', err);
            setError(err);
            setLoading(false);
          }
          return;
        }
        const rows = snapshot.docs.map((d) => ({ ...d.data(), _id: d.id }));
        setRecords(rows);
        setError(null);
        setLoading(false);
        console.log(`[Firebase] Loaded ${rows.length} record(s) from Firestore.`);
      },
      (err) => {
        console.error('[Firebase] Failed to load records:', err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const allData = useMemo(() => records.map(enrichRow), [records]);

  const [filters, setFilters] = useState({
    employee: '', dateFrom: '', dateTo: '', approval: '', month: '', search: '',
  });

  const filteredData = useMemo(() => {
    return allData.filter(row => {
      if (filters.employee && row.employeeName !== filters.employee) return false;
      if (filters.approval === 'approved' && !row.approved) return false;
      if (filters.approval === 'pending' && row.approved) return false;
      if (filters.month && row.monthYear !== filters.month) return false;
      if (filters.dateFrom && row.parsedDate) {
        const from = parseDate(filters.dateFrom);
        if (from && row.parsedDate < from) return false;
      }
      if (filters.dateTo && row.parsedDate) {
        const to = parseDate(filters.dateTo);
        if (to && row.parsedDate > to) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !row.employeeName.toLowerCase().includes(q) &&
          !String(row.date).toLowerCase().includes(q) &&
          !String(row.muneebApproval).toLowerCase().includes(q) &&
          !String(row.totalHours).toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [allData, filters]);

  const kpis = useMemo(() => {
    const totalHours = filteredData.reduce((s, r) => s + r.totalHoursNumeric, 0);
    // Remaining = all hours where comp time has NOT been used yet.
    const remainingHours = filteredData
      .filter(r => r.compensatoryStatus === 'Not Use')
      .reduce((s, r) => s + r.totalHoursNumeric, 0);
    // Missing = comp date is empty/null/"—" (future dates don't count as missing).
    const missingCompCount = filteredData.filter(r => isCompDateMissing(r.compensatoryDate)).length;
    return {
      totalHours:     Math.round(totalHours     * 100) / 100,
      remainingHours: Math.round(remainingHours * 100) / 100,
      missingCompCount,
    };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const empMap = {};
    filteredData.forEach(r => {
      empMap[r.employeeName] = (empMap[r.employeeName] || 0) + r.totalHoursNumeric;
    });
    const employeeHours = Object.entries(empMap)
      .map(([name, hours]) => ({ name, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours);

    const monthMap = {};
    const monthSortMap = {};
    filteredData.forEach(r => {
      if (!monthMap[r.monthYear]) { monthMap[r.monthYear] = 0; monthSortMap[r.monthYear] = r.monthSortKey; }
      monthMap[r.monthYear] += r.totalHoursNumeric;
    });
    const monthHours = Object.entries(monthMap)
      .map(([month, hours]) => ({ month, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => monthSortMap[a.month] - monthSortMap[b.month]);

    const dateMap = {};
    filteredData.forEach(r => {
      const key = r.parsedDate ? r.parsedDate.toISOString().slice(0, 10) : String(r.date);
      dateMap[key] = (dateMap[key] || 0) + r.totalHoursNumeric;
    });
    const dateHours = Object.entries(dateMap)
      .map(([date, hours]) => ({ date, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const approvalData = [
      { name: 'Approved',     value: filteredData.filter(r => r.approved).length,  fill: '#06b6d4' },
      { name: 'Not Approved', value: filteredData.filter(r => !r.approved).length, fill: '#f87171' },
    ];
    const compData = [
      { name: 'Use Time', value: filteredData.filter(r => r.compensatoryStatus === 'Use Time').length, fill: '#10b981' },
      { name: 'Not Use',  value: filteredData.filter(r => r.compensatoryStatus === 'Not Use').length,  fill: '#f59e0b' },
    ];
    return { employeeHours, monthHours, dateHours, approvalData, compData };
  }, [filteredData]);

  const insights = useMemo(() => {
    const list = [];
    if (chartData.employeeHours.length > 0) {
      const top = chartData.employeeHours[0];
      list.push(`${top.name} worked the highest total weekend hours (${top.hours}h).`);
    }
    if (chartData.monthHours.length > 0) {
      const topMonth = [...chartData.monthHours].sort((a, b) => b.hours - a.hours)[0];
      list.push(`Most weekend work happened in ${topMonth.month} (${topMonth.hours}h total).`);
    }
    const approvedCount = filteredData.filter(r => r.approved).length;
    if (approvedCount === filteredData.length && filteredData.length > 0) {
      list.push('All entries are approved by Muneeb.');
    } else if (filteredData.length > 0) {
      const pct = Math.round((approvedCount / filteredData.length) * 100);
      list.push(`${pct}% of entries are approved by Muneeb (${approvedCount} of ${filteredData.length}).`);
    }
    const notAdded = filteredData.filter(r => isCompDateMissing(r.compensatoryDate)).length;
    if (notAdded > 0) list.push(`${notAdded} entr${notAdded === 1 ? 'y' : 'ies'} still need a compensatory date.`);
    return list;
  }, [filteredData, chartData]);

  const meta = useMemo(() => {
    const employees = [...new Set(allData.map(r => r.employeeName))].sort();
    const monthSeen = {};
    allData.forEach(r => { monthSeen[r.monthYear] = r.monthSortKey; });
    const months = Object.keys(monthSeen).filter(Boolean).sort((a, b) => monthSeen[a] - monthSeen[b]);
    return { employees, months };
  }, [allData]);

  // CRUD — each writes to Firestore. The onSnapshot listener above then pushes
  // the updated collection back into state, so the table/KPIs refresh automatically.
  const addRecord = useCallback(async (raw) => {
    try {
      const ref = await addDoc(collection(db, COLLECTION), toFirestore(raw));
      console.log('[Firebase] Record added:', ref.id);
    } catch (err) {
      console.error('[Firebase] Failed to add record:', err);
      alert(`Could not save to Firebase.\n\nError: ${err?.code || err?.message || err}`);
    }
  }, []);

  const updateRecord = useCallback(async (id, raw) => {
    try {
      await setDoc(doc(db, COLLECTION, String(id)), toFirestore(raw));
      console.log('[Firebase] Record updated:', id);
    } catch (err) {
      console.error('[Firebase] Failed to update record:', err);
      alert('Could not update the record in Firebase. Check the console for details.');
    }
  }, []);

  const deleteRecord = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION, String(id)));
      console.log('[Firebase] Record deleted:', id);
    } catch (err) {
      console.error('[Firebase] Failed to delete record:', err);
      alert('Could not delete the record in Firebase. Check the console for details.');
    }
  }, []);

  const resetData = useCallback(async () => {
    if (!window.confirm('Reset all data to the original sample records? This cannot be undone.')) return;
    try {
      const col = collection(db, COLLECTION);
      // Delete every existing document, then re-seed the sample data.
      const existing = await getDocs(col);
      const batch = writeBatch(db);
      existing.forEach((d) => batch.delete(d.ref));
      RAW_DATA.forEach((row) => batch.set(doc(col), toFirestore(row)));
      await batch.commit();
      console.log('[Firebase] Data reset to sample records.');
    } catch (err) {
      console.error('[Firebase] Failed to reset data:', err);
      alert('Could not reset data in Firebase. Check the console for details.');
    }
  }, []);

  return {
    filteredData, kpis, chartData, insights, meta,
    filters, setFilters, loading, error,
    addRecord, updateRecord, deleteRecord, resetData,
  };
}
