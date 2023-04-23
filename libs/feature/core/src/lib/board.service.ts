import { inject, Injectable } from '@angular/core';
import { objLoop } from '@chess/utils';
import { PieceType, PieceColor, SquareId, PossibleMovement } from './types';
import { StoreService } from './store.service';
import { Piece } from './piece';



@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);

  public isKingInCheck(player: PieceColor): boolean {

    const playerKing =
      objLoop(this.store._piecesPosition)
        .find((_, piece) => piece?.type === PieceType.King);


    const isCheck = objLoop(this.store._piecesMovements)
      .find((_, movements) =>
        movements.some(movement => movement.squareId === playerKing?.startSquareId && movement.isAttackMove));

    return !!isCheck;
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

  public _selectSquare(squareId: SquareId | null) {
    if (this.store._selectedSquare === squareId) {
      this.store._resetSelection();
      return;
    }

    if (
      this.store._selectedSquareMovements.some(movement => movement.squareId === squareId)
    ) {
      this.move(this.store._selectedSquare, squareId);
      this.store._resetSelection();
      return;
    }

    this.store.selectSquare(squareId);
  }

  private updateMovements() {
    const piecesMovements: Record<SquareId, PossibleMovement[]> = {};
    objLoop(this.store._piecesPosition).forEach((squareId, piece) => {
      piecesMovements[squareId] = piece?._updatePossibleMovements(this.store._piecesPosition);
    });

    this.store.replaceMovement(piecesMovements);
  }
}