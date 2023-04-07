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
  selector: '[chessLettersLabel]'
})
export class ChessLettersLabelDirective {
  @Input() set chessLettersLabel(length: number) {
    for (let index = 0; index < length; index++) {
      const context = {
        $implicit: index,
        letter: indexToLetter(index)
      };
      this.viewContainerRef.createEmbeddedView(this.templateRef, context);
    }
  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}