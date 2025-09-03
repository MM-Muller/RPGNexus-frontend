import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameLayoutComponent } from '../../layouts/game-layout/game-layout.component';
import { AccountComponent } from './account/account.component';
import { CharactersComponent } from './characters/characters.component';
import { WorldsComponent } from './worlds/worlds.component';
import { BattleComponent } from './battle/battle.component';

const routes: Routes = [
  {
    path: 'battle',
    component: BattleComponent,
  },

  {
    path: '',
    component: GameLayoutComponent,
    children: [
      { path: '', redirectTo: 'worlds', pathMatch: 'full' },
      { path: 'account', component: AccountComponent },
      { path: 'worlds', component: WorldsComponent },
      { path: 'characters', component: CharactersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}