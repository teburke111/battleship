const express = require("express");
const app = express();

const PORT = 5000;

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Hello from Node!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
