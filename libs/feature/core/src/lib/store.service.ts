import { Injectable } from '@angular/core';
import { BoardMovements, BoardPieces, Piece, PieceColor, PieceMovement, PieceType, SquareId } from './types';
import {
  combineLatestWith, firstValueFrom,
  Observable,
} from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { getBoardMovements } from './movements';
import { isCheckmateByColor, getKingCheckSquareIdByColor, movePiece } from './store.util';


export interface ChessConfig {
  squaresPerSide: number;
}
export interface State {
  // Board
  boardPieces: BoardPieces;
  selectedSquareId: SquareId | null;

  // Config
  config: ChessConfig
}

const INITIALIZE_STATE: State = {
  boardPieces: {},
  selectedSquareId: null,
  config: {
    squaresPerSide: 8,
  }
}

@Injectable({providedIn: 'root'})
export class StoreService extends ComponentStore<State> {

  constructor() {
    super(INITIALIZE_STATE);
  }

  // region VIEW MODEL SELECTORS
  public readonly boardPieces$: Observable<BoardPieces> = this.select(state => state.boardPieces);

  public readonly selectedSquareId$: Observable<SquareId | null> = this.select(state => state.selectedSquareId);
  public readonly config$: Observable<ChessConfig> = this.select(state => state.config);
  public readonly configSquaresPerSide$: Observable<number> = this.select(this.config$, config => config.squaresPerSide);
  // endregion VIEW MODEL SELECTORS

  // region SELECTORS
  public readonly boardMovements$: Observable<BoardMovements> = this.select(
    this.boardPieces$,
    this.configSquaresPerSide$,
    getBoardMovements 
  )

  public readonly selectedSquareMovements$: Observable<PieceMovement[]> = this.select(
    this.selectedSquareId$,
    this.boardMovements$,
    (selectedSquareId, boardMovements) => boardMovements[selectedSquareId!] ?? []
  )
  // endregion SELECTORS

  // region PARAMETERS SELECTORS
  public pieceColorBySquareId$(squareId: SquareId): Observable<PieceColor | undefined> {
    return this.select(
      this.boardPieces$,
      boardPieces => boardPieces[squareId]?.color
    )
  }

  public pieceTypeBySquareId$(squareId: SquareId): Observable<PieceType | undefined> {
    return this.select(
      this.boardPieces$,
      boardPieces => boardPieces[squareId]?.type
    )
  }

  public isSquareSelectedBySquareId$(squareId: SquareId): Observable<boolean> {
    return this.select(
      this.selectedSquareId$,
      selectedSquareId => selectedSquareId === squareId
    )
  }

  public pieceMovementsBySquareId$(squareId: SquareId): Observable<PieceMovement[]> {
    return this.select(this.boardMovements$, boredMovements => boredMovements[squareId])
  }

  public isSquaresAttackMoveBySquareId$(squareId: SquareId): Observable<boolean> {
    return this.select(
      this.selectedSquareMovements$,
      selectedSquareMovements =>
        selectedSquareMovements?.some(movement => movement.isAttackMove && movement.squareId === squareId)
    )
  }

  public isSquaresFreeMoveBySquareId$(squareId: SquareId): Observable<boolean> {
    return this.select(
      this.selectedSquareMovements$,
      selectedSquareMovements =>
        selectedSquareMovements?.some(movement => !movement.isAttackMove && movement.squareId === squareId)
    )
  }

  public kingCheckSquareIdByColor$(pieceColor: PieceColor): Observable<SquareId | undefined> {
    return this.select(
      this.boardMovements$.pipe(combineLatestWith(this.boardPieces$)),
      ([boredMovements, boardPieces]) =>
        getKingCheckSquareIdByColor({ boardPieces, boardMovements: boredMovements, pieceColor })
    )
  }

  public isCheckmateByColor$(pieceColor: PieceColor): Observable<boolean> {
    return this.select(
      this.boardMovements$.pipe(combineLatestWith(this.boardPieces$)),
      ([boredMovements, boardPieces]) =>
        isCheckmateByColor(pieceColor, boardPieces, boredMovements)
    )
  }
  // endregion PARAMETERS SELECTORS

  // region UPDATE
  public resetSelection() {
    this.patchState(({ selectedSquareId: null }));
  }

  public selectSquare(selectedSquareId: SquareId | null) {
    this.patchState(({ selectedSquareId }))
  }

  public addPiece(piece: Piece) {
    this.patchState(state => ({ boardPieces: { ...state.boardPieces, [piece.startSquareId]: piece } }))
  }

  public async replacePiece(sourceSquareId: SquareId, destinationSquareId: SquareId) {
    const boardMovements = await firstValueFrom(this.boardMovements$);
    const extraMovement = boardMovements[sourceSquareId].find(pieceMovement => pieceMovement.squareId === destinationSquareId)?.extraMovement;
    this.patchState(state => ({
      boardPieces: movePiece(state.boardPieces, sourceSquareId, destinationSquareId, extraMovement)
    }))
  }
  // endregion UPDATE
}
