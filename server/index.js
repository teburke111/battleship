const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 5000;

const rooms = {};
// roomId -> {
//   players: [socketId],
//   boards: { socketId: board }
// }

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // =========================
  // JOIN ROOM
  // =========================
  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        boards: {},
        turnIndex: 0,
      };
    }

    console.log(rooms[roomId].players.length);
    

    if (!rooms[roomId].players.includes(socket.id)) {
      rooms[roomId].players.push(socket.id);
    }

    io.to(roomId).emit("room_update", {
      players: rooms[roomId].players.length,
    });
  });

  // =========================
  // ATTACK
  // =========================
  socket.on("attack", ({ roomId, row, col }) => {
    const room = rooms[roomId];

    if (!room) {
      console.log("Room not found");
      return;
    }

    if (room.players.length < 2) {
      console.log("Waiting for opponent...");
      return;
    }

    const attackerId = socket.id;
    const opponentId = room.players.find(id => id !== attackerId);

    if (!opponentId) {
      console.log("Opponent not found");
      return;
    }

    const opponentBoard = room.boards[opponentId];

    if (!opponentBoard) {
      console.log("Opponent board missing");
      return;
    }

    console.log("=== DEBUG ATTACK ===");
    console.log("Row:", row, "Col:", col);
    console.log("Board row:", opponentBoard[row]);
    console.log("Cell value:", opponentBoard[row]?.[col]);

    const cell = opponentBoard[row][col];

    // 🚫 prevent duplicate attacks
    if (cell === "hit" || cell === "miss") {
      io.to(attackerId).emit("attack_result", {
        row,
        col,
        result: cell,
      });
      return;
    }

    // 🎯 determine hit
    const isHit = cell === "ship";

    // update board
    opponentBoard[row][col] = isHit ? "hit" : "miss";

    console.log(`Attack at (${row}, ${col}) → ${isHit ? "HIT" : "MISS"}`);

    // send result to attacker
    io.to(attackerId).emit("attack_result", {
      row,
      col,
      result: isHit ? "hit" : "miss",
    });

    // send update to defender
    io.to(opponentId).emit("defense_update", {
      row,
      col,
      result: isHit ? "hit" : "miss",
    });
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(id => id !== socket.id);
      delete room.boards[socket.id];

      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

// =========================
// ROUTES
// =========================
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.get("/createBoard/:roomId/:socketId", (req, res) => {
  const { roomId, socketId } = req.params;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      boards: {},
    };
  }

  // 🚫 DO NOT regenerate if already exists
  if (rooms[roomId].boards[socketId]) {
    return res.json({
      ships: rooms[roomId].boards[socketId],
    });
  }

  const ships = generateShips();
  const board = createBoardFromShips(ships);

  rooms[roomId].boards[socketId] = board;

  console.log("Generated board via API for:", socketId);

  console.log(board);

  res.json({ ships: board });
});

// =========================
// START SERVER
// =========================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// =========================
// HELPERS
// =========================

function createBoardFromShips(ships, size = 10) {
  const board = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "empty")
  );

  ships.forEach(({ row, col }) => {
    board[row][col] = "ship";
  });

  return board;
}

function generateShips(boardSize = 10) {
  const shipLengths = [5, 4, 4, 3, 3, 2, 2, 2, 2];
  const ships = [];
  const occupied = new Set();

  const key = (r, c) => `${r},${c}`;

  const isValidPlacement = (row, col) => {
    return (
      row >= 0 &&
      row < boardSize &&
      col >= 0 &&
      col < boardSize &&
      !occupied.has(key(row, col))
    );
  };

  const markSurroundings = (row, col) => {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
          occupied.add(key(r, c));
        }
      }
    }
  };

  for (let length of shipLengths) {
    let placed = false;

    while (!placed) {
      const isHorizontal = Math.random() < 0.5;

      const startRow = Math.floor(Math.random() * boardSize);
      const startCol = Math.floor(Math.random() * boardSize);

      const newShip = [];

      for (let i = 0; i < length; i++) {
        const row = isHorizontal ? startRow : startRow + i;
        const col = isHorizontal ? startCol + i : startCol;

        if (!isValidPlacement(row, col)) {
          newShip.length = 0;
          break;
        }

        newShip.push({ row, col });
      }

      if (newShip.length === length) {
        for (const { row, col } of newShip) {
          occupied.add(key(row, col));
        }

        for (const { row, col } of newShip) {
          markSurroundings(row, col);
        }

        ships.push(...newShip);
        placed = true;
      }
    }
  }

  return ships;
}