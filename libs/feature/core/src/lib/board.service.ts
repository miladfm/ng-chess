import { effect, inject, Injectable } from '@angular/core';
import { PieceColor, PieceType, SquareId } from './types';
import { StoreAction } from './signal-store/store.action';
import { StoreSelector } from './signal-store/store.selector';


@Injectable({providedIn: 'root'})
export class BoardService {

  private signalAction = inject(StoreAction);
  private signalSelector = inject(StoreSelector);

  constructor() {

    const isWhiteKingCheck = this.signalSelector.isKingCheckSquareIdByColor(PieceColor.White);
    const isBlackKingCheck = this.signalSelector.isKingCheckSquareIdByColor(PieceColor.Black);
    const isWhiteKingCheckmate = this.signalSelector.isCheckmateByColor(PieceColor.White);
    const isBlackKingCheckmate = this.signalSelector.isCheckmateByColor(PieceColor.Black);

    effect(() => console.log('[signal] white check', isWhiteKingCheck()))
    effect(() => console.log('[signal] black check', isBlackKingCheck()))
    effect(() => console.log('[signal] white checkmate', isWhiteKingCheckmate()))
    effect(() => console.log('[signal] black checkmate', isBlackKingCheckmate()))





    // this.store.get.pieceMovementsHistories().pipe(
    //   filter((histories) => histories[0]?.type === MovementHistoryType.StartGame),
    //   withLatestFrom(
    //     this.store.get.boardPieces(),
    //     this.store.get.boardMovements()
    //   ),
    // ).subscribe(([movementHistory, boardPieces, boardMovement]) => {
    //   aiMove(boardPieces, boardMovement, activeColor).then(aiMove => {
    //     activeColor = activeColor === PieceColor.White ? PieceColor.Black : PieceColor.White;
    //     this.store.dispatch.replacePiece(aiMove.bestMove.from, aiMove.bestMove.to);
    //   });
    // })
  }

  public startGame() {
    this.signalAction.startGame();
  }


  public async addPiece(color: PieceColor, type: PieceType, startSquareId: SquareId) {
    const piece = {type, color, startSquareId, hasMoved: false};
    this.signalAction.addPiece(piece);
  }


  public move(start: SquareId, end: SquareId) {

    const signalMovements = this.signalSelector.pieceMovementsBySquareId(start)();
    const signalCanMove = signalMovements.some(movement => movement.squareId === end)

    if (signalCanMove) {
      this.signalAction.replacePiece(start, end);
    }
  }

  public resetSelection() {
    this.signalAction.resetSelection();
  }

  public selectSquare(squareId: SquareId) {
    const signalSelectedSquareId = this.signalSelector.selectedSquareId();

    // deselect the selected square
    if (signalSelectedSquareId === squareId) {
      this.signalAction.resetSelection();
      return;
    }

    const signalSelectedSquareMovements = this.signalSelector.selectedSquareMovements();
    const signalShouldMove = signalSelectedSquareMovements.some(movement => movement.squareId === squareId);

    // Move selected piece
    if (signalSelectedSquareId && signalShouldMove) {
      this.move(signalSelectedSquareId, squareId);
      this.signalAction.resetSelection();
      return;
    }

    // Select square
    this.signalAction.selectSquare(squareId);
  }
}