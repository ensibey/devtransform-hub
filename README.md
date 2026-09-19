# ⚡ DevTransform

> **The Ultimate Privacy-First, 100% Client-Side Developer Utility & Document Transformation Platform.**  
> 145+ high-performance tools running entirely in your browser with **zero server uploads**, zero tracking, and instant execution.

[![Live Demo](https://img.shields.io/badge/Live_Demo-devtransform--hub.vercel.app-2563eb?style=for-the-badge&logo=vercel)](https://devtransform-hub.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Zero Uploads](https://img.shields.io/badge/Security-100%25_Client--Side-10b981?style=for-the-badge&logo=shield)](https://devtransform-hub.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🌟 Try It Live

👉 **[https://devtransform-hub.vercel.app/](https://devtransform-hub.vercel.app/)**

No sign-ups. No subscriptions. No file size limits. Works completely offline after initial load.

---

## 🔒 100% Client-Side Architecture (Zero Server Uploads)

Unlike standard online converters that upload confidential documents and code snippets to remote backend servers, **DevTransform performs every single operation inside your browser's local sandbox**:

- **PDF & Word Processing:** Powered by WebAssembly, `pdf-lib`, and `mammoth` right inside browser memory.
- **Code & Data Transformations:** Powered by native browser JavaScript runtimes and `@codemirror` virtual engines.
- **Image Compression & Conversions:** Canvas API & modern browser Web Workers.
- **Zero Telemetry / Zero Logging:** Your files, API keys, credentials, and databases never leave your machine.

---

## 🛠️ Tool Suite Highlights (145+ Free Utilities)

### 📄 Everyday Document & Office Suite
- **Word to PDF Converter:** Convert `.docx`, `.doc`, `.rtf`, `.txt` to vector PDFs with custom margins and orientations.
- **PDF to Word Converter:** In-browser text & layout extraction with live editing and `.docx` export.
- **Markdown to PDF:** Dual-pane live GitHub-flavored Markdown editor with print-perfect paginated PDF export.
- **HTML to PDF:** WYSIWYG invoice & report templates with instant vector PDF rendering.
- **PDF Watermark & Numberer:** Custom opacity, diagonal stamps (CONFIDENTIAL, DRAFT), and "Page X of Y" pagination.
- **CSV / Excel to PDF:** Professional table generator with striped, corporate, and minimalist typography styles.
- **Text to PDF:** Paginated multi-page documents with line numbers and monospaced font options.
- **PDF Merge, Split & Protect:** Combine, slice, encrypt, and organize PDF pages on the fly.

### 💻 Code & Format Converters
- **JSON to Types:** Generate TypeScript interfaces, Go structs, Rust structs, Python Pydantic models, and C# classes instantly.
- **Format Interop:** Bi-directional converters between JSON, YAML, TOML, XML, and CSV.
- **cURL to Code:** Convert cURL requests to native JavaScript Fetch, Node.js Axios, Python Requests, Go HTTP, and Rust reqwest.
- **SQL Formatter:** Beautify, minify, and dialect-standardize complex SQL queries (PostgreSQL, MySQL, SQLite).

### 🚀 DevOps & SysAdmin Cheatsheets
- **Interactive Nginx Recipe Hub:** Zero-downtime reverse proxies, SSL redirects, SPA `try_files` fallbacks, rate limiting, and CORS headers.
- **Docker & Docker Compose Hub:** Command builders, volume cleanup recipes, and container debug templates.
- **Kubernetes (k8s) Helper:** Pod debugging, `kubectl port-forward`, CrashLoopBackOff triage, and secret encoders.
- **Systemd Service Builder:** System daemon generators for Node.js, Python FastAPI/Gunicorn, and compiled Go/Rust binaries.

### 🎨 Web & Design Utilities
- **Image Converter & Compressor:** WebP, PNG, JPEG, SVG, AVIF converters with zero quality loss.
- **CSS Generator Suite:** Glassmorphism, Neumorphism, CSS Mesh Gradients, Box Shadows, and Border Radius generators.
- **SVG to JSX / Base64:** Clean, minify, and embed SVG vector icons directly in React/Next.js projects.

---

## ⚡ Tech Stack

- **Framework:** Next.js 14 (App Router, Static Site Generation `output: 'export'`)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + Radix UI Primitives + Lucide Icons
- **Code Editor Engine:** CodeMirror 6
- **Document Engines:** `pdf-lib`, `mammoth`, `papaparse`
- **Deployment:** Vercel Global Edge Network

---

## 🚀 Getting Started Locally

Clone the repository and run the development server locally:

```bash
# 1. Clone the repository
git clone https://github.com/ensibey/devtransform-hub.git

# 2. Navigate to project directory
cd devtransform-hub

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build & Static Export

```bash
npm run build
```

This compiles all 7,800+ static routes into the `/out` directory, fully prepared for deployment to any static host (Vercel, Cloudflare Pages, GitHub Pages, AWS S3 / CloudFront).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/ensibey/devtransform-hub/issues).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
