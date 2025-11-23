# Application State & Improvement Opportunities

## Current State

### Tech Stack
-   **Framework**: React 19
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **UI Library**: Material UI (MUI) v7
-   **Data Grid**: @mui/x-data-grid
-   **Routing**: React Router DOM v7
-   **Testing**: Playwright (E2E)
-   **Linting**: ESLint

### Architecture
-   **Client-Side Rendering (CSR)**: The application is a standard SPA.
-   **State Management**:
    -   `AuthContext` for user authentication state.
    -   Local component state (`useState`, `useReducer`) for UI logic.
-   **Data Layer**:
    -   `mockService.ts`: A comprehensive mock service simulating a backend with `setTimeout` for latency.
    -   Data models defined in `src/types/models.ts`.
-   **Styling**:
    -   Custom MUI Theme (`src/theme.ts`) implementing a "Glassmorphism" dark mode.
    -   Heavy use of inline `sx` props for component styling.

### Key Features
1.  **Authentication**: Mocked login flow.
2.  **Dashboard**: Overview of key metrics.
3.  **Profile Management**: User details, skills, and tags.
4.  **Project Management**:
    -   Project CRUD.
    -   Role definition and requirements.
    -   Resource assignment.
5.  **Resource Management**:
    -   User directory.
    -   Group/Department management.
6.  **Skills Management**:
    -   Taxonomy configuration (Categories, Subcategories, Tags).
    -   Skills master list.

## Opportunities for Improvement

### 1. Architecture & Data Fetching
-   **Backend Integration**: The application is currently 100% mocked. A real backend API needs to be integrated.
-   **Data Fetching Library**: Adopt **TanStack Query (React Query)**. This will replace the manual `useEffect` data fetching patterns, providing caching, loading states, and error handling out of the box.
-   **State Management**: For complex global state (beyond Auth), consider **Zustand** or **Redux Toolkit**, though React Query often reduces the need for this.

### 2. Code Quality & Maintainability
-   **Form Handling**: Implement **React Hook Form** combined with **Zod** for schema validation. This will replace manual form state management and improve validation logic.
-   **Style Extraction**: Refactor heavy `sx` prop usage into reusable styled components or theme mixins to improve readability and performance.
-   **Type Safety**: Ensure strict type checking is enabled and used consistently. Avoid `any` types.
-   **Cleanup**: Remove production `console.log` statements (found in `ProfilePage.tsx` and `mockService.ts`).

### 3. User Experience (UX)
-   **Feedback Mechanisms**: Implement a global **Toast/Snackbar** system for success/error notifications (currently using `console.error` or basic alerts).
-   **Loading States**: Standardize loading skeletons or spinners across all data-fetching components.
-   **Error Boundaries**: Add React Error Boundaries to gracefully handle runtime errors.

### 4. Testing
-   **Unit/Integration Tests**: Currently, only E2E tests (Playwright) exist. Add **Vitest** and **React Testing Library** for component and utility testing.
-   **Test Coverage**: Aim for high coverage on critical business logic (e.g., skill matching algorithms).

### 5. Features to Complete
-   **Real Authentication**: Integrate with an Identity Provider (Auth0, Firebase, etc.).
-   **RBAC (Role-Based Access Control)**: Enforce permissions on the frontend (hiding buttons/routes) based on user roles (Admin vs. User).
-   **Skill Matching Logic**: The "Smart Staffing" algorithm in `mockService` is a good prototype but needs to be moved to the backend or optimized for the frontend.

### 6. Accessibility (a11y)
-   **Audit**: Run an accessibility audit (e.g., using Lighthouse or axe-core).
-   **Keyboard Navigation**: Ensure all custom interactive elements (like cards with actions) are keyboard accessible.
