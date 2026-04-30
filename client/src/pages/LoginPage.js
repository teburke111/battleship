import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (!username || !roomId) return;
    navigate("/game", { state: { username, roomId } });
  };

  return (
    <div className="login-container">
      <h1>⚓ Battleship</h1>

      <input
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button onClick={handleEnter}>Enter Game</button>
    </div>
  );
}