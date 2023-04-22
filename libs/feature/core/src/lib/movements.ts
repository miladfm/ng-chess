import {
  PieceType,
  PieceColor,
  MovementDirection,
  Movement,
  CanPieceMoveFnItem,
  canPieceMoveFn,
} from './types';


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



const isNextSquareUnoccupied: canPieceMoveFn = (current: CanPieceMoveFnItem, next: CanPieceMoveFnItem) => !next.piece;
const isNextSquareOccupied: canPieceMoveFn = (current: CanPieceMoveFnItem, next: CanPieceMoveFnItem) => !!next.piece;
const isPieceAtStartPosition: canPieceMoveFn = (current: CanPieceMoveFnItem, next: CanPieceMoveFnItem) =>
  current.piece.startSquareId === current.position;


interface PieceMovement {
  movement: [number, number],
  maxMovement?: number, // Default: Number.POSITIVE_INFINITY
  isAttackMove?: boolean // Default: true
  canMoveFns?: canPieceMoveFn[], // Default: []
}

export const PIECE_MOVEMENTS_BY_PIECE_TYPE:Record<PieceType, PieceMovement[]> = {
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
    { movement: MOVEMENT.UP, maxMovement: 1, canMoveFns: [isNextSquareUnoccupied], isAttackMove: false },
    { movement: MOVEMENT.DOUBLE_UP, maxMovement: 1, canMoveFns: [isPieceAtStartPosition], isAttackMove: false },
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