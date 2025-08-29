import { Component, Input } from '@angular/core';
import { Objective } from '../../models/objective.model';

@Component({
  selector: 'app-objective-item',
  templateUrl: './objective-item.component.html',
  styleUrls: ['./objective-item.component.scss'],
})
export class ObjectiveItemComponent {
  @Input() objective!: Objective;
}
