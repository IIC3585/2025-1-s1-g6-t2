import React, { useEffect, useState } from 'react';

const defaultStyles = {
  theme: 'light',
  fontFamily: 'sans',
  borderRadius: 'rounded',
  textColor: '#000000',
};

const Settings = ({ onSaveSettings }) => {
  const [tempSettings, setTempSettings] = useState(defaultStyles);
  const [previewSettings, setPreviewSettings] = useState(defaultStyles);

  useEffect(() => {
    const saved = localStorage.getItem('userStyles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTempSettings(parsed);
      setPreviewSettings(parsed);
      applyStyles(parsed);
    }
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...tempSettings, [key]: value };
    setTempSettings(updated);
    setPreviewSettings(updated); 
  };

  const applyStyles = (settings) => {
    const root = document.documentElement;
    root.className = '';
    root.classList.add(settings.theme);
    root.style.setProperty('--tw-text-opacity', '1');
    root.style.setProperty('--custom-text-color', settings.textColor);
    document.body.style.fontFamily = getFontFamily(settings.fontFamily);

  };

  const getFontFamily = (key) => {
    switch (key) {
      case 'sans':
        return 'ui-sans-serif, system-ui';
      case 'serif':
        return 'ui-serif, Georgia';
      case 'mono':
        return 'ui-monospace, SFMono-Regular';
      default:
        return 'ui-sans-serif, system-ui';
    }
  };

  const handleSave = () => {
    localStorage.setItem('userStyles', JSON.stringify(tempSettings));
    applyStyles(tempSettings);
    if (onSaveSettings) onSaveSettings(tempSettings);
    alert('Estilos guardados');
  };

  const handleReset = () => {
    setTempSettings(defaultStyles);
    setPreviewSettings(defaultStyles);
    localStorage.removeItem('userStyles');
    applyStyles(defaultStyles);
  };

  return (
    <div className="p-6" style={{ color: previewSettings.textColor }}>
      <h2 className="text-xl font-bold mb-4">Configuración de Estilos</h2>

      <div className="mb-4">
        <label className="block mb-1">Tema</label>
        <select
          className="p-2 border rounded text-black"
          value={tempSettings.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Fuente de Botón</label>
        <select
          className="p-2 border rounded text-black"
          value={tempSettings.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Mono</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Redondez de bordes</label>
        <select
          className="p-2 border rounded text-black"
          value={tempSettings.borderRadius}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
        >
          <option value="rounded">Redondeado</option>
          <option value="square">Cuadrado</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Color de letra</label>
        <input
          type="color"
          value={tempSettings.textColor}
          onChange={(e) => handleChange('textColor', e.target.value)}
        />
      </div>

      <div className="mb-6">
        <p className="mb-2">Vista previa:</p>
        <button
          className={`p-2 ${
            previewSettings.borderRadius === 'rounded' ? 'rounded-2xl' : ''
          }`}
          style={{
            backgroundColor: previewSettings.theme === 'dark' ? '#333' : '#ddd',
            color: previewSettings.textColor,
            fontFamily: getFontFamily(previewSettings.fontFamily),
          }}
        >
          Botón de ejemplo
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
};

export default Settings;