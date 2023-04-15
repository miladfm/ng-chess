import { PieceBase } from './piece.base';
import { Piece, Position } from '@chess/core';

export class Knight extends PieceBase {

  public type = Piece.Knight;

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

  protected override getMoveDirections(): [number, number][] {
    return this.directions;
  }

  protected override shouldContinueCheckSquare(square: Position, loopIndex: number): boolean {
    return loopIndex <= 1;
  }
}