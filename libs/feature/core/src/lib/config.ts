import { MovementDirection, PieceColor } from './types';

export const startingPlayer = PieceColor.White as PieceColor;

export const movementsDirectionByPlayer = {
  [PieceColor.White]: startingPlayer === PieceColor.White ? MovementDirection.Up : MovementDirection.Down,
  [PieceColor.Black]: startingPlayer === PieceColor.White ? MovementDirection.Down : MovementDirection.Up,
}
