import { inject, Injectable } from '@angular/core';
import { PieceColor, PieceType, SquareId } from './types';
import { StoreService } from './store.service';
import { firstValueFrom, map } from 'rxjs';


@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);

  constructor() {
    // this.store.boardMovements$.subscribe(a => console.log('boardMovements$', a));
    // this.store.selectedSquareMovements$.subscribe(a => console.log('selectedSquareMovements$', a));
    this.store.isKingCheckByColor$(PieceColor.White).subscribe(a => console.log('white check', a));
    this.store.isKingCheckByColor$(PieceColor.Black).subscribe(a => console.log('black check', a));
  }


  public addPiece(color: PieceColor, type: PieceType, startSquareId: SquareId) {
    this.store.addPiece({type, color, startSquareId})
  }


  public async move(start: SquareId, end: SquareId) {

    const canMove = await firstValueFrom(
      this.store.pieceMovementsBySquareId$(start).pipe(
        map(movements => movements.some(movement => movement.squareId === end))
      )
    );

    if (canMove) {
      this.store.replacePiece(start, end);
    }
  }

  public resetSelection() {
    this.store.resetSelection();
  }

  public async selectSquare(squareId: SquareId) {

    const selectedSquareId = await firstValueFrom(this.store.selectedSquareId$);

    // deselect the selected square
    if (selectedSquareId === squareId) {
      this.store.resetSelection();
      return;
    }

    const shouldMove = await firstValueFrom(
      this.store.selectedSquareMovements$.pipe(
        map(movements => movements.some(movement => movement.squareId === squareId))
      )
    );

    // Move selected piece
    if (selectedSquareId && shouldMove) {
      await this.move(selectedSquareId, squareId);
      this.store.resetSelection();
      return;
    }

    // Select square
    this.store.selectSquare(squareId);
  }
}