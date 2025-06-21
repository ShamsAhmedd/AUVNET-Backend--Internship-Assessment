import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CategoriesComponent } from './components/dashboard/categories/categories.component';
import { UserProductComponent } from './components/user-product/user-product.component';
import { ProductsComponent } from './components/dashboard/products/products.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { AdminsComponent } from './components/dashboard/admins/admins.component';
import { WishistComponent } from './components/wishist/wishist.component';
import { UserAuthLayoutComponent } from './components/user-auth-layout/user-auth-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminHomeComponent } from './components/dashboard/admin-home/admin-home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    SidebarComponent,
    CategoriesComponent,
    UserProductComponent,
    ProductsComponent,
    UsersComponent,
    AdminsComponent,
    WishistComponent,
    UserAuthLayoutComponent,
    AdminLayoutComponent,
    UserNavbarComponent,
    AdminNavbarComponent,
    NotFoundComponent,
    AdminHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // or toast-bottom-right
      timeOut: 3000,
      preventDuplicates: true,
    }),
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
