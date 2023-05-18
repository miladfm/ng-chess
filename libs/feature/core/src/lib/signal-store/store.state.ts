import { Injectable, signal } from '@angular/core';
import { MovementHistory } from './store.model';
import { SquareId } from '@chess/core';

@Injectable({providedIn: 'root'})
export class StoreState {

  public config = {
    squaresPerSide: signal(8)
  }

  public board = {
    selectedSquareId: signal<SquareId | null>(null),
    selectedMovementsHistoryIndex: signal<number | null>(null),
    movementsHistories: signal<MovementHistory[]>([])
  }

}