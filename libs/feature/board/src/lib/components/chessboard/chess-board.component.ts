import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessSquaresDirective } from '../../directives/chess-squares.directive';
import { ChessNumbersLabelDirective } from '../../directives/chess-numbers-label.directive';
import { ChessLettersLabelDirective } from '../../directives/chess-letters-label.directive';
import { BoardService, PieceType, PieceColor, SquareId, StoreService } from '@chess/core';
import { SquareComponent } from '../square/square.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ConfigService } from '../../../../../core/src/lib/config.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChessSquaresDirective,
    ChessNumbersLabelDirective,
    ChessLettersLabelDirective,
    SquareComponent,
    DragDropModule
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
  private configService = inject(ConfigService);

  constructor() {
    this.configService.setSquareLength(this.squareLength);

    this.boardService.addPiece(PieceColor.White, PieceType.Knight, 'b1');
    this.boardService.addPiece(PieceColor.White, PieceType.Knight, 'g1');
    this.boardService.addPiece(PieceColor.White, PieceType.Queen, 'd1');
    this.boardService.addPiece(PieceColor.White, PieceType.King, 'e1');
    this.boardService.addPiece(PieceColor.White, PieceType.Rook, 'a1');
    this.boardService.addPiece(PieceColor.White, PieceType.Rook, 'h1');
    this.boardService.addPiece(PieceColor.White, PieceType.Bishop, 'c1');
    this.boardService.addPiece(PieceColor.White, PieceType.Bishop, 'f1');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'a2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'b2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'c2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'd2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'e2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'f2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'g2');
    this.boardService.addPiece(PieceColor.White, PieceType.Pawn, 'h2');

    this.boardService.addPiece(PieceColor.Black, PieceType.Knight, 'b8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Knight, 'g8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Queen, 'd8');
    this.boardService.addPiece(PieceColor.Black, PieceType.King, 'e8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Rook, 'a8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Rook, 'h8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Bishop, 'f8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Bishop, 'c8');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'a7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'b7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'c7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'd7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'e7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'f7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'g7');
    this.boardService.addPiece(PieceColor.Black, PieceType.Pawn, 'h7');
  }

  onDrop(e: CdkDragDrop<SquareId>) {
    this.boardService.resetSelection();
    this.boardService.move(e.previousContainer.data, e.container.data);
  }
}
