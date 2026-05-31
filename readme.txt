# 🍃 Clearleaf

> A minimal, focused PDF reader with AI-powered document Q&A and multi-timer support — built for deep work sessions.

---

## Overview

Clearleaf is a productivity web application that combines three tools in one clean interface:

- **PDF Viewer** — read and navigate any PDF document directly in the browser
- **Multi-Timer** — run multiple labeled countdown timers simultaneously with circular progress indicators
- **AI Assistant** — ask natural language questions about the loaded PDF and get instant answers

---

## Features

### PDF Viewer
- Drag and drop a PDF onto the upload zone or click to browse
- Full in-browser rendering via native iframe
- Replace the current PDF at any time using the topbar button
- Processing overlay shown while the document uploads to the backend

### Multi-Timer
- Create as many named timers as you need
- Set custom durations in minutes
- Animated circular progress ring per timer
- Start, pause, reset, and delete each timer independently
- Live status badges — Running / Paused / Finished
- Alert notification when a timer completes
- Empty state shown when no timers exist

### AI Assistant
- Ask any question about the loaded PDF in plain English
- Submit with the Ask AI button or `Cmd + Enter` / `Ctrl + Enter`
- AI panel is disabled until a PDF is uploaded (with a clear hint message)
- Error state styling if the request fails
- Clear button to reset the response

### General UX
- Fully responsive — mobile sidebar slides in over the PDF view
- Status bar in the sidebar footer shows PDF and AI readiness at a glance
- Smooth hover effects and micro-interactions throughout
- Custom scrollbar styling
- Warm parchment color palette (`#E4D6A9`, `#622B14`, `#995F2F`, `#978F66`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JSX), inline styles |
| Fonts | DM Serif Display, DM Sans (Google Fonts) |
| Backend | Python (FastAPI recommended) |
| AI | Any LLM API connected via backend |
| PDF Rendering | Native browser iframe |

---

## Project Structure

```
clearleaf/
├── src/
│   ├── assets/
│   │   ├── clearleaf-logo.svg       # Brand leaf mark (favicon)
│   │   └── clearleaf-favicon.svg    # Icon-only favicon
│   ├── App.jsx                      # Root entry point
│   └── MultiTimerPdfViewerApp.jsx   # Main application component
├── public/
│   ├── favicon.svg                  # Browser tab icon
│   └── index.html
├── backend/
│   └── main.py                      # FastAPI backend
├── README.md
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/your-username/clearleaf.git
cd clearleaf
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up the backend

```bash
cd backend
pip install fastapi uvicorn python-multipart
```

### 4. Start the backend

```bash
uvicorn main:app --reload --port 8000
```

### 5. Start the frontend

```bash
# Back in the root directory
npm run dev
```

### 6. Open in browser

```
http://localhost:5173
```

---

## Backend API

The frontend expects two endpoints on `http://localhost:8000`:

### `POST /upload-pdf`

Accepts a PDF file as `multipart/form-data`.

```
Content-Type: multipart/form-data
Body: file = <pdf file>
```

**Success response:**
```json
{ "message": "PDF uploaded successfully" }
```

### `POST /ask`

Accepts a JSON body with a question string.

```json
{ "question": "What is the main topic of this document?" }
```

**Success response:**
```json
{ "answer": "The document discusses..." }
```

---

## Environment & CORS

If you see network errors in the browser console, add CORS middleware to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Favicon Setup

The leaf mark icon is already saved at `src/assets/clearleaf-favicon.svg`. To use it as the browser tab icon, add this to your `public/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Copy the favicon file to `public/favicon.svg` to make it available.

---

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary / actions | Deep brown | `#622B14` |
| Hover / highlights | Warm sienna | `#995F2F` |
| Borders / muted UI | Khaki | `#978F66` |
| Background | Parchment | `#E4D6A9` |
| Dark text | Near black | `#2C1A0F` |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Add a new timer (when name field is focused) |
| `Cmd + Enter` / `Ctrl + Enter` | Submit AI question |

---

## License

MIT — free to use, modify, and distribute.

---

## Author

Built with focus and flow. 🍃
