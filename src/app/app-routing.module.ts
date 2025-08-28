import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signUp/signup.component';
import { HistoriaComponent } from './features/historia/historia.component';
import { HomeComponent } from './features/home/home.component';
import { ObjetivoComponent } from './features/objetivo/objetivo.component';
import { PersonagensComponent } from './features/personagens/personagens.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'historia', component: HistoriaComponent },
  { path: 'personagens', component: PersonagensComponent },
  { path: 'objetivo', component: ObjetivoComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
