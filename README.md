## Vision

<img width="1940" height="1140" alt="BattleShipDiagram" src="https://github.com/user-attachments/assets/2e3132dc-6560-4eab-91c3-e53464e5f0fe" />

This project is a full stack web application composed of two components: a **React frontend** (client) and a **Node.js backend** (server).

- **REST API (HTTP)** — Used for standard request/response operations such as fetching data and performing CRUD actions, handled by Express.
- **WebSockets (Socket.IO)** — Used for real time, communication to enable live updates and decisions between players.

The Node.js backend uses **Express** to expose REST API endpoints and **Socket.IO** to manage game connections.

---

## Proposal

This project will be containerized using Docker using lightweight Alpine-based images:

- **Client:**  
  - `FROM node:18`
    - Base image provides Node.js 18 and npm pre-installed.
    - Chosen because React development requires Node.js, and Node 18 is stable and supported.
  - `WORKDIR /app`
    - Sets /app as the working directory inside the container.
    - All subsequent commands (COPY, RUN) run relative to /app.
  - `COPY package*.json ./`
    - Copies package.json and package-lock.json only.
    - This allows Docker to cache the npm install step efficiently.
  - `RUN npm install`
    - Installs dependencies defined in package.json.
  - `COPY . .`
    - Copies the full frontend source code into the container.
  - `EXPOSE 3000`
    - Declares port 3000 for the container.
    - React dev server listens here.
  - `CMD ["npm", "start"]`
    - Default command to run when the container starts.
    - Launches the React development server.

- **Server:**  
  - `FROM node:18`
    - Provides Node.js 18 for running server.
    - Chosen for stability and compatibility with Express.
  - `WORKDIR /app`
    - Sets /app as the working directory.
  - `COPY package*.json ./`
    - Copies package definitions first for caching.
  - `RUN npm install`
    - Installs backend dependencies.
  - `COPY . .`
    - Copies the full backend source code.
  - `EXPOSE 5000`
    - Declares backend port for communication with frontend.
  - `CMD ["node", "index.js"]`
    - Runs the main backend server file.

Using Alpine images reduces container size and improves startup performance while maintaining full Node.js functionality.

