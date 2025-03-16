class QuoteNotifications {
  constructor() {
    this.quotes = [];
    this.notificationInterval = 24 * 60 * 60 * 1000; // 24 hours by default
  }

  async init() {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return false;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered:', registration);
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }

  async requestPermission() {
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  }

  setQuotes(quotes) {
    this.quotes = quotes;
  }

  setNotificationInterval(hours) {
    this.notificationInterval = hours * 60 * 60 * 1000;
  }

  getRandomQuote() {
    if (this.quotes.length === 0) return null;
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  scheduleNotification() {
    // Only schedule if permission is granted and quotes are available
    if (Notification.permission !== 'granted' || this.quotes.length === 0) {
      return;
    }

    // Store the next notification time
    const nextNotificationTime = Date.now() + this.notificationInterval;
    localStorage.setItem('nextQuoteNotification', nextNotificationTime);

    // Set timeout for next notification
    setTimeout(() => {
      this.sendNotification();
    }, this.notificationInterval);
  }

  async sendNotification() {
    if (Notification.permission !== 'granted') {
      return;
    }

    const quote = this.getRandomQuote();
    if (!quote) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if Push API is supported
      if ('pushManager' in registration) {
        // For browsers with Push API support
        registration.showNotification(quote.text, {
          body: quote.author ? `— ${quote.author}` : '',
          icon: '/images/icon-192x192.png',
          badge: '/images/icon-192x192.png',
          vibrate: [100, 50, 100]
        });
      } else {
        // Fallback for browsers without Push API
        new Notification(quote.text, {
          body: quote.author ? `— ${quote.author}` : '',
          icon: '/images/icon-192x192.png'
        });
      }
      
      // Schedule the next notification
      this.scheduleNotification();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  checkAndScheduleNotifications() {
    // Check if we need to schedule a new notification
    const nextNotificationTime = localStorage.getItem('nextQuoteNotification');
    
    if (!nextNotificationTime || Date.now() > parseInt(nextNotificationTime)) {
      // Schedule immediately if the time has passed or not set
      this.scheduleNotification();
    } else {
      // Schedule for the remaining time
      const timeToNext = parseInt(nextNotificationTime) - Date.now();
      setTimeout(() => {
        this.sendNotification();
      }, timeToNext);
    }
  }
}
