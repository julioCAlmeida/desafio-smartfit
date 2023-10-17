import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Location } from './types/location.interface';
import { GetUnitsService } from './services/get-units.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'desafio-smartfit';

  showList = new BehaviorSubject(false);
  unitslist: Location[] = [];

  constructor(private unitService: GetUnitsService) {}

  onSubmit() {
    this.unitslist = this.unitService.getFilteredUnits();
    this.showList.next(true);
  }
}
