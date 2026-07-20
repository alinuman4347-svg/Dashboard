import { useState, useRef, useEffect, useMemo } from 'react';
import { X, Check, ChevronDown, Plus } from 'lucide-react';

const FIELD = 'w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white';

// Searchable dropdown that supports selecting one or many employees.
// - multiple=true: chips + "Select All" / "Clear All", stays open after each pick.
// - multiple=false: single pick, closes the dropdown immediately (used for editing).
export default function EmployeeMultiSelect({ employees, selected, onChange, multiple = true, placeholder = 'Select or search…' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return employees;
    return employees.filter(e => e.toLowerCase().includes(q));
  }, [employees, trimmedQuery]);

  // Typed a name that isn't in the existing list yet? Offer to add it as a new employee.
  const canAddNew = trimmedQuery.length > 0
    && !employees.some(e => e.toLowerCase() === trimmedQuery.toLowerCase())
    && !selected.some(s => s.toLowerCase() === trimmedQuery.toLowerCase());

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function toggle(name) {
    if (!multiple) {
      onChange([name]);
      setOpen(false);
      setQuery('');
      return;
    }
    if (selected.includes(name)) onChange(selected.filter(s => s !== name));
    else onChange([...selected, name]);
  }

  function remove(name, e) {
    e.stopPropagation();
    onChange(selected.filter(s => s !== name));
  }

  function selectAll(e) {
    e.stopPropagation();
    onChange([...employees]);
  }

  function clearAll(e) {
    e.stopPropagation();
    onChange([]);
  }

  function addNew(name) {
    toggle(name);
    setQuery('');
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Backspace' && !query && selected.length > 0) {
      onChange(selected.slice(0, -1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canAddNew) addNew(trimmedQuery);
      else if (filtered.length === 1) toggle(filtered[0]);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`${FIELD} flex flex-wrap items-center gap-1 cursor-text min-h-[38px]`}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
      >
        {selected.map(name => (
          <span
            key={name}
            className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-md pl-2 pr-1 py-0.5 text-xs font-medium max-w-full"
          >
            <span className="truncate">{name}</span>
            <button
              type="button"
              onClick={e => remove(name, e)}
              className="p-0.5 rounded hover:bg-cyan-100 text-cyan-500 hover:text-cyan-700 flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] border-none outline-none bg-transparent text-sm py-0.5"
        />
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-auto" />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto scrollbar-thin">
          {multiple && (
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 sticky top-0 bg-white">
              <button type="button" onClick={selectAll} className="text-xs font-semibold text-cyan-600 hover:underline">
                Select All
              </button>
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-gray-400 hover:underline">
                Clear All
              </button>
            </div>
          )}
          {canAddNew && (
            <div
              onClick={() => addNew(trimmedQuery)}
              className="px-3 py-2 text-sm cursor-pointer flex items-center gap-1.5 text-cyan-600 font-medium hover:bg-cyan-50 border-b border-gray-100"
            >
              <Plus className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Add "{trimmedQuery}" as new employee</span>
            </div>
          )}
          {filtered.length === 0 && !canAddNew ? (
            <div className="px-3 py-2 text-xs text-gray-400">No matches</div>
          ) : (
            filtered.map(name => {
              const isSelected = selected.includes(name);
              return (
                <div
                  key={name}
                  onClick={() => toggle(name)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-cyan-50 ${
                    isSelected ? 'bg-cyan-50/60 text-cyan-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
