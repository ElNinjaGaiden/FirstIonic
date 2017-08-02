import { Component } from '@angular/core';
import { LoadingController, App, NavController } from 'ionic-angular';
import { Home } from '../../../models/home';
import { Homes } from '../../../providers/homes';
import { VisitorsTabsPage } from '../../visitors/visitorsTabs/visitorsTabs';

@Component({
    selector: 'homes-search',
    templateUrl: 'search.html'
})
export class HomesSearchPage {

    private nav: NavController;

    constructor (private app: App,
                private homes: Homes,
                private loadingCtrl: LoadingController) {

        this.nav = app.getRootNav();
    }

    currentHomes: Array<Home> = [];

    searchHomes(event) {
        if(event.target.value) {
            this.currentHomes = this.homes.searchByNumber(event.target.value);
        }
        else {
            this.currentHomes = [];
        }
    }

    goToVisitors(slidingItem, home) {
        slidingItem.close();
        this.nav.push(VisitorsTabsPage, { homes: [home], currentHome: home });
    }
}