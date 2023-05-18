import { effect, inject, Injectable } from '@angular/core';
import { StoreState } from './store.state';
import { MovementHistoryType } from './store.model';
import { Piece, SquareId } from '@chess/core';
import { StoreSelector } from './store.selector';
import { movePiece } from '../store.util';

@Injectable({providedIn: 'root'})
export class StoreAction {
  private store = inject(StoreState);
  private selector = inject(StoreSelector);


  public startGame() {
    this.store.board.movementsHistories.update(
      movementsHistories => [
        ...movementsHistories,
        {
          type: MovementHistoryType.StartGame,
          boardPieces: movementsHistories[movementsHistories.length - 1]?.boardPieces ?? {}
        }
      ]
    )
  }

  public resetSelection() {
    this.store.board.selectedSquareId.set(null);
  }

  public selectSquare(squareId: SquareId | null) {
    this.store.board.selectedSquareId.set(squareId);
  }

  public addPiece(piece: Piece) {
    const historyIndex = this.selector.selectedMovementsHistoryIndex();
    const boardPieces = this.selector.boardPieces();
    const newBoardPieces = { ...boardPieces, [piece.startSquareId]: piece }

    this.store.board.selectedSquareId.set(null);
    this.store.board.movementsHistories.update(movementsHistories => [
      ...movementsHistories.slice(0, historyIndex + 1),
      { type: MovementHistoryType.Put, boardPieces: newBoardPieces, to: piece.startSquareId }
    ]);
  }

  public replacePiece(sourceSquareId: SquareId, destinationSquareId: SquareId) {
    const boardMovements = this.selector.boardMovements();
    const extraMove = boardMovements[sourceSquareId].find(pieceMovement => pieceMovement.squareId === destinationSquareId)?.extraMovement;
    const historyIndex = this.selector.selectedMovementsHistoryIndex();
    const boardPieces = this.selector.boardPieces();

    if (!boardPieces[sourceSquareId]) {
      return;
    }

    this.store.board.selectedSquareId.set(null);
    this.store.board.selectedMovementsHistoryIndex.set(null);
    this.store.board.movementsHistories.update(movementsHistories => [
      ...movementsHistories.slice(0, historyIndex  +1),
      {
        type: MovementHistoryType.Move,
        boardPieces: movePiece(boardPieces, sourceSquareId, destinationSquareId, extraMove),
        from: sourceSquareId,
        to: destinationSquareId
      }
    ])
  }


  public selectHistory(index: number) {
    this.store.board.selectedSquareId.set(null);
    this.store.board.selectedMovementsHistoryIndex.set(index);
  }
}