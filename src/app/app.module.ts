import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HistoriaComponent } from './features/historia/historia.component';
import { HomeComponent } from './features/home/home.component';
import { ObjetivoComponent } from './features/objetivo/objetivo.component';
import { PersonagensComponent } from './features/personagens/personagens.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    HistoriaComponent,
    PersonagensComponent,
    ObjetivoComponent,
    CharacterCardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
