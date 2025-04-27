import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import {  provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './services/auth-interseptor.service';
import { TokenInterceptor } from './services/token-interceptor.service';
import { ErrorInterceptor } from './services/error-interceptor.service';
import { DatePipe } from '@angular/common';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
      provideHttpClient(
        withInterceptors([authInterceptor]),
        withInterceptorsFromDi()),
        DatePipe,

        provideAnimationsAsync(),
        provideToastr({
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        }),

        // provideHttpClient(
        //   withInterceptors([
        //     (req, next) => new TokenInterceptor().intercept(req, next),
        //     (req, next) => new ErrorInterceptor().intercept(req, next)
        //   ])
        // ),
        provideHttpClient(withInterceptorsFromDi()) // <<< très important












  ]
};
