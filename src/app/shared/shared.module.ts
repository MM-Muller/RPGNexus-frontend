import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObjectiveNodeComponent } from '../components/objective-node/objective-node.component';

@NgModule({
  declarations: [ObjectiveNodeComponent],
  imports: [CommonModule],
  exports: [ObjectiveNodeComponent],
})
export class SharedModule {}
