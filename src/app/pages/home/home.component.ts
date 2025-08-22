import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title = 'NEXUS';
  subtitle = 'GALÁCTICO';
  description =
    '"No vasto oceano cósmico do Nexus Galáctico, cada estrela é uma linha de possibilidades, e cada descoberta é um passo em direção à compreensão de nosso lugar no infinito."';

  constructor() {}
}
