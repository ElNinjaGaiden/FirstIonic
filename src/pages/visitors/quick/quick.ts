import { Component, ViewChild } from '@angular/core';
import { App, NavController, Navbar, ViewController, Platform } from 'ionic-angular';
import { NewVisitorPage } from '../new/new';
import { Visitors } from '../../../providers/visitors';

@Component({
    selector: 'quick-visitors',
    templateUrl: 'quick.html'
})
export class QuickVisitorsPage {

    @ViewChild(Navbar) navBar:Navbar;
    private rootNav: NavController;
    private tabsContainerIsRootView: boolean = false;

    constructor(private app: App,
                private visitors: Visitors,
                public navCtrl: NavController,
                private viewCtrl: ViewController,
                private platform: Platform) {

        this.rootNav = this.app.getRootNav();
    }

    goToNewVisitor() {
        this.rootNav.push(NewVisitorPage, { visitorType: 'quick' });
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