import { Component } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { InmediateVisitorsPage } from '../inmediate/inmediate';
import { PermanentVisitorsPage } from '../permanent/permanent';
import { FavoritesVisitorsPage } from '../favorites/favorites';
import { Visitors } from '../../../providers/visitors';
import { Utils } from '../../../providers/utils';
import { Visitor } from '../../../models/visitor';
import { Home } from '../../../models/home';

@Component({
    selector: 'visitors-tabs',
    templateUrl: 'visitorsTabs.html'
})
export class VisitorsTabsPage {

    homes: Array<Home>;
    currentHome: Home;

    visitorsInmediateTab: any = InmediateVisitorsPage;
    visitorsFavoritesTab: any = FavoritesVisitorsPage;
    visitorsPermanentTab: any = PermanentVisitorsPage;

    visitorsInmediateTitle = " ";
    visitorsFavoritesTitle = " ";
    visitorsPermanentTitle = " ";

    constructor(private navParams: NavParams,
                private translateService: TranslateService,
                private visitors: Visitors,
                private loadingCtrl: LoadingController,
                private utils: Utils) {

        translateService.get(['VISITORS.INMEDIATE.TAB_TITLE', 'VISITORS.FAVORITES.TAB_TITLE', 'VISITORS.PERMANENT.TAB_TITLE']).subscribe(values => {
            this.visitorsInmediateTitle = values['VISITORS.INMEDIATE.TAB_TITLE'];
            this.visitorsFavoritesTitle = values['VISITORS.FAVORITES.TAB_TITLE'];
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