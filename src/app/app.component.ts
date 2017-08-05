import { Component, ViewChild, } from '@angular/core';
import { Platform, Nav, Config, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { CardsPage } from '../pages/cards/cards';
// import { ContentPage } from '../pages/content/content';
import { FirstRunPage, MainPage } from '../pages/pages';
// import { ListMasterPage } from '../pages/list-master/list-master';
// import { LoginPage } from '../pages/login/login';
// import { MapPage } from '../pages/map/map';
// import { MenuPage } from '../pages/menu/menu';
// import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
// import { SignupPage } from '../pages/signup/signup';
// import { TabsPage } from '../pages/tabs/tabs';
// import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomesSearchPage } from '../pages/homes/search/search';
import { VisitorsTabsPage } from '../pages/visitors/visitorsTabs/visitorsTabs';
import { ActiveVisitorsPage } from '../pages/visitors/actives/actives';
//import { TopicsListPage } from '../pages/topics-list/topics-list';

import { Settings } from '../providers/providers';
import { User } from '../providers/user';
import { Homes } from '../providers/homes';
import { Security } from '../providers/security';
import { Utils } from '../providers/utils';
import { Toast } from '../providers/toast';

import { TranslateService } from '@ngx-translate/core';

declare var FCMPlugin;

@Component({
  template: `
  <ion-menu [content]="content">
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>{{ 'MENU_TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header color="danger" *ngIf="security.isDevelopmentMode">
          Development
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(mainPage)" *ngIf="security.isDevelopmentMode">
          Topics
        </button>
        <ion-list-header color="light" *ngIf="security.isAdminUser">
          {{ 'ADMIN.MENU_TITLE' | translate }}
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(rootPage)" *ngIf="security.isAdminUser">
          Home
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          {{ 'ADMIN_AMENITIES.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          {{ 'ADMIN_CHARGES.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          {{ 'ADMIN_USERS.MENU_TITLE' | translate }}
        </button>
        <ion-list-header color="light" *ngIf="security.isSecurityUser">
          {{ 'SECURITY.MENU_TITLE' | translate }}
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(rootPage)" *ngIf="security.isSecurityUser">
          Home
        </button>
        <button menuClose ion-item (click)="openPage(homesSearchPage)" *ngIf="security.isSecurityUser">
          {{ 'SECURITY_VISITORS.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage(activeVisitorsPage)" *ngIf="security.isSecurityUser">
          {{ 'ACTIVE_VISITORS.MENU_TITLE' | translate }}
        </button>
        <ion-list-header color="light" *ngIf="security.isResidentUser">
          {{ 'MY_HOUSE.MENU_TITLE' | translate }}
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(rootPage)" *ngIf="security.isResidentUser">
          Home
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          {{ 'AMENITIES.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          {{ 'PAYMENTS.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage(visitorsPage, { homes: homes.userHomes })" *ngIf="security.isResidentUser">
          {{ 'VISITORS.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          {{ 'ALERTS.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          {{ 'SERVICES.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          {{ 'MI_PROFILE.MENU_TITLE' | translate }}
        </button>
        <button menuClose ion-item (click)="openPage(settingsPage)">
          {{ 'SETTINGS.MENU_TITLE' | translate }}
        </button>
        <ion-item menuClose (click)="doLogout()">
          <ion-icon name="power" item-start color="danger"></ion-icon>
          <h2>{{ 'LOG_OUT.MENU_TITLE' | translate }}</h2>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = null; //FirstRunPage
  visitorsPage = VisitorsTabsPage;
  homesSearchPage = HomesSearchPage;
  settingsPage = SettingsPage;
  activeVisitorsPage = ActiveVisitorsPage;
  logoutConfirmationMessage : string;

  @ViewChild(Nav) public nav: Nav;
  @ViewChild('content') public _navCtrl: NavController;

  constructor(private translate: TranslateService, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private platform: Platform, 
              public settings: Settings, 
              private user: User,
              private homes: Homes,
              private security: Security,
              private config: Config, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private storage: Storage,
              private utils: Utils,
              private toast: Toast) {

    this.initTranslate();
    this.user.getAccessData().then((accessData) => {
      if(accessData) {
        this.rootPage = MainPage;
      }
      else {
        this.rootPage = FirstRunPage;
      }
    }, (error) => {
      console.error(error);
      this.rootPage = FirstRunPage;
    });
  }

  get navCtrl () {
    return this._navCtrl;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.

    this.settings.load()
    .then(() => {
      this.translate.setDefaultLang(this.settings.allSettings.language);

      this.translate.get(['BACK_BUTTON_TEXT', 'LOG_OUT']).subscribe(values => {
        this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        this.logoutConfirmationMessage = values.LOG_OUT.CONFIRMATION_MESSAGE;
      });
    });
  }

  openPage(page, params) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page) {
      this.nav.setRoot(page, params);
    }
  }

  doLogout() {
    let confirmation = this.alertCtrl.create({
      title: this.utils.confirmationTitle,
      message: this.logoutConfirmationMessage,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this._doLogout();
          }
        }
      ]
    });
    confirmation.present();
  }

  _doLogout() {
    let loader = this.loadingCtrl.create({
        content: this.utils.pleaseWaitMessage
    });
    loader.present();
    this.user.logout().then((success) => {
      loader.dismiss();
      this.nav.setRoot(WelcomePage);
    }, errorMessage => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: errorMessage,
        buttons: ['OK']
      });
      alert.present();
    });
  }
}
