import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/components/icon/icon';
import { ConfigService } from '../../core/services/config/config.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  userProfile:any;
  private readonly configService = inject(ConfigService);
  protected readonly appConfig = toSignal(this.configService.config$, { requireSync: true });
}
