import { Piece, Position } from './types';
import { PieceBase } from './piece.base';
import { increaseLetter } from '@chess/utils';

export class Pawn extends PieceBase {

  public type = Piece.Pawn;

  protected override getMoveDirections(): [number, number][] {
    const directions: [number, number][] = [];

    directions.push([1 * this.movementDirection, 0]);

    if (this.isAtStartPosition) {
      directions.push([2 * this.movementDirection, 0]);
    }

    return directions;
  }

  protected override shouldContinueCheckSquare(square: Position, loopIndex: number): boolean {
    return loopIndex <= 1 && this.store._isSquareFree(square);
  }

  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    super._updatePossibleMovements(piecesPosition);

    // Add attack movements for pawn
    const possibleAttackSquares: Position[] = [
      `${increaseLetter(this.col, 1)}${this.row + this.movementDirection}`,
      `${increaseLetter(this.col, -1)}${this.row + this.movementDirection}`,
    ];

    for (const square of possibleAttackSquares) {
      if (this.store._isSquareValid(square) && !this.store._isSquareFree(square) && piecesPosition[square]._player !== this._player) {
        this._possibleAttackMovements.push(square);
      }
    }
  }
}