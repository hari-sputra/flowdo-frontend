# FlowDo — Tasks in a Notebook

> A paper-inspired, monochrome task management application featuring adaptive layouts for Mobile, Tablet, and Desktop platforms. Built with **Vue 3**, **Tailwind CSS v4**, and **Pinia**.

---

## 🎨 Visual Philosophy — The Book & Paper Aesthetic

FlowDo is designed to feel like writing in a **physical notebook** rather than interacting with a cold digital spreadsheet. Every component is styled to evoke the sensation of ink on premium paper.

### Design Principles

- **Warm Cream Paper**: Background uses a soft, warm cream color (`#faf8f5`) with a subtle grain texture overlay to simulate actual paper fiber.
- **Ink Typography**: Headings feature elegant serif styles (*Playfair Display*), metadata and dates use precise monospace characters (*JetBrains Mono*), and clean sans-serif (*Inter*) is reserved for modern UI elements.
- **Physical Depth**: Surfaces use multi-layered shadows to mimic sheets of paper stacked on top of each other.
- **Stamped Accents**: Priority levels are designed as rustic ink stamps, slightly rotated and textured to look like they were stamped by hand.
- **The Journal (Dark Mode)**: Inverts the light parchment into a luxurious dark leather-bound journal style (aged dark brown with muted gold-foil accents).

---

## ✨ Key Features

1. **Adaptive Device Layouts (Non-Responsive)**: Distinct, tailormade layouts specifically built for Mobile, Tablet, and Desktop sizes (with auto-detection and manual preference overrides).
2. **Task Board (Notebook Entries)**: Full CRUD capabilities for task entries featuring checklist completions, due dates, and priorities.
3. **Ink Stamp Priorities**: Distinguish task urgency using simulated ink stamp markings (`URGENT`, `HIGH`, `MEDIUM`, `LOW`).
4. **Categorization & Tags**: Associate items with dynamic category tags, colored with custom palette dot indicators.
5. **Smart Sorting & Filters**: Categorize tasks by `All`, `Active`, or `Completed`, and sort instantly by due date, description, or priority.
6. **Due Today Alerts**: Active system banners and subtle prompts to remind you of tasks that require immediate attention today.
7. **Web Push Notifications**: System-level push notifications using service workers for task reminders.

---

## 🛠️ Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>` with strict TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Using the `@tailwindcss/vite` plugin for CSS-first configurations)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (Modular stores for Auth, Tasks, Tags, and Notifications)
- **Router**: [Vue Router 4](https://router.vuejs.org/) (With route authorization guarding)
- **Utilities**: 
  - [@vueuse/core](https://vueuse.org/) (Local storage persistence & device viewport detection)
  - [Day.js](https://day.js.org/) (Lightweight date transformations)
  - [Lucide Icons](https://lucide.dev/) (Clean minimalist line icon set matching the paper style)
  - [Vue Sonner](https://github.com/emilkowalski/sonner) (Toast notifications customized with paper borders)

---

## 📂 Project Architecture

```
flowdo-frontend/
├── docs/
│   ├── PRD.md                         # Product Requirement Document
│   └── FRONTEND_IMPLEMENTATION_PLAN.md# Phased implementation plan
│
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css               # Tailwind v4 configuration & theme tokens
│   │       ├── paper.css              # Custom paper grain, stamps & ruled lines
│   │       └── transitions.css        # Vue route & UI animation easing
│   │
│   ├── composables/
│   │   ├── useDeviceDetection.ts      # Multi-platform layout detector
│   │   └── useTheme.ts                # Light / Dark / System theme switcher
│   │
│   ├── layouts/
│   │   ├── AdaptiveRoot.vue           # Layout router based on device state
│   │   ├── AuthLayout.vue             # Centered card layout for Auth pages
│   │   ├── mobile/                    # Tailored Smartphone Shell
│   │   ├── tablet/                    # Collapsible Tablet Shell
│   │   └── desktop/                   # Book-Spread Desktop Shell
│   │
│   ├── features/
│   │   ├── auth/                      # Login & Registration views
│   │   ├── tasks/                     # Task Dashboard, Cards, and Forms
│   │   └── settings/                  # User options, theme & notifications
│   │
│   ├── router/                        # Authentication routing guards
│   ├── services/                      # Axios HTTP client configuration
│   ├── stores/                        # Pinia state management
│   └── main.ts                        # Application bootstrap entry point
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v20+ recommended).

### 1. Installation

Clone your repository and install node packages:

```bash
npm install
```

### 2. Development Run

Start the Vite hot-reloading development server:

```bash
npm run dev
```

The app will start running on `http://localhost:5173`. Open it inside your browser and toggle device responsive modes to see adaptive layouts trigger.

### 3. Static Type Checking

Validate TypeScript and template health:

```bash
npm run build
```

### 4. Code Formatting

Check and lint files:

```bash
npm run lint
```

---

## 🐳 Docker Deployment (Production)

FlowDo utilizes multi-stage Docker builds to compile the static application and serve it efficiently via Nginx.

To run the container locally:

```bash
# Build the production image
docker build -t flowdo-frontend .

# Run the container
docker run -d -p 8080:80 flowdo-frontend
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
