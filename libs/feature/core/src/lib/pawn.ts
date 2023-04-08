import { MovementDirection, Player, Position } from './types';
import { movementsDirectionByPlayer } from './config';

export class Pawn {

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

  private possibleMovements: Position[] = [];
  constructor(private startPosition: Position, private player: Player) {
    this.currentPosition = startPosition;
    this.movementDirection = movementsDirectionByPlayer[this.player];
    this.updatePossibleMovements();
  }

  public move(newPosition: Position) {

    const canMove = this.possibleMovements.includes(newPosition);
    if (!canMove) {
      console.log(`❌ ${this.player} Pawn: ${this.currentPosition} -> ${newPosition}. Possible movements are ${this.possibleMovements}`);
      return;
    }

    console.log(`✅ ${this.player} Pawn: ${this.currentPosition} -> ${newPosition}`);
    this.currentPosition = newPosition;
    this.updatePossibleMovements();
  }

  private updatePossibleMovements() {
    this.possibleMovements = []

    // Add the forward movement by one row in the current direction.

    this.possibleMovements.push(this.getForwardMovement(1));

    // If the pawn is at its starting position, add the forward movement by two rows in the current direction.
    if (this.isAtStartPosition) {
      this.possibleMovements.push(this.getForwardMovement(2))
    }
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
}