import { BoardMovements, BoardPieces, Movement, PieceColor, PieceMovement, PieceType, SquareId } from './types';
import { findPieceByColorAndType, getKingCheckSquareIdByColor, parseSquareId } from './store.util';
import { decreaseLetter, increaseLetter, objLoop } from '@chess/utils';
/**
 * Castling:
 * During castling, the king is shifted two squares toward a rook of the same color on the same rank,
 * and the rook is transferred to the square crossed by the king.
 *
 * There are two forms of castling:
 * 1- Castling kingside (short castling):
 *    consists of moving the king to g1 and the rook to f1 for White, or moving the king to g8 and the rook to f8 for Black.
 * 2- Castling queenside (long castling)
 *    consists of moving the king to c1 and the rook to d1 for White, or moving the king to c8 and the rook to d8 for Black.
 *
 * Rules:
 * 1- Neither the king nor the rook has previously moved.
 * 2- There are no pieces between the king and the rook.
 * 3- The king is not currently in check.
 * 4- The king does not pass through or finish on a square that is attacked by an enemy piece.
 */

export function getCastlingPieceMovementsByColor(
  { boardPieces, boardMovements, pieceColor }
  : {
    boardPieces: BoardPieces,
    boardMovements: BoardMovements,
    pieceColor: PieceColor
  }
): BoardMovements {

  const {
    key: kingSquareId,
    value: kingPiece
  } = findPieceByColorAndType(boardPieces, pieceColor, PieceType.King) ?? {};

  if (!kingSquareId) {
   return {};
  }

  const rookSquareIds = getRookSquareIdsForCastlingByColor({
    boardPieces,
    boardMovements,
    pieceColor
  });

  return rookSquareIds.reduce((castlingBoardMovements, rookSquareId) => {

    const kingNewSquareId = getCastlingNewSquareId(kingSquareId, rookSquareId, 2);
    const rookNewSquareId = getCastlingNewSquareId(kingSquareId, rookSquareId, 1);

    if (!kingNewSquareId || !rookNewSquareId) {
      return castlingBoardMovements;
    }

    castlingBoardMovements[kingSquareId] = [
      ...castlingBoardMovements[kingSquareId] ?? [],
      {
        squareId: kingNewSquareId,
        isAttackMove: false,
        extraMovement: {from: rookSquareId, to: rookNewSquareId }
      }
    ];

    return  castlingBoardMovements;
  }, {} as BoardMovements)

}

function getCastlingNewSquareId(kingSquareId: SquareId, rookSquareId: SquareId, movementSteps: number): SquareId | null {
  const [kingCol, kingRow] = parseSquareId(kingSquareId);
  const [rookCol, rookRow] = parseSquareId(rookSquareId);

  if (kingCol === rookCol) {
    return kingRow < rookRow
      ? `${kingCol}${kingRow + movementSteps}`
      : `${kingCol}${kingRow - movementSteps}`
  }

  if (kingRow === rookRow) {
    return kingCol < rookCol
      ? `${increaseLetter(kingCol, movementSteps)}${kingRow}`
      : `${decreaseLetter(kingCol, movementSteps)}${kingRow}`
  }

  return null;
}


function getRookSquareIdsForCastlingByColor(
  { boardPieces, boardMovements, pieceColor }
  : {
    boardPieces: BoardPieces,
    boardMovements: BoardMovements,
    pieceColor: PieceColor
  }
): SquareId[] {

  const {
    key: kingSquareId,
    value: kingPiece
  } = findPieceByColorAndType(boardPieces, pieceColor, PieceType.King) ?? {};

  // No king exist on the board
  if (!kingPiece || !kingSquareId) {
    return [];
  }

  // Rule 1.1: the king has not previously moved.
  if (kingPiece.hasMoved) {
    return [];
  }

  const rookSquareIds = getRookSquareIds({
    boardPieces,
    pieceColor
  });

  // No Rooks exist on the board
  if (rookSquareIds.length === 0) {
    return [];
  }

  // Rule 1.2: the rooks has not previously moved.
  const notMovedRookSquareIds = getNotMovedRookSquareIds({
    boardPieces,
    rookSquareIds
  });
  if (notMovedRookSquareIds.length === 0) {
    return [];
  }

  // Rule 2: There are no pieces between the king and the rook
  const unobstructedRookSquareIds = getUnobstructedRookSquareIds({
    boardPieces,
    notMovedRookSquareIds,
    kingSquareId
  });
  if (unobstructedRookSquareIds.length === 0) {
    return [];
  }


  // Rule 3: The king is not currently in check.
  const isKingCheck = getKingCheckSquareIdByColor({
    pieceColor,
    boardMovements,
    boardPieces
  });
  if (isKingCheck) {
    return [];
  }

  // Rule 4: The king does not pass through or finish on a square that is attacked by an enemy piece.
  // Note: we don't need to check the finish square, because, after calculate all movement, we will remove the square that king will be checked.
  const unthreatenedRookSquaresIds = getUnthreatenedRookSquaresIds({
    boardPieces,
    boardMovements,
    unobstructedRookSquareIds,
    kingSquareId,
    pieceColor,
  });
  return unthreatenedRookSquaresIds;
}

