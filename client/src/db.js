// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'imageDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

// Guardar imagen en la base de datos
export async function saveImage(imageData) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({
    image: imageData,
    date: new Date()
  });
  await tx.done;
  console.log('✅ Imagen guardada en IndexedDB');
}

// Obtener todas las imágenes guardadas
export async function getImages() {
  console.log("Obteniendo imágenes...");
  const db = await initDB();
  const images = await db.getAll(STORE_NAME);
  return images.map(item => item.image);  // Asegúrate de que solo devuelvas el `image`
}

// Borrar todas las imágenes en la base de datos
export async function clearImages() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();  // Borra todos los registros en el store
  await tx.done;
  console.log('✅ Base de datos vacía');
}
