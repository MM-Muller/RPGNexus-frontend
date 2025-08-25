import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriaComponent } from './pages/historia/historia.component';
import { HomeComponent } from './pages/home/home.component';
import { ObjetivoComponent } from './pages/objetivo/objetivo.component';
import { PersonagensComponent } from './pages/personagens/personagens.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'historia', component: HistoriaComponent },
  { path: 'personagens', component: PersonagensComponent },
  { path: 'objetivo', component: ObjetivoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
