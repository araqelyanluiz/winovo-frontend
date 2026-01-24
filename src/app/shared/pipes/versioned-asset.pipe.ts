import { Pipe, PipeTransform } from '@angular/core';
import { APP_VERSION } from '../../core/services/version/version-manager';

@Pipe({
  name: 'versionedAsset',
  standalone: true
})
export class VersionedAssetPipe implements PipeTransform {
  transform(url: string | null | undefined): string {
    if (!url) return '';
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${APP_VERSION}`;
  }
}
