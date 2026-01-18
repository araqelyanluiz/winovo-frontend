import { Component, computed, effect, inject, signal } from '@angular/core';
import { TelegramAuthService } from '../../core/services/telegram/telegram-auth.service';
import { RouterModule } from "@angular/router";
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-wallet',
  imports: [RouterModule,Icon],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {
  private readonly telegramAuthService = inject(TelegramAuthService);
  protected readonly user = this.telegramAuthService.user;
  protected readonly userBalance = computed(() => this.user()?.balance ?? 0);
  protected readonly userBalanceCurrency = computed(() => this.user()?.projectCurrency ?? 'USD');

  constructor() {
    effect(() => {
     
    });
  }
}
