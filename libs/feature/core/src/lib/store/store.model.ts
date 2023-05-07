import { BoardPieces, ExtraPieceMovement, Piece, SquareId } from '../types';

export interface AppState {
  board: BoardState,
  config: ConfigState
}

// region Board Store
export interface BoardState {
  selectedSquareId: SquareId | null;
  movementsHistories: MovementHistory[],
  selectedMovementsHistoryIndex: number | null;
}

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

// endregion Board Store

// region Board Action
export interface SelectSquareAction {
  selectedSquareId: SquareId | null
}
export interface AccPieceAction {
  piece: Piece
}
export interface ReplacePiecesAction {
  sourceSquareId: SquareId,
  destinationSquareId: SquareId,
  extraMove?: ExtraPieceMovement
}
export interface SelectHistoryAction {
  index: number,
}
// endregion Board Action

// region Config Store
export interface ConfigState {
  squaresPerSide: number;
}

// endregion Config Store

// region Config Action
export interface SquaresPerSideAction {
  squaresPerSide: number;
}

// endregion Config Action