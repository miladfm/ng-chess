import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessSquaresDirective } from '../../directives/chess-squares.directive';
import { ChessNumbersLabelDirective } from '../../directives/chess-numbers-label.directive';
import { ChessLettersLabelDirective } from '../../directives/chess-letters-label.directive';
import { Pawn, Player } from '@chess/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChessSquaresDirective,
    ChessNumbersLabelDirective,
    ChessLettersLabelDirective
  ],
  selector: "chess-board",
  templateUrl: "./chess-board.component.html",
  styleUrls: ["./chess-board.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessBoardComponent {

  protected readonly squareLength = 8;

  constructor() {
    const pawn1 = new Pawn('a1', Player.White);
    const pawn2 = new Pawn('a8', Player.Black);

    console.log(pawn1);
    console.log(pawn2);


    pawn1.move('a2');
    pawn1.move('a4');

    pawn2.move('a6');
    pawn2.move('a5');
    pawn2.move('a3');
  }
}
