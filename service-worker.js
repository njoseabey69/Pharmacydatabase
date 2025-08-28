// Service Worker for PharmaSys - Offline functionality

const CACHE_NAME = 'pharmasys-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/data.js',
  '/js/ui.js',
  '/js/utils.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://code.jquery.com/jquery-3.6.0.min.js'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache addAll failed:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for failed requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });
}

// Periodic sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'periodic-sync') {
      event.waitUntil(doPeriodicSync());
    }
  });
}

// Push notifications (if supported)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: data.tag,
        data: data
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Background sync function
async function doBackgroundSync() {
  console.log('Background sync started');
  // Implement background data sync logic here
  try {
    // Check if there's any pending data to sync
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      const results = await Promise.allSettled(
        pendingData.map(item => syncDataItem(item))
      );
      
      // Handle results
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      console.log(`Background sync completed: ${successful.length} successful, ${failed.length} failed`);
      
      if (successful.length > 0) {
        // Show notification for successful sync
        self.registration.showNotification('Sync Complete', {
          body: `${successful.length} items synchronized successfully`,
          icon: '/icons/icon-192x192.png'
        });
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// Periodic sync function
async function doPeriodicSync() {
  console.log('Periodic sync started');
  // Implement periodic data sync logic here
  try {
    // Sync all data periodically
    await syncAllData();
    console.log('Periodic sync completed');
  } catch (error) {
    console.error('Periodic sync error:', error);
  }
}

// Helper functions for data sync
async function getPendingData() {
  // Get data that needs to be synced from IndexedDB or localStorage
  try {
    const pending = localStorage.getItem('pendingSync') || '[]';
    return JSON.parse(pending);
  } catch (error) {
    console.error('Error getting pending data:', error);
    return [];
  }
}

async function syncDataItem(item) {
  // Simulate API call to sync data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, simulate successful sync 90% of the time
      if (Math.random() > 0.1) {
        resolve(item);
      } else {
        reject(new Error('Sync failed'));
      }
    }, 1000);
  });
}

async function syncAllData() {
  // Sync all local data with server
  console.log('Syncing all data...');
  // Implementation would go here
}

// Health check function
async function healthCheck() {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('Health check passed');
      return true;
    } else {
      console.log('Health check failed');
      return false;
    }
  } catch (error) {
    console.error('Health check error:', error);
    return false;
  }
}

// Cache management functions
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.warn('Failed to update cache for:', request.url);
      }
    }
    
    console.log('Cache updated successfully');
  } catch (error) {
    console.error('Cache update error:', error);
  }
}

// Storage management
async function cleanupStorage() {
  try {
    // Clean up old data from IndexedDB or localStorage
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Example: Clean up old sync data
    const syncData = await getPendingData();
    const recentData = syncData.filter(item => item.timestamp > oneWeekAgo);
    
    localStorage.setItem('pendingSync', JSON.stringify(recentData));
    console.log('Storage cleanup completed');
  } catch (error) {
    console.error('Storage cleanup error:', error);
  }
}

// Message event handler for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'UPDATE_CACHE':
      updateCache();
      break;
      
    case 'CLEANUP_STORAGE':
      cleanupStorage();
      break;
      
    case 'HEALTH_CHECK':
      healthCheck().then(healthy => {
        event.ports[0].postMessage({ healthy });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled rejection
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection in Service Worker:', event.reason);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    doBackgroundSync,
    doPeriodicSync,
    healthCheck,
    updateCache,
    cleanupStorage
  };
}
