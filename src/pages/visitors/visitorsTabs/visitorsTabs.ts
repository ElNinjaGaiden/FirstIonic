import { Component } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { QuickVisitorsPage } from '../quick/quick';
import { PermanentVisitorsPage } from '../permanent/permanent';
import { RecurringVisitorsPage } from '../recurring/recurring';
import { Visitors } from '../../../providers/visitors';
import { Utils } from '../../../providers/utils';
import { Visitor } from '../../../models/visitor';
import { Home } from '../../../models/home';

@Component({
    selector: 'vists-tabs',
    templateUrl: 'visitorsTabs.html'
})
export class VisitorsTabsPage {

    homes: Array<Home>;
    currentHome: Home;

    visitorsQuickTab: any = QuickVisitorsPage;
    visitorsRecurringTab: any = RecurringVisitorsPage;
    visitorsPermanentTab: any = PermanentVisitorsPage;

    visitorsQuickTitle = " ";
    visitorsRecurringTitle = " ";
    visitorsPermanentTitle = " ";

    constructor(private navParams: NavParams,
                private translateService: TranslateService,
                private visitors: Visitors,
                private loadingCtrl: LoadingController,
                private utils: Utils) {

        translateService.get(['VISITORS.QUICK.TAB_TITLE', 'VISITORS.RECURRING.TAB_TITLE', 'VISITORS.PERMANENT.TAB_TITLE']).subscribe(values => {
            this.visitorsQuickTitle = values['VISITORS.QUICK.TAB_TITLE'];
            this.visitorsRecurringTitle = values['VISITORS.RECURRING.TAB_TITLE'];
            this.visitorsPermanentTitle = values['VISITORS.PERMANENT.TAB_TITLE'];
        });

        if(this.navParams.data.homes && this.navParams.data.homes.length) {
            this.homes = this.navParams.data.homes;
            this.currentHome = this.homes[0];
            this.loadHouseVisitors(this.currentHome);
        }
    }

    loadHouseVisitors(home) {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.loadVisitorsByHome(home)
        .then((visitors) => {
            loader.dismiss();
        })
        .catch((error) => {
            loader.dismiss();
            console.error(error);
        });
    }
}