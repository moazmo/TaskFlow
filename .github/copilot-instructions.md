# TaskFlow - Desktop Task Management App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TaskFlow is a modern desktop task management application built with Electron, React, TypeScript, and Tailwind CSS. It features a clean, modern UI with drag-and-drop functionality, project organization, and local SQLite database storage.

## Architecture
- **Main Process**: Electron main process (`src/main.ts`) handles window management and database operations
- **Renderer Process**: React application with TypeScript (`src/renderer.tsx`)
- **Database**: SQLite with better-sqlite3 for local data persistence
- **State Management**: Zustand for client-side state management
- **UI Components**: Custom components with Radix UI primitives and Tailwind CSS
- **Styling**: Tailwind CSS with custom design system and dark/light theme support

## Key Features
- Task creation, editing, and management
- Project/category organization with color coding
- Priority levels (Low, Medium, High, Urgent)
- Due dates and overdue detection
- Status tracking (Pending, In Progress, Completed)
- Search and filtering capabilities
- Dark/light theme support
- Drag-and-drop interface
- Offline-first architecture

## Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure in `src/components/`
- Use Zustand stores for state management
- Implement responsive design with Tailwind CSS
- Follow the established naming conventions
- Use Radix UI primitives for complex UI components
- Ensure accessibility with proper ARIA labels
- Handle errors gracefully with try-catch blocks
- Use proper TypeScript interfaces for data structures

## Database Schema
- `projects`: Project/category information
- `tasks`: Main task data with relationships to projects
- `tags`: Task tagging system (future feature)
- `task_tags`: Many-to-many relationship for task tags

## Code Style
- Use functional components with React hooks
- Prefer composition over inheritance
- Use descriptive variable and function names
- Keep components focused and single-purpose
- Use proper TypeScript types and interfaces
- Follow the existing folder structure and naming conventions
