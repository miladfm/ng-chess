import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';

export class Bishop extends PieceBase {

  public type = Piece.Bishop;

  private directions: [number, number][] = [
    [1, 1], // Top-Right
    [-1, 1], // Top-Left
    [1, -1], // Bottom-Right
    [-1, -1], // Bottom-Left
  ];

  protected override getMoveDirections(): [number, number][] {
    return this.directions;
  }

  protected override shouldContinueCheckSquare(square: Position, loopIndex: number): boolean {
    return this.store._isSquareValid(square);
  }
}