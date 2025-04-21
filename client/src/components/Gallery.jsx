import React, { useState, useEffect } from 'react';
import { getImages, clearImages } from '../db';

const Gallery = () => {
  const [savedImages, setSavedImages] = useState([]);
   const [isImagesLoaded, setIsImagesLoaded] = useState(false); // Estado para saber si se presionó el botón de cargar imágenes
    const [clearMessage, setClearMessage] = useState(''); // Mensaje para confirmar que la base de datos se vació


  useEffect(() => {
    getImages().then((images) => {
      setSavedImages(images);
    });
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
        setClearMessage('La base de datos ha sido vaciada exitosamente.');
      });
    };
  

  return (
    <div>
      <h2>Galeria</h2>
        <button onClick={loadSavedImages}>Cargar galeria de imagenes</button>
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
        <button onClick={emptyDatabase}>Vaciar Base de Datos</button>
        {clearMessage && <p>{clearMessage}</p>} {/* Mensaje de confirmación */}
    </div>
  );
};

export default Gallery;