import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() type: 'race' | 'class' = 'race';
  @Input() subtype: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}
