import { Piece, Player, Position } from './types';
import { decreaseLetter, increaseLetter } from '@chess/utils';
import { PieceBase } from './piece.base';
import { inject } from '@angular/core';
import { StoreService } from './store.service';

export class Pawn extends PieceBase {

  public type = Piece.Pawn;

  override _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    this.updatePossibleFreeMovements(piecesPosition);
    this.updatePossibleAttackMovements(piecesPosition);
  }

  private updatePossibleFreeMovements(piecesPosition: Record<Position, PieceBase>) {
    this.possibleFreeMovements = []

    // Add the forward movement by one row in the current direction.

    // One square move forward
    const oneForward= this.getForwardMovement(1);
    if (this.store._isSquareFree(oneForward) && this.store._isSquareValid(oneForward)) {
      this.possibleFreeMovements.push(oneForward);
    }

    // Two square move forward
    // If the pawn hasn't moved yet, it can move two squares forward
    const twoForward= this.getForwardMovement(2);
    if (this.isAtStartPosition && this.store._isSquareFree(twoForward) && this.store._isSquareValid(twoForward)) {
      this.possibleFreeMovements.push(twoForward);
    }
  }

  protected updatePossibleAttackMovements(piecesPosition: Record<Position, PieceBase>) {
    this.possibleAttackMovements = [];
    // Check the diagonal squares in front of the pawn for capturing
    const diagonal = this.getDiagonalForwardMovement(1);
    diagonal.forEach(square => {
      if (!this.store._isSquareFree(square) && this.store._isSquareValid(square) && piecesPosition[square]._player !== this._player) {
        this.possibleAttackMovements.push(square);
      }
    });
  }

  /**
   * Returns the position of the pawn after moving a given number of rows forward in the current direction.
   *
   * @param movement The number of rows to move forward.
   * @returns The new position of the pawn.
   */
  private getForwardMovement(movement: 1 | 2): Position {
    const row = this.row + (movement * this.movementDirection);
    return `${this.col}${row}`
  }

  private getDiagonalForwardMovement(movement: number): Position[] {
    const row = this.row + (movement * this.movementDirection);
    const col1 = increaseLetter(this.col);
    const col2 = decreaseLetter(this.col);
    return [col1, col2]
      .filter(col => col !== null)
      .map(col => `${col}${row}` as Position);
  }
}