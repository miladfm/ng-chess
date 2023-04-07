import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[chessNumberLabel]'
})
export class ChessNumbersLabelDirective {
  @Input() set chessNumberLabel(length: number) {
    for (let index = 0; index < length; index++) {
      const context = {
        $implicit: index,
        index: length - index
      };
      this.viewContainerRef.createEmbeddedView(this.templateRef, context);
    }
  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}