import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject (AuthserviceService);
  const router = inject (Router);

  if(authService.getRole() == 'Admin'){
  return true;
  }else{

    router.navigate(['/login']);
    return false;

  }

};
