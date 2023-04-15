import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';
import { increaseLetter } from '@chess/utils';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

export class King extends PieceBase {

  public type = Piece.King;

  private config = inject(ConfigService);

  private directions: [number, number][] = [
    [1, 1], // Top-Right
    [-1, 1], // Top-Left
    [1, -1], // Bottom-Right
    [-1, -1], // Bottom-Left,
    [1, 0], // Top
    [0, 1], // Right
    [-1, 0], // Bottom
    [0, -1], // Left
  ];


  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    // TODO: Remove check square from free movements
    this.possibleFreeMovements = [];
    this.possibleAttackMovements = [];

    // Iterate through each direction
    for (const [rowDir, colDir] of this.directions) {
      const newRow = this.row + rowDir;
      const newCol = increaseLetter(this.col, colDir);
      const newSquare: Position = `${newCol}${newRow}`;

      if (this.store._isSquareValid(newSquare)) {
        if (!this.store._isSquareFree(newSquare)) {
          // Square is occupied by opponent piece
          if (piecesPosition[newSquare]._player !== this._player) {
            this.possibleAttackMovements.push(newSquare);
          }
        } else {
          // Square is empty and valid for free movement
          this.possibleFreeMovements.push(newSquare);
        }
      }
    }
  }
}