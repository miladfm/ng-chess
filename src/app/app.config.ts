import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { boardReducer } from '../../libs/feature/core/src/lib/store/board.reducer';
import { configReducer } from '../../libs/feature/core/src/lib/store/config.reducer';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideStore({
      board: boardReducer,
      config: configReducer,
    }),
    provideStoreDevtools(),
  ],
};
