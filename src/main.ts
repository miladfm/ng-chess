import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { boardReducer } from '../libs/feature/core/src/lib/store/board.reducer';
import { configReducer } from '../libs/feature/core/src/lib/store/config.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideStore({
      board: boardReducer,
      config: configReducer
    }),
    provideStoreDevtools()
  ],
}).catch((err) => console.error(err));
