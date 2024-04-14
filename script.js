const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('No Service Worker support!');
    }
    if (!('Notification' in window)) {
      throw new Error('No Notification support API!');
    }
  };
  
  const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
  };
  
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
  
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    } 
  };
  
  const enableNotifications = async () => {
    checkPermission();
    await requestNotificationPermission();
    await registerSW();
  };
  
  const showLoginForm = () => {
    document.getElementById('enableNotificationsBtn').style.display = 'none';
    document.getElementById('isAdminBtn').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  };
  
  const login = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username === 'gundeep' && password === 'qwerty') {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('sendNotificationBtn').style.display = 'block';
    } else {
      alert('Invalid username or password');
    }
  };
  
  const sendNotification = async () => {
    // Send notification manually
    const response = await fetch('https://notification-tznv.onrender.com/send-notification', {
      method: 'post',
      headers: { 'Content-type': "application/json" },
      body: JSON.stringify({ message: "New Notice from EdConnect Noticeboard!" })
    });
    const result = await response.json();
    console.log(result);
  };
  
  const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
  
    return outputArray;
  };
  
  // No changes required here as the subscription logic remains the same
  const saveSubscription = async (subscription) => {
    const response = await fetch('https://notification-tznv.onrender.com/save-subscription', {
      method: 'post',
      headers: { 'Content-type': "application/json" },
      body: JSON.stringify(subscription)
    });
  
    return response.json();
  };
  
  