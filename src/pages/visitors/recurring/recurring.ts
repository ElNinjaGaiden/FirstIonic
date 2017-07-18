import { Component, ViewChild } from '@angular/core';
import { App, NavController, Navbar, ViewController, Platform, NavParams } from 'ionic-angular';
import { NewVisitorPage } from '../new/new';
import { Visitors } from '../../../providers/visitors';
import { Home } from '../../../models/home';

@Component({
    selector: 'recurring-visitors',
    templateUrl: 'recurring.html'
})
export class RecurringVisitorsPage {

    @ViewChild(Navbar) navBar:Navbar;
    private rootNav: NavController;
    private tabsContainerIsRootView: boolean = false;
    home: Home;

    constructor(private app: App,
                private visitors: Visitors,
                public navCtrl: NavController,
                private viewCtrl: ViewController,
                private platform: Platform,
                private navParams: NavParams) {

        this.rootNav = this.app.getRootNav();
        this.home = this.navParams.data;
    }

    goToNewVisitor() {
        this.rootNav.push(NewVisitorPage, { visitorType: 'recurring', homes: [this.home] });
    }

    ionViewDidLoad() {
        let tabsView = this.navCtrl.parent;
        let tabsViewControllerId = tabsView.viewCtrl.id;
        let rootNavViews = this.rootNav.getViews();
        let tabsViewNavIndex = rootNavViews.findIndex(vc => vc.id === tabsViewControllerId);
        this.tabsContainerIsRootView = tabsViewNavIndex === 0;

        if(!this.tabsContainerIsRootView) {
            this.navBar.backButtonClick = (e:UIEvent) => {
                this.navCtrl.parent.viewCtrl.dismiss();
                e.preventDefault();
            };
        }
    }

    get navBarClass() : string {
        let baseCssClass = this.platform.is('android') ? 'toolbar toolbar-md' : 'toolbar toolbar-ios';
        return (!this.tabsContainerIsRootView ? 'force-back-button' : 'no-back-button') + ' ' + baseCssClass;
    }
}