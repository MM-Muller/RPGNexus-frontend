import { Component, Input } from '@angular/core';
import { Objective } from '../../models/objective.model';

@Component({
  selector: 'app-objective-panel',
  templateUrl: './objective-panel.component.html',
  styleUrls: ['./objective-panel.component.scss'],
})
export class ObjectivePanelComponent {
  @Input() title: string = '';
  @Input() iconType: 'portal' | 'constellation' = 'portal';
  @Input() objectives: Objective[] = [];
}
