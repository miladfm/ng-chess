import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[chessSquares]'
})
export class ChessSquaresDirective {
  @Input() set chessSquares(length: number) {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        const context = {
          $implicit: row * length + col,
          row,
          col,
          isDarkSquare: (row + col) % 2 === 1
        };
        this.viewContainerRef.createEmbeddedView(this.templateRef, context);
      }
    }

  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}