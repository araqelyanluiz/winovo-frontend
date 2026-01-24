import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { Casino } from './pages/casino/casino';
import { Search } from './pages/search/search';
import { Wallet } from './pages/wallet/wallet';
import { NotFound } from './pages/errors/not-found/not-found';
import { ShellLayoutComponent } from './layout/shell-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { Deposit } from './pages/wallet/components/deposit/deposit';
import { Withdraw } from './pages/wallet/components/withdraw/withdraw';
import { History } from './pages/wallet/components/history/history';

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
            { 
                path: 'wallet', component: Wallet, 
                children: [
                    { path: '', redirectTo: 'deposit', pathMatch: 'full' },
                    { path: 'deposit', component: Deposit },
                    { path: 'withdraw', component: Withdraw },
                    { path: 'history', component: History }
                ] 
            }
        ],
    },
    { path: '404', component: NotFound },
    { path: 'not-found', redirectTo: '404', pathMatch: 'full' },
    { path: '**', redirectTo: '404' },
];
