import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService, PieceType, PieceColor, SquareId, StoreService } from '@chess/core';
import { shareReplay, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'chess-square',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': "square",
    '[class.square--white]': '!isDark',
    '[class.square--black]': 'isDark',
    '(pointerdown)': 'onSquareSelect($event)'
  }
})
export class SquareComponent {

  @Input() isDark: boolean;
  @Input() id: SquareId;

  protected store = inject(StoreService);
  protected board = inject(BoardService);

  protected player$ = this.store.positions$.pipe(
    map(positions => positions[this.id]?.color),
    filter((player) => !!player),
    shareReplay()
  )

  protected piece$ = this.store.positions$.pipe(
    map(positions => positions[this.id]),
    map((piece) => piece?.type),
  )

  protected selected$ = this.store.selectedSquare$.pipe(
    map(selectedSquare => selectedSquare === this.id)
  )

  protected attackMovement$ = this.store.selectedMovementSquare$.pipe(
    map(movements => movements.filter(movement => movement.isAttackMove)),
    map(movements => movements.some(movement => movement.squareId === this.id))
  )

  protected freeMovement$ = this.store.selectedMovementSquare$.pipe(
    map(movements => movements.filter(movement => !movement.isAttackMove)),
    map(movements => movements.some(movement => movement.squareId === this.id))
  )


  protected readonly Player = PieceColor;
  protected readonly Piece = PieceType;


  protected onSquareSelect(event: Event) {
    event.stopPropagation();
    this.board._selectSquare(this.id);
  }
}
