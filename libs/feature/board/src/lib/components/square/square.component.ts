import {
  ChangeDetectionStrategy,
  Component, effect,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext, Signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardService, PieceType, PieceColor, SquareId } from '@chess/core';
import { StoreSelector } from '../../../../../core/src/lib/signal-store/store.selector';

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

  protected selector = inject(StoreSelector);
  protected board = inject(BoardService);
  protected injector = inject(Injector);

  protected pieceColor: Signal<PieceColor| undefined>;
  protected pieceType: Signal<PieceType| undefined>;
  protected isSelected: Signal<boolean>;
  protected isAttackMove: Signal<boolean>;
  protected isFreeMove: Signal<boolean>;


  protected readonly Player = PieceColor;
  protected readonly Piece = PieceType;


  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.pieceColor = this.selector.pieceColorBySquareId(this.squareId);
      this.pieceType = this.selector.pieceTypeBySquareId(this.squareId);
      this.isSelected = this.selector.isSquareSelectedBySquareId(this.squareId);
      this.isAttackMove = this.selector.isSquaresAttackMoveBySquareId(this.squareId);
      this.isFreeMove = this.selector.isSquaresFreeMoveBySquareId(this.squareId);
    });
  }


  protected async onSquareSelect(event: Event) {
    event.stopPropagation();
    await this.board.selectSquare(this.squareId);
  }
}
