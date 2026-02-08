## Vision

<img width="1940" height="1140" alt="BattleShipDiagram" src="https://github.com/user-attachments/assets/2e3132dc-6560-4eab-91c3-e53464e5f0fe" />

This project is a full stack web application composed of two components: a **React frontend** (client) and a **Node.js backend** (server).

- **REST API (HTTP)** — Used for standard request/response operations such as fetching data and performing CRUD actions, handled by Express.
- **WebSockets (Socket.IO)** — Used for real time, communication to enable live updates and decisions between players.

The Node.js backend uses **Express** to expose REST API endpoints and **Socket.IO** to manage game connections.

---

## Proposal

This project will be containerized using Docker using lightweight Alpine-based images:

- **Frontend:**  
  - `node:alpine`  
  - Used to install dependencies and build the React application

- **Backend:**  
  - `node:alpine`  
  - Runs the Express server and Socket.IO for real time communication

Using Alpine images reduces container size and improves startup performance while maintaining full Node.js functionality.

