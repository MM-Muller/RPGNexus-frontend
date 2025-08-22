import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title: string = 'COSMOS';
  subtitle: string = 'EXPLORAÇÃO';
  description: string =
    'A jornada de mil anos luz começa com um único passo em direção às estrelas distantes que aguardam nossa chegada.';
}
