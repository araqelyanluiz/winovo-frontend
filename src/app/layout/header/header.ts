import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/components/icon/icon';
import { ConfigService } from '../../core/services/config/config.service';
import { TelegramAuthService } from '../../core/services/telegram/telegram-auth.service';
import { RouterLink } from "@angular/router";
import { DecimalPipe } from '@angular/common';
import { VersionedAssetPipe } from '../../shared/pipes/versioned-asset.pipe';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon, DecimalPipe, VersionedAssetPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly configService = inject(ConfigService);
  private readonly telegramAuthService = inject(TelegramAuthService);
  
  protected readonly appConfig = toSignal(this.configService.config$, { requireSync: true });
  protected readonly user = this.telegramAuthService.user;
  
  protected readonly userBalance = computed(() => this.user()?.balance ?? 0);
  protected readonly userBalanceCurrency = computed(() => this.user()?.projectCurrency ?? 'USD');
  protected readonly userAvatar = computed(() => this.user()?.profile_pic ?? 'assets/images/default-avatar.png');
  protected readonly userName = computed(() => this.user()?.first_name);

  openSupportChat() {
    const supportLink = this.appConfig().supportChatLink;
    if (supportLink) {
      window.open(supportLink, '_blank');
    }
  }
}
