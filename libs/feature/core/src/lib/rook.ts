import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';

export class Rook extends PieceBase {

  public type = Piece.Rook;

  private directions: [number, number][] = [
    [1, 0], // Top
    [0, 1], // Right
    [-1, 0], // Bottom
    [0, -1], // Left
  ];

  protected override getMoveDirections(): [number, number][] {
    return this.directions;
  }

  protected override shouldContinueCheckSquare(square: Position, loopIndex: number): boolean {
    return this.store._isSquareValid(square);
  }
}