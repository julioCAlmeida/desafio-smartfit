import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12'
  },
  afternoon: {
    first: '12',
    last: '18'
  },
  night: {
    first: '18',
    last: '23'
  }
}

type HOUR_INDEXES = 'morning' | 'afternoon' | 'night';

@Injectable({
  providedIn: 'root'
})
export class FilterUnitsService {

  constructor() { }

  transformWeekday(weekday: number) {
    switch(weekday) {
      case 0:
        return 'Dom.'
      case 6:
        return 'Sáb.'
      default:
        return 'Seg. à Sex.'
    }
  }

  filterUnits(unit: Location, open_hour: string, close_hour: string) {
    if(!unit.schedules) return true;

    let openHourFilter = parseInt(open_hour, 10);
    let closeHourFilter = parseInt(close_hour, 10);

    let todaysWeekday = this.transformWeekday(new Date().getDay());

    for (let i = 0; i < unit.schedules.length; i++) {
      let scheduleHour = unit.schedules[i].hour;
      let scheduleWeekday = unit.schedules[i].weekdays;

      if(todaysWeekday == scheduleWeekday) {
        if(scheduleHour != 'Fechada') {
          let [unitOpenHour, unitCloseHour] = scheduleHour.split(' às ');
          let unitOpenHourInt = parseInt(unitOpenHour.replace('h', ''), 10);
          let unitCloseHourInt = parseInt(unitCloseHour.replace('h', ''), 10);

          if(unitOpenHourInt <= openHourFilter && unitCloseHourInt >= closeHourFilter) {
            return true;
          } else {
            return false;
          }
        }
      }
    }

    return false;
  }

  filter(results: Location[], showClosed: boolean, hour: string) {
    let intermediateResults = results;

    if(!showClosed) {
      intermediateResults = results.filter(location => location.opened == true);
    }

    if(hour) {
      const OPEN_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first;
      const CLOSE_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last;

      return intermediateResults.filter(location => this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR));
    } else {
      return intermediateResults;
    }
  }
}
