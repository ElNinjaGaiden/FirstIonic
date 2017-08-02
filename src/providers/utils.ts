import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Utils {

    private _daysTranslations: any;
    private _pleaseWaitMessage: string;
    private _confirmationTitle: string;

    constructor(private translateService: TranslateService) {
        translateService.get('DAYS').subscribe(values => {
            this._daysTranslations = values;
        });

        translateService.get('PLEASE_WAIT').subscribe(values => {
            this._pleaseWaitMessage = values;
        });

        translateService.get('CONFIRMATION_TITLE').subscribe(values => {
            this._confirmationTitle = values;
        });
    }

    get pleaseWaitMessage() : string {
        return this._pleaseWaitMessage;
    }

    get confirmationTitle() : string {
        return this._confirmationTitle;
    }

    getDaysLabels(days: Array<string>) : Array<string> {
        return days && days.map(d => this._daysTranslations[d]);
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