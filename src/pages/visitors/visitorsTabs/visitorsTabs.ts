import { Component } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { QuickVisitorsPage } from '../quick/quick';
import { PermanentVisitorsPage } from '../permanent/permanent';
import { RecurringVisitorsPage } from '../recurring/recurring';
import { Visitors } from '../../../providers/visitors';
import { Visitor } from '../../../models/visitor';

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

    constructor(private navParams: NavParams,
                private translateService: TranslateService,
                private visitors: Visitors,
                private loadingCtrl: LoadingController) {

        translateService.get(['VISITORS.QUICK.TAB_TITLE', 'VISITORS.RECURRING.TAB_TITLE', 'VISITORS.PERMANENT.TAB_TITLE']).subscribe(values => {
            this.visitorsQuickTitle = values['VISITORS.QUICK.TAB_TITLE'];
            this.visitorsRecurringTitle = values['VISITORS.RECURRING.TAB_TITLE'];
            this.visitorsPermanentTitle = values['VISITORS.PERMANENT.TAB_TITLE'];
        });

        if(this.navParams.data.houseNumber) {
            this.loadHouseVisitors(this.navParams.data.houseNumber);
        }
    }

    loadHouseVisitors(houseNumber) {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        this.visitors.loadVisitorsByHome(houseNumber)
        .then((visitors) => {
            loader.dismiss();
            //console.log(visitors);
        })
        .catch((error) => {
            loader.dismiss();
            console.error(error); //
        });
    }
}