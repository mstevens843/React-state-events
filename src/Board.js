import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 * This renders an HTML table of individual <Cell /> components.
 * It handles clicks on cells by flipping cells and the ones around it.
 */

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.3 }) {
  const [board, setBoard] = useState(createBoard());
  const [hasWon, setHasWon] = useState(false);

  /** createBoard: create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** hasWon: check if all lights are off */
  function checkHasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  /** flipCellsAround: flip cell and neighboring cells around the clicked cell */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);
      const boardCopy = oldBoard.map(row => [...row]);

      const flipCell = (y, x) => {
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Flip the clicked cell and its neighbors
      flipCell(y, x);
      flipCell(y - 1, x); // Flip above
      flipCell(y + 1, x); // Flip below
      flipCell(y, x - 1); // Flip left
      flipCell(y, x + 1); // Flip right

      return boardCopy;
    });

    setHasWon(checkHasWon());
  }

  // if the game is won, just show a winning message & render nothing else
  if (hasWon) {
    return <div className="Board-Winner">You won!</div>;
  }

  // make table board
  let tblBoard = [];
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
