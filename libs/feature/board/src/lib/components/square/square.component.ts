import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService, Piece, Player, Position, StoreService } from '@chess/core';
import { filter, map, shareReplay } from 'rxjs';

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
    '(pointerdown)': 'onSquareSelect($event)',
    '(cdkDragDropped)': 'onDrop($event)'
  }
})
export class SquareComponent {

  @Input() isDark: boolean;
  @Input() id: Position;

  protected store = inject(StoreService);
  protected board = inject(BoardService);

  protected player$ = this.store.positions$.pipe(
    map(positions => positions[this.id]?._player),
    filter((player) => !!player),
    shareReplay()
  )

  protected piece$ = this.store.positions$.pipe(
    map(positions => positions[this.id]),
    map((piece) => piece ? Piece.Pawn : null),
  )

  protected selected$ = this.store.selectedSquare$.pipe(
    map(selectedSquare => selectedSquare === this.id)
  )

  protected attackMovement$ = this.store.attackMovementSquare$.pipe(
    map(squares => squares.includes(this.id))
  )

  protected freeMovement$ = this.store.freeMovementSquare$.pipe(
    map(squares => squares.includes(this.id))
  )


  protected readonly Player = Player;
  protected readonly Piece = Piece;


  protected onSquareSelect(event: Event) {
    event.stopPropagation();
    this.board._selectSquare(this.id);
  }

  protected onDrop(e: any) {
    console.log(e);
  }
}
