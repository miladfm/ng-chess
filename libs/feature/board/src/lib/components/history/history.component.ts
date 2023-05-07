import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementHistoryType, StoreService } from '@chess/core';

@Component({
  selector: 'chess-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {}
})
export class HistoryComponent {

  private store = inject(StoreService);
  protected history$ = this.store.get.pieceMovementsHistories();
  protected selectedMovementsHistoryIndex$ = this.store.get.selectedMovementsHistoryIndex();

  protected readonly MovementHistoryType = MovementHistoryType;

  protected onHistoryClick(index: number) {
    this.store.dispatch.selectHistory(index);
  }
}
