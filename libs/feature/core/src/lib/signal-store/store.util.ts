import { MovementHistory } from './store.model';
import { MovementHistoryType } from '@chess/core';


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