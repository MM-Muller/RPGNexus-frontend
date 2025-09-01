import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriaComponent } from './features/historia/historia.component';
import { HomeComponent } from './features/home/home.component';
import { ObjetivoComponent } from './features/objetivo/objetivo.component';
import { PersonagensComponent } from './features/personagens/personagens.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
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
