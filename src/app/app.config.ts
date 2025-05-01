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
import { DatePipe } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { tokenInterceptor } from './services/token-interceptor.service';



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

        DatePipe,

        provideAnimationsAsync(),
        provideToastr({
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        }),


        provideHttpClient(
          withInterceptors([authInterceptor, tokenInterceptor]),
          withInterceptorsFromDi()
        ),







  ]
};
