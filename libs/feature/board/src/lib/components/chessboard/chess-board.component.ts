import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessSquaresDirective } from '../../directives/chess-squares.directive';
import { ChessNumbersLabelDirective } from '../../directives/chess-numbers-label.directive';
import { ChessLettersLabelDirective } from '../../directives/chess-letters-label.directive';
import { BoardService, Piece, Player, StoreService } from '@chess/core';
import { PositionToAsciiPipe } from '../../pipes/position-to-ascii.pipe';
import { SquareComponent } from '../square/square.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChessSquaresDirective,
    ChessNumbersLabelDirective,
    ChessLettersLabelDirective,
    PositionToAsciiPipe,
    SquareComponent,
  ],
  selector: "chess-board",
  templateUrl: "./chess-board.component.html",
  styleUrls: ["./chess-board.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessBoardComponent {

  protected readonly squareLength = 8;

  private boardService = inject(BoardService);
  private storeService = inject(StoreService);

  constructor() {
    this.boardService.put(Player.White, Piece.Pawn, 'a2');
    this.boardService.put(Player.White, Piece.Pawn, 'b2');
    this.boardService.put(Player.White, Piece.Pawn, 'c2');
    this.boardService.put(Player.White, Piece.Pawn, 'd2');
    this.boardService.put(Player.White, Piece.Pawn, 'e2');
    this.boardService.put(Player.White, Piece.Pawn, 'f2');
    this.boardService.put(Player.White, Piece.Pawn, 'g2');
    this.boardService.put(Player.White, Piece.Pawn, 'h2');

    this.boardService.put(Player.Black, Piece.Pawn, 'a7');
    this.boardService.put(Player.Black, Piece.Pawn, 'b7');
    this.boardService.put(Player.Black, Piece.Pawn, 'c7');
    this.boardService.put(Player.Black, Piece.Pawn, 'd7');
    this.boardService.put(Player.Black, Piece.Pawn, 'e7');
    this.boardService.put(Player.Black, Piece.Pawn, 'f7');
    this.boardService.put(Player.Black, Piece.Pawn, 'g7');
    this.boardService.put(Player.Black, Piece.Pawn, 'h7');


    // setTimeout(() => this.boardService.move('a2', 'a3'), 1000)
    // setTimeout(() => this.boardService.move('a3', 'a5'), 2000)
    // setTimeout(() => this.boardService.move('b7', 'b5'), 3000)
    // setTimeout(() => this.boardService.move('b5', 'b3'), 4000)
    // setTimeout(() => this.boardService.move('b5', 'b4'), 5000)

  }
}
