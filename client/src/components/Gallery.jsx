import React, { useState, useEffect, useContext } from 'react';
import { getImages, clearImages } from '../db';


const defaultStyles = {
  theme: 'light',
  fontFamily: 'sans',
  borderRadius: 'rounded',
  textColor: '#000000',
};

const Gallery = ({styleSettings}) => {
  const [savedImages, setSavedImages] = useState([]);
   const [isImagesLoaded, setIsImagesLoaded] = useState(false); // Estado para saber si se presionó el botón de cargar imágenes
    const [clearMessage, setClearMessage] = useState(''); // Mensaje para confirmar que la base de datos se vació
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


  useEffect(() => {
    getImages().then((images) => {
      setSavedImages(images);
    });
  }, []);

    useEffect(() => {
      const saved = localStorage.getItem('userStyles');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTempSettings(parsed);
        setPreviewSettings(parsed);
      }
    }, []);

  
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
        setClearMessage(<p className="text-center text-lg">La base de datos ha sido vaciada</p>);
      });
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
  

    const buttonClass = `bg-${styleSettings.primaryColor}-500 hover:bg-${styleSettings.primaryColor}-700 text-white font-bold py-2 px-4 rounded-${styleSettings.borderRadius} font-${styleSettings.font}`;

    return (
      <div className={`font-${styleSettings.font} text-${styleSettings.textColor}`}>
        <p className="text-4xl font-bold mb-4 text-center">Galería</p>
  
        <div className="flex justify-center gap-4 mb-6">
          {/* Botón para cargar imágenes */}
          <button onClick={loadSavedImages}
          className={`p-2 ${
            previewSettings.borderRadius === 'rounded' ? 'rounded-2xl' : ''
          }`}
          style={{
            backgroundColor: previewSettings.theme === 'dark' ? '#333' : '#ddd',
            color: previewSettings.textColor,
            fontFamily: getFontFamily(previewSettings.fontFamily),
          }}
        >
          Cargar Imágenes
        </button>
          {/* Botón para vaciar la base de datos */}
          <button onClick={emptyDatabase}
          className={`p-2 ${
            previewSettings.borderRadius === 'rounded' ? 'rounded-2xl' : ''
          }`}
          style={{
            backgroundColor: previewSettings.theme === 'dark' ? '#333' : '#ddd',
            color: previewSettings.textColor,
            fontFamily: getFontFamily(previewSettings.fontFamily),
          }}
        >
          Vaciar Base de Datos
        </button>
        </div>
  
        <div>
          {isImagesLoaded && savedImages.length === 0 ? (  // Mostrar solo después de hacer clic
            <p className="text-center text-lg ">No hay imágenes guardadas</p>
          ) : (
            savedImages.map((image, index) => (
              <div key={index} className="mb-4">
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
  
        {/* Mensaje de confirmación */}
        {clearMessage && <p className="text-center text-green-600">{clearMessage}</p>}
      </div>
    );
  };
  
  export default Gallery;