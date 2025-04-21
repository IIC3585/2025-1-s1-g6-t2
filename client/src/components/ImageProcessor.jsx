import React, { useEffect, useState, useRef } from 'react';
// Importa el módulo WASM desde public/pkg
import init, { grayscale, invert, sepia, brightness, contrast } from '../../public/pkg/image_filter.js';
import { saveImage, getImages, clearImages } from '../db';
import './ImageProcessor.css'; 

const ImageProcessor = () => {
  console.log("ImageProcessor cargado");
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [imageData, setImageData] = useState(null); // Datos de la imagen original
  const [processedData, setProcessedData] = useState(null); // Imagen procesada
  const [filter, setFilter] = useState('original');
  const [brightnessFactor, setBrightnessFactor] = useState(1); // Control de brillo
  const [contrastFactor, setContrastFactor] = useState(1); // Control de contraste
  const [imageProcessed, setImageProcessed] = useState(false); // Estado para controlar si la imagen está procesada
  
  const [originalImageData, setOriginalImageData] = useState(null); // Almacena la imagen original

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
        setOriginalImageData({ data, width: canvas.width, height: canvas.height }); // Guardamos la imagen original
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!imageData || imageData.width === 0 || imageData.height === 0) return;
    let result;
    if (filter === 'grayscale') {
      result = grayscale(imageData.data.data); // La función espera un array de píxeles
    } else if (filter === 'invert') {
      result = invert(imageData.data.data);
    } else if (filter === 'sepia') {
      result = sepia(imageData.data.data);
    } else if (filter === 'brightness') {
      result = brightness(imageData.data.data, brightnessFactor);
    } else if (filter === 'contrast') {
      result = contrast(imageData.data.data, contrastFactor);
    } else if (filter === 'original') {
      result = originalImageData.data.data; // Restaurar la imagen original
    }

    if (!result || result.length === 0) return;

    const newImageData = new ImageData(
      new Uint8ClampedArray(result),
      imageData.width,
      imageData.height
    );
    setProcessedData(newImageData);
    setImageProcessed(true); // Indicar que la imagen fue procesada
    // notifyProcessComplete();
  };

  const saveImageData = () => {
    if (processedData) {
      console.log("Guardando imagen...");
      saveImage({
        data: Array.from(processedData.data),
        width: processedData.width,
        height: processedData.height
      });
      console.log("width", processedData.width);
      console.log("height", processedData.height);
      alert('Imagen guardada');
    }
  };

  const loadSavedImages = () => {
    setIsImagesLoaded(true); // Marca que hemos cargado las imágenes
    getImages().then(images => {
      console.log("Imágenes guardadas:", images);
      images.forEach(image => {
        console.log("width imagen guardada", image.width);
        console.log("height imagen guardada", image.height);
      });
      const validImages = images.filter(image => image.width > 0 && image.height > 0);
      setSavedImages(validImages);
    });
  };

  const emptyDatabase = () => {
    clearImages().then(() => {
      setSavedImages([]); // Vaciar el estado de las imágenes guardadas
      setClearMessage('La base de datos ha sido vaciada exitosamente.');
    });
  };

  return (
    <div>
      <h1>DCCPhotoEdition</h1>
      <h4>Procesamiento de Imágenes con WASM</h4>
      {!wasmLoaded && <p>Cargando módulo WASM...</p>}
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {imageData && (
        <>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="original">Original</option> {/* Opción para volver al color original */}
            <option value="grayscale">Escala de grises</option>
            <option value="invert">Invertir colores</option>
            <option value="sepia">Sepia</option>
            <option value="brightness">Brillo</option>
            <option value="contrast">Contraste</option>
          </select>

          {/* Ajustes de brillo y contraste */}
          {filter === 'brightness' && (
            <div>
              <label>Brillo:</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={brightnessFactor}
                onChange={(e) => setBrightnessFactor(e.target.value)}
              />
            </div>
          )}

          {filter === 'contrast' && (
            <div>
              <label>Contraste:</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={contrastFactor}
                onChange={(e) => setContrastFactor(e.target.value)}
              />
            </div>
          )}

          <button onClick={processImage}>Procesar Imagen</button>
          {imageProcessed && <button onClick={saveImageData}>Guardar Imagen</button>} {/* Solo mostrar después de procesar */}
        </>
      )}
      {/* El canvas donde se renderizará la imagen procesada */}
      <div className='canvas-container'>
        {processedData && (
          <div className='canvas-wrapper'>
            <h3>Imagen Procesada</h3>
            <canvas
              ref={canvasRef}
              width={processedData.width}
              height={processedData.height}
              style={{ border: '1px solid black' }}
            />
          </div>
        )}
      </div>

      {/* Mostrar imágenes guardadas */}
      
    </div>
  );
};

export default ImageProcessor;
