import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementHistoryType } from '@chess/core';
import { StoreSelector } from '../../../../../core/src/lib/signal-store/store.selector';
import { StoreAction } from '../../../../../core/src/lib/signal-store/store.action';

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

  private storeAction = inject(StoreAction);

  protected history = inject(StoreSelector).pieceMovementsHistories;
  protected selectedMovementsHistoryIndex = inject(StoreSelector).selectedMovementsHistoryIndex;

  protected readonly MovementHistoryType = MovementHistoryType;

  protected onHistoryClick(index: number) {
    this.storeAction.selectHistory(index);
  }
}
