import { AppState } from './store.model';
import { createSelector } from '@ngrx/store';
import { getBoardMovements } from '../movements';
import { PieceColor, SquareId } from '@chess/core';
import { getPieceMovements } from './store.util';
import { getKingCheckSquareIdByColor, isCheckmateByColor as isCheckmateByColorUtil } from '../store.util';


export const board = (state: AppState) => state.board;
export const config = (state: AppState) => state.config;

export const squaresPerSide = createSelector(
  config, (state) => state.squaresPerSide
);

export const selectedMovementsHistoryIndex = createSelector(
  board, (state) => state.selectedMovementsHistoryIndex ?? state.movementsHistories.length - 1
);

export const selectedSquareId = createSelector(
  board, (state) => state.selectedSquareId
);

export const movementsHistories = createSelector(
  board, (state) => state.movementsHistories
);

export const boardPieces = createSelector(
  selectedMovementsHistoryIndex,
  movementsHistories,
  (selectedMovementsHistoryIndex, movementsHistories) =>
    movementsHistories[selectedMovementsHistoryIndex]?.boardPieces ?? {}
);
export const boardMovements = createSelector(
  boardPieces,
  squaresPerSide,
  (boardPieces, squaresPerSide) =>
    getBoardMovements(boardPieces, squaresPerSide)
);
export const selectedSquareMovements = createSelector(
  selectedSquareId,
  boardMovements,
  (selectedSquareId, boardMovements) =>
    boardMovements[selectedSquareId!] ?? []
);
export const pieceMovementsHistories = createSelector(
  movementsHistories,
  (movementsHistories) => getPieceMovements(movementsHistories)
);
export const pieceColorBySquareId = (squareId: SquareId) => createSelector(
  boardPieces,
  (boardPieces) => boardPieces[squareId]?.color
);
export const pieceTypeBySquareId = (squareId: SquareId) => createSelector(
  boardPieces,
  (boardPieces) => boardPieces[squareId]?.type
);
export const isSquareSelectedBySquareId = (squareId: SquareId) => createSelector(
  selectedSquareId,
  (selectedSquareId) => selectedSquareId === squareId
);
export const pieceMovementsBySquareId = (squareId: SquareId) => createSelector(
  boardMovements,
  (boredMovements) => boredMovements[squareId]
);
export const isSquaresAttackMoveBySquareId = (squareId: SquareId) => createSelector(
  selectedSquareMovements,
  (selectedSquareMovements) =>
    selectedSquareMovements?.some(movement => movement.isAttackMove && movement.squareId === squareId)
);
export const isSquaresFreeMoveBySquareId = (squareId: SquareId) => createSelector(
  selectedSquareMovements,
  (selectedSquareMovements) =>
    selectedSquareMovements?.some(movement => !movement.isAttackMove && movement.squareId === squareId)
);
export const isCheckmateByColor = (pieceColor: PieceColor) => createSelector(
  boardMovements,
  boardPieces,
  (boredMovements, boardPieces) =>
    isCheckmateByColorUtil(pieceColor, boardPieces, boredMovements)
);
export const isKingCheckSquareIdByColor = (pieceColor: PieceColor) => createSelector(
  boardMovements,
  boardPieces,
  (boredMovements, boardPieces) =>
    getKingCheckSquareIdByColor({ boardPieces, boardMovements: boredMovements, pieceColor })
);


