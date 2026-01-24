import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Icon } from '../../../shared/components/icon/icon';
import { VersionedAssetPipe } from '../../../shared/pipes/versioned-asset.pipe';

@Component({
  selector: 'app-not-found',
  imports: [Icon, RouterLink, VersionedAssetPipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  get requestedPath(): string {
    return this.router.url;
  }

  goBack(): void {
    this.location.back();
  }
}
