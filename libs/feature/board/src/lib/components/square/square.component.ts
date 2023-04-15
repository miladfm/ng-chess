import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService, Piece, Player, Position, StoreService } from '@chess/core';
import { PositionToAsciiPipe } from '../../pipes/position-to-ascii.pipe';
import { filter, map, shareReplay } from 'rxjs';

@Component({
  selector: 'chess-square',
  standalone: true,
  imports: [CommonModule, PositionToAsciiPipe],
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': "square",
    '[class.square--white]': '!isDark',
    '[class.square--black]': 'isDark',
    '(click)': 'onSquareClick($event)'
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


  protected onSquareClick(event: Event) {
    event.stopPropagation();
    this.board._selectSquare(this.id);
  }
}
