import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. Importe o FormsModule

import { GameRoutingModule } from './game-routing.module';

import { GameLayoutComponent } from '../../layouts/game-layout/game-layout.component';
import { AccountComponent } from './account/account.component';
import { BattleComponent } from './battle/battle.component';
import { CharactersComponent } from './characters/characters.component';
import { WorldsComponent } from './worlds/worlds.component';

@NgModule({
  declarations: [
    GameLayoutComponent,
    AccountComponent,
    WorldsComponent,
    CharactersComponent,
    BattleComponent,
  ],
  imports: [CommonModule, GameRoutingModule, FormsModule],
})
export class GameModule {}