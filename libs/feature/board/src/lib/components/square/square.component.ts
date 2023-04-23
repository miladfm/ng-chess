import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService, PieceType, PieceColor, SquareId, StoreService } from '@chess/core';
import { Observable, tap } from 'rxjs';

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
    '[class.square--white]': '!isDarkSquare',
    '[class.square--black]': 'isDarkSquare',
    '(pointerdown)': 'onSquareSelect($event)'
  }
})
export class SquareComponent implements OnInit {

  @Input() isDarkSquare: boolean;
  @Input() squareId: SquareId;

  protected store = inject(StoreService);
  protected board = inject(BoardService);

  protected pieceColor$: Observable<PieceColor| undefined>;
  protected pieceType$: Observable<PieceType| undefined>;
  protected isSelected: Observable<boolean>;
  protected isAttackMove$: Observable<boolean>;
  protected isFreeMove$: Observable<boolean>;


  protected readonly Player = PieceColor;
  protected readonly Piece = PieceType;

  ngOnInit() {
    this.pieceColor$ = this.store.pieceColorBySquareId$(this.squareId); // .pipe(tap(a => console.log('pieceColor$', a)));
    this.pieceType$ = this.store.pieceTypeBySquareId$(this.squareId); // .pipe(tap(a => console.log('pieceType$', a)));
    this.isSelected = this.store.isSquareSelectedBySquareId$(this.squareId); // .pipe(tap(a => console.log('isSelected', a)));
    this.isAttackMove$ = this.store.isSquaresAttackMoveBySquareId$(this.squareId); // .pipe(tap(a => console.log('isAttackMove$', a)));
    this.isFreeMove$ = this.store.isSquaresFreeMoveBySquareId$(this.squareId); // .pipe(tap(a => console.log('isFreeMove$', a)));
  }


  protected async onSquareSelect(event: Event) {
    event.stopPropagation();
    await this.board.selectSquare(this.squareId);
  }
}
