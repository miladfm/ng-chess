import { BoardMovements, BoardPiece, PieceColor, PieceType, SquareId } from './types';
import { objLoop } from '@chess/utils';

export function isKingCheckByColor(
  pieceColor: PieceColor,
  boredMovements: BoardMovements,
  boardPieces: BoardPiece) {

  const kingSquareId = objLoop(boardPieces)
    .findKey((squareId, piece) => piece?.type === PieceType.King && piece.color === pieceColor);

  const checkingPieceSquareId = objLoop(boredMovements)
    .findKey((squareId, movements) => movements.some(movement => movement.squareId === kingSquareId));

  return checkingPieceSquareId;
}

export function movePiece(boardPieces: BoardPiece, sourceSquareId: SquareId, destinationSquareId: SquareId) {
  return {
    ...boardPieces,
    [sourceSquareId]: null,
    [destinationSquareId]: boardPieces[sourceSquareId],
  }
}

export function isCheckmateByColor(pieceColor: PieceColor, boardPieces: BoardPiece, movements: BoardMovements) {
  const pieceColorMovements = objLoop(movements).filter(squareId => boardPieces[squareId]?.color === pieceColor);
  return !objLoop(pieceColorMovements).find((squareId, movements) => movements.length !== 0);
}