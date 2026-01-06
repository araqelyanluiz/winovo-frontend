import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { Casino } from './pages/casino/casino';
import { Search } from './pages/search/search';
import { Wallet } from './pages/wallet/wallet';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'profile', component: Profile },
    { path: 'casino', component: Casino },
    { path: 'search', component: Search },
    { path: 'wallet', component: Wallet },
    { path: '**', redirectTo: 'home' },
];
