## Architecture

<img width="1940" height="1140" alt="BattleShipDiagram" src="https://github.com/user-attachments/assets/2e3132dc-6560-4eab-91c3-e53464e5f0fe" />

This project is a full stack web application composed of two components: a **React frontend** (client) and a **Node.js backend** (server).

- **REST API (HTTP)** — Used for standard request/response operations such as fetching data and performing CRUD actions, handled by Express.
- **WebSockets (Socket.IO)** — Used for real time, communication to enable live updates and decisions between players.

The Node.js backend uses **Express** to expose REST API endpoints and **Socket.IO** to manage game connections.

---

## Build Process

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

- Running `docker compose up --build` runs the React frontend and Node.js backend in separate containers with mapped ports, allowing them to communicate internally and be accessed externally from a browser.

---

## Networking

- Docker Compose automatically creates a **bridge network** for all services defined in the `docker-compose.yml` file.
- Containers on the same network can communicate using their **service names** as hostnames.  

  For example:
  - React frontend can call the Node backend at:  
    ```text
    http://server:5000/api/test
    ```
    Here, `server` is the **service name** defined in `docker-compose.yml`.

- Docker handles **internal DNS resolution**, so you don’t need to use IP addresses.  
- Ports exposed in the Dockerfiles (`3000` for React, `5000` for Node) are mapped to host ports via `docker-compose.yml`:


**External access (in browser):**  
  You can access your containers from a browser using the hostname and the mapped ports defined in `docker-compose.yml`.

  For example:
  - User can access React frontend from browser using:  
    ```text
    http://docker.teburke-297341.cloud-edu-pg0.clemson.cloudlab.us:3000/
    ```
  

```yaml
ports:
  - "3000:3000"  # React frontend
  - "5000:5000"  # Node backend

---

## Instructions

# 1. Start a CloudLab Experiment

Before running this project, you must create and start a CloudLab experiment using profile.py from this repo. Once the experiment is ready SSH into the experiment.

# 2. Clone the repository:
```bash
git clone https://github.com/teburke111/Verus.git
```

# 3. Change into project directory:
```bash
cd BattleShip
```

4. Run deployment Script
```bash
./startup.sh
```

5. **Access Front End**
- Access your website at: `http://<NODE_IP>:<NODEPORT>`


