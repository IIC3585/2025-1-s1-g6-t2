import React, { useEffect, useState, useRef } from 'react';
// Importa el módulo WASM desde public/pkg
import init, { grayscale, invert } from '../../public/pkg/image_filter.js';
import { saveImage } from '../db';

const ImageProcessor = () => {
  console.log("ImageProcessor cargado");
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [filter, setFilter] = useState('grayscale');

  // Referencia al elemento canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadWasm() {
      console.log("⏳ Cargando WASM...");
      await init();
      console.log("✅ WASM cargado");
      setWasmLoaded(true);
    }
    loadWasm();
  }, []);

  // Efecto para actualizar el canvas cada vez que processedData cambia.
  useEffect(() => {
    if (canvasRef.current && processedData) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(processedData, 0, 0);
    }
  }, [processedData]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setImageData({ data, width: canvas.width, height: canvas.height });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!imageData) return;
    let result;
    if (filter === 'grayscale') {
      result = grayscale(imageData.data.data); // La función espera un array de píxeles
    } else if (filter === 'invert') {
      result = invert(imageData.data.data);
    }
    const newImageData = new ImageData(
      new Uint8ClampedArray(result),
      imageData.width,
      imageData.height
    );
    // Actualiza el estado con la imagen procesada
    setProcessedData(newImageData);
    notifyProcessComplete();
    saveImage({
      data: Array.from(newImageData.data),
      width: newImageData.width,
      height: newImageData.height
    });
  };

  function notifyProcessComplete() {
    if (Notification.permission === 'granted') {
      new Notification('Procesamiento de imagen', {
        body: '¡La imagen se ha procesado correctamente!'
      });
    }
  }

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div>
      <h2>Procesamiento de Imágenes con WASM</h2>
      {!wasmLoaded && <p>Cargando módulo WASM...</p>}
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {imageData && (
        <>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="grayscale">Escala de grises</option>
            <option value="invert">Invertir colores</option>
          </select>
          <button onClick={processImage}>Procesar Imagen</button>
        </>
        
      )}
      {/* El canvas donde se renderizará la imagen procesada */}
      {processedData && (
        <canvas
          ref={canvasRef}
          width={processedData.width}
          height={processedData.height}
          style={{ border: '1px solid black' }}
        />

        
        

      )}
    </div>
  );
};

export default ImageProcessor;

