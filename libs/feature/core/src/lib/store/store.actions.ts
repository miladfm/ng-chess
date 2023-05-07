import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  SelectSquareAction,
  AccPieceAction,
  ReplacePiecesAction,
  SelectHistoryAction, SquaresPerSideAction,

} from './store.model';

export const ConfigActions = createActionGroup({
  source: 'Config',
  events: {
    'Squares Per Side': props<SquaresPerSideAction>(),
  },
});

export const BoardActions = createActionGroup({
  source: 'Board',
  events: {
    'Start Game': emptyProps(),
    'Reset Selection': emptyProps(),
    'Select Square': props<SelectSquareAction>(),
    'Add Piece': props<AccPieceAction>(),
    'Replace Piece': props<ReplacePiecesAction>(),
    'Select History': props<SelectHistoryAction>(),
  },
});


