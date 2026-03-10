import React, { useState } from 'react';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 11)); // March 11, 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // 0 = Sunday, 1 = Monday, etc. Adjust for Monday start:
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectedDay = 11;

  return (
    <div className="bg-[#111418] border border-[#21262d] rounded-2xl p-6 shadow-2xl font-sans">
      <div className="flex justify-between items-center mb-6 text-[var(--bg-color)]">
        <h3 className="font-semibold px-2 text-[#2f81f7]">{monthNames[currentDate.getMonth()]} <span className="text-[var(--text-muted)] font-normal">{currentDate.getFullYear()}</span></h3>
        <div className="flex gap-4 pr-2">
          <button onClick={handlePrevMonth} className="text-[var(--text-muted)] hover:text-white transition-colors">&lt;</button>
          <button onClick={handleNextMonth} className="text-[var(--text-muted)] hover:text-white transition-colors">&gt;</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs font-medium text-[var(--text-muted)]">
        <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-[var(--text-muted)]">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = currentDate.getMonth() === 2 && day === selectedDay; // Only hardcode active state for March
          const isPast = day < selectedDay && currentDate.getMonth() === 2;
          
          if (isSelected) {
            return <div key={day} className="p-2 bg-[#2f81f7] text-white rounded-lg shadow-sm font-bold cursor-pointer transition-transform hover:scale-105">{day}</div>;
          }
          if (isPast) {
             return <div key={day} className="p-2 bg-[#21262d] text-white rounded-lg cursor-pointer">{day}</div>;
          }
          if (day > 15 && day < 20 && currentDate.getMonth() === 2) {
             return <div key={day} className="p-2 bg-[#30363d] text-white rounded-lg cursor-pointer -mx-1">{day}</div>;
          }
          
          return (
            <div key={day} className="p-2 hover:text-white cursor-pointer rounded-lg hover:bg-[#21262d] transition-colors relative flex justify-center items-center">
                {day}
                {day === 10 && currentDate.getMonth() === 2 && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#2f81f7]"></div>}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
         <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--bg-color)] font-semibold">Wed <span className="text-xs text-[var(--text-muted)] font-normal">11</span></span>
            <div className="bg-[#21262d] rounded-md p-0.5 flex text-xs">
              <button className="px-2 py-1 rounded bg-[#010409] text-white shadow-sm transition-colors">12h</button>
              <button className="px-2 py-1 rounded text-[var(--text-muted)] hover:text-white transition-colors">24h</button>
            </div>
         </div>
         <div className="space-y-2">
            {['9:00pm', '9:30pm', '10:00pm', '10:30pm'].map(time => (
               <button key={time} className="w-full py-2.5 px-4 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-muted)] hover:text-white hover:border-[#2f81f7] hover:bg-[#2f81f7]/10 transition-colors text-left font-medium">
                   {time}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
}
