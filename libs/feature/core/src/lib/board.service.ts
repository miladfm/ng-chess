import { inject, Injectable } from '@angular/core';
import { objLoop } from '@chess/utils';
import { Bishop } from './bishop';
import { Rook } from './rook';
import { Queen } from './queen';
import { King } from './king';
import { Knight } from './knight';
import { Pawn } from './pawn';
import { Piece, Player, Position } from './types';
import { StoreService } from './store.service';


const PIECE_CLASS_REF: Record<Piece, any> = {
  [Piece.Pawn]: Pawn,
  [Piece.Bishop]: Bishop,
  [Piece.Rook]: Rook,
  [Piece.Queen]: Queen,
  [Piece.King]: King,
  [Piece.Knight]: Knight,
}

@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);

  public isKingInCheck(player: Player): boolean {

    const opponentPieces = this.store._getPlayerPieces(player === Player.White ? Player.Black : Player.White);
    const playerKing =
      objLoop(this.store._piecesPosition)
        .find((_, piece) => piece?.type === Piece.King);


    return opponentPieces.some(piece => piece._possibleAttackMovements.includes(playerKing._currentPosition))
  }
  public put(player: Player, piece: Piece, position: Position) {

    this.store.put(position, new PIECE_CLASS_REF[piece](player, position))
    this.updateMovements();
  }


  public move(start: Position, end: Position) {
    const isMoveSuccess = this.store._piecesPosition[start]?._move(end);

    if (!isMoveSuccess) {
      return;
    }

    this.store.replace(start, end);
    this.updateMovements();
    console.log('White Check', this.isKingInCheck(Player.White));
    console.log('Black Check', this.isKingInCheck(Player.Black));
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