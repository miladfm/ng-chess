import { inject, Injectable } from '@angular/core';
import { Player, Position } from '@chess/core';
import { BehaviorSubject, distinctUntilChanged, filter, map } from 'rxjs';
import { PieceBase } from './piece.base';
import { ConfigService } from './config.service';
import { LETTER_START_CHAR_CODE, letterToASCII, LETTER_MAX_CHAR_CODE, objLoop } from '@chess/utils';

@Injectable({providedIn: 'root'})
export class StoreService {

  private config = inject(ConfigService);

  public _piecesPosition: Record<Position, PieceBase> = {};
  public _selectedSquare: Position;
  public _attackMovementSquare: Position[] = [];
  public _freeMovementSquare: Position[] = [];

  private positionsSubject$ = new BehaviorSubject(this._piecesPosition);
  public positions$ = this.positionsSubject$.asObservable()

  private selectedSquareSubject$ = new BehaviorSubject<Position>(null);
  public selectedSquare$ = this.selectedSquareSubject$.pipe(distinctUntilChanged());

  private attackMovementSquareSubject$ = new BehaviorSubject<Position[]>([]);
  public attackMovementSquare$ = this.attackMovementSquareSubject$.pipe(distinctUntilChanged());

  private freeMovementSquareSubject$ = new BehaviorSubject<Position[]>([]);
  public freeMovementSquare$ = this.freeMovementSquareSubject$.pipe(distinctUntilChanged());


  public _getPlayerPieces(player: Player) {
    return objLoop(this._piecesPosition)
        .filter((square, piece) => piece?._player === player);
  }

  public _isSquareFree(square: Position) {
    return !this._piecesPosition[square];
  }

  public _isSquareValid(square: Position) {
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

  public selectSquare(square: Position | null) {
    this._selectedSquare = square;
    this._attackMovementSquare = this._piecesPosition[this._selectedSquare]?._possibleAttackMovements ?? [];
    this._freeMovementSquare = this._piecesPosition[this._selectedSquare]?._possibleFreeMovements ?? [];

    this.selectedSquareSubject$.next(this._selectedSquare);
    this.attackMovementSquareSubject$.next(this._attackMovementSquare);
    this.freeMovementSquareSubject$.next(this._freeMovementSquare);

    console.group('Selected');
    console.log("_selectedSquare", this._selectedSquare);
    console.log("_attackMovementSquare", this._attackMovementSquare);
    console.log("_freeMovementSquare", this._freeMovementSquare);
    console.groupEnd();

  }

  public put(position: Position, pieceInstance: PieceBase) {
    this._piecesPosition[position] = pieceInstance;
    this.positionsSubject$.next(this._piecesPosition);
  }

  public replace(start: Position, end: Position) {
    this._piecesPosition[end] = this._piecesPosition[start];
    this._piecesPosition[start] = null;
    this.positionsSubject$.next(this._piecesPosition);
  }

}