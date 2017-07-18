import { Component, ViewChild } from '@angular/core';
import { App, NavController, Navbar, ViewController, Platform, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { NewVisitorPage } from '../new/new';
import { Visitors } from '../../../providers/visitors';
import { Homes } from '../../../providers/homes';
import { Security } from '../../../providers/security';
import { Home } from '../../../models/home';

@Component({
    selector: 'quick-visitors',
    templateUrl: 'quick.html'
})
export class QuickVisitorsPage {

    @ViewChild(Navbar) navBar:Navbar;
    homesForm: FormGroup;
    private rootNav: NavController;
    private tabsContainerIsRootView: boolean = false;
    homes: Array<Home>;
    currentHome: Home;

    constructor(private app: App,
                public formBuilder: FormBuilder,
                private visitors: Visitors,
                private homesProvider: Homes,
                private security: Security,
                public navCtrl: NavController,
                private viewCtrl: ViewController,
                private platform: Platform,
                private navParams: NavParams) {

        this.rootNav = this.app.getRootNav();
        this.homes = this.navParams.data.homes;
        this.currentHome = this.navParams.data.currentHome;
        this.homesForm = this.formBuilder.group({
            'houseId': new FormControl({ value: this.currentHome.id, disabled: this.security.isSecurityUser })
        });
    }

    goToNewVisitor() {
        this.rootNav.push(NewVisitorPage, { visitorType: 'quick', homes: this.homes });
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