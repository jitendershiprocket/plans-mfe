import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withDisabledInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Set base href to empty string so router ignores shell app's URL path
    { provide: APP_BASE_HREF, useValue: '' },
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withDisabledInitialNavigation() // Disable automatic initial navigation for microfrontend
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    )
  ]
};
