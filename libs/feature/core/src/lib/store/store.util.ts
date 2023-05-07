import { AccPieceAction, ReplacePiecesAction, BoardState, MovementHistory } from './store.model';
import { MovementHistoryType } from '@chess/core';
import { movePiece } from '../store.util';


// region Reducer
export function getSelectedHistoryIndex(state: BoardState) {
  return state.selectedMovementsHistoryIndex ?? state.movementsHistories.length - 1;
}

export function getActiveBoardPieces(state: BoardState) {
  const historyIndex = getSelectedHistoryIndex(state);
  return state.movementsHistories[historyIndex]?.boardPieces ?? {};
}

export function getMovementsHistoriesForNewPiece(state: BoardState, action: AccPieceAction) {
  const historyIndex = getSelectedHistoryIndex(state);
  const boardPieces =  getActiveBoardPieces(state);
  const newBoardPieces = { ...boardPieces, [action.piece.startSquareId]: action.piece };

  return [
      ...state.movementsHistories.slice(0, historyIndex + 1),
      { type: MovementHistoryType.Put, boardPieces: newBoardPieces, to: action.piece.startSquareId }
  ]
}


export function getMovementsHistoriesForReplacePiece(state: BoardState, action: ReplacePiecesAction) {
  const historyIndex = getSelectedHistoryIndex(state);
  const boardPieces =  getActiveBoardPieces(state);

  if (!boardPieces[action.sourceSquareId]) {
    return state.movementsHistories;
  }

  return [
    ...state.movementsHistories.slice(0, historyIndex + 1),
    {
      type: MovementHistoryType.Move,
      boardPieces: movePiece(boardPieces, action.sourceSquareId, action.destinationSquareId, action.extraMove),
      from: action.sourceSquareId,
      to: action.destinationSquareId
    }
  ]
}

// endregion Reducer


// region selector
export function getPieceMovements(movementsHistories: MovementHistory[]) {
  const startGameIndex = movementsHistories.findIndex(movementsHistory => movementsHistory.type === MovementHistoryType.StartGame)

  if (startGameIndex === -1) {
    return [];
  }

  return movementsHistories.slice(startGameIndex).map((movementsHistory, index) => ({
    type: movementsHistory.type,
    piece: movementsHistory.boardPieces[movementsHistory.to!]!,
    from: movementsHistory.from,
    to: movementsHistory.to,
    index: index + startGameIndex
  }));
}
// endregion selector