import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../core/services/config/config.service';
import { FooterConfig } from './footer.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly configService = inject(ConfigService);

  readonly footerConfig = computed<FooterConfig | undefined>(() => {
    const config = this.configService.getConfig();
    return config.layout?.footer;
  });
}
