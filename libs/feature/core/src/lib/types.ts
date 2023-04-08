export type Position = `${string}${number}`;

export enum Player {
  White = 'White',
  Black = 'Black'
}

export enum MovementDirection {
  Up = 1,
  Down = -1,
}