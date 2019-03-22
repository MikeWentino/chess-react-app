import React, { Component } from "react";
import autobind from "react-autobind";
import "./ChessBoard.css";

class ChessBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      white: "top", // TODO :: could make this an enum
      board: [
        // TODO :: could populate this with a loop
        ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"]
      ]
    };

    console.log(this.state.board[0][0]);
    console.log(this.state.board[0][1]);
    console.log(this.state.board[1][1]);

    autobind(this);
  }

  onDragStart = (ev, piece, row, col) => {
    console.log("dragstart:", piece, row, col);
    ev.dataTransfer.setData("piece", piece);
    ev.dataTransfer.setData("row", row);
    ev.dataTransfer.setData("col", col);
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  validPawnMoves = (color, row, col) => {
    const validMoves = [];
    //first move two-move advance
    if (
      color === "w" &&
      row === 1 &&
      this.isPositionOpen(row + 1, col) &&
      this.isPositionOpen(row + 2, col)
    ) {
      console.log("hit 1");
      validMoves.push({ x: row + 2, y: col });
    } else if (
      color == "b" &&
      row === 6 &&
      this.isPositionOpen(row - 1, col) &&
      this.isPositionOpen(row - 2, col)
    ) {
      console.log("hit 2");
      validMoves.push({ x: row - 2, y: col });
    }

    //single move advance
    if (color === "w" && this.isPositionOpen(row + 1, col)) {
      console.log("hit 3");
      validMoves.push({ x: row + 1, y: col });
    } else if (color === "b" && this.isPositionOpen(row - 1, col)) {
      console.log("hit 4");
      validMoves.push({ x: row - 1, y: col });
    }

    //capture diagonal
    if (color === "w" && this.isPositionEnemy(color, row + 1, col + 1)) {
      console.log("hit 5");
      validMoves.push({ x: row + 1, y: col + 1 });
    }

    if (color === "w" && this.isPositionEnemy(color, row + 1, col - 1)) {
      console.log("hit 6");
      validMoves.push({ x: row + 1, y: col - 1 });
    }

    if (color === "b" && this.isPositionEnemy(color, row - 1, col + 1)) {
      console.log("hit 7");
      validMoves.push({ x: row - 1, y: col + 1 });
    }

    if (color === "b" && this.isPositionEnemy(color, row - 1, col - 1)) {
      console.log("hit 8");
      validMoves.push({ x: row - 1, y: col - 1 });
    }

    // TODO :: en passant

    // TODO :: pawn promotion

    return validMoves;
  };

  validRookMoves = (color, row, col) => {
    let validMoves = [];

    //moving Up
    let move = { x: row, y: col };
    let nextMove = { x: row + 1, y: col };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x + 1, y: nextMove.y };
      validMoves.push({ x: move.x, y: move.y });
      console.log(" hit move up: " + move.x + " " + move.y);
    }

    //moving down
    move = { x: row, y: col };
    nextMove = { x: row - 1, y: col };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move down");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x - 1, y: nextMove.y };
      validMoves.push({ x: move.x, y: move.y });
    }

    //moving right
    move = { x: row, y: col };
    nextMove = { x: row, y: col + 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move right");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x, y: nextMove.y + 1 };
      validMoves.push({ x: move.x, y: move.y });
    }

    //moving left
    move = { x: row, y: col };
    nextMove = { x: row, y: col - 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move left");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x, y: nextMove.y - 1 };
      validMoves.push({ x: move.x, y: move.y });
    }

    return validMoves;
  };

  validKnightMoves = (color, row, col) => {
    const validMoves = [];

    if (this.isPositionValid(color, row + 2, col + 1)) {
      validMoves.push({ x: row + 2, y: col + 1 });
    }
    if (this.isPositionValid(color, row + 2, col - 1)) {
      validMoves.push({ x: row + 2, y: col - 1 });
    }
    if (this.isPositionValid(color, row - 2, col + 1)) {
      validMoves.push({ x: row - 2, y: col + 1 });
    }
    if (this.isPositionValid(color, row - 2, col - 1)) {
      validMoves.push({ x: row - 2, y: col - 1 });
    }
    if (this.isPositionValid(color, row + 1, col + 2)) {
      validMoves.push({ x: row + 1, y: col + 2 });
    }
    if (this.isPositionValid(color, row + 1, col - 2)) {
      validMoves.push({ x: row + 1, y: col - 2 });
    }
    if (this.isPositionValid(color, row - 1, col + 2)) {
      validMoves.push({ x: row - 1, y: col + 2 });
    }
    if (this.isPositionValid(color, row - 1, col - 2)) {
      validMoves.push({ x: row - 1, y: col - 2 });
    }

    return validMoves;
  };

  validBishopMoves = (color, row, col) => {
    let validMoves = [];

    //moving Up
    let move = { x: row, y: col };
    let nextMove = { x: row + 1, y: col + 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x + 1, y: nextMove.y + 1 };
      validMoves.push({ x: move.x, y: move.y });
      console.log(" hit move up: " + move.x + " " + move.y);
    }

    //moving down
    move = { x: row, y: col };
    nextMove = { x: row - 1, y: col + 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move down");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x - 1, y: nextMove.y + 1 };
      validMoves.push({ x: move.x, y: move.y });
    }

    //moving right
    move = { x: row, y: col };
    nextMove = { x: row + 1, y: col - 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move right");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x + 1, y: nextMove.y - 1 };
      validMoves.push({ x: move.x, y: move.y });
    }

    //moving left
    move = { x: row, y: col };
    nextMove = { x: row - 1, y: col - 1 };
    while (
      this.isPositionOnBoard(nextMove.x, nextMove.y) &&
      !this.isPositionEnemy(color, move.x, move.y) &&
      (this.isPositionOpen(nextMove.x, nextMove.y) ||
        this.isPositionEnemy(color, nextMove.x, nextMove.y))
    ) {
      console.log(" hit move left");
      move = { x: nextMove.x, y: nextMove.y };
      nextMove = { x: nextMove.x - 1, y: nextMove.y - 1 };
      validMoves.push({ x: move.x, y: move.y });
    }

    return validMoves;
  };

  validQueenMoves = (color, row, col) => {
    return this.validRookMoves(color, row, col).concat(
      this.validBishopMoves(color, row, col)
    );
  };

  validKingMoves = (color, row, col) => {
    const validMoves = [];

    if (this.isPositionValid(color, row + 1, col)) {
      validMoves.push({ x: row + 1, y: col });
    }

    if (this.isPositionValid(color, row - 1, col)) {
      validMoves.push({ x: row - 1, y: col });
    }

    if (this.isPositionValid(color, row, col + 1)) {
      validMoves.push({ x: row, y: col + 1 });
    }

    if (this.isPositionValid(color, row, col - 1)) {
      validMoves.push({ x: row, y: col - 1 });
    }

    if (this.isPositionValid(color, row + 1, col + 1)) {
      validMoves.push({ x: row + 1, y: col + 1 });
    }

    if (this.isPositionValid(color, row - 1, col - 1)) {
      validMoves.push({ x: row - 1, y: col - 1 });
    }

    if (this.isPositionValid(color, row - 1, col + 1)) {
      validMoves.push({ x: row - 1, y: col + 1 });
    }

    if (this.isPositionValid(color, row + 1, col - 1)) {
      validMoves.push({ x: row + 1, y: col - 1 });
    }

    //castling

    return validMoves;
  };

  validPieceMoves = (piece, row, col) => {
    console.log("validPieceMoves: " + piece[0] + " " + row + " " + col);
    if (piece[1] == "p") {
      return this.validPawnMoves(piece[0], row, col);
    } else if (piece[1] == "r") {
      return this.validRookMoves(piece[0], row, col);
    } else if (piece[1] == "n") {
      return this.validKnightMoves(piece[0], row, col);
    } else if (piece[1] == "b") {
      return this.validBishopMoves(piece[0], row, col);
    } else if (piece[1] == "q") {
      return this.validQueenMoves(piece[0], row, col);
    } else if (piece[1] == "k") {
      return this.validKingMoves(piece[0], row, col);
    }
    return [];
    //throw err -> no piece of that type
  };

  isPositionValid = (color, x, y) => {
    return (
      this.isPositionOnBoard(x, y) &&
      (this.isPositionOpen(x, y) || this.isPositionEnemy(color, x, y))
    );
  };

  isPositionOnBoard = (x, y) => {
    console.log("isPositionOnBoard: " + x + " " + y);
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      console.log("  YES");
      return true;
    }

    console.log("  NO");
    return false;
  };

  isPositionOpen = (x, y) => {
    const { board } = this.state;
    console.log("isPositionOpen");
    console.log(x + " " + y);
    if (!board[x][y]) {
      return true;
    }

    return false;
  };

  // checking if the move will put the moving team in check
  isPositionSafe = (color, x, y) => {};

  isPositionEnemy = (color, x, y) => {
    const { board } = this.state;
    console.log("isPositionEnemy");
    console.log(color + " " + x + " " + y);
    if (board[x][y] && board[x][y][0] != color) {
      console.log("  YES: " + board[x][y][0]);
      return true;
    }
    console.log("  NO");
    return false;
  };

  validateMove = (piece, pieceRow, pieceCol, row, col) => {
    const validMoves = this.validPieceMoves(piece, pieceRow, pieceCol);
    console.log("validateMoves");
    console.log(validMoves);
    console.log(
      piece + " " + pieceRow + " " + pieceCol + " " + row + " " + col
    );

    for (let i = 0; i < validMoves.length; i++) {
      const validMove = validMoves[i];
      console.log(
        "->" + validMove.x + " == " + row + ", " + validMove.y + " == " + col
      );
      console.log(parseInt(validMove.x) == parseInt(row));
      console.log(parseInt(validMove.y) == parseInt(col));
      //TODO :: might be able to get rid f parseInt
      if (
        parseInt(validMove.x) == parseInt(row) &&
        parseInt(validMove.y) == parseInt(col)
      ) {
        // TODO :: check if move puts the current team in check
        // use isPositionSafe() change name
        return true;
      }
    }

    console.log("NOT VALID");
    return false;
  };

  onDrop = (ev, row, col) => {
    let piece = ev.dataTransfer.getData("piece");
    let pieceRow = parseInt(ev.dataTransfer.getData("row"));
    let pieceCol = parseInt(ev.dataTransfer.getData("col"));

    console.log("dragStop: " + piece + " " + row + " " + col);

    if (this.validateMove(piece, pieceRow, pieceCol, row, col)) {
      const { board } = this.state;
      board[pieceRow][pieceCol] = "";
      board[row][col] = piece;
      this.setState({
        board
      });
    }
  };

  render() {
    const { board } = this.state;
    return (
      <React.Fragment>
        <div className="chess-board board chess-board-component">
          <div className="Pieces">
            {board.map((row, rowNum) => {
              return row.map((square, colNum) => {
                console.log("->" + square + colNum + rowNum);
                const coord = `0${colNum + 1}0${rowNum + 1}`;
                return (
                  <React.Fragment>
                    {square !== "" ? (
                      <div
                        id={`piece-${coord}`}
                        className={`piece grabable ${square} square-${coord}`}
                        onDragStart={e =>
                          this.onDragStart(e, square, rowNum, colNum)
                        }
                        onDragOver={e => this.onDragOver(e)}
                        onDrop={e => this.onDrop(e, rowNum, colNum)}
                        draggable
                      />
                    ) : (
                      <div
                        id={`square-${coord}`}
                        onDragOver={e => this.onDragOver(e)}
                        onDrop={e => this.onDrop(e, rowNum, colNum)}
                        className={`piece square-${coord}`}
                      />
                    )}
                  </React.Fragment>
                );
              });
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChessBoard;
