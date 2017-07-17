import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QuickVisitorsPage } from '../quick/quick';
import { PermanentVisitorsPage } from '../permanent/permanent';
import { RecurringVisitorsPage } from '../recurring/recurring';

@Component({
    selector: 'vists-tabs',
    templateUrl: 'visitorsTabs.html'
})
export class VisitorsTabsPage {

    visitorsQuickTab: any = QuickVisitorsPage;
    visitorsRecurringTab: any = RecurringVisitorsPage;
    visitorsPermanentTab: any = PermanentVisitorsPage;

    visitorsQuickTitle = " ";
    visitorsRecurringTitle = " ";
    visitorsPermanentTitle = " ";

    constructor(private translateService: TranslateService) {

        translateService.get(['VISITORS.QUICK.TAB_TITLE', 'VISITORS.RECURRING.TAB_TITLE', 'VISITORS.PERMANENT.TAB_TITLE']).subscribe(values => {
            this.visitorsQuickTitle = values['VISITORS.QUICK.TAB_TITLE'];
            this.visitorsRecurringTitle = values['VISITORS.RECURRING.TAB_TITLE'];
            this.visitorsPermanentTitle = values['VISITORS.PERMANENT.TAB_TITLE'];
        });
    }
}