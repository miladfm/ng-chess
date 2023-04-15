import { MovementDirection, Piece, Player, Position, StoreService } from '@chess/core';
import { movementsDirectionByPlayer } from './config';
import { inject } from '@angular/core';

export abstract class PieceBase {

  protected store = inject(StoreService);

  abstract readonly type: Piece;
  protected readonly movementDirection: MovementDirection;
  public possibleFreeMovements: Position[] = [];
  public possibleAttackMovements: Position[] = []; // possibleCaptureMovements, possibleThreatMovements

  protected readonly startPosition: Position;
  protected currentPosition: Position;
  public _player: Player;
  protected get isAtStartPosition() {
    return this.startPosition === this.currentPosition;
  }

  protected get row(): number {
    return Number(this.currentPosition[1]);
  }

  protected get col() {
    return this.currentPosition[0];
  }

  constructor(_player: Player, startPosition: Position) {
    this._player = _player;
    this.startPosition = startPosition;
    this.currentPosition = startPosition;
    this.movementDirection = movementsDirectionByPlayer[_player];
  }

  public abstract _updatePossibleMovements(piecesPosition: Record<Position, PieceBase>): void;

  public _move(newPosition: Position) {
    const canMove =
      this.possibleFreeMovements.includes(newPosition) ||
      this.possibleAttackMovements.includes(newPosition);

    if (!canMove) {
      console.log(`❌ ${this._player} ${this.type}: ${this.currentPosition} -> ${newPosition}. Possible movements are ${this.possibleFreeMovements} ${this.possibleAttackMovements}`);
      return false;
    }

    console.log(`✅ ${this._player} ${this.type}: ${this.currentPosition} -> ${newPosition}`);
    this.currentPosition = newPosition;

    return true;
  }
}