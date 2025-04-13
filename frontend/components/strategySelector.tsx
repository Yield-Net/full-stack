'use client';

import { useState } from 'react';

export default function StrategySelector({ onSelect }) {
  const [selected, setSelected] = useState('balanced');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="mb-4">
      <label className="mr-2 font-medium">Select Strategy:</label>
      <select
        value={selected}
        onChange={handleChange}
        className="border px-3 py-1 rounded"
      >
        <option value="conservative">Conservative</option>
        <option value="balanced">Balanced</option>
        <option value="aggressive">Aggressive</option>
      </select>
    </div>
  );
}