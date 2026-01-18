import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { Casino } from './pages/casino/casino';
import { Search } from './pages/search/search';
import { Wallet } from './pages/wallet/wallet';
import { NotFound } from './pages/errors/not-found/not-found';
import { ShellLayoutComponent } from './layout/shell-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: ShellLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            { path: 'profile', component: Profile },
            { path: 'casino', component: Casino },
            { path: 'search', component: Search },
            { path: 'wallet', component: Wallet }
        ],
    },
    { path: 'not-found', component: NotFound },
    { path: '**', redirectTo: 'not-found' },
];
