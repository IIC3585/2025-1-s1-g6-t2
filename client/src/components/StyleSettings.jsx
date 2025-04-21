import React, { useContext } from 'react';
import { StyleContext } from '../context/styleContext';
import { colors, fontSizes, fonts } from '../styles/themes';

const StyleSettings = () => {
  const { styles, setStyles } = useContext(StyleContext);

  const updateStyle = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <p className="text-2xl font-bold">Configuración de Estilo</p>

      {/* Tema claro/oscuro */}
      <div>
        <label className="block mb-2 font-semibold">Tema</label>
        <select
          className="border rounded p-2"
          value={styles.theme}
          onChange={e => updateStyle('theme', e.target.value)}
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </div>

      {/* Color principal */}
      <div>
        <label className="block mb-2 font-semibold">Color principal</label>
        <select
          className="border rounded p-2"
          value={styles.primaryColor}
          onChange={e => updateStyle('primaryColor', e.target.value)}
        >
          {Object.entries(colors).map(([name, value]) => (
            <option key={name} value={value}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tamaño de fuente */}
      <div>
        <label className="block mb-2 font-semibold">Tamaño de fuente</label>
        <select
          className="border rounded p-2"
          value={styles.fontSize}
          onChange={e => updateStyle('fontSize', e.target.value)}
        >
          {Object.entries(fontSizes).map(([name, value]) => (
            <option key={name} value={value}>
              {name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de letra */}
      <div>
        <label className="block mb-2 font-semibold">Tipo de letra</label>
        <select
          className="border rounded p-2"
          value={styles.fontFamily}
          onChange={e => updateStyle('fontFamily', e.target.value)}
        >
          {Object.entries(fonts).map(([name, value]) => (
            <option key={name} value={value}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Vista previa de botón */}
      <div>
        <label className="block mb-2 font-semibold">Vista previa de botón</label>
        <button
          className={`px-4 py-2 text-white bg-${styles.primaryColor} rounded hover:opacity-80`}
        >
          Botón de ejemplo
        </button>
      </div>
    </div>
  );
};

export default StyleSettings;