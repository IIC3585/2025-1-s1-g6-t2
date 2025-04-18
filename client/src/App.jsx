import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { IoNotificationsOutline } from 'react-icons/io5';
import React, { useEffect } from 'react';
import ImageProcessor from './components/ImageProcessor';
import { registerPushNotifications } from './utils/pushNotifications';
import { saveNotification, getAllNotifications, clearNotifications } from './notificationsDB';

function App() {
  const [count, setCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  
  useEffect(() => {
    registerPushNotifications();
  }, []);

  useEffect(() => {
    Notification.requestPermission();

    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data?.type === 'push-notification') {
        const notif = event.data.data;
        await saveNotification(notif);
        setNotificationCount(prev => prev + 1);
        setNotificationList(prev => [...prev, notif]);
      }
    });

    getAllNotifications().then(setNotificationList);
  }, []);

  const resetNotifications = () => {
    setNotificationCount(0);
  };

  const handleClear = async () => {
    await clearNotifications();
    setNotificationList([]);
    setNotificationCount(0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Procesador de Imágenes</h1>
        <div className="notification-icon" onClick={resetNotifications}>
          <IoNotificationsOutline size={28} />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>
      </header>

      <ImageProcessor />

      <div className="notifications-list">
        <h2>Notificaciones</h2>
        <button onClick={handleClear}>Limpiar historial</button>
        <ul>
          {notificationList.map((notif, idx) => (
            <li key={idx}>
              <strong>{notif.title || 'Notificación'}</strong><br />
              <span>{notif.body}</span><br />
              <small>{new Date(notif.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}

export default App
