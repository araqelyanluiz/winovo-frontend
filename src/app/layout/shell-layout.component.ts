import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from "./navigation/navigation";
import { Footer } from "./footer/footer";
import { Header } from "./header/header";

@Component({
  standalone: true,
  selector: 'app-shell-layout',
  imports: [RouterOutlet, Header, Footer, Navigation],
  template: `
    <div class="min-h-screen flex flex-col max-w-3xl mx-auto bg-skin1">
        <div class="flex flex-col">
            <app-header />
            <main class="flex-1">
                <router-outlet />
            </main>
            <app-footer />
        </div>
        <app-navigation />
    </div>
  `,
})
export class ShellLayoutComponent {}
