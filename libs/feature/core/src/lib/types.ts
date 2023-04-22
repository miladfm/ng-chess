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
  startSquareId: SquareId,
  color: PieceColor
}

export type Movement = [number, number];

export interface CanPieceMoveFnItem {
  position: SquareId,
  piece: Piece
}

export type canPieceMoveFn = (current: CanPieceMoveFnItem, next: CanPieceMoveFnItem) => boolean;