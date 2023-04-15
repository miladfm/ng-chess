import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';

export class Queen extends PieceBase {

  public type = Piece.Queen;

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

  protected override getMoveDirections(): [number, number][] {
    return this.directions;
  }

  protected override shouldContinueCheckSquare(square: Position, loopIndex: number): boolean {
    return this.store._isSquareValid(square);
  }
}