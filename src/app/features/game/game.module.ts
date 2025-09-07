import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { GameRoutingModule } from './game-routing.module';

import { GameLayoutComponent } from '../../layouts/game-layout/game-layout.component';
import { AccountComponent } from './account/account.component';
import { BattleComponent } from './battle/battle.component';
import { CharactersComponent } from './characters/characters.component';
import { WorldsComponent } from './worlds/worlds.component';
import { CharacterCreateComponent } from './character-create/character-create.component';

@NgModule({
  declarations: [
    GameLayoutComponent,
    AccountComponent,
    WorldsComponent,
    CharactersComponent, 
    BattleComponent,
    CharacterCreateComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    FormsModule,         
    ReactiveFormsModule, 
    RouterModule         
  ],
})
export class GameModule {}