function getRookSquareIds(
  { boardPieces, pieceColor }
  : { boardPieces: BoardPieces, pieceColor: PieceColor }
) {
  return objLoop(boardPieces)
    .findKeys((squareId, piece) => piece?.color === pieceColor && piece.type === PieceType.Rook);
}

function getNotMovedRookSquareIds(
  { boardPieces, rookSquareIds }
  : { boardPieces: BoardPieces, rookSquareIds: SquareId[] }
) {
  return rookSquareIds.filter(rookSquareId => !boardPieces[rookSquareId]?.hasMoved)
}

function getUnobstructedRookSquareIds(
  { boardPieces, notMovedRookSquareIds, kingSquareId }
  : { boardPieces: BoardPieces, notMovedRookSquareIds: SquareId[], kingSquareId: SquareId }
) {
  return notMovedRookSquareIds.filter(rookSquareId => {
    const squaresIdsBetweenKingAndRook = getSquaresIdsBetween(rookSquareId, kingSquareId);
    const isNoPeacesBetweenKingAndRook =  squaresIdsBetweenKingAndRook.every(squareId => !boardPieces[squareId]);
    return isNoPeacesBetweenKingAndRook;
  });
}

function getUnthreatenedRookSquaresIds(
  { boardPieces, boardMovements, unobstructedRookSquareIds, kingSquareId, pieceColor }
  : {
     boardPieces: BoardPieces,
     boardMovements : BoardMovements,
     unobstructedRookSquareIds: SquareId[],
     kingSquareId: SquareId,
     pieceColor: PieceColor,
   }) {
  return unobstructedRookSquareIds.filter(rookSquareId => {
    const squaresIdsBetweenKingAndRook = getSquaresIdsBetween(rookSquareId, kingSquareId);
    const squaresIdsBetweenKingAndRookIsCheck = objLoop(boardMovements).some((squareId, movements) => {

      if (!boardPieces[squareId]) {
        return false;
      }

      if (boardPieces[squareId]!.color === pieceColor) {
        return false;
      }

      return movements.some(movement => squaresIdsBetweenKingAndRook.includes(movement.squareId));
    })

    return !squaresIdsBetweenKingAndRookIsCheck;
  });
}

function getSquaresIdsBetween(from: SquareId, to: SquareId): SquareId[] {
  if (from === to) {
    return [];
  }

  const [fromCol, fromRow] = parseSquareId(from);
  const [toCol, toRow] = parseSquareId(to);

  const getNextCol = (col: string, maxCol: string): string => {
    if (col < maxCol) {
      return increaseLetter(col);
    }
    if (col > maxCol) {
      return decreaseLetter(col);
    }

    return col
  }

  const getNextRow = (row: number, maxRow: number): number => {
    if (row < maxRow) {
      return ++row;
    }
    if (row > maxRow) {
      return --row;
    }

    return row
  }

  const squareIdsBetween: SquareId[] = [];

  let currCol = getNextCol(fromCol, toCol);
  let currRow = getNextRow(fromRow, toRow);


  while (currCol !== toCol || currRow !== toRow) {
    squareIdsBetween.push(`${currCol}${currRow}`);

    currCol = getNextCol(currCol, toCol);
    currRow = getNextRow(currRow, toRow);
  }


  return squareIdsBetween;
}
