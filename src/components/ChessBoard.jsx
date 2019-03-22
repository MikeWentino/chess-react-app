import React, { Component } from "react";
import autobind from "react-autobind";
import "./ChessBoard.css";

class ChessBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
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

  onDrop = (ev, row, col) => {
    let piece = ev.dataTransfer.getData("piece");
    let pieceRow = ev.dataTransfer.getData("row");
    let pieceCol = ev.dataTransfer.getData("col");

    const { board } = this.state;
    board[pieceRow][pieceCol] = "";
    board[row][col] = piece;
    this.setState({
      board
    });
    console.log("onDrop" + row + col);
    console.log("dragStop: " + piece + pieceRow + pieceCol);
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
