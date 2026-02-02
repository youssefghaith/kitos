# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 16 website for a Middle East-based company selling high-end pool tables and marble tables. The site features an interactive customizer allowing customers to visualize and configure their tables before requesting a quote.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
Starts the Next.js development server at http://localhost:3000 with hot module reloading.

### Building for Production
```bash
npm run build
```
Creates an optimized production build.

### Running Production Build Locally
```bash
npm run start
```
Starts the production server (requires `npm run build` first).

### Linting
```bash
npm run lint
```
Runs ESLint with Next.js-specific rules.

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Font**: Geist (sans and mono variants via next/font)

### Project Structure
- **`app/`**: Next.js App Router pages and layouts
  - Uses React Server Components by default
  - `layout.tsx` is the root layout with font configuration
  - `globals.css` contains Tailwind directives and global styles
- **`components/`**: Reusable React components
- **`public/`**: Static assets (images, fonts, etc.)

### Path Aliases
The project uses `@/*` as an alias for the root directory (configured in `tsconfig.json`).

### Key Implementation Details

**Product Categories**: The site supports two product types:
- Pool tables (wood-based with felt surfaces)
- Marble tables

**Customizer Features**: 
- Real-time visual preview of selected options
- Configuration options include: size, materials (wood type or marble), felt color (for pool tables), leg style, and accessories
- Live price calculation based on selections
- WhatsApp integration for quote requests with pre-filled configuration details

**Styling Approach**:
- Tailwind CSS with mobile-first responsive design
- Geist font family is loaded and applied via CSS variables (`--font-geist-sans`, `--font-geist-mono`)

### TypeScript Configuration
- Strict mode is enabled
- Import alias `@/*` maps to project root
- JSX is handled via `react-jsx` transform (no need to import React in every file)
