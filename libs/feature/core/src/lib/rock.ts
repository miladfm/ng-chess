import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';
import { increaseLetter } from '@chess/utils';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

export class Rock extends PieceBase {

  public type = Piece.Rook;

  private config = inject(ConfigService);


  private directions: [number, number][] = [
    [1, 0], // Top
    [0, 1], // Right
    [-1, 0], // Bottom
    [0, -1], // Left
  ];


  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    this.possibleFreeMovements = [];
    this.possibleAttackMovements = [];

    // Iterate through each direction
    for (const [rowDir, colDir] of this.directions) {

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