import { MovementDirection, Piece, Player, Position, StoreService } from '@chess/core';
import { movementsDirectionByPlayer } from './config';
import { inject } from '@angular/core';
import { increaseLetter } from '@chess/utils';

export abstract class PieceBase {

  protected store = inject(StoreService);

  abstract readonly type: Piece;
  protected readonly movementDirection: MovementDirection;
  public _possibleFreeMovements: Position[] = [];
  public _possibleAttackMovements: Position[] = []; // possibleCaptureMovements, possibleThreatMovements

  protected readonly startPosition: Position;
  public _currentPosition: Position;
  public _player: Player;
  protected get isAtStartPosition() {
    return this.startPosition === this._currentPosition;
  }

  protected get row(): number {
    return Number(this._currentPosition[1]);
  }

  protected get col() {
    return this._currentPosition[0];
  }

  constructor(_player: Player, startPosition: Position) {
    this._player = _player;
    this.startPosition = startPosition;
    this._currentPosition = startPosition;
    this.movementDirection = movementsDirectionByPlayer[_player];
  }

  protected abstract getMoveDirections(): [number, number][];
  protected abstract shouldContinueCheckSquare(square: Position, loopIndex: number): boolean;

  public _move(newPosition: Position) {
    const canMove =
      this._possibleFreeMovements.includes(newPosition) ||
      this._possibleAttackMovements.includes(newPosition);

    if (!canMove) {
      console.log(`❌ ${this._player} ${this.type}: ${this._currentPosition} -> ${newPosition}. Possible movements are ${this._possibleFreeMovements} ${this._possibleAttackMovements}`);
      return false;
    }

    console.log(`✅ ${this._player} ${this.type}: ${this._currentPosition} -> ${newPosition}`);
    this._currentPosition = newPosition;

    return true;
  }

  public _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>) {
    this._possibleFreeMovements = [];
    this._possibleAttackMovements = [];

    for (const [rowDir, colDir] of this.getMoveDirections()) {
      let newRow = this.row + rowDir;
      let newCol = increaseLetter(this.col, colDir);

      let index = 1;
      while (this.shouldContinueCheckSquare(`${newCol}${newRow}`, index)) {
        const newSquare: Position = `${newCol}${newRow}`;

        if (!this.store._isSquareFree(newSquare)) {
          // Square is occupied by opponent piece
          if (piecesPosition[newSquare]._player !== this._player) {
            this._possibleAttackMovements.push(newSquare);
          }
          break;
        }

        // Square is empty and valid for free movement
        this._possibleFreeMovements.push(newSquare);

        // Move to next square in the direction
        newRow += rowDir;
        newCol = increaseLetter(newCol, colDir);
        index++;
      }
    }
  };
}