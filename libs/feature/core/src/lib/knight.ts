import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';
import { increaseLetter } from '@chess/utils';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

export class Knight extends PieceBase {

  public type = Piece.Knight;

  // List all possible movement directions
  protected directions: [number, number][] = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
  ];

  private config = inject(ConfigService);


  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    this.possibleFreeMovements = [];
    this.possibleAttackMovements = [];

    // Iterate through each direction
    for (const [rowDir, colDir] of this.directions) {

      const newRow = this.row + rowDir;
      const newCol = increaseLetter(this.col, colDir);
      const newSquare: Position = `${newCol}${newRow}`;

      if (!this.store._isSquareValid(newSquare)) {
        continue;
      }

      if (this.store._isSquareFree(newSquare)) {
        // Square is empty and valid for free movement
        this.possibleFreeMovements.push(newSquare);
      } else if (piecesPosition[newSquare]._player !== this._player) {
        // Square is occupied by opponent piece
        this.possibleAttackMovements.push(newSquare);
      }
    }
  }
}