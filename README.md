# Management App Vue

A modern project management application built with Vue 3, TypeScript, and Tailwind CSS. This application allows users to manage projects and tasks efficiently with features like Kanban and Table views, filtering, sorting, and real-time status updates.

[Visit Live Demo](https://iluxaboy.github.io/Management-app-vue/)

## Features

- **Project Management**: Create and track multiple projects.
- **Task Tracking**: Add tasks to projects with deadlines, performers, and statuses.
- **Views**: Switch between Table and Kanban views for flexible task visualization.
- **Filtering & Sorting**: Filter projects by name and sort by various criteria (ID, Name, Status, etc.).
- **Data Persistence**: Data is persisted using a local JSON server, simulating a real backend environment.
- **Notifications**: Real-time notifications for actions (Success/Error).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (version 20.19.0 or higher recommended)
- npm (Node Package Manager)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:

   ```sh
   cd Management-app-vue
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

### Running the Application

To fully run the application, you need to start both the backend (JSON server) and the frontend.

1. **Start the Backend Server**:
   This application uses `json-server` to mock a backend API.
   Open a terminal and run:

   ```sh
   npm run db
   ```

   The API server will start at `http://localhost:3000`.

2. **Start the Frontend Development Server**:
   Open a **new terminal window/tab** and run:
   ```sh
   npm run dev
   ```
   The application will start, typically at `http://localhost:5173` (check the terminal output for the exact URL).

## Technologies Used

- **[Vue 3](https://vuejs.org/)**: The progressive JavaScript framework.
- **[TypeScript](https://www.typescriptlang.org/)**: For type safety and better developer experience.
- **[Pinia](https://pinia.vuejs.org/)**: The intuitive store for Vue.js.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework.
- **[Axios](https://axios-http.com/)**: Promise based HTTP client for the browser and node.js.
- **[JSON Server](https://github.com/typicode/json-server)**: Get a full fake REST API with zero coding.
