# Hollow Quote

A dark-themed static web application that displays sinister quotes fetched from a JSON file. This app is designed to be hosted on GitHub Pages and supports installable PWA functionality with quote notifications on Android devices.

## Features

- Dark, modern sinister theme
- Displays random quotes with smooth transitions
- Shows quote category alongside text and author
- Responsive design that works on mobile and desktop
- Fetches quotes from [HollowQuotes](https://github.com/KushagraSingh78/HollowQuotes) repository
- **PWA Support**: Can be installed on Android devices
- **Notifications**: Delivers quote notifications on supported devices

## Quote Format

The application expects quotes in the following JSON format:

```json
[
  {
    "id": "1",
    "text": "It is better to be feared than loved, if you cannot be both.",
    "author": "Niccolò Machiavelli",
    "category": "power",
    "date_added": "2025-03-16"
  },
  {
    "id": "2",
    "text": "He who has a why to live for can bear almost any how.",
    "author": "Friedrich Nietzsche",
    "category": "resilience",
    "date_added": "2025-03-16"
  }
]
```

## How to Use

1. Clone this repository
2. Open `index.html` in your browser to see the application locally
3. Deploy to GitHub Pages to make it accessible online

## PWA Installation (Android)

1. Open the website in Chrome on your Android device
2. Tap the "Install App" button or use the Chrome menu to "Add to Home Screen"
3. Once installed, enable notifications when prompted
4. You'll receive quote notifications periodically

## Deployment to GitHub Pages

1. Push this repository to GitHub
2. Go to repository settings
3. Navigate to the "Pages" section
4. Select the branch you want to deploy (usually `main`)
5. Save the settings and wait for GitHub to deploy your site

## Icons

Before deploying, create the following icon files:
- `/images/icon-192x192.png` (192×192 pixels)
- `/images/icon-512x512.png` (512×512 pixels)

These icons should match your app's theme (dark and sinister).

## File Structure

```
HollowQuote/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── notifications.js
├── images/
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── README.md
```

## Credits

Quotes are fetched from [KushagraSingh78/HollowQuotes](https://github.com/KushagraSingh78/HollowQuotes).
