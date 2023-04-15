export type Position = `${string}${number}`;

export enum Player {
  White = 'White',
  Black = 'Black'
}

export enum MovementDirection {
  Up = 1,
  Down = -1,
}

export enum Piece {
  Pawn = 'pawn',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king',
  Knight = 'knight',
}