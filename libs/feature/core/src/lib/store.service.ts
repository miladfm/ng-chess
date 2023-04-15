import { Injectable } from '@angular/core';
import { Pawn, Piece, Player, Position } from '@chess/core';
import { BehaviorSubject, distinctUntilChanged, filter, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class StoreService {

  public _piecesPosition: Record<Position, Pawn> = {};
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
    this._attackMovementSquare = this._piecesPosition[this._selectedSquare]?.possibleAttackMovements ?? [];
    this._freeMovementSquare = this._piecesPosition[this._selectedSquare]?.possibleFreeMovements ?? [];

    this.selectedSquareSubject$.next(this._selectedSquare);
    this.attackMovementSquareSubject$.next(this._attackMovementSquare);
    this.freeMovementSquareSubject$.next(this._freeMovementSquare);

    console.group('Selected');
    console.log("_selectedSquare", this._selectedSquare);
    console.log("_attackMovementSquare", this._attackMovementSquare);
    console.log("_freeMovementSquare", this._freeMovementSquare);
    console.groupEnd();

  }

  public put(position: Position, pieceInstance: Pawn) {
    this._piecesPosition[position] = pieceInstance;
    this.positionsSubject$.next(this._piecesPosition);
  }

  public replace(start: Position, end: Position) {
    this._piecesPosition[end] = this._piecesPosition[start];
    this._piecesPosition[start] = null;
    this.positionsSubject$.next(this._piecesPosition);
  }

}