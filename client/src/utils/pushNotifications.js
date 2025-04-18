export async function registerPushNotifications() {
    if (!('serviceWorker' in navigator)) return;
    if (!('PushManager' in window)) return;
  
    try {
      const registration = await navigator.serviceWorker.ready;
  
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado');
        return;
      }
  
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BJeJd9jedpn9RAoksJVvweyNz9vrR1xEIyO38n3N26t1r6y-cRz7VVGeM_z7YkKRt81V-NKO2ARXivlYrarGofQ') // reemplaza con tu clave pública
      });
  
      console.log('Subscripción push:', JSON.stringify(subscription));
      // Aquí enviarías la subscripción a tu backend
    } catch (error) {
      console.error('Error registrando notificaciones push:', error);
    }
  }
  
  // Utilidad para convertir clave VAPID
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }