import { useMemo, useState } from 'react';
import { X, Plus, Pencil, Trash2, Check } from 'lucide-react';

const FIELD = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white';

export default function EmployeeManagementModal({ employees, onAdd, onRename, onRemove, onSetActive, onClose }) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const sorted = useMemo(
    () => [...employees].sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );

  async function handleAdd(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (await onAdd(name)) setNewName('');
  }

  function startEdit(emp) {
    setEditingId(emp.id);
    setEditValue(emp.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue('');
  }

  async function saveEdit(emp) {
    const name = editValue.trim();
    if (!name || name === emp.name) { cancelEdit(); return; }
    if (await onRename(emp.id, emp.name, name)) cancelEdit();
  }

  function handleRemove(emp) {
    if (window.confirm(`Remove "${emp.name}" from the employee list?\n\nExisting records for them will be kept.`)) {
      onRemove(emp.id, emp.name);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-base font-bold text-gray-800">Manage Employees</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Add employee */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="New employee name"
              className={FIELD}
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="flex-shrink-0 flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>

          {/* Roster */}
          <div className="border border-gray-100 rounded-lg divide-y divide-gray-50 max-h-80 overflow-y-auto scrollbar-thin">
            {sorted.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8 px-3">
                No employees yet. Add one above.
              </p>
            ) : (
              sorted.map(emp => {
                const isActive = emp.active !== false;
                const isEditing = editingId === emp.id;
                return (
                  <div key={emp.id} className="flex items-center gap-2 px-3 py-2.5">
                    {isEditing ? (
                      <>
                        <input
                          autoFocus
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(emp);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 min-w-0 border border-cyan-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <button
                          type="button" onClick={() => saveEdit(emp)} title="Save"
                          className="flex-shrink-0 p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button" onClick={cancelEdit} title="Cancel"
                          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 min-w-0 truncate text-sm font-medium text-gray-800">
                          {emp.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSetActive(emp.id, !isActive)}
                          className={`flex-shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          type="button" onClick={() => startEdit(emp)} title="Rename"
                          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button" onClick={() => handleRemove(emp)} title="Remove"
                          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <p className="text-xs text-gray-400">
            Inactive employees are hidden from the Add Record picker but keep their existing records.
          </p>

          <button
            type="button" onClick={onClose}
            className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
