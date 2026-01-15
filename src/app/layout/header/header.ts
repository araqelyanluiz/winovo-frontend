import { Component, inject, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/components/icon/icon';
import { ConfigService } from '../../core/services/config/config.service';
import { TelegramAuthService } from '../../core/services/telegram/telegram-auth.service';
import { RouterLink } from "@angular/router";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon, DecimalPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly configService = inject(ConfigService);
  private readonly telegramAuthService = inject(TelegramAuthService);
  
  protected readonly appConfig = toSignal(this.configService.config$, { requireSync: true });
  protected readonly user = this.telegramAuthService.user;
  
  protected readonly defaultBalance = computed(() => {
    return this.user()?.balances?.find(b => b.default);
  });
  
  protected readonly userBalance = computed(() => this.defaultBalance()?.balance ?? 0);
  protected readonly userBalanceCurrency = computed(() => this.defaultBalance()?.currency ?? 'USD');
  protected readonly userAvatar = computed(() => this.user()?.profile_pic ?? 'assets/images/default-avatar.png');
  protected readonly userName = computed(() => this.user()?.first_name ?? 'User');

  constructor() {
    effect(() => {
     
    });
  }

}
