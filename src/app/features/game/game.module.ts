import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameRoutingModule } from './game-routing.module';

import { GameLayoutComponent } from '../../layouts/game-layout/game-layout.component';
import { AccountComponent } from './account/account.component';
import { CharactersComponent } from './characters/characters.component';
import { WorldsComponent } from './worlds/worlds.component';
import { BattleComponent } from './battle/battle.component'; 

@NgModule({
  declarations: [
    GameLayoutComponent,
    AccountComponent,
    WorldsComponent,
    CharactersComponent,
    BattleComponent, 
  ],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}