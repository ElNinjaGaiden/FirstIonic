import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Utils {

    _daysTranslations: any;

    constructor(private translateService: TranslateService) {
        translateService.get('DAYS').subscribe(values => {
            this._daysTranslations = values;
        });
    }

    getDaysLabels(days: Array<string>) : Array<string> {
        return days.map(d => this._daysTranslations[d]);
    }

    formatTimeLabel(time: string) : string {
        const parts = time.split(':');
        const hours = parseInt(parts[0]);
        const pad = '00';
        const minutes = parts[1];
        const suffix = hours >= 12 ? "PM":"AM";
        return ((hours + 11) % 12 + 1) + ':' + (pad.substring(0, pad.length - minutes.length) + minutes ) + ' ' + suffix;
    }
}