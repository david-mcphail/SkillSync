# SkillSync - Skills Management Platform

A comprehensive application for managing employee skills, projects, and resources. This application helps organizations track skill proficiency, manage project staffing, and optimize resource allocation.

## 🚀 Features

-   **Dashboard**: High-level overview of key metrics and system status.
-   **Profile Management**: Manage user profiles, including skills, tags, and personal details.
-   **Project Management**:
    -   Create and manage projects.
    -   Define roles and skill requirements.
    -   Assign resources to projects.
-   **Resource Management**:
    -   Directory of all users.
    -   Group and Department management.
-   **Skills Taxonomy**:
    -   Configurable hierarchy of Categories, Subcategories, and Tags.
    -   Master list of skills.

## 🛠️ Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [Material UI (MUI) v7](https://mui.com/)
-   **Data Grid**: [@mui/x-data-grid](https://mui.com/x/react-data-grid/)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **Testing**: [Playwright](https://playwright.dev/)

## 📦 Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd skills-management
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

Build the application for production:

```bash
npm run build
```

### Running Tests

Run End-to-End (E2E) tests with Playwright:

```bash
npm run test:e2e
```

## 🚧 Current Status

The application currently uses a **mock service layer** (`src/services/mockService.ts`) to simulate backend interactions. All data is stored in memory or local state and will reset on reload (unless persisted to localStorage in specific implementations).
