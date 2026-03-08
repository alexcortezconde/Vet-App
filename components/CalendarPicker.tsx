
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface CalendarPickerProps {
  value: string; // DD/MM/YYYY
  onChange: (date: string) => void;
  minDate?: Date;
}

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const DAYS = ['D','L','M','M','J','V','S'];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, minDate }) => {
  const parseInitialView = () => {
    const parts = value.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const y = parseInt(parts[2]);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const [viewDate, setViewDate] = useState(parseInitialView);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return date < min;
  };

  const isSelected = (day: number) => {
    const formatted = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    return formatted === value;
  };

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    const formatted = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    onChange(formatted);
  };

  return (
    <div className="bg-white dark:bg-darkCard border border-slate-100 dark:border-slate-800 p-6 rounded-4xl shadow-2xl animate-in zoom-in-95">
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="font-black text-secondary dark:text-slate-100 text-sm">
          {MONTHS[month]} {year}
        </span>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 bg-crema dark:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-crema dark:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d, i) => (
          <span key={i} className="text-[9px] font-black text-slate-300 uppercase">{d}</span>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <button
            key={day}
            onClick={() => handleSelect(day)}
            disabled={isDisabled(day)}
            className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
              isDisabled(day)
                ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                : isSelected(day)
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-secondary dark:text-slate-400 hover:bg-crema dark:hover:bg-slate-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
