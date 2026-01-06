import { 
  Component, 
  Input, 
  OnInit, 
  OnDestroy,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { IconRegistry } from './icon.registry';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (svgContent()) {
      <span 
        class="app-icon"
        [innerHTML]="svgContent()"
      ></span>
    } @else if (loading()) {
      <span class="app-icon app-icon-loading"></span>
    } @else {
      <span 
        class="app-icon app-icon-missing"
        [title]="'Icon not found: ' + iconName()"
      >?</span>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      flex-shrink: 0;
    }

    .app-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      line-height: 1;
      flex-shrink: 0;
    }

    .app-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
      color: inherit;
    }

    .app-icon ::ng-deep svg [fill]:not([fill="none"]) {
      fill: currentColor;
    }

    .app-icon ::ng-deep svg [stroke]:not([stroke="none"]) {
      stroke: currentColor;
    }

    .app-icon-loading {
      opacity: 0.5;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .app-icon-missing {
      color: #999;
      font-size: 0.8em;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed currentColor;
      border-radius: 2px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Icon implements OnInit, OnDestroy {
  private readonly iconRegistry = inject(IconRegistry);
  private readonly destroy$ = new Subject<void>();

  // Public signals for inputs
  readonly iconName = signal<string>('');
  
  // State signals
  readonly svgContent = signal<SafeHtml | null>(null);
  readonly loading = signal<boolean>(false);

  constructor() {
    // Watch for icon name changes
    effect(() => {
      const name = this.iconName();
      if (name) {
        this.loadIcon();
      }
    });
  }

  @Input()
  set name(value: string) {
    this.iconName.set(value);
  }

  ngOnInit(): void {
    // Effect will handle loading
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadIcon(): void {
    const name = this.iconName();
    
    if (!name) {
      return;
    }

    // Try to get from cache first
    const cached = this.iconRegistry.getIcon(name);
    if (cached) {
      this.svgContent.set(cached);
      return;
    }

    // If not in cache, try loading from URL
    this.loading.set(true);
    const url = `/assets/icons/${name}.svg`;
    
    this.iconRegistry.registerIconFromUrl(name, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (svg) => {
          this.svgContent.set(svg);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(`Failed to load icon "${name}":`, error);
          this.loading.set(false);
        }
      });
  }
}
