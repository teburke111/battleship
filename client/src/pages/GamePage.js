import { useEffect, useState } from "react";
import Board from "../components/Board";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";


export default function GamePage() {
    const location = useLocation();
    const { username, roomId } = location.state || {};

    const navigate = useNavigate();

    const [playerBoard, setPlayerBoard] = useState(null);
    const [opponentBoard, setOpponentBoard] = useState(
    Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => "empty")
    )
    );

    console.log(playerBoard);


    useEffect(() => {
        socket.emit("join_room", roomId);
    }, [roomId]);

    useEffect(() => {
        const handleAttackResult = ({ row, col, result }) => {
            console.log("You attacked:", row, col, result);

            setOpponentBoard(prev => {
            const copy = prev.map(r => [...r]);
            copy[row][col] = result;
            return copy;
            });

            
        };

        socket.on("attack_result", handleAttackResult);

        return () => socket.off("attack_result", handleAttackResult);
        }, []);

    const handleAttack = (row, col) => {
        console.log("Attacking:", row, col);

        socket.emit("attack", {
            roomId,
            row,
            col,
        });
    };

    useEffect(() => {
        socket.on("defense_update", ({ row, col, result }) => {
            console.log("DEFENSE UPDATE:", row, col, result);

            setPlayerBoard(prev => {
            const copy = prev.map(r => [...r]);

            copy[row][col] =
                copy[row][col] === "ship" ? "hit" : "miss";

            return copy;
            });
        });

        return () => socket.off("defense_update");
        }, []);

  useEffect(() => {
  socket.on("opponent_attack", ({ row, col }) => {
    console.log("Enemy attacked:", row, col);

    setPlayerBoard((prev) => {
        const newBoard = prev.map((r) => [...r]);

        if (newBoard[row][col] === "ship") {
            newBoard[row][col] = "hit";
        } else {
            newBoard[row][col] = "miss";
        }

        return newBoard;
        });
    });

    return () => socket.off("opponent_attack");
    }, []);

  useEffect(() => {
    const fetchBoard = async () => {
        try {
        const res = await fetch(
            `${window.location.protocol}//${window.location.hostname}:5000/createBoard/${roomId}/${socket.id}`
        );

        const data = await res.json();

        setPlayerBoard(data.ships);
        } catch (err) {
        console.error("Error fetching board:", err);
        }
    };

    if (roomId && socket.id) {
        fetchBoard();
    }
    }, [roomId]);

  if (!playerBoard) return <h2>Loading...</h2>;

  return (
    <div className="game-container">
      <h2>Player: {username} | Room: {roomId}</h2>

      <div className="boards">
        <div>
          <h3>Your Board</h3>
          <Board board={playerBoard} isPlayer={true} />
        </div>

        <div>
          <h3>Opponent Board</h3>
            <Board
                board={opponentBoard}
                isPlayer={false}
                onAttack={handleAttack}
            />
        </div>
      </div>
    </div>
  );
}