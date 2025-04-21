import React, { useState } from 'react';
import ImageProcessor from './components/ImageProcessor';
import Gallery from './components/Gallery';
import About from './components/About';

function App() {
  const [currentSection, setCurrentSection] = useState('home'); // Controla la sección visible

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <ImageProcessor />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      default:
        return <ImageProcessor />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <nav>
          <ul>
            <li><a href="#" onClick={() => setCurrentSection('home')}>¡Comencemos!</a></li>
            <li><a href="#" onClick={() => setCurrentSection('gallery')}>Galería</a></li>
            <li><a href="#" onClick={() => setCurrentSection('about')}>Nosotros</a></li>
          </ul>
        </nav>
      </header>

      {renderSection()} {/* Renderiza la sección actual */}

    </div>
  );
}

export default App;
