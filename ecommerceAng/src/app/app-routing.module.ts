import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserProductComponent } from './components/user-product/user-product.component';
import { WishistComponent } from './components/wishist/wishist.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './components/dashboard/admin-home/admin-home.component';
import { CategoriesComponent } from './components/dashboard/categories/categories.component';
import { ProductsComponent } from './components/dashboard/products/products.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { AdminsComponent } from './components/dashboard/admins/admins.component';

import { UserAuthLayoutComponent } from './components/user-auth-layout/user-auth-layout.component';

import { adminAuthGuard } from './shared/guards/admin-auth.guard';
import { userAuthGuard } from './shared/guards/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserAuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'user/addProduct', component: UserProductComponent, canActivate: [userAuthGuard] },
      { path: 'user/wishList', component: WishistComponent, canActivate: [userAuthGuard] },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
      { path: 'admin/home', component: AdminHomeComponent },
      { path: 'admin/categories', component: CategoriesComponent },
      { path: 'admin/products', component: ProductsComponent },
      { path: 'admin/users', component: UsersComponent },
      { path: 'admin/admins', component: AdminsComponent },
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
