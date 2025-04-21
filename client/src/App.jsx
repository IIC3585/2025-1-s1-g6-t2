import React, { useState, useEffect } from 'react';
import ImageProcessor from './components/ImageProcessor';
import Gallery from './components/Gallery';
import About from './components/About';
import Settings from './components/Settings';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [styleSettings, setStyleSettings] = useState({
    theme: 'light',
    textColor: '#000000',      // ✅ nuevo campo para el color del texto
    borderRadius: 'md',
    font: 'sans',
  });

  // Aplica las preferencias guardadas en localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('styleSettings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setStyleSettings(parsed);
      // Aplica el modo oscuro si está activado
      document.documentElement.classList.toggle('dark', parsed.theme === 'dark');
    }
  }, []);

  // Actualiza el color del texto globalmente usando una variable CSS
  useEffect(() => {
    document.documentElement.style.setProperty('--custom-text-color', styleSettings.textColor || '#000000');
    document.documentElement.classList.toggle('dark', styleSettings.theme === 'dark');
  }, [styleSettings]);

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <ImageProcessor styleSettings={styleSettings} />;
      case 'gallery':
        return <Gallery styleSettings={styleSettings} />;
      case 'about':
        return <About styleSettings={styleSettings} />;
      case 'settings':
        return <Settings styleSettings={styleSettings} setStyleSettings={setStyleSettings} />;
      default:
        return <ImageProcessor styleSettings={styleSettings} />;
    }
  };

  // Clases dinámicas para fuente y bordes
  const fontClass = styleSettings.font === 'serif'
    ? 'font-serif'
    : styleSettings.font === 'mono'
    ? 'font-mono'
    : 'font-sans';

  const borderRadiusClass = styleSettings.borderRadius === 'lg'
    ? 'rounded-lg'
    : styleSettings.borderRadius === 'xl'
    ? 'rounded-xl'
    : 'rounded-md';

    return (
      <div className={`min-h-screen ${fontClass} ${borderRadiusClass}`}>
        <header className="p-4 shadow">
          <nav>
            <ul className="flex gap-4">
              <li><a href="#" onClick={() => setCurrentSection('home')}>¡Comencemos!</a></li>
              <li><a href="#" onClick={() => setCurrentSection('gallery')}>Galería</a></li>
              <li><a href="#" onClick={() => setCurrentSection('about')}>Nosotros</a></li>
              <li><a href="#" onClick={() => setCurrentSection('settings')}>Estilos</a></li>
            </ul>
          </nav>
        </header>
    
        <main
          className="flex flex-col items-center justify-center p-6 text-[var(--custom-text-color)]"
          style={{
            fontFamily: styleSettings.font === 'serif'
              ? 'ui-serif, Georgia'
              : styleSettings.font === 'mono'
              ? 'ui-monospace, SFMono-Regular'
              : 'ui-sans-serif, system-ui',
          }}
        >
          {renderSection()}
        </main>
      </div>
    );
    
}

export default App;
