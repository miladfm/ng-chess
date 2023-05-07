import { inject, Injectable } from '@angular/core';
import { PieceColor, PieceType, SquareId } from './types';
import { StoreService } from './store.service';


@Injectable({providedIn: 'root'})
export class BoardService {

  private store = inject(StoreService);

  constructor() {
    this.store.get.isKingCheckSquareIdByColor(PieceColor.White).subscribe(a => console.log('white check', a));
    this.store.get.isKingCheckSquareIdByColor(PieceColor.Black).subscribe(a => console.log('black check', a));

    this.store.get.isCheckmateByColor(PieceColor.White).subscribe(a => console.log('white checkmate', a));
    this.store.get.isCheckmateByColor(PieceColor.Black).subscribe(a => console.log('black checkmate', a));
  }

  public startGame() {
    this.store.dispatch.startGame();
  }


  public async addPiece(color: PieceColor, type: PieceType, startSquareId: SquareId) {
    await this.store.dispatch.addPiece({type, color, startSquareId, hasMoved: false})
  }


  public async move(start: SquareId, end: SquareId) {

    const movements = await this.store.snapshots.pieceMovementsBySquareId(start);
    const canMove = movements.some(movement => movement.squareId === end)

    if (canMove) {
      await this.store.dispatch.replacePiece(start, end);
    }
  }

  public resetSelection() {
    this.store.dispatch.resetSelection();
  }

  public async selectSquare(squareId: SquareId) {

    const selectedSquareId = await this.store.snapshots.selectedSquareId();

    // deselect the selected square
    if (selectedSquareId === squareId) {
      this.store.dispatch.resetSelection();
      return;
    }

    const selectedSquareMovements = await this.store.snapshots.selectedSquareMovements();
    const shouldMove = selectedSquareMovements.some(movement => movement.squareId === squareId);

    // Move selected piece
    if (selectedSquareId && shouldMove) {
      await this.move(selectedSquareId, squareId);
      this.store.dispatch.resetSelection();
      return;
    }

    // Select square
    this.store.dispatch.selectSquare(squareId);
  }
}