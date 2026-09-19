# DevTransform Quick Hub — Chrome & Edge Extension (Manifest V3)

Official browser extension for **DevTransform Hub** (https://devtransform-hub.vercel.app). Provides instant 1-click access to 145+ client-side developer utilities, PDF converters, and code generators directly from your browser toolbar and URL omnibox.

---

## 🛠️ How to Install in Developer Mode (Local Test)

### In Google Chrome / Brave / Arc:
1. Open `chrome://extensions` in your browser.
2. Enable **"Developer mode"** toggle in the top right corner.
3. Click **"Load unpacked"** in the top left corner.
4. Select the `public/extension` folder inside this project.
5. The **DevTransform** icon will appear in your extensions bar!

### In Microsoft Edge:
1. Open `edge://extensions` in Edge.
2. Enable **"Developer mode"** in the left sidebar.
3. Click **"Load unpacked"** and select this directory.

---

## 🚀 How to Use

### 1. Toolbar Popup
Click the DevTransform icon in your browser toolbar to instantly search and open any of the 145+ developer tools with dark mode support.

### 2. Address Bar Omnibox Shortcuts
Type `dt` in your browser address bar followed by a space and a keyword:
- `dt json` ➔ Opens JSON to TypeScript Converter
- `dt cron` ➔ Opens Cron Expression Explainer
- `dt chmod` ➔ Opens Linux chmod Calculator
- `dt word` ➔ Opens Word to PDF Converter
- `dt port` ➔ Opens Ports & Kill Process Directory
- `dt regex` ➔ Opens Regex Pattern Library

---

## 📦 How to Publish to Chrome Web Store

1. Zip the files inside `public/extension/`:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `background.js`
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Click **"New Item"** and upload the zip file.
4. Fill in the store listing details (Description, privacy policy URL: `https://devtransform-hub.vercel.app/privacy/`).
5. Submit for review! (Typically approved within 24-48 hours).
