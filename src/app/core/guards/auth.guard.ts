import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TelegramAuthService } from '../services/telegram/telegram-auth.service';

export const authGuard: CanActivateFn = () => {
  const telegramAuthService = inject(TelegramAuthService);
  const router = inject(Router);

  if (!telegramAuthService.user()) {
    router.navigate(['/404']);
    return false;
  }

  return true;
};
