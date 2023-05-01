import {
  BoardMovements,
  BoardPieces,
  canPieceMoveFn,
  Movement,
  MovementDirection,
  PieceColor,
  PieceMovement,
  PieceMovementConfig,
  PieceType,
  SquareId,
} from './types';
import { increaseLetter, LETTER_START_CHAR_CODE, letterToASCII, objLoop } from '@chess/utils';
import { findPieceByColorAndType, getKingCheckSquareIdByColor, movePiece, parseSquareId } from './store.util';
import { getCastlingPieceMovementsByColor } from './castling-movements';


// region CAN_MOVE_FNS
const isNextSquareUnoccupied: canPieceMoveFn = (current, next) => !next.piece;
const isNextSquareOccupied: canPieceMoveFn = (current, next) => !!next.piece;
const isPieceAtStartPosition: canPieceMoveFn = (current) =>
  current.piece?.startSquareId === current.position;
// endregion CAN_MOVE_FNS


// region CONFIGS
export const COLOR_MOVEMENT_DIRECTION: Record<PieceColor, MovementDirection> = {
  [PieceColor.White]: MovementDirection.Up,
  [PieceColor.Black]: MovementDirection.Down
}

const MOVEMENT = {
  UP_RIGHT: [1, 1] as Movement,
  UP_LEFT: [1, -1] as Movement,
  DOWN_RIGHT: [-1, 1] as Movement,
  DOWN_LEFT:  [-1, -1] as Movement,
  UP: [1, 0] as Movement,
  RIGHT: [0, 1] as Movement,
  DOWN: [-1, 0] as Movement,
  LEFT: [0, -1] as Movement,

  // Pawn moves
  DOUBLE_UP: [2, 0] as Movement,

  // Knight moves
  DOUBLE_UP_RIGHT: [2, 1] as Movement,
  UP_DOUBLE_RIGHT: [1, 2] as Movement,
  DOWN_DOUBLE_RIGHT: [-1, 2] as Movement,
  DOUBLE_DOWN_RIGHT: [-2, 1] as Movement,
  DOUBLE_DOWN_LEFT: [-2, -1] as Movement,
  DOWN_DOUBLE_LEFT: [-1, -2] as Movement,
  UP_DOUBLE_LEFT: [1, -2] as Movement,
  DOUBLE_UP_LEFT: [2, -1] as Movement
}

const PIECE_MOVEMENTS_BY_PIECE_TYPE:Record<PieceType, PieceMovementConfig[]> = {
  [PieceType.Bishop]: [
    { movement: MOVEMENT.UP_RIGHT },
    { movement: MOVEMENT.UP_LEFT },
    { movement: MOVEMENT.DOWN_RIGHT },
    { movement: MOVEMENT.DOWN_LEFT },
  ],
  [PieceType.King]: [
    { movement: MOVEMENT.UP, maxMovement: 1 },
    { movement: MOVEMENT.RIGHT, maxMovement: 1 },
    { movement: MOVEMENT.DOWN, maxMovement: 1 },
    { movement: MOVEMENT.LEFT, maxMovement: 1 },
    { movement: MOVEMENT.UP_RIGHT, maxMovement: 1 },
    { movement: MOVEMENT.UP_LEFT, maxMovement: 1 },
    { movement: MOVEMENT.DOWN_RIGHT, maxMovement: 1 },
    { movement: MOVEMENT.DOWN_LEFT, maxMovement: 1 },
  ],
  [PieceType.Knight]: [
    { movement: MOVEMENT.DOUBLE_UP_RIGHT, maxMovement: 1  },
    { movement: MOVEMENT.UP_DOUBLE_RIGHT, maxMovement: 1  },
    { movement: MOVEMENT.DOWN_DOUBLE_RIGHT, maxMovement: 1  },
    { movement: MOVEMENT.DOUBLE_DOWN_RIGHT, maxMovement: 1  },
    { movement: MOVEMENT.DOUBLE_DOWN_LEFT, maxMovement: 1  },
    { movement: MOVEMENT.DOWN_DOUBLE_LEFT, maxMovement: 1  },
    { movement: MOVEMENT.UP_DOUBLE_LEFT, maxMovement: 1  },
    { movement: MOVEMENT.DOUBLE_UP_LEFT, maxMovement: 1  },
  ],
  [PieceType.Pawn]: [
    { movement: MOVEMENT.UP, maxMovement: 1, canMoveFns: [isNextSquareUnoccupied], canAttack: false },
    { movement: MOVEMENT.DOUBLE_UP, maxMovement: 1, canMoveFns: [isPieceAtStartPosition], canAttack: false },
    { movement: MOVEMENT.UP_RIGHT, maxMovement: 1, canMoveFns: [isNextSquareOccupied]},
    { movement: MOVEMENT.UP_LEFT, maxMovement: 1, canMoveFns: [isNextSquareOccupied]},
  ],
  [PieceType.Queen]: [
    { movement: MOVEMENT.UP  },
    { movement: MOVEMENT.RIGHT  },
    { movement: MOVEMENT.DOWN  },
    { movement: MOVEMENT.LEFT  },
    { movement: MOVEMENT.UP_RIGHT },
    { movement: MOVEMENT.UP_LEFT },
    { movement: MOVEMENT.DOWN_RIGHT },
    { movement: MOVEMENT.DOWN_LEFT },
  ],
  [PieceType.Rook]: [
    { movement: MOVEMENT.UP  },
    { movement: MOVEMENT.RIGHT  },
    { movement: MOVEMENT.DOWN  },
    { movement: MOVEMENT.LEFT  },
  ]
}
// endregion CONFIGS

