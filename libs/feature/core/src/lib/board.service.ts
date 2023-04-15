import { inject, Injectable } from '@angular/core';
import { Pawn, Piece, Player, Position, StoreService } from '@chess/core';
import { objLoop } from '@chess/utils';
import { ConfigService } from './config.service';
import { Bishop } from './bishop';
import { Rock } from './rock';
import { Queen } from './queen';
import { King } from './king';
import { Knight } from './knight';

@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);
  public put(player: Player, piece: Piece, position: Position) {

    switch (piece) {

      case Piece.Pawn:
        this.store.put(position, new Pawn(player, position));
        break;

      case Piece.Bishop:
        this.store.put(position, new Bishop(player, position));
        break;

      case Piece.Rook:
        this.store.put(position, new Rock(player, position));
        break;

      case Piece.King:
        this.store.put(position, new King(player, position));
        break;

      case Piece.Queen:
        this.store.put(position, new Queen(player, position));
        break;

      case Piece.Knight:
        this.store.put(position, new Knight(player, position));
        break;
    }

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