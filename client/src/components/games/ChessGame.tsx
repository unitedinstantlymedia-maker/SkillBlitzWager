import React, { useState } from "react";
import Chessboard from "react-chessboard";
import { Chess } from "chess.js";

const game = new Chess();

export default function ChessGame() {
  const [fen, setFen] = useState(game.fen());

  function onDrop(sourceSquare, targetSquare) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false;
    setFen(game.fen());
    return true;
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardWidth={Math.min(window.innerWidth, 480)} // автоматически под мобильный/десктоп
      />
    </div>
  );
}