// region FUNCTION

function isSquareValid(squareId: SquareId, squaresPerSide: number) {
  const colASCII = letterToASCII(squareId[0]);
  const row = Number(squareId[1]);

  const LETTER_VALID_MAX_CHAR_CODE = LETTER_START_CHAR_CODE + squaresPerSide;
  const isColValid = LETTER_START_CHAR_CODE <= colASCII && colASCII <= LETTER_VALID_MAX_CHAR_CODE;
  const isRowValid = 1 <= row && row <= squaresPerSide;

  return isColValid && isRowValid;
}

export function getBoardMovementsWithoutKingCheck(boardPieces: BoardPieces, squaresPerSide: number): BoardMovements {
  return objLoop(boardPieces).map((squareId: SquareId) => getPieceMovements(boardPieces, squareId, squaresPerSide))
}

export function getBoardMovements(boardPieces: BoardPieces, squaresPerSide: number) {
  const boardMovements = {} as BoardMovements;
  const movementsWithoutKingCheck = getBoardMovementsWithoutKingCheck(boardPieces, squaresPerSide)

  // Standard movements
  objLoop(movementsWithoutKingCheck).forEach((squareId,pieceMove ) => {
    const pieceMovement = [] as PieceMovement[];
    pieceMove.forEach(pieceMovementCandidate => {
      const tmpBoardPiece = movePiece(boardPieces, squareId, pieceMovementCandidate.squareId);
      const tmpMovementsWithoutKingCheck = getBoardMovementsWithoutKingCheck(tmpBoardPiece, squaresPerSide);

      if (
        !getKingCheckSquareIdByColor({
          boardPieces: tmpBoardPiece,
          boardMovements: tmpMovementsWithoutKingCheck,
          pieceColor: boardPieces[squareId]!.color
        })
      ) {
        pieceMovement.push(pieceMovementCandidate);
      }
    });

    boardMovements[squareId] = pieceMovement;
  });

  // White king castling
  const whiteKingCastlingSquareId = findPieceByColorAndType(boardPieces, PieceColor.White, PieceType.King)?.key;
  if (whiteKingCastlingSquareId) {
    const whiteCastlingPieceMovements = getCastlingPieceMovementsByColor({ boardPieces, boardMovements, pieceColor: PieceColor.White });
    objLoop(whiteCastlingPieceMovements).forEach((squareId, pieceMovement) => {
      boardMovements[squareId] = [...boardMovements[squareId], ...pieceMovement];
    })
  }

  // Black king castling
  const blackKingCastlingSquareId = findPieceByColorAndType(boardPieces, PieceColor.Black, PieceType.King)?.key;
  if(blackKingCastlingSquareId) {
    const blackCastlingPieceMovements = getCastlingPieceMovementsByColor({ boardPieces, boardMovements, pieceColor: PieceColor.Black });
    objLoop(blackCastlingPieceMovements).forEach((squareId, pieceMovement) => {
      boardMovements[squareId] = [...boardMovements[squareId], ...pieceMovement];
    })
  }

  return boardMovements;
}

export function getPieceMovements(boardPieces: BoardPieces, pieceSquareId: SquareId, squaresPerSide: number): PieceMovement[] {

  const piece = boardPieces[pieceSquareId];

  if (!piece) {
    return [];
  }
  const [pieceCol, pieceRow] = parseSquareId(pieceSquareId);
  const movements: PieceMovement[] = [];

  // TODO: Write a short text, that is this loop about
  for (const pieceMovement of PIECE_MOVEMENTS_BY_PIECE_TYPE[piece.type]) {

    const {
      movement,
      maxMovement = Number.POSITIVE_INFINITY,
      canAttack = true,
      canMoveFns = []
    } = pieceMovement;

    const [rowMovement, colMovement] = movement.map(move => move * COLOR_MOVEMENT_DIRECTION[piece.color])
    let nextRow = pieceRow + rowMovement;
    let nextCol = increaseLetter(pieceCol, colMovement);
    let isNextSquareValid = isSquareValid(`${nextCol}${nextRow}`, squaresPerSide);

    let index = 1;
    // TODO: Write a short text, that is this loop about
    while (index <= maxMovement && isNextSquareValid) {

      const nextSquareId: SquareId = `${nextCol}${nextRow}`;
      const nextSquarePiece = boardPieces[nextSquareId];

      const canMove = canMoveFns.every(fn => fn(
        {position: pieceSquareId, piece: piece},
        {position: nextSquareId, piece: nextSquarePiece}
      ));

      if (!canMove) {
        break;
      }

      const isNextSquareOccupied = !!nextSquarePiece;
      const isNextSquareEmpty = !nextSquarePiece;
      const isNextSquareOpponent = isNextSquareOccupied && nextSquarePiece.color !== piece.color;
      const isAttackMove = isNextSquareOpponent && canAttack;


      if (isAttackMove || isNextSquareEmpty) {
        movements.push({ squareId: nextSquareId, isAttackMove });
      }

      // Must be called after push the movement. Because for attack movement we have to push it into possibleMovements and then exit the loop.
      if (isNextSquareOccupied) {
        break;
      }

      // Move to next square in the direction
      nextRow += rowMovement;
      nextCol = increaseLetter(nextCol, colMovement);
      index++;
      isNextSquareValid = isSquareValid(`${nextCol}${nextRow}`, squaresPerSide);
    }
  }

  return movements;
}
// endregion FUNCTION