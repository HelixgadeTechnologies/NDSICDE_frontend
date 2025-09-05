# NDSICDE M&E Platform

A comprehensive monitoring and evaluation platform built with Next.js, featuring role-based access control and modular architecture.

## Project Overview

The NDSICDE M&E Platform is designed to streamline monitoring and evaluation processes across different organizational roles. The platform implements a role-based architecture that provides tailored experiences for various user types while maintaining security and data integrity.

## Architecture

### Directory Structure

#### `/app` - Application Routes
Contains all page components and routing logic for the platform. The folder structure directly maps to application routes using Next.js App Router conventions.

**Public Routes:**
- `login` - User authentication
- `reset-password` - Password recovery

**Role-Based Routes:**
- `admin` - Super administrator dashboard and controls
- `management` - Management and staff interfaces
- `partners` - Partner organization access
- `r-managers` - Request and retirement managers workspace
- `team-member` - Team member collaboration tools

Additional files include loading states, 404 error handling, and the root `page.tsx` which redirects unauthenticated users to the login page.

#### `/components` - Role-Specific Components
Houses custom components organized by user role, ensuring clean separation of concerns and role-specific functionality.

- `admin-components` - Administrative interface components
- `management-components` - Management dashboard elements
- `partners-components` - Partner-specific UI components
- Additional role-based component directories

#### `/context` - Global State Management
Contains React Context providers for application-wide state management, enabling consistent data flow across all components and routes.

#### `/lib` - Core Library Functions
Centralized location for API interactions and configuration management.

**Subdirectories:**
- `api/` - API service layer with files organized by functional domain (e.g., `auth.ts` for authentication services)
- `config/` - Static configuration files including sidebar navigation, dropdown options, and application constants

#### `/store` - State Management
Implements application state management using modern state management patterns. Store files are organized by role and screen functionality to maintain modularity.

#### `/types` - TypeScript Definitions
Comprehensive type definitions for the entire application, ensuring type safety and developer experience across all components and services.

#### `/ui` - Shared UI Components
Reusable interface components used across multiple roles and screens.

**Subdirectories:**
- `form/` - Form-specific components including inputs, validators, and form layouts

#### `/utils` - Utility Functions
Helper functions and utilities organized by functionality, providing common operations used throughout the application.

## Key Features

- **Role-Based Access Control**: Secure, role-specific routing and component rendering
- **Modular Architecture**: Clean separation of concerns with organized component structure
- **Type Safety**: Comprehensive TypeScript implementation
- **Responsive Design**: Mobile-first design approach with adaptive layouts
- **Reusable Components**: Shared UI library for consistent user experience
- **Centralized Configuration**: Easy-to-maintain configuration management

## Development Guidelines

### Component Organization
- Role-specific components are isolated in their respective directories
- Shared components reside in the `/ui` directory
- Form components are further organized in `/ui/form` for better maintainability

### State Management
- Global state is managed through React Context in the `/context` directory
- Role-specific state is handled in the `/store` directory
- Component-level state uses React hooks

### API Integration
- All API calls are centralized in the `/lib/api` directory
- Services are organized by functional domain for better maintainability
- Consistent error handling and response formatting

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run the development server: `npm run dev`
5. Access the application at `http://localhost:3000`

## Technology Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Zustand Stores
- **Icons**: Iconify React
- **Authentication**: Role-based authentication system

## Contributing

Please follow the established directory structure and naming conventions when contributing to the project. Ensure all new components are properly typed and placed in their appropriate directories based on role specificity or shared usage.