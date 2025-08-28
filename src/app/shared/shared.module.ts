import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CharacterCardComponent } from '../components/character-card/character-card.component';
import { ObjectiveNodeComponent } from '../components/objective-node/objective-node.component';

@NgModule({
  declarations: [CharacterCardComponent, ObjectiveNodeComponent],
  imports: [CommonModule],
  exports: [CharacterCardComponent, ObjectiveNodeComponent],
})
export class SharedModule {}
