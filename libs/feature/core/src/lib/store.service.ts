import { inject, Injectable } from '@angular/core';
import { PieceColor, PossibleMovement, SquareId } from '@chess/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Piece } from './piece';
import { ConfigService } from './config.service';
import { LETTER_START_CHAR_CODE, letterToASCII, LETTER_MAX_CHAR_CODE, objLoop } from '@chess/utils';

@Injectable({providedIn: 'root'})
export class StoreService {

  private config = inject(ConfigService);

  public _piecesPosition: Record<SquareId, Piece> = {};
  public _piecesMovements: Record<SquareId, PossibleMovement[]> = {};
  public _selectedSquare: SquareId;
  public _selectedSquareMovements: PossibleMovement[] = [];

  private positionsSubject$ = new BehaviorSubject(this._piecesPosition);
  public positions$ = this.positionsSubject$.asObservable()

  private selectedSquareSubject$ = new BehaviorSubject<SquareId>(null);
  public selectedSquare$ = this.selectedSquareSubject$.pipe(distinctUntilChanged());

  private movementSquareSubject$ = new BehaviorSubject(this._piecesMovements);
  public movementSquare$ = this.movementSquareSubject$.pipe(distinctUntilChanged());

  private selectedMovementSquareSubject$ = new BehaviorSubject<PossibleMovement[]>([]);
  public selectedMovementSquare$ = this.selectedMovementSquareSubject$.pipe(distinctUntilChanged());

  public _getPlayerPieces(player: PieceColor) {
    return objLoop(this._piecesPosition)
        .filter((square, piece) => piece?.color === player);
  }

  public _isSquareFree(square: SquareId) {
    return !this._piecesPosition[square];
  }

  public _isSquareValid(square: SquareId) {
    const colASCII = letterToASCII(square[0]);
    const row = Number(square[1]);

    const isColValid = LETTER_START_CHAR_CODE <= colASCII && colASCII <= LETTER_MAX_CHAR_CODE;
    const isRowValid = 1 <= row && row <= this.config._squareLength;

    return isColValid && isRowValid;
  }

  public _resetSelection() {
    this._selectedSquare = null;
    this._selectedSquareMovements = [];
    this.selectedSquareSubject$.next(this._selectedSquare);
    this.selectedMovementSquareSubject$.next(this._selectedSquareMovements);
  }

  public selectSquare(squareId: SquareId | null) {
    this._selectedSquare = squareId;
    this._selectedSquareMovements = this._piecesMovements[squareId] ?? [];
    this.selectedSquareSubject$.next(this._selectedSquare);
    this.selectedMovementSquareSubject$.next(this._selectedSquareMovements);
  }

  public put(position: SquareId, pieceInstance: Piece) {
    this._piecesPosition[position] = pieceInstance;
    this.positionsSubject$.next(this._piecesPosition);
  }

  public replace(start: SquareId, end: SquareId) {
    this._piecesPosition[end] = this._piecesPosition[start];
    this._piecesPosition[start] = null;
    this.positionsSubject$.next(this._piecesPosition);
  }

  public replaceMovement(movements: Record<SquareId, PossibleMovement[]>) {
    console.log('replaceMovement', movements);
    this._piecesMovements = movements;
    this.movementSquareSubject$.next(movements);
  }

}