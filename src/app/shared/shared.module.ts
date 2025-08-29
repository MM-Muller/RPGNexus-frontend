import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CharacterCardComponent } from '../components/character-card/character-card.component';
import { ObjectiveItemComponent } from '../components/objective-item/objective-item.component';
import { ObjectiveNodeComponent } from '../components/objective-node/objective-node.component';
import { ObjectivePanelComponent } from '../components/objective-panel/objective-panel.component';

@NgModule({
  declarations: [
    CharacterCardComponent,
    ObjectiveNodeComponent,
    ObjectiveItemComponent,
    ObjectivePanelComponent,
  ],
  imports: [CommonModule],
  exports: [
    CharacterCardComponent,
    ObjectiveNodeComponent,
    ObjectiveItemComponent,
    ObjectivePanelComponent,
  ],
})
export class SharedModule {}
