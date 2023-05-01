import {
  BoardMovements,
  BoardPieces,
  ExtraPieceMovement,
  PieceColor,
  PieceType,
  SquareId,
} from './types';
import { objLoop } from '@chess/utils';


export function findPieceByColorAndType(
  boardPieces: BoardPieces,
  pieceColor: PieceColor,
  pieceType: PieceType,
) {
  return objLoop(boardPieces)
    .find((squareId, piece) => piece?.type === pieceType && piece.color === pieceColor);
}

export function getKingCheckSquareIdByColor(
  { boardPieces, boardMovements, pieceColor }
  : {
   boardPieces: BoardPieces,
   boardMovements: BoardMovements,
   pieceColor: PieceColor,
  }
) {

  const kingSquareId = findPieceByColorAndType(boardPieces, pieceColor, PieceType.King)?.key;

  const checkingPieceSquareId = objLoop(boardMovements)
    .findKey((squareId, movements) => movements.some(movement => movement.squareId === kingSquareId));

  return checkingPieceSquareId;
}

export function movePiece(boardPieces: BoardPieces, sourceSquareId: SquareId, destinationSquareId: SquareId, extraMovement?: ExtraPieceMovement): BoardPieces {
  return {
    ...boardPieces,
    // Extra movement
    // must be happening before standard movements. Otherwise, in custom board if the king is at c1 and rook is at a1,
    // Then the rook will be moved but the king will be removed from board.
    ...(extraMovement && {
      [extraMovement.from]: null,
      [extraMovement.to]: {
        ...boardPieces[extraMovement.from],
        hasMoved: true
      },
    }),
    // Standard Move
    [sourceSquareId]: null,
    [destinationSquareId]: {
      ...boardPieces[sourceSquareId],
      hasMoved: true
    },
  }
}

export function isCheckmateByColor(pieceColor: PieceColor, boardPieces: BoardPieces, movements: BoardMovements) {
  const pieceColorMovements = objLoop(movements).filter(squareId => boardPieces[squareId]?.color === pieceColor);
  return !objLoop(pieceColorMovements).findValue((squareId, movements) => movements.length !== 0);
}

export function parseSquareId(squareId: SquareId): [string, number] {
  return [squareId[0], Number(squareId[1])];
}