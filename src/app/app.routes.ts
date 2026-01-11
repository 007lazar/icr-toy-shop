import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { About } from './about/about';
import { Products } from './products/products';
import { Profile } from './profile/profile';
import { Permalink } from './permalink/permalink';
import { Basket } from './basket/basket';

export const routes: Routes = [
    {path: '', title: "Home", component: Home},
    {path: 'login', title: "Login", component: Login},
    {path: 'register', title: "Register", component: Register},
    {path: 'profile', title: "Profile", component: Profile},
    {path: 'basket', title: "Basket", component: Basket},
    {path: 'about', title: "About", component: About},
    {path: 'products', title: "Products", component: Products},
    {path: 'toy/permalink/:permalink', title: "Toy Permalink", component: Permalink},
    {path: '**', redirectTo: ''},
];
