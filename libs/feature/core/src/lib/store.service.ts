import { inject, Injectable } from '@angular/core';
import { PieceColor, SquareId } from '@chess/core';
import { BehaviorSubject, distinctUntilChanged, filter, map } from 'rxjs';
import { Piece } from './piece';
import { ConfigService } from './config.service';
import { LETTER_START_CHAR_CODE, letterToASCII, LETTER_MAX_CHAR_CODE, objLoop } from '@chess/utils';

@Injectable({providedIn: 'root'})
export class StoreService {

  private config = inject(ConfigService);

  public _piecesPosition: Record<SquareId, Piece> = {};
  public _selectedSquare: SquareId;
  public _attackMovementSquare: SquareId[] = [];
  public _freeMovementSquare: SquareId[] = [];

  private positionsSubject$ = new BehaviorSubject(this._piecesPosition);
  public positions$ = this.positionsSubject$.asObservable()

  private selectedSquareSubject$ = new BehaviorSubject<SquareId>(null);
  public selectedSquare$ = this.selectedSquareSubject$.pipe(distinctUntilChanged());

  private attackMovementSquareSubject$ = new BehaviorSubject<SquareId[]>([]);
  public attackMovementSquare$ = this.attackMovementSquareSubject$.pipe(distinctUntilChanged());

  private freeMovementSquareSubject$ = new BehaviorSubject<SquareId[]>([]);
  public freeMovementSquare$ = this.freeMovementSquareSubject$.pipe(distinctUntilChanged());


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
    this._attackMovementSquare = [];
    this._freeMovementSquare = [];

    this.selectedSquareSubject$.next(this._selectedSquare);
    this.attackMovementSquareSubject$.next(this._attackMovementSquare);
    this.freeMovementSquareSubject$.next(this._freeMovementSquare);
  }

  public selectSquare(square: SquareId | null) {
    this._selectedSquare = square;
    this._attackMovementSquare = this._piecesPosition[this._selectedSquare]?.attackMovements ?? [];
    this._freeMovementSquare = this._piecesPosition[this._selectedSquare]?.freeMovements ?? [];

    this.selectedSquareSubject$.next(this._selectedSquare);
    this.attackMovementSquareSubject$.next(this._attackMovementSquare);
    this.freeMovementSquareSubject$.next(this._freeMovementSquare);

    // console.group('Selected');
    // console.log("_selectedSquare", this._selectedSquare);
    // console.log("_attackMovementSquare", this._attackMovementSquare);
    // console.log("_freeMovementSquare", this._freeMovementSquare);
    // console.groupEnd();

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

}