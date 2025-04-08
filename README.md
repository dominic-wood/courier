# Courier – API Toolkit 📨

Courier is a lightweight Postman-style HTTP client built with React, TypeScript, and Tailwind CSS.  
It allows developers to quickly compose and test API requests with a clean, focused interface.


![Courier Screenshot](./public/courier-logo-large.png)

## 🚀 Features

- 🔗 Supports `GET`, `POST`, `PUT`, `DELETE`, and `PATCH` methods
- 📦 Custom headers input
- 📝 JSON body editor (auto-disabled for `GET`)
- 🎯 Response viewer with:
  - ✅ Status code
  - 🕒 Request duration
  - 📋 Copy to clipboard
  - ❌ Error display
- 🖼️ Brand-aligned UI with Courier red theme (#ed1c24)
- 📱 Fully responsive layout

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS**
- **Vite** for blazing-fast development

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/courier.git
cd courier
```
### 2. Install dependencies
```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```

## 🧼  Project Structure
```css
src/
  components/
    HeaderBar.tsx
    RequestForm.tsx
    ResponseViewer.tsx
  App.tsx
  main.tsx
  index.css
```

## 🧭 Roadmap
- 🧠 Request history
- 🎨 Theme switcher (dark/light)
- 🧾 Request preview panel
- 💾 Export/import request configs
- 🌐 Environment variables (Dev/Prod/etc.)

## 📃 License
MIT – Use it, fork it, break it, improve it.