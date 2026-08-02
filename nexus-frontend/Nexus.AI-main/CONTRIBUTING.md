# 🤝 Contributing to Project NEXUS

Thank you for your interest in contributing to **Project NEXUS**! We welcome contributions from developer communities, artificial intelligence researchers, UI designers, and open-source enthusiasts.

Whether you're fixing a bug, adding new features to our multi-agent architecture, improving documentation, or refining UI components, your effort helps advance indigenous autonomous intelligence.

---

## 📜 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Workflow](#-development-workflow)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Commit Message Guidelines](#commit-message-guidelines)
- [Code & Styling Standards](#-code--styling-standards)
- [Questions & Support](#-questions--support)

---

## 🌐 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please maintain professionalism, treat all community members with respect, and focus on constructive feedback.

---

## 🛠️ How Can I Contribute?

### Reporting Bugs

Before submitting an issue, please search existing issues to ensure it hasn't already been reported. When filing a bug report, include:

1. **A clear, descriptive title**.
2. **Steps to reproduce the behavior**.
3. **Expected vs. actual results**.
4. **Environment details** (OS, Node version, Browser, Screen size).
5. **Console logs or screenshots** if applicable.

### Suggesting Features

We welcome ideas for new feature cards, agent capabilities, memory pathways, or UI improvements! Please submit a feature request issue containing:

- The motivation behind the suggested feature.
- Detailed explanation of how it should work.
- Mockups or structural design examples if relevant.

---

## 💻 Development Workflow

### Local Development Setup

1. **Fork the Repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Project-NEXUS.git
   cd Project-NEXUS/nexus-frontend/Nexus.AI-main
   ```
3. **Create a topic branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. **Install dependencies & run dev server**:
   ```bash
   npm install
   npm run dev
   ```

### Branch Naming Conventions

Use clear, structured prefixes when naming your git branches:

- `feat/feature-name` — New user-facing or architectural features.
- `fix/bug-description` — Bug fixes or stability patches.
- `docs/topic-name` — Documentation improvements.
- `refactor/scope-name` — Code restructuring without visual/functional changes.

### Commit Message Guidelines

We follow Conventional Commits formatting:

```text
<type>(<scope>): <short description>

[optional body]
```

#### Examples:
- `feat(bento): add hover shine animation to feature cards`
- `fix(layout): clip footer background canvas to resolve height inflation`
- `docs(readme): add project architecture and contributor guide`

---

## 🎨 Code & Styling Standards

When contributing code to the frontend repository:

1. **React Components**:
   - Keep components focused and modular.
   - Use standard React hooks (`useState`, `useEffect`, `useRef`).
   - Wrap dynamic or lazy-loaded routes in `<Suspense>` and handle errors gracefully using `<ErrorBoundary>`.

2. **Design System & Styling**:
   - Maintain the project's **muted dark aesthetic** (`#0b0f1a` / `#131b2e`).
   - Avoid high-saturation, neon glow effects or glossy gradients.
   - Use CSS custom variables defined in `global.css` (`var(--bg-base)`, `var(--border-subtle)`, `var(--text-primary)`).
   - Ensure responsive behavior on mobile screens ($\le 768\text{px}$).

3. **SEO & Accessibility**:
   - Use semantic HTML tags (`<article>`, `<section>`, `<header>`, `<figure>`, `<figcaption>`).
   - Include `alt` tags on all images and proper `aria` attributes on interactive elements.

---

## 🚀 Submitting Pull Requests

1. Verify that your code builds cleanly without linting errors:
   ```bash
   npm run build
   ```
2. Commit your changes and push them to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
3. Open a **Pull Request** against the `main` branch of `AbhijeetER/Project-NEXUS`.
4. Fill out the PR template with details of what was changed and how to test it.
5. Wait for team review and feedback!

---

Thank you for helping make **Project NEXUS** extraordinary! 🚀
