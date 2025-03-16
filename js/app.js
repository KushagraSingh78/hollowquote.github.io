document.addEventListener('DOMContentLoaded', async () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteCategory = document.getElementById('quote-category');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const notificationBtn = document.getElementById('enable-notifications');
    const installBtn = document.getElementById('install-app');
    
    let quotes = [];
    let currentIndex = -1;
    let deferredPrompt;
    const notifications = new QuoteNotifications();

    // Initialize notifications
    const notificationsSupported = await notifications.init();
    
    if (notificationsSupported) {
        notificationBtn.classList.remove('hidden');
    }

    // Fetch quotes from GitHub
    async function fetchQuotes() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/KushagraSingh78/HollowQuotes/refs/heads/main/quotes.json');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            quotes = await response.json();
            // Set quotes for notifications
            notifications.setQuotes(quotes);
            displayRandomQuote();
        } catch (error) {
            console.error('Error fetching quotes:', error);
            quoteText.textContent = 'Failed to load quotes. Please try again later.';
            quoteAuthor.textContent = '';
            quoteCategory.textContent = '';
        }
    }

    // Display a random quote
    function displayRandomQuote() {
        if (quotes.length === 0) return;
        
        let randomIndex;
        // Ensure we don't get the same quote twice in a row
        do {
            randomIndex = Math.floor(Math.random() * quotes.length);
        } while (randomIndex === currentIndex && quotes.length > 1);
        
        currentIndex = randomIndex;
        const randomQuote = quotes[randomIndex];
        
        // Add fade-out effect
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        quoteCategory.style.opacity = 0;
        
        setTimeout(() => {
            quoteText.textContent = randomQuote.text || 'No quote text available';
            quoteAuthor.textContent = randomQuote.author || 'Unknown';
            quoteCategory.textContent = randomQuote.category || 'uncategorized';
            
            // Add fade-in effect
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
            quoteCategory.style.opacity = 1;
        }, 300);
    }

    // Request notification permission
    async function requestNotificationPermission() {
        const granted = await notifications.requestPermission();
        if (granted) {
            notificationBtn.textContent = 'Notifications Enabled';
            notificationBtn.disabled = true;
            notifications.scheduleNotification();
        }
    }

    // Install PWA app
    function installApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    installBtn.classList.add('hidden');
                }
                deferredPrompt = null;
            });
        }
    }

    // Event listeners
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    
    if (notificationsSupported) {
        notificationBtn.addEventListener('click', requestNotificationPermission);
    }
    
    installBtn.addEventListener('click', installApp);

    // Check if notifications are already permitted
    if (notificationsSupported && Notification.permission === 'granted') {
        notificationBtn.textContent = 'Notifications Enabled';
        notificationBtn.disabled = true;
        notifications.checkAndScheduleNotifications();
    }
    
    // Handle app installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        installBtn.classList.remove('hidden');
    });

    // Initial fetch
    fetchQuotes();
});
