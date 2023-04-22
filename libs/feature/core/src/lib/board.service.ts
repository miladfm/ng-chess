import { inject, Injectable } from '@angular/core';
import { objLoop } from '@chess/utils';
import { PieceType, PieceColor, SquareId } from './types';
import { StoreService } from './store.service';
import { Piece } from './piece';



@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);

  public isKingInCheck(player: PieceColor): boolean {

    const opponentPieces = this.store._getPlayerPieces(player === PieceColor.White ? PieceColor.Black : PieceColor.White);
    const playerKing =
      objLoop(this.store._piecesPosition)
        .find((_, piece) => piece?.type === PieceType.King);


    return playerKing && opponentPieces.some(piece => piece.attackMovements.includes(playerKing.startSquareId))
  }
  public put(color: PieceColor, type: PieceType, startSquareId: SquareId) {

    this.store.put(startSquareId, new Piece(type, color, startSquareId))
    this.updateMovements();
  }


  public move(start: SquareId, end: SquareId) {
    const isMoveSuccess = this.store._piecesPosition[start]?._move(end);

    if (!isMoveSuccess) {
      return;
    }

    this.store.replace(start, end);
    this.updateMovements();
    // console.log('White Check', this.isKingInCheck(Player.White));
    // console.log('Black Check', this.isKingInCheck(Player.Black));
  }

  public _resetSelection() {
    this.store._resetSelection();
  }

  public _selectSquare(square: SquareId | null) {
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