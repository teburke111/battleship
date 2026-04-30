import Cell from "./Cell";

export default function Board({ board, isPlayer, onAttack }) {
  const safeBoard =
    Array.isArray(board) && Array.isArray(board[0])
      ? board
      : Array.from({ length: 10 }, () =>
          Array.from({ length: 10 }, () => "empty")
        );

  return (
    <div className="board">
      {safeBoard.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`cell ${cell}`}
            onClick={
              !isPlayer && onAttack
                ? () => onAttack(rIdx, cIdx)
                : undefined
            }
          />
        ))
      )}
    </div>
  );
}