import { inject, Injectable } from '@angular/core';
import { Pawn, Piece, Player, Position, StoreService } from '@chess/core';
import { objLoop } from '@chess/utils';

@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);
  public put(player: Player, piece: Piece, position: Position) {
    this.store.put(position, new Pawn(player, position));
    this.updateMovements();
  }


  public move(start: Position, end: Position) {
    const isMoveSuccess = this.store._piecesPosition[start]?._move(end);

    if (!isMoveSuccess) {
      return;
    }

    this.store.replace(start, end);
    this.updateMovements();
  }

  public _resetSelection() {
    this.store._resetSelection();
  }

  public _selectSquare(square: Position | null) {
    if (this.store._selectedSquare === square) {
      this.store._resetSelection();
      return;
    }

    if (
      this.store._freeMovementSquare.includes(square) ||
      this.store._attackMovementSquare.includes(square)
    ) {
      this.move(this.store._selectedSquare, square);
      this.store._resetSelection();
      return;
    }

    this.store.selectSquare(square);
  }

  private updateMovements() {
    objLoop(this.store._piecesPosition).forEach((square, piece) => {
      piece?._updatePossibleMovements(this.store._piecesPosition);
    })
  }
}