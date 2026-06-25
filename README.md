<h1 align="center">
  <img src="public/web-check-logo.png" width="80" alt="WebScan Logo" /><br/>
  WebScan
</h1>

<p align="center">
  <b><i>Instantly analyze any website's security, infrastructure & tech stack</i></b><br/>
  <sub>Analyze. Detect. Protect.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built%20with-Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-4ce1d3?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://github.com/Mohammed-razin-cr/Web-Scan">
    <img src="https://img.shields.io/github/stars/Mohammed-razin-cr/Web-Scan?style=social" />
  </a>
  &nbsp;
  <a href="https://github.com/Mohammed-razin-cr/Web-Scan/issues">
    <img src="https://img.shields.io/github/issues/Mohammed-razin-cr/Web-Scan?color=ff6b6b" />
  </a>
</p>

---

## 🔍 What is WebScan?

**WebScan** is a powerful open-source **website intelligence & security analysis platform**. Enter any domain, URL, or IP address and get a comprehensive real-time report covering 30+ security and infrastructure checks — all displayed in a stunning, modern dashboard.

> Built and maintained by [Mohammed Razin](https://github.com/Mohammed-razin-cr/)

---

## ✨ Features

WebScan runs **30+ checks** in parallel and presents results in a beautiful masonry card layout:

| Category | Checks |
|---|---|
| 🔒 **Security** | SSL Certificate, HSTS, HTTP Security Headers, Security.txt, DNSSEC |
| 🌐 **DNS & Network** | DNS Records, DNS Server, TXT Records, Trace Route, Open Ports |
| 🏗️ **Infrastructure** | WHOIS Lookup, IP Address, Server Status, Redirects, Firewall Detection |
| 🧠 **Intelligence** | Tech Stack, Known Threats, Block Lists, Carbon Footprint, Global Rank |
| 📄 **Content** | Robots.txt, Sitemap, Social Tags, Linked Pages, Cookies, Mail Config |
| 📸 **Extras** | Screenshot, Archive History, Quality Check, TLS Version |



## 🚀 Getting Started

### Prerequisites
- Node.js `>= 22`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohammed-razin-cr/Web-Scan.git
cd Web-Scan

# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- 🌐 **Frontend (Astro)** → http://localhost:4321
- ⚙️ **Backend API (Express)** → http://localhost:3001

---

## 🏗️ Project Structure

```
Web-Scan/
├── api/                    # Backend API handlers (30+ endpoint modules)
├── src/
│   ├── client/             # React frontend app
│   │   ├── components/     # UI components (Cards, Nav, Buttons, etc.)
│   │   ├── views/          # Page views (Home, Results, About)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── jobs/           # Job registry & fetcher definitions
│   │   ├── analysis/       # Security analysis rules
│   │   └── styles/         # Global styles & color tokens
│   ├── components/         # Astro components (homepage, layout)
│   └── pages/              # Astro page routes
├── public/                 # Static assets (logo, icons, etc.)
├── server.js               # Express server entry point
└── astro.config.mjs        # Astro configuration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Astro](https://astro.build/) v6 |
| **UI Library** | [React](https://react.dev/) v19 |
| **Styling** | Emotion (CSS-in-JS) + SCSS |
| **Backend** | Node.js + Express v5 |
| **3D Globe** | Three.js |
| **Charts** | Recharts |
| **Type Safety** | TypeScript |
| **Dev Tools** | Nodemon, Concurrently, ESLint, Prettier |

---

## ⚙️ Configuration

Create a `.env` file in the root (see `.env.sample` for reference):

```env
# API endpoint for the frontend to call
PUBLIC_API_ENDPOINT=http://localhost:3001/api

# Optional: Enable rate limiting
API_ENABLE_RATE_LIMIT=false

# Optional: Set a custom port
PORT=3001
```

---

## 📦 Available Scripts

```bash
npm run dev          # Start frontend + backend concurrently
npm run dev:api      # Start backend API only (port 3001)
npm run dev:astro    # Start frontend only (port 4321)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

---

## 🔐 Self-Hosting

You can self-host WebScan on your own server. Visit `/self-hosted-setup` in the app for a step-by-step guide, or:

1. Clone the repo
2. Install dependencies: `npm install --legacy-peer-deps`
3. Build: `npm run build`
4. Start: `npm run start`

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs via [Issues](https://github.com/Mohammed-razin-cr/Web-Scan/issues)
- 💡 Suggest features
- 🔧 Submit pull requests

---

## 👨‍💻 Author

**Mohammed Razin**

- GitHub: [@Mohammed-razin-cr](https://github.com/Mohammed-razin-cr/)
- Project: [Web-Scan](https://github.com/Mohammed-razin-cr/Web-Scan)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Mohammed-razin-cr/">Mohammed Razin</a>
</p>
