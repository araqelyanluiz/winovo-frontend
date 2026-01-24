import { Component, inject, computed } from '@angular/core';
import { TelegramAuthService } from '../../core/services/telegram/telegram-auth.service';
import { Icon } from "../../shared/components/icon/icon";

@Component({
  selector: 'app-profile',
  imports: [Icon],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly telegramAuthService = inject(TelegramAuthService);

  protected readonly user = this.telegramAuthService.user;
  protected readonly userAvatar = computed(() => this.user()?.profile_pic ?? 'assets/images/default-avatar.png');
  protected readonly userName = computed(() => {
    const user = this.user();
    return user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user?.first_name ?? 'User';
  });
  protected readonly userUsername = computed(() => this.user()?.username ? `@${this.user()!.username}` : '@user');
  protected readonly userId = computed(() => this.user()?.telegram_id ?? 0);
}
