import { createReducer, on } from '@ngrx/store';
import { ConfigActions } from './store.actions';
import { ConfigState } from './store.model';

export const INITIALIZE_STATE: ConfigState = {
  squaresPerSide: 8,
}

export const configReducer = createReducer(
  INITIALIZE_STATE,

  on(ConfigActions.squaresPerSide, (state, action) => ({
    ...state,
    config:
      { ...state, squaresPerSide: action.squaresPerSide }
  })),
);