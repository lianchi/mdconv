# MDConv - Lightweight Markdown Preview & Export

A lightweight, elegant online Markdown preview and export tool built with Next.js 16.

## Features

- **Drag & Drop Upload**: Support `.md` and `.markdown` files (up to 10MB).
- **Real-time Preview**: Render standard Markdown and GFM (tables, task lists) with syntax highlighting.
- **Single File HTML Export**: Export fully self-contained HTML files with inline CSS (no external dependencies).
- **PDF Export**: High-fidelity PDF export via browser print (optimized styles).
- **Privacy Focused**: Client-side processing only. No file uploads to server.
- **Responsive Design**: Mobile-first, elegant UI with green theme.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Markdown Engine**: [remark](https://remark.js.org/) + [rehype](https://github.com/rehypejs/rehype)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linting**: [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mdconv.git
   cd mdconv
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit tests:
```bash
npm test
```

### Linting

Run ESLint:
```bash
npx eslint .
```

## Export Details

### HTML Export
The exported HTML is a single file containing:
- Reset CSS
- Minimal Markdown Styles (GitHub-like)
- Syntax Highlighting Styles (GitHub Light Theme)
- Your Markdown content rendered as HTML

It requires no internet connection to view.

### PDF Export
Uses the browser's native print functionality with optimized `@media print` styles to remove UI elements and ensure proper layout.

## License

MIT
