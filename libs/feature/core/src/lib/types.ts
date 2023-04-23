export type SquareId = `${string}${number}`;

export enum PieceColor {
  White = 'white',
  Black = 'black'
}

export enum MovementDirection {
  Up = 1, // The player piece will move up inside of board
  Down = -1, // The player piece will move down inside of board
}

export enum PieceType {
  Pawn = 'pawn',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king',
  Knight = 'knight',
}

export interface Piece {
  type: PieceType,
  color: PieceColor
  startSquareId: SquareId,
}

export type Movement = [number, number];

export interface CanPieceMoveFnItem {
  position: SquareId,
  piece: Piece | null
}

export interface PieceMovementConfig {
  movement: [number, number],
  maxMovement?: number, // Default: Number.POSITIVE_INFINITY
  canAttack?: boolean // Default: true
  canMoveFns?: canPieceMoveFn[], // Default: []
}

export type canPieceMoveFn = (current: CanPieceMoveFnItem, next: CanPieceMoveFnItem) => boolean;

export interface PieceMovement {
  squareId: SquareId,
  isAttackMove: boolean
}

export type BoardPiece = Record<SquareId, Piece | null>;
export type BoardMovements = Record<SquareId, PieceMovement[]>;
