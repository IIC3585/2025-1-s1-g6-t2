import React, { useEffect, useState, useRef } from 'react';
// Importa el módulo WASM desde public/pkg
import init, { grayscale, invert } from '../../public/pkg/image_filter.js';
import { saveImage, getImages, clearImages } from '../db';
import './ImageProcessor.css'; 

const ImageProcessor = () => {
  console.log("ImageProcessor cargado");
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [imageData, setImageData] = useState(null); // Datos de la imagen original
  const [processedData, setProcessedData] = useState(null); // Imagen procesada
  const [filter, setFilter] = useState('original');
  const [imageProcessed, setImageProcessed] = useState(false); // Estado para controlar si la imagen está procesada
  const [savedImages, setSavedImages] = useState([]);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false); // Estado para saber si se presionó el botón de cargar imágenes
  const [clearMessage, setClearMessage] = useState(''); // Mensaje para confirmar que la base de datos se vació
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
    notifyProcessComplete();
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
            <option value="original">Original</option> {/* Opción para volver al color original */}
            <option value="grayscale">Escala de grises</option>
            <option value="invert">Invertir colores</option>
          </select>
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
      <div>
        <h3>Imágenes Guardadas</h3>
        <button onClick={loadSavedImages}>Cargar imágenes guardadas</button>
        <div>
          {isImagesLoaded && savedImages.length === 0 ? (  // Mostrar solo después de hacer clic
            <p>No hay imágenes guardadas</p>
          ) : (
            savedImages.map((image, index) => (
              <div key={index}>
                <canvas
                  width={image.width}
                  height={image.height}
                  style={{ border: '1px solid black' }}
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      const imgData = new ImageData(
                        new Uint8ClampedArray(image.data),
                        image.width,
                        image.height
                      );
                      ctx.putImageData(imgData, 0, 0);
                    }
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón para vaciar la base de datos */}
      <button onClick={emptyDatabase}>Vaciar Base de Datos</button>
      {clearMessage && <p>{clearMessage}</p>} {/* Mensaje de confirmación */}
    </div>
  );
};

export default ImageProcessor;
