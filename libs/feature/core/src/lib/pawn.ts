import { MovementDirection, Player, Position } from './types';
import { movementsDirectionByPlayer } from './config';
import { decreaseLetter, increaseLetter } from '@chess/utils';

export class Pawn {

  public readonly PIECE_ASCII = this._player === Player.White ? '♙' : '♟︎';
  private readonly movementDirection: MovementDirection;
  private currentPosition: string;

  private get isAtStartPosition() {
    return this.startPosition === this.currentPosition;
  }

  private get row(): number {
    return Number(this.currentPosition[1]);
  }

  private get col() {
    return this.currentPosition[0];
  }

  public possibleFreeMovements: Position[] = [];
  public possibleAttackMovements: Position[] = []; // possibleCaptureMovements, possibleThreatMovements
  constructor(public _player: Player, private startPosition: Position) {
    this.currentPosition = startPosition;
    this.movementDirection = movementsDirectionByPlayer[this._player];
  }

  public _move(newPosition: Position) {

    const canMove =
      this.possibleFreeMovements.includes(newPosition) ||
      this.possibleAttackMovements.includes(newPosition);

    if (!canMove) {
      console.log(`❌ ${this._player} Pawn: ${this.currentPosition} -> ${newPosition}. Possible movements are ${this.possibleFreeMovements} ${this.possibleAttackMovements}`);
      return false;
    }

    console.log(`✅ ${this._player} Pawn: ${this.currentPosition} -> ${newPosition}`);
    this.currentPosition = newPosition;

    return true;
  }
  public _updatePossibleMovements(piecesPosition: Record<Position, Pawn>) {
    this._updatePossibleFreeMovements(piecesPosition);
    this._updatePossibleAttackMovements(piecesPosition);
  }

  public _updatePossibleFreeMovements(piecesPosition: Record<Position, Pawn>) {
    this.possibleFreeMovements = []

    // Add the forward movement by one row in the current direction.

    // One square move forward
    const oneForward = this.getForwardMovement(1);
    if (!piecesPosition[oneForward]) {
      this.possibleFreeMovements.push(oneForward);
    }

    // Two square move forward
    // If the pawn hasn't moved yet, it can move two squares forward
    const twoForward = this.getForwardMovement(2);
    if (this.isAtStartPosition && !piecesPosition[twoForward]) {
      this.possibleFreeMovements.push(twoForward);
    }
  }

  public _updatePossibleAttackMovements(piecesPosition: Record<Position, Pawn>) {
    this.possibleAttackMovements = [];
    // Check the diagonal squares in front of the pawn for capturing
    const diagonal = this.getDiagonalForwardMovement(1);
    diagonal.forEach(square => {
      if (piecesPosition[square] && piecesPosition[square]._player !== this._player) {
        this.possibleAttackMovements.push(square);
      }
    });
  }

  /**
   * Returns the position of the pawn after moving a given number of rows forward in the current direction.
   *
   * @param movement The number of rows to move forward.
   * @returns The new position of the pawn.
   */
  private getForwardMovement(movement: 1 | 2): Position {
    const row = this.row + (movement * this.movementDirection);
    return `${this.col}${row}`
  }

  private getDiagonalForwardMovement(movement: number): Position[] {
    const row = this.row + (movement * this.movementDirection);
    const col1 = increaseLetter(this.col);
    const col2 = decreaseLetter(this.col);
    return [col1, col2]
      .filter(col => col !== null)
      .map(col => `${col}${row}` as Position);
  }
}