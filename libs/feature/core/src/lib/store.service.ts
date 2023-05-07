import { Injectable } from '@angular/core';
import {
  BoardMovements,
  BoardPieces,
  MovementHistory,
  MovementHistoryType,
  Piece,
  PieceColor,
  PieceMovement,
  PieceMovementsHistory,
  PieceType,
  SquareId,
} from './types';
import { combineLatestWith, firstValueFrom, Observable } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { getBoardMovements } from './movements';
import { getKingCheckSquareIdByColor, isCheckmateByColor, movePiece } from './store.util';


export interface ChessConfig {
  squaresPerSide: number;
}
export interface State {
  // Board
  // boardPieces: BoardPieces;
  selectedSquareId: SquareId | null;
  movementsHistories: MovementHistory[],
  selectedMovementsHistoryIndex: number | null;
  // Config
  config: ChessConfig
}

const INITIALIZE_STATE: State = {
  // boardPieces: {},
  selectedSquareId: null,
  selectedMovementsHistoryIndex: null,
  movementsHistories: [],
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
  public readonly movementsHistories$: Observable<MovementHistory[]> = this.select(state => state.movementsHistories);
  public readonly selectedMovementsHistoryIndex$: Observable<number> = this.select(state =>
    state.selectedMovementsHistoryIndex ?? state.movementsHistories.length - 1
  );

  public readonly selectedSquareId$: Observable<SquareId | null> = this.select(state => state.selectedSquareId);
  public readonly config$: Observable<ChessConfig> = this.select(state => state.config);
  public readonly configSquaresPerSide$: Observable<number> = this.select(this.config$, config => config.squaresPerSide);
  // endregion VIEW MODEL SELECTORS

  // region SELECTORS
  public readonly boardPieces$: Observable<BoardPieces> = this.select(
    this.selectedMovementsHistoryIndex$.pipe(combineLatestWith(this.movementsHistories$)),
    ([selectedMovementsHistoryIndex, movementsHistories] ) =>
      movementsHistories[selectedMovementsHistoryIndex]?.boardPieces ?? {}
  );

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

  public readonly pieceMovementsHistories$: Observable<PieceMovementsHistory[]> = this.select(
    this.movementsHistories$,
    (movementsHistories) => {
      const startGameIndex = movementsHistories.findIndex(movementsHistory => movementsHistory.type === MovementHistoryType.StartGame)
      return movementsHistories.slice(startGameIndex).map((movementsHistory, index) => ({
        type: movementsHistory.type,
        piece: movementsHistory.boardPieces[movementsHistory.to!]!,
        from: movementsHistory.from,
        to: movementsHistory.to,
        index: index + startGameIndex
      }));
    }
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

  public startGame() {
    this.patchState(state => ({
      movementsHistories: [
        ...state.movementsHistories,
        { type: MovementHistoryType.StartGame, boardPieces: state.movementsHistories[state.movementsHistories.length - 1].boardPieces }
      ],
      selectedMovementsHistoryIndex: null
    }));
  }
  public resetSelection() {
    this.patchState(({ selectedSquareId: null }));
  }

  public selectSquare(selectedSquareId: SquareId | null) {
    this.patchState(({ selectedSquareId }))
  }

  public async addPiece(piece: Piece) {
    const boardPieces = await firstValueFrom(this.boardPieces$);
    const selectedMovementsHistoryIndex = await firstValueFrom(this.selectedMovementsHistoryIndex$);
    this.patchState(state => {
      const newBoardPieces = { ...boardPieces, [piece.startSquareId]: piece };
      return {
        movementsHistories: [
          ...state.movementsHistories.slice(0, selectedMovementsHistoryIndex + 1),
          { type: MovementHistoryType.Put, boardPieces: newBoardPieces, to: piece.startSquareId }
        ],
        selectedMovementsHistoryIndex: null
      }})
  }

  public async replacePiece(sourceSquareId: SquareId, destinationSquareId: SquareId) {
    const boardMovements = await firstValueFrom(this.boardMovements$);
    const boardPieces = await firstValueFrom(this.boardPieces$);
    const selectedMovementsHistoryIndex = await firstValueFrom(this.selectedMovementsHistoryIndex$);

    const extraMovement = boardMovements[sourceSquareId].find(pieceMovement => pieceMovement.squareId === destinationSquareId)?.extraMovement;
    this.patchState(state => {
      if (!boardPieces[sourceSquareId]) {
        return {};
      }

      return {
        movementsHistories: [
          ...state.movementsHistories.slice(0, selectedMovementsHistoryIndex  +1),
          {
            type: MovementHistoryType.Move,
            boardPieces: movePiece(boardPieces, sourceSquareId, destinationSquareId, extraMovement),
            from: sourceSquareId,
            to: destinationSquareId
          }
        ],
        selectedMovementsHistoryIndex: null
      }
    })
  }

  public selectHistory(selectedMovementsHistoryIndex: number) {
    this.patchState({ selectedMovementsHistoryIndex });
  }
  // endregion UPDATE
}
