import { Component, Input } from '@angular/core';
import { Objective } from '../../../models/objective.model';

@Component({
  selector: 'app-objective-node',
  templateUrl: './objective-node.component.html',
  styleUrls: ['./objective-node.component.scss'],
})
export class ObjectiveNodeComponent {
  @Input() objective!: Objective;
}
