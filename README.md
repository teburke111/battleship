## Architecture

<img width="1940" height="1140" alt="BattleShipDiagram" src="https://github.com/user-attachments/assets/2e3132dc-6560-4eab-91c3-e53464e5f0fe" />

<br />

This project is a full stack web application composed of two main components, a React frontend and a Node.js backend. The frontend was built using React and handles all client side interactions, while the backend works with creating users and game boards plus handling player communication and the game process. The backend is built using Express, which exposes REST API endpoints creating game boards using an ship place algorithm, adding users, and also test apis used during development. In addition to the REST API, the backend also uses Socket.IO to enable real time communication between clients, allowing for live updates and interactive gameplay decisions between players.

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

- Running `startup.sh` starts the entire application automatically by executing `docker compose up --build`. Instead of building everything locally, the system pulls prebuilt Docker images from Docker Hub and uses them to create and run the React frontend and Node.js backend in separate containers. These containers have their ports mapped so they can communicate internally through Docker networking while still being accessible externally through a web browser.

---

## Networking

## Networking

- Docker Compose automatically creates a bridge network for all services in the `docker-compose.yml` file, allowing containers to communicate with each other internally. Services can reference each other using their service names as hostnames, with Docker handling internal DNS resolution so no IP addresses are needed.

- Ports defined in `docker-compose.yml` expose the containers to the host machine, enabling external browser access. The React frontend runs on port `3000` and can be accessed through the CloudLab node’s public URL, such as `http://docker.teburke-297341.cloud-edu-pg0.clemson.cloudlab.us:3000/`, while still communicating internally with the backend.

```yaml
ports:
  - "3000:3000"  # React frontend
  - "5000:5000"  # Node backend
```

---

## Instructions

1. **Start a CloudLab Experiment**

Before running this project, you must create and start a CloudLab experiment using profile.py from this repo. Once the experiment is ready SSH into the experiment.

2. **Clone the repository:**
```bash
git clone https://github.com/teburke111/BattleShip.git
```

3. **Change into project directory:**
```bash
cd BattleShip
```

4. **Run deployment Script**
```bash
./startup.sh
```

5. **Access Front End**
- Access your website at: `http://<NODE_IP>:<NODEPORT>`


