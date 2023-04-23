import { MovementDirection, PieceType, PieceColor, SquareId, StoreService, PossibleMovement } from '@chess/core';
import { movementsDirectionByPlayer } from './config';
import { inject } from '@angular/core';
import { increaseLetter } from '@chess/utils';
import { PIECE_MOVEMENTS_BY_PIECE_TYPE, COLOR_MOVEMENT_DIRECTION } from './movements';

export class Piece {

  protected store = inject(StoreService);

  readonly type: PieceType;

  public readonly startSquareId: SquareId;
  public currentPosition: SquareId;
  public color: PieceColor;

  protected get row(): number {
    return Number(this.currentPosition[1]);
  }

  protected get col() {
    return this.currentPosition[0];
  }

  constructor(type: PieceType, color: PieceColor, startSquareId: SquareId) {
    this.type = type;
    this.color = color;
    this.startSquareId = startSquareId;
    this.currentPosition = startSquareId;
  }


  public _move(newSquareId: SquareId) {
    const movements = this.store._piecesMovements[this.currentPosition];
    const canMove = movements.some(movement => movement.squareId === newSquareId);

    if (!canMove) {
      console.log(`❌ ${this.color} ${this.type}: ${this.currentPosition} -> ${newSquareId}. Possible movements are ${movements.map(a => a.squareId)}`);
      return false;
    }

    console.log(`✅ ${this.color} ${this.type}: ${this.currentPosition} -> ${newSquareId}`);
    this.currentPosition = newSquareId;

    return true;
  }


  public _updatePossibleMovements(piecesPosition: Record<SquareId, Piece>) {
    const possibleMovements: PossibleMovement[] = [];

    // TODO: Write a short text, that is this loop about
    for (const pieceMovement of PIECE_MOVEMENTS_BY_PIECE_TYPE[this.type]) {

      const {
        movement,
        maxMovement = Number.POSITIVE_INFINITY,
        canAttack = true,
        canMoveFns = []
      } = pieceMovement;

      const [row, col] = movement.map(move => move * COLOR_MOVEMENT_DIRECTION[this.color])
      let nextRow = this.row + row;
      let nextCol = increaseLetter(this.col, col);

      let index = 1;
      // TODO: Write a short text, that is this loop about
      while (index <= maxMovement && this.store._isSquareValid(`${nextCol}${nextRow}`)) {

        const nextSquareId: SquareId = `${nextCol}${nextRow}`;
        const nextSquarePiece = piecesPosition[nextSquareId];

        const canMove = canMoveFns.every(fn => fn(
          {position: this.currentPosition, piece: this},
          {position: nextSquareId, piece: nextSquarePiece},
        ));

        if (!canMove) {
          break;
        }

        const isNextSquareOccupied = !!nextSquarePiece;
        const isNextSquareEmpty = !nextSquarePiece;
        const isNextSquareOpponent = isNextSquareOccupied && nextSquarePiece.color !== this.color;
        const isAttackMove = isNextSquareOpponent && canAttack;


        if (isAttackMove || isNextSquareEmpty) {
          possibleMovements.push({ squareId: nextSquareId, isAttackMove });
        }

        // Must be called after push the movement. Because for attack movement we have to push it into possibleMovements and then exit the loop.
        if (isNextSquareOccupied) {
          break;
        }


        // Move to next square in the direction
        nextRow += row;
        nextCol = increaseLetter(nextCol, col);
        index++;
      }
    }

    return possibleMovements;
  }
}