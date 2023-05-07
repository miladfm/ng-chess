import { inject, Injectable } from '@angular/core';
import {
  Piece,
  PieceColor,
  SquareId,
} from './types';
import { firstValueFrom, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { BoardActions } from './store/store.actions';
import {
  boardMovements,
  boardPieces, isSquaresAttackMoveBySquareId,
  isSquareSelectedBySquareId, isSquaresFreeMoveBySquareId,
  movementsHistories,
  pieceColorBySquareId, pieceMovementsBySquareId,
  pieceMovementsHistories,
  pieceTypeBySquareId,
  selectedMovementsHistoryIndex,
  selectedSquareId,
  selectedSquareMovements,
  squaresPerSide,
  isCheckmateByColor, isKingCheckSquareIdByColor,
} from './store/store.selector';

@Injectable({providedIn: 'root'})
export class StoreService {

  private store = inject(Store);

  public get = {
    squaresPerSide: () => this.store.select(squaresPerSide),
    selectedMovementsHistoryIndex: () => this.store.select(selectedMovementsHistoryIndex),
    movementsHistories: () => this.store.select(movementsHistories),
    selectedSquareId: () => this.store.select(selectedSquareId),
    boardPieces: () => this.store.select(boardPieces),
    boardMovements: () => this.store.select(boardMovements),
    selectedSquareMovements: () => this.store.select(selectedSquareMovements),
    pieceMovementsHistories: () => this.store.select(pieceMovementsHistories),
    pieceColorBySquareId: (squareId: SquareId) => this.store.select(pieceColorBySquareId(squareId)),
    pieceTypeBySquareId: (squareId: SquareId) => this.store.select(pieceTypeBySquareId(squareId)),
    isSquareSelectedBySquareId: (squareId: SquareId) => this.store.select(isSquareSelectedBySquareId(squareId)),
    pieceMovementsBySquareId: (squareId: SquareId) => this.store.select(pieceMovementsBySquareId(squareId)),
    isSquaresAttackMoveBySquareId: (squareId: SquareId) => this.store.select(isSquaresAttackMoveBySquareId(squareId)),
    isSquaresFreeMoveBySquareId: (squareId: SquareId) => this.store.select(isSquaresFreeMoveBySquareId(squareId)),
    isCheckmateByColor: (pieceColor: PieceColor) => this.store.select(isCheckmateByColor(pieceColor)),
    isKingCheckSquareIdByColor: (pieceColor: PieceColor) => this.store.select(isKingCheckSquareIdByColor(pieceColor)),
  }

  public snapshots = {
    squaresPerSide: () => firstValueFrom(this.store.select(squaresPerSide)),
    selectedMovementsHistoryIndex: () => firstValueFrom(this.store.select(selectedMovementsHistoryIndex)),
    movementsHistories: () => firstValueFrom(this.store.select(movementsHistories)),
    selectedSquareId: () => firstValueFrom(this.store.select(selectedSquareId)),
    boardPieces: () => firstValueFrom(this.store.select(boardPieces)),
    boardMovements: () => firstValueFrom(this.store.select(boardMovements)),
    selectedSquareMovements: () => firstValueFrom(this.store.select(selectedSquareMovements)),
    pieceMovementsHistories: () => firstValueFrom(this.store.select(pieceMovementsHistories)),
    pieceColorBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(pieceColorBySquareId(squareId))),
    pieceTypeBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(pieceTypeBySquareId(squareId))),
    isSquareSelectedBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(isSquareSelectedBySquareId(squareId))),
    pieceMovementsBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(pieceMovementsBySquareId(squareId))),
    isSquaresAttackMoveBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(isSquaresAttackMoveBySquareId(squareId))),
    isSquaresFreeMoveBySquareId: (squareId: SquareId) => firstValueFrom(this.store.select(isSquaresFreeMoveBySquareId(squareId))),
    isCheckmateByColor: (pieceColor: PieceColor) => firstValueFrom(this.store.select(isCheckmateByColor(pieceColor))),
    isKingCheckSquareIdByColor: (pieceColor: PieceColor) => firstValueFrom(this.store.select(isKingCheckSquareIdByColor(pieceColor))),
  }

  public dispatch = {
    startGame: () => this.store.dispatch(BoardActions.startGame()),
    resetSelection: () => this.store.dispatch(BoardActions.resetSelection()),
    selectSquare: (selectedSquareId: SquareId | null) => this.store.dispatch(BoardActions.selectSquare({selectedSquareId})),
    addPiece: (piece: Piece) => this.store.dispatch(BoardActions.addPiece({piece})),
    selectHistory: (index: number) => this.store.dispatch(BoardActions.selectHistory({index})),

    replacePiece: async (sourceSquareId: SquareId, destinationSquareId: SquareId) => {
      const boardMovements = await this.snapshots.boardMovements();
      const extraMove = boardMovements[sourceSquareId].find(pieceMovement => pieceMovement.squareId === destinationSquareId)?.extraMovement;
      this.store.dispatch(BoardActions.replacePiece({ sourceSquareId, destinationSquareId, extraMove }));
    },
  }
}
