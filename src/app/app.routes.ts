import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { About } from './about/about';
import { Products } from './products/products';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {path: '', title: "Home", component: Home},
    {path: 'login', title: "Login", component: Login},
    {path: 'register', title: "Register", component: Register},
    {path: 'profile', title: "Profile", component: Profile},
    {path: 'about', title: "About", component: About},
    {path: 'products', title: "Products", component: Products},
    {path: '**', redirectTo: ''},
];
