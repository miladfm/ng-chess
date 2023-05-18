import { BoardPieces, SquareId } from '../types';

export enum MovementHistoryType {
  Put = 'Put',
  Move = 'Move',
  StartGame = 'StartGame'
}

export interface MovementHistory {
  type: MovementHistoryType,
  boardPieces: BoardPieces,
  from?: SquareId, // Available only for Move type
  to?: SquareId, // Available only for Move and Put type
}
