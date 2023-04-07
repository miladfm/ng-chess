import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';


const MAX_LETTERS_LENGTH = 26;
const ASCII_A = 'a'.charCodeAt(0);

@Directive({
  standalone: true,
  selector: '[chessLettersLabel]'
})
export class ChessLettersLabelDirective {
  @Input() set chessLettersLabel(length: number) {
    for (let index = 0; index < length; index++) {
      const letterIndex = Math.ceil(index % MAX_LETTERS_LENGTH);
      const letter = String.fromCharCode(ASCII_A + letterIndex);
      const context = {
        $implicit: index,
        letter
      };
      this.viewContainerRef.createEmbeddedView(this.templateRef, context);
    }
  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}