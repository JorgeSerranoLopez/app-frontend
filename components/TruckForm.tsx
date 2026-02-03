import React, { useEffect, useState } from 'react';

interface Props {
  initial?: { name: string; type: string; capacity: number } | null;
  onSubmit: (data: { name: string; type: string; capacity: number }) => void;
}

export const TruckForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('S');
  const [capacity, setCapacity] = useState(36);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setCapacity(initial.capacity);
    } else {
      setName('');
      setType('S');
      setCapacity(36);
    }
  }, [initial]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        className="border rounded-lg px-3 py-2"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="border rounded-lg px-3 py-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="TMP">TMP</option>
      </select>
      <input
        type="number"
        className="border rounded-lg px-3 py-2"
        placeholder="Capacidad"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
      />
      <button
        onClick={() => onSubmit({ name, type, capacity })}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Guardar
      </button>
    </div>
  );
}
