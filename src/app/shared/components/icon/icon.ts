import { 
  Component, 
  Input, 
  OnInit, 
  OnDestroy,
  inject,
  signal,
  computed,
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
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.min-width.px]="size()"
        [style.min-height.px]="size()"
        [style.display]="'inline-flex'"
        [style.align-items]="'center'"
        [style.justify-content]="'center'"
        [innerHTML]="svgContent()"
      ></span>
    } @else if (loading()) {
      <span 
        class="app-icon app-icon-loading"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.min-width.px]="size()"
        [style.min-height.px]="size()"
        [style.display]="'inline-flex'"
      ></span>
    } @else {
      <span 
        class="app-icon app-icon-missing"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.min-width.px]="size()"
        [style.min-height.px]="size()"
        [style.display]="'inline-flex'"
        [title]="'Icon not found: ' + name()"
      >?</span>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .app-icon {
      line-height: 1;
      flex-shrink: 0;
    }

    .app-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
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

  // Inputs as signals
  readonly name = signal<string>('');
  readonly size = signal<number>(24);
  readonly color = signal<string | null>(null);
  readonly strokeWidth = signal<number | null>(null);
  
  // State signals
  readonly svgContent = signal<SafeHtml | null>(null);
  readonly loading = signal<boolean>(false);

  // Computed processed SVG
  private readonly processedSvg = computed(() => {
    const svg = this.svgContent();
    const color = this.color();
    const strokeWidth = this.strokeWidth();
    
    if (!svg || typeof svg !== 'string') return svg;

    let processed = svg as string;

    // Apply color if specified
    if (color) {
      processed = processed
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${color}"`);
      
      // If no fill/stroke attributes, add them to svg tag
      if (!processed.includes('fill=') && !processed.includes('currentColor')) {
        processed = processed.replace('<svg', `<svg fill="${color}"`);
      }
    }

    // Apply stroke width if specified
    if (strokeWidth !== null) {
      processed = processed.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    }

    return processed as unknown as SafeHtml;
  });

  @Input()
  set iconName(value: string) {
    this.name.set(value);
  }

  @Input()
  set iconSize(value: number | string) {
    this.size.set(typeof value === 'string' ? parseInt(value, 10) : value);
  }

  @Input()
  set iconColor(value: string | null) {
    this.color.set(value);
  }

  @Input()
  set iconStrokeWidth(value: number | string | null) {
    if (value === null) {
      this.strokeWidth.set(null);
    } else {
      this.strokeWidth.set(typeof value === 'string' ? parseInt(value, 10) : value);
    }
  }

  ngOnInit(): void {
    this.loadIcon();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadIcon(): void {
    const iconName = this.name();
    
    if (!iconName) {
      console.warn('Icon name is required');
      return;
    }

    // Try to get from cache first
    const cached = this.iconRegistry.getIcon(iconName);
    if (cached) {
      this.svgContent.set(cached);
      return;
    }

    // If not in cache, try loading from URL
    this.loading.set(true);
    const url = `/assets/icons/${iconName}.svg`;
    
    this.iconRegistry.registerIconFromUrl(iconName, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (svg) => {
          this.svgContent.set(svg);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(`Failed to load icon "${iconName}":`, error);
          this.loading.set(false);
        }
      });
  }
}
