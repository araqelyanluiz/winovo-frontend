import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../core/services/config/config.service';
import { Icon } from '../../shared/components/icon/icon';
import { NavigationItem } from './navigation.model';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  private readonly configService = inject(ConfigService);

  readonly navigationItems = computed<NavigationItem[]>(() => {
    const config = this.configService.getConfig();
    return config.layout?.navigation?.items?.filter(item => item.enabled) || [];
  });

  getIconName(iconPath: string): string {
    // Extract icon name from path: /assets/icons/home.svg -> home
    const match = iconPath.match(/\/([^\/]+)\.svg$/);
    return match ? match[1] : iconPath;
  }
}
