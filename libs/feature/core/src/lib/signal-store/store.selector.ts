import { computed, inject, Injectable } from '@angular/core';
import { StoreState } from './store.state';
import { getBoardMovements } from '../movements';
import { getPieceMovements } from './store.util';
import { PieceColor, SquareId } from '@chess/core';
import { getKingCheckSquareIdByColor, isCheckmateByColor as isCheckmateByColorUtil } from '../store.util';

@Injectable({providedIn: 'root'})
export class StoreSelector {

  private store = inject(StoreState);


  public squaresPerSide = this.store.config.squaresPerSide.asReadonly();

  public selectedMovementsHistoryIndex = computed(() =>
    this.store.board.selectedMovementsHistoryIndex() ?? Math.max(0, this.store.board.movementsHistories().length - 1)
  )

  public selectedSquareId = this.store.board.selectedSquareId.asReadonly();

  public movementsHistories = this.store.board.movementsHistories.asReadonly();

  public boardPieces = computed(() =>
    this.movementsHistories()[this.selectedMovementsHistoryIndex()]?.boardPieces ?? {}
  )

  public boardMovements = computed(() =>
    getBoardMovements(this.boardPieces(), this.squaresPerSide())
  )

  public selectedSquareMovements = computed(() =>
    this.boardMovements()[this.selectedSquareId()!] ?? []
  )

  public pieceMovementsHistories = computed(() =>
    getPieceMovements(this.movementsHistories())
  )

  public pieceColorBySquareId = (squareId: SquareId) => computed(() =>
    this.boardPieces()[squareId]?.color
  )

  public pieceTypeBySquareId = (squareId: SquareId) => computed(() =>
    this.boardPieces()[squareId]?.type
  )

  public isSquareSelectedBySquareId = (squareId: SquareId) => computed(() =>
    this.selectedSquareId() === squareId
  )

  public pieceMovementsBySquareId = (squareId: SquareId) => computed(() =>
    this.boardMovements()[squareId]
  )

  public isSquaresAttackMoveBySquareId = (squareId: SquareId) => computed(() =>
    this.selectedSquareMovements()?.some(movement => movement.isAttackMove && movement.squareId === squareId)
  )

  public isSquaresFreeMoveBySquareId = (squareId: SquareId) => computed(() =>
    this.selectedSquareMovements()?.some(movement => !movement.isAttackMove && movement.squareId === squareId)
  )

  public isCheckmateByColor = (pieceColor: PieceColor) => computed(() =>
    isCheckmateByColorUtil(
      pieceColor,
      this.boardPieces(),
      this.boardMovements()
    )
  )

  public isKingCheckSquareIdByColor = (pieceColor: PieceColor) => computed(() =>
    getKingCheckSquareIdByColor({
      boardPieces: this.boardPieces(),
      boardMovements: this.boardMovements(),
      pieceColor
    })
  )
}