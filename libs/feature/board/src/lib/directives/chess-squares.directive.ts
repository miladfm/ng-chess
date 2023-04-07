import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { indexToLetter } from '@chess/utils';

@Directive({
  standalone: true,
  selector: '[chessSquares]'
})
export class ChessSquaresDirective {
  @Input() set chessSquares(length: number) {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        const index = row * length + col;
        const context = {
          $implicit: index,
          row,
          col,
          index,
          isDarkSquare: (row + col) % 2 === 1,
          label: indexToLetter(index, 8) + (length - row)
        };
        this.viewContainerRef.createEmbeddedView(this.templateRef, context);
      }
    }

  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}