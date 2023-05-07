import { createReducer, on } from '@ngrx/store';
import { BoardActions } from './store.actions';
import { BoardState, MovementHistoryType } from './store.model';
import { getMovementsHistoriesForNewPiece, getMovementsHistoriesForReplacePiece } from './store.util';

export const INITIALIZE_STATE: BoardState = {
  selectedSquareId: null,
  selectedMovementsHistoryIndex: null,
  movementsHistories: [],
}

export const boardReducer = createReducer(
  INITIALIZE_STATE,

  on(BoardActions.startGame, (state) => ({
    ...state,
    movementsHistories: [
      ...state.movementsHistories,
      {
        type: MovementHistoryType.StartGame,
        boardPieces: state.movementsHistories[state.movementsHistories.length - 1].boardPieces
      }
    ]
  })),


  on(BoardActions.resetSelection, (state) => ({
    ...state,
    selectedSquareId: null
  })),

  on(BoardActions.selectSquare, (state, action) => ({
    ...state,
    selectedSquareId: action.selectedSquareId
  })),

  on(BoardActions.addPiece, (state, action) => ({
    ...state,
    movementsHistories: getMovementsHistoriesForNewPiece(state, action),
    selectedMovementsHistoryIndex: null
  })),

  on(BoardActions.replacePiece, (state, action) => ({
    ...state,
    movementsHistories: getMovementsHistoriesForReplacePiece(state, action),
    selectedMovementsHistoryIndex: null
  })),


  on(BoardActions.selectHistory, (state, action) => ({
    ...state,
    selectedMovementsHistoryIndex: action.index,
    selectedSquareId: null
  }))
);