import { Component, ViewChild } from '@angular/core';
import { App, NavController, Navbar, ViewController, Platform, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { EditorVisitorPage } from '../editor/editor';
import { Visitors } from '../../../providers/visitors';
import { Security } from '../../../providers/security';
import { Utils } from '../../../providers/utils';
import { Home } from '../../../models/home';
import { Visitor } from '../../../models/visitor';
import { VisitorRegistrationTypes } from '../../../models/visitor';

@Component({
    selector: 'favorites-visitors',
    templateUrl: 'favorites.html'
})
export class FavoritesVisitorsPage {

    @ViewChild(Navbar) navBar:Navbar;
    homesForm: FormGroup;
    private rootNav: NavController;
    private tabsContainerIsRootView: boolean = false;
    homes: Array<Home>;
    currentHome: Home;

    constructor(private app: App,
                public formBuilder: FormBuilder,
                private visitors: Visitors,
                private security: Security,
                public navCtrl: NavController,
                private viewCtrl: ViewController,
                private platform: Platform,
                private navParams: NavParams,
                private loadingCtrl: LoadingController,
                private utils: Utils) {

        this.rootNav = this.app.getRootNav();
        this.homes = this.navParams.data.homes;
        this.currentHome = this.navParams.data.currentHome;
        this.homesForm = this.formBuilder.group({
            'houseId': new FormControl({ value: this.currentHome.id, disabled: this.security.isSecurityUser })
        });
    }

    // goToNewVisitor() {
    //     this.rootNav.push(EditorVisitorPage, { registrationType: VisitorRegistrationTypes.Inmediate, isFavorite: true, homes: this.homes });
    // }

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
        return (!this.tabsContainerIsRootView ? 'force-back-button tab-toolbar' : 'no-back-button tab-toolbar') + ' ' + baseCssClass;
    }

    onVisitorEntry(visitor : Visitor) {
        this.rootNav.push(EditorVisitorPage, { visitor: visitor, homes: this.homes, mode: 'save', showFavorite: false });
    }

    onVisitorEdit(visitor : Visitor) {
        this.rootNav.push(EditorVisitorPage, { visitor: visitor, homes: this.homes, mode: 'editFavorite', showFavorite: false });
    }

    loadVisitors() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.loadVisitorsByHome(this.currentHome)
        .then((visitors) => {
            loader.dismiss();
        })
        .catch((error) => {
            loader.dismiss();
            console.error(error);
        });
    }
}