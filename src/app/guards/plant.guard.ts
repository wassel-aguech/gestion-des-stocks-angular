import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/auth.service';
import { inject } from '@angular/core';

export const plantGuard: CanActivateFn = (route, state) => {


    const authService = inject (AuthserviceService);
    const router = inject (Router);

    if(authService.getRole() == 'Plant'){
    return true;
    }else{

      router.navigate(['/login']);
      return false;

    }
};
