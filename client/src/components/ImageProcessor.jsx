import React, { useEffect, useState, useRef } from 'react';
import init, { grayscale, invert, sepia, brightness, contrast } from '../../public/pkg/image_filter.js';
import { saveImage } from '../db';
import './ImageProcessor.css';

const defaultStyles = {
  theme: 'light',
  fontFamily: 'sans',
  borderRadius: 'rounded',
  textColor: '#000000',
};

const ImageProcessor = ({ styleSettings }) => {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [filter, setFilter] = useState('original');
  const [brightnessFactor, setBrightnessFactor] = useState(1);
  const [contrastFactor, setContrastFactor] = useState(1);
  const [imageProcessed, setImageProcessed] = useState(false);
  const [originalImageData, setOriginalImageData] = useState(null);
  const [previewSettings, setPreviewSettings] = useState(defaultStyles);
  const [tempSettings, setTempSettings] = useState(defaultStyles);

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

  useEffect(() => {
    if (canvasRef.current && processedData) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(processedData, 0, 0);
    }
  }, [processedData]);

  useEffect(() => {
    const saved = localStorage.getItem('userStyles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTempSettings(parsed);
      setPreviewSettings(parsed);
    }
  }, []);

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
        setOriginalImageData({ data, width: canvas.width, height: canvas.height });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!imageData || imageData.width === 0 || imageData.height === 0) return;
    let result;

    if (filter === 'grayscale') {
      result = grayscale(imageData.data.data);
    } else if (filter === 'invert') {
      result = invert(imageData.data.data);
    } else if (filter === 'sepia') {
      result = sepia(imageData.data.data);
    } else if (filter === 'brightness') {
      result = brightness(imageData.data.data, brightnessFactor);
    } else if (filter === 'contrast') {
      result = contrast(imageData.data.data, contrastFactor);
    } else if (filter === 'original') {
      result = originalImageData.data.data;
    }

    if (!result || result.length === 0) return;

    const newImageData = new ImageData(
      new Uint8ClampedArray(result),
      imageData.width,
      imageData.height
    );
    setProcessedData(newImageData);
    setImageProcessed(true);
  };

  const saveImageData = () => {
    if (processedData) {
      console.log("Guardando imagen...");
      saveImage({
        data: Array.from(processedData.data),
        width: processedData.width,
        height: processedData.height
      });
      alert('Imagen guardada');
    }
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

  // Clases dinámicas desde styleSettings
  const buttonClass = `bg-${styleSettings.primaryColor}-500 hover:bg-${styleSettings.primaryColor}-700 text-white font-bold py-2 px-4 rounded-${styleSettings.borderRadius} font-${styleSettings.font}`;
  const selectClass = `border p-2 rounded-${styleSettings.borderRadius} font-${styleSettings.font}`;
  const labelClass = `block mt-4 mb-1 font-${styleSettings.font}`;
  const textColorClass = styleSettings.textColor;

  return (
    <div className={`font-${styleSettings.font} text-${textColorClass}`}>
      <p className="text-4xl font-bold mb-4 text-center">DCCPhotoEdition</p>

      <p className="mb-6 text-xl text-center">Procesamiento de Imágenes con WASM</p>

      {!wasmLoaded && <p className="text-gray-500 text-center">Cargando módulo WASM...</p>}

      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        className="w-full mb-4 p-2 bg-gray-700 text-white rounded-md" 
      />

      {imageData && (
        <>
          <label className={labelClass}>Filtro:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className={selectClass}
          >
            <option value="original">Original</option>
            <option value="grayscale">Escala de grises</option>
            <option value="invert">Invertir colores</option>
            <option value="sepia">Sepia</option>
            <option value="brightness">Brillo</option>
            <option value="contrast">Contraste</option>
          </select>

          {filter === 'brightness' && (
            <div>
              <label className={labelClass}>Brillo:</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={brightnessFactor}
                onChange={(e) => setBrightnessFactor(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded-md"
              />
            </div>
          )}

          {filter === 'contrast' && (
            <div>
              <label className={labelClass}>Contraste:</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={contrastFactor}
                onChange={(e) => setContrastFactor(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded-md"
              />
            </div>
          )}

          <div className="mt-4 flex justify-center gap-6">
            <button 
              onClick={processImage} 
              className={`p-2 ${
                previewSettings.borderRadius === 'rounded' ? 'rounded-2xl' : ''
              }`}
              style={{
                backgroundColor: previewSettings.theme === 'dark' ? '#333' : '#ddd',
                color: previewSettings.textColor,
                fontFamily: getFontFamily(previewSettings.fontFamily),
              }}
            >
              Procesar Imagen
            </button>

            {imageProcessed && (
              <button 
                onClick={saveImageData} 
                className={`p-2 ${
                  previewSettings.borderRadius === 'rounded' ? 'rounded-2xl' : ''
                }`}
                style={{
                  backgroundColor: previewSettings.theme === 'dark' ? '#333' : '#ddd',
                  color: previewSettings.textColor,
                  fontFamily: getFontFamily(previewSettings.fontFamily),
                }}
              >
                Guardar Imagen
              </button>






            )}
          </div>
        </>
      )}

      

      <div className='mt-6'>
        {processedData && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Imagen Procesada</h3>
            <canvas
              ref={canvasRef}
              width={processedData.width}
              height={processedData.height}
              className="border border-gray-500 mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageProcessor;
