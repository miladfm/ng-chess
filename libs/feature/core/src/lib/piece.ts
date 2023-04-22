import { MovementDirection, PieceType, PieceColor, SquareId, StoreService } from '@chess/core';
import { movementsDirectionByPlayer } from './config';
import { inject } from '@angular/core';
import { increaseLetter } from '@chess/utils';
import { PIECE_MOVEMENTS_BY_PIECE_TYPE, COLOR_MOVEMENT_DIRECTION } from './movements';

export class Piece {

  protected store = inject(StoreService);

  readonly type: PieceType;
  public freeMovements: SquareId[] = [];
  public attackMovements: SquareId[] = []; // possibleCaptureMovements, possibleThreatMovements

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


  public _move(newPosition: SquareId) {
    const canMove =
      this.freeMovements.includes(newPosition) ||
      this.attackMovements.includes(newPosition);

    if (!canMove) {
      console.log(`❌ ${this.color} ${this.type}: ${this.currentPosition} -> ${newPosition}. Possible movements are ${this.freeMovements} ${this.attackMovements}`);
      return false;
    }

    console.log(`✅ ${this.color} ${this.type}: ${this.currentPosition} -> ${newPosition}`);
    this.currentPosition = newPosition;

    return true;
  }

  public _updatePossibleMovements(piecesPosition: Record<SquareId, Piece>) {
    this.freeMovements = [];
    this.attackMovements = [];


    for (const pieceMovement of PIECE_MOVEMENTS_BY_PIECE_TYPE[this.type]) {

      const {
        movement,
        maxMovement = Number.POSITIVE_INFINITY,
        isAttackMove = true,
        canMoveFns = []
      } = pieceMovement;

      const rowDir = movement[0] * COLOR_MOVEMENT_DIRECTION[this.color];
      const colDir = movement[1] * COLOR_MOVEMENT_DIRECTION[this.color];
      let newRow = this.row + rowDir;
      let newCol = increaseLetter(this.col, colDir);

      let index = 1;
      while (index <= maxMovement && this.store._isSquareValid(`${newCol}${newRow}`)) {

        const nextSquare: SquareId = `${newCol}${newRow}`;
        const canMove = canMoveFns.every(fn => fn(
          {position: this.currentPosition, piece: piecesPosition[this.currentPosition]},
          {position: nextSquare, piece: piecesPosition[nextSquare]},
        ));
        const isNextSquareCurrentPlayer = piecesPosition[nextSquare]?.color === this.color;
        const isNextSquareOccupiedPlayer = piecesPosition[nextSquare] && piecesPosition[nextSquare].color !== this.color;


        if (isNextSquareCurrentPlayer || !canMove) {
          break;
        }

        if (isNextSquareOccupiedPlayer && isAttackMove) {
          this.attackMovements.push(nextSquare);
          break;
        }

        // Square is empty and valid for free movement
        this.freeMovements.push(nextSquare);

        // Move to next square in the direction
        newRow += rowDir;
        newCol = increaseLetter(newCol, colDir);
        index++;
      }
    }
  }
}