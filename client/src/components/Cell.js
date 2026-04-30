export default function Cell({ type, onClick, clickable }) {
  let className = "cell";

  if (type === "ship") className += " ship";
  if (type === "hit") className += " hit";
  if (type === "miss") className += " miss";

  return (
    <div
      className={className}
      onClick={clickable ? onClick : undefined}
    />
  );
}