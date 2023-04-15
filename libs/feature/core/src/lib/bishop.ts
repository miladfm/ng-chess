import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';
import { decreaseLetter, increaseLetter } from '@chess/utils';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

export class Bishop extends PieceBase {

  public type = Piece.Bishop;

  private config = inject(ConfigService);


  private diagonalDirections: [number, number][] = [
    [1, 1], // Top-Right
    [-1, 1], // Top-Left
    [1, -1], // Bottom-Right
    [-1, -1], // Bottom-Left
  ];


  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    this.possibleFreeMovements = [];
    this.possibleAttackMovements = [];

    // Iterate through each direction
    for (const [rowDir, colDir] of this.diagonalDirections) {

      let newRow = this.row + rowDir;
      let newCol = increaseLetter(this.col, colDir);

      // Keep moving in direction until reaching edge, blocked or attack
      while (this.store._isSquareValid(`${newCol}${newRow}`)) {
        const newSquare: Position = `${newCol}${newRow}`;

        if (!this.store._isSquareFree(newSquare)) {
          // Square is occupied by opponent piece
          if (piecesPosition[newSquare]._player !== this._player) {
            this.possibleAttackMovements.push(newSquare);
          }
          break;
        }

        // Square is empty and valid for free movement
        this.possibleFreeMovements.push(newSquare);

        // Move to next square in the direction
        newRow += rowDir;
        newCol = increaseLetter(newCol, colDir);
      }
    }
  }


}