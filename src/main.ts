import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
