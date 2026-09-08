# Resume Studio (`resume-io`)

[![Deploy to Cloudflare Workers](https://github.com/Frontend-fuchhey/resume.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Frontend-fuchhey/resume.io/actions/workflows/deploy.yml)
[![Deployment: Cloudflare Workers](https://img.shields.io/badge/Deployment-Cloudflare%20Workers-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Framework: React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Bundler: Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Resume Studio** is an intelligent, high-fidelity resume building studio and interactive multi-page canvas designed for developers, designers, marketers, and multi-disciplinary professionals. It combines real-time click-to-edit canvas interactions with robust ATS parser compliance, seamless CV ingestion, and pixel-accurate vector PDF export.

---

## 🌟 Feature Highlights

### 1. Direct On-Canvas In-Place Editing (Inline Editing)
- **Instant Click-to-Edit**: Click anywhere directly on the studio canvas preview to edit text blocks in place—including candidate names, job titles, section headers, institutions, bullet points, skills, and project details.
- **Zero Focus Loss & Cursor Jumping**: Upgraded contentEditable architecture that auto-syncs typing changes to the central Zustand store in real time via `onInput` while strictly preserving cursor selection.
- **Subtle Visual Feedback**: Elements feature elegant hover outlines and focused typing rings aligned with your active theme accent color.

### 2. Interactive & Highlighted Hyperlinks
- **Accent-Styled Active Links**: Portfolio links, GitHub profiles, LinkedIn URLs, and project references are visibly styled with primary accent colors and underlined.
- **Inline URL Popover**: Normal click on any link opens a floating URL/label editor with an instant "Test Link ↗" button and keyboard shortcuts (Enter to save, Esc to close).
- **Direct Navigation**: Hold `Alt` / `Cmd` + Click or use the hover action chip to open external links directly in a new browser tab.

### 3. Multi-Format CV Ingestion & Parsing
- **PDF & DOCX Parser**: Ingest existing resumes in `.pdf` and `.docx` formats directly in the browser using client-side `pdfjs-dist` and `mammoth.js`.
- **Smart Field Extraction**: Automatically parses contact details, work history, degree programs, skill categories, and project achievements into editable structured data.

### 4. Multi-Disciplinary Projects & Skill Management
- **Versatile Roles**: Adaptable fields for software engineers, UX/UI designers, marketing managers, researchers, and cross-functional builders.
- **Organized Competencies**: Categorized skill chips with editable group labels and single-click reordering.

### 5. Fluid Multi-Page Layout Engine
- **ATS-Optimized Formatting**: 4 curated templates (`ATS Studio Two-Column`, `Classic ATS`, `Tech Developer Standard`, and `Executive Professional`).
- **Natural Multi-Page Overflow**: Uses strict `break-inside: avoid` CSS rules and visual page-break boundary visualizers (A4 Standard & US Letter dimensions) to prevent awkward content clipping across page transitions.
- **Vector-Grade PDF Export**: Produces razor-sharp, text-selectable vector PDFs without canvas blur, interactive focus artifacts, or stray cursor outlines.

### 6. Local Persistence, Duplication & Versioning
- **Auto-Save State**: Automatically persists resume snapshots to `localStorage` with intelligent debouncing.
- **Multi-Resume Management**: Create, duplicate, switch, and delete resume versions with timestamps and custom titles.
- **Granular History**: Non-destructive Undo / Redo stack with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).

### 7. Automated CI/CD Pipeline
- **GitHub Actions Integration**: Pushing to `main` automatically triggers automated build and static asset deployment to **Cloudflare Workers**.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | [React 18](https://react.dev/) | Component architecture & hooks |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) | Ultra-fast HMR and optimized production bundling |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Centralized store with `persist` middleware & debounced history |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Responsive design system & custom studio surfaces |
| **Icons & Animations** | [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/) | Polished UI iconography and smooth modal/reorder animations |
| **Document Parsing** | [pdfjs-dist](https://mozilla.github.io/pdf.js/) & [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | Client-side PDF & DOCX text extraction |
| **PDF Generation** | [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) / [html2canvas](https://html2canvas.hertzen.com/) | Client-side vector-text PDF rendering |
| **Hosting & Edge** | [Cloudflare Workers](https://workers.cloudflare.com/) | High-performance global SPA edge hosting via Static Assets |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Continuous Integration and Automated Deployment |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version `20.x` or later
- **npm**: Version `10.x` or later (bundled with Node.js)
- **Git**

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Frontend-fuchhey/resume.io.git
   cd resume.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to start using Resume Studio.

4. **Build production assets locally**:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment & CI/CD Pipeline

The project is hosted on **Cloudflare Workers** using the new Static Assets engine.

### Automated CI/CD (Recommended)
Every commit pushed to the `main` branch triggers the GitHub Actions workflow located in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
1. Checks out the code.
2. Sets up Node.js 20 with npm caching.
3. Installs clean dependencies via `npm ci`.
4. Executes `npm run build` to generate the production bundle in `dist/`.
5. Deploys static assets to Cloudflare Workers using `cloudflare/wrangler-action@v3`.

#### Required GitHub Secrets
To configure CI/CD in your own fork, add the following repository secrets under **Settings > Secrets and variables > Actions**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token with Workers & Pages edit permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.

### Manual Deployment via CLI
You can also deploy manually using Wrangler:
```bash
# Login to your Cloudflare account (one-time setup)
npx wrangler login

# Build static assets & deploy to Cloudflare Workers
npm run deploy
```

---

## 📁 Repository Structure

```
resume.io/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated Cloudflare Workers CI/CD workflow
├── public/                       # Static public assets (favicons, logos)
├── src/
│   ├── assets/                   # Brand logos and illustration assets
│   ├── components/
│   │   ├── editor/               # Studio shell, toolbars, and template gallery
│   │   │   ├── EditorScreen.jsx
│   │   │   ├── FloatingCanvasToolbar.jsx
│   │   │   └── RightToolbarPane.jsx
│   │   ├── forms/                # Sidebar data management forms
│   │   │   ├── BasicForm.jsx
│   │   │   ├── ExperienceManager.jsx
│   │   │   ├── EducationManager.jsx
│   │   │   ├── ProjectsManager.jsx
│   │   │   ├── SkillsManager.jsx
│   │   │   └── WebsitesManager.jsx
│   │   ├── modals/               # Import CV and Saved Resumes modals
│   │   │   ├── ImportResumeModal.jsx
│   │   │   └── SavedResumesModal.jsx
│   │   ├── preview/              # Live Studio Canvas & Inline Editors
│   │   │   ├── EditableText.jsx  # Real-time on-canvas text editing
│   │   │   ├── EditableLink.jsx  # Interactive hyperlink popover & tester
│   │   │   ├── EditableDate.jsx  # Inline date editor & calendar picker
│   │   │   ├── Bullet.jsx        # Achievement bullet editor
│   │   │   ├── PreviewPane.jsx   # Zoom, scale, and page-break container
│   │   │   └── templates/        # ATS-optimized resume templates
│   │   │       ├── AtsStudioTemplate.jsx
│   │   │       ├── ClassicTemplate.jsx
│   │   │       ├── TechTemplate.jsx
│   │   │       └── ExecutiveTemplate.jsx
│   │   └── ui/                   # Reusable atomic UI primitives and inputs
│   ├── config/                   # Template definitions and constants
│   ├── lib/
│   │   ├── factory.js            # Initial entity shapes and defaults
│   │   ├── format.js             # Date and URL formatting helpers
│   │   ├── parser/               # Client-side PDF & DOCX ingestion logic
│   │   │   └── resumeParser.js
│   │   ├── resumeHistory.js      # LocalStorage persistence & resume versioning
│   │   └── sample.js             # Pre-filled sample resume data
│   ├── pdf/
│   │   └── exportPdf.js          # Vector PDF generation & print cleanup
│   ├── store/
│   │   ├── useResumeStore.js     # Central Zustand store (two-way sync & history)
│   │   └── useUIStore.js         # Transient UI state (toasts, active tabs)
│   ├── App.jsx
│   ├── index.css                 # Tailwind utilities & print media queries
│   └── main.jsx
├── index.html                    # Root HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── worker.js                     # Cloudflare Worker fetch handler
└── wrangler.toml                 # Cloudflare Workers configuration
```

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please ensure that your code passes production builds (`npm run build`) before opening a PR.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
