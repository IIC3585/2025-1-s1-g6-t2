import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from 'react';
import ImageProcessor from './components/ImageProcessor';

function App() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
  <>
    {/* Aquí se inserta tu componente de procesamiento de imágenes */}
    <ImageProcessor />
  </>
);

}

export default App
