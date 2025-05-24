# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web application that provides a browser-based interface for [pdsadmin](https://github.com/bluesky-social/pds/tree/main/pdsadmin) commands, allowing PDS (Personal Data Server) administration through a web UI instead of command line.

## Development Commands

```bash
# Install dependencies
pnpm i

# Start development server (includes local PDS setup)
pnpm dev

# Build for production
pnpm build

# Run linting and formatting checks
pnpm lint

# Fix linting and formatting issues
pnpm format

# Run type checking
pnpm typecheck

# Run end-to-end tests
pnpm e2e

# Preview production build
pnpm preview
```

Development server runs at: http://localhost:5173/pdsadmin-web/

Local PDS credentials:

- URL: http://localhost:2583
- Password: admin-pass

## Architecture

### State Management

- Uses Jotai for global state management
- Session state persisted in localStorage via `atomWithStorage`
- Key atoms in `src/atoms/`:
  - `session.ts`: Authentication state and PDS connection info
  - `account-list.ts`: Account data and pagination
  - `modal.ts`: Modal dialog state
  - `toast.ts`: Toast notification state

### PDS Communication

- `src/utils/pds.ts` contains the main `PDS` class for API communication
- Uses @atcute/client for AT Protocol communication
- Basic authentication with admin credentials
- Supports all major pdsadmin operations: account listing, takedown/untakedown, deletion, invite codes, crawl requests

### Component Structure

- Modal-based UI for all admin actions
- `src/components/modal/body/` contains specific modal content for each operation
- Infinite scroll for account listing
- Responsive design optimized for mobile-first approach

### Development Environment

- Automatically sets up and runs local AT Protocol dev environment
- Uses scripts in `scripts/` directory to manage local PDS instance
- Vite-based development with React and TypeScript
- TailwindCSS + DaisyUI for styling
