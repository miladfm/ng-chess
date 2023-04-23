import { Injectable } from '@angular/core';
import { BoardMovements, BoardPiece, Piece, PieceColor, PieceMovement, PieceType, SquareId } from './types';
import {
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  firstValueFrom,
  Observable,
  ObservedValueOf,
} from 'rxjs';
import { objLoop } from '@chess/utils';
import { ComponentStore } from '@ngrx/component-store';
import { getBoardMovements } from './movements';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Projector, SelectConfig } from '@ngrx/component-store/src/component-store';


export interface ChessConfig {
  squaresPerSide: number;
}
export interface State {
  // Board
  boardPieces: BoardPiece;
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
  public readonly boardPieces$: Observable<BoardPiece> = this.select(state => state.boardPieces);

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
    (selectedSquareId, boardMovements) => selectedSquareId ? boardMovements[selectedSquareId] : []
  )
  // endregion SELECTORS

  // region PARAMETERS SELECTORS
  public pieceColorBySquareId$(squareId: SquareId) {
    return this.select(
      this.boardPieces$,
      boardPiece => boardPiece[squareId]?.color
    )
  }

  public pieceTypeBySquareId$(squareId: SquareId) {
    return this.select(
      this.boardPieces$,
      boardPiece => boardPiece[squareId]?.type
    )
  }

  public isSquareSelectedBySquareId$(squareId: SquareId) {
    return this.select(
      this.selectedSquareId$,
      selectedSquareId => selectedSquareId === squareId
    )
  }

  public pieceMovementsBySquareId$(squareId: SquareId) {
    return this.select(this.boardMovements$, boredMovements => boredMovements[squareId])
  }

  public isSquaresAttackMoveBySquareId$(squareId: SquareId) {
    return this.select(
      this.selectedSquareMovements$,
      selectedSquareMovements =>
        selectedSquareMovements?.some(movement => movement.isAttackMove && movement.squareId === squareId)
    )
  }

  public isSquaresFreeMoveBySquareId$(squareId: SquareId) {
    return this.select(
      this.selectedSquareMovements$,
      selectedSquareMovements =>
        selectedSquareMovements?.some(movement => !movement.isAttackMove && movement.squareId === squareId)
    )
  }

  public isKingCheckByColor$(pieceColor: PieceColor) {
    return this.select(
      this.boardMovements$.pipe(combineLatestWith(this.boardPieces$)),
      ([boredMovements, boardPieces]) => {

        const kingSquareId = objLoop(boardPieces)
          .findKey((squareId, piece) => piece?.type === PieceType.King && piece.color === pieceColor);
        
        const checkingPieceSquareId = objLoop(boredMovements)
          .findKey((squareId, movements) => movements.some(movement => movement.squareId === kingSquareId));

        return checkingPieceSquareId;
      }
    )
  }
  // endregion PARAMETERS SELECTORS

  // region UPDATE
  public resetSelection() {
    this.patchState(state => ({ selectedSquareId: null }))
  }

  public selectSquare(selectedSquareId: SquareId | null) {
    this.patchState(_ => ({ selectedSquareId }))
  }

  public addPiece(piece: Piece) {
    this.patchState(state => ({ boardPieces: { ...state.boardPieces, [piece.startSquareId]: piece } }))
    console.log('state', this.get());
  }

  public replacePiece(sourceSquareId: SquareId, destinationSquareId: SquareId) {
    this.patchState(state => ({
      boardPieces: {
        ...state.boardPieces,
        [sourceSquareId]: null,
        [destinationSquareId]: state.boardPieces[sourceSquareId],
      }
    }))
  }
  // endregion UPDATE
}
