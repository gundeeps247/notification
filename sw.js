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

const saveSubscription = async (subscription) => {
  const response = await fetch('https://notification-tznv.onrender.com/save-subscription', {
    method: 'post',
    headers: { 'Content-type': "application/json" },
    body: JSON.stringify(subscription)
  });

  return response.json();
};

self.addEventListener('error', function(event) {
console.error('Service worker error:', event.error);
});

self.addEventListener('install', function(event) {
self.skipWaiting();
});

self.addEventListener('activate', function(event) {
event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
if (event.data === 'skipWaiting') {
  self.skipWaiting();
}
});

self.addEventListener("activate", async (e) => {
  try {
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg')
    });
    console.log(subscription);
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (error) {
    console.error("Error subscribing:", error);
  }
});

self.addEventListener('push', e => {
self.registration.showNotification('New Notice', {body:e.data.text() })
});

self.addEventListener('sync', function(event) {
if (event.tag === 'syncData') {
  // Perform sync operation
  console.log('Background sync event received');
}
});

// Retry activation if service worker stops
self.addEventListener('statechange', function(event) {
if (event.target.state === 'redundant') {
  console.warn('Service worker redundant, attempting to register again...');
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then(clients => {
      clients.forEach(client => client.navigate(client.url));
    });
}
});
