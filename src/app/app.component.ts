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
// import { SettingsPage } from '../pages/settings/settings';
// import { SignupPage } from '../pages/signup/signup';
// import { TabsPage } from '../pages/tabs/tabs';
// import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomesSearchPage } from '../pages/homes/search/search';
import { VisitorsTabsPage } from '../pages/visitors/visitorsTabs/visitorsTabs';
//import { TopicsListPage } from '../pages/topics-list/topics-list';

import { Settings } from '../providers/providers';
import { User } from '../providers/user';
import { Homes } from '../providers/homes';
import { Security } from '../providers/security';

import { TranslateService } from '@ngx-translate/core';

@Component({
  template: `
  <ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
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
          Adminstración
        </ion-list-header>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          Amenidades
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          Cobros
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isAdminUser">
          Usuarios
        </button>
        <ion-list-header color="light" *ngIf="security.isSecurityUser">
          Seguridad
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(homesSearchPage)" *ngIf="security.isSecurityUser">
          Ingreso de Invitados
        </button>
        <ion-list-header color="light" *ngIf="security.isResidentUser">
          Mi Condominio
        </ion-list-header>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          Amenidades
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          Pagos y facturas
        </button>
        <button menuClose ion-item (click)="openPage(visitorsPage, { homes: homes.userHomes })" *ngIf="security.isResidentUser">
          Visitas
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          Alertas
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          Servicios
        </button>
        <button menuClose ion-item (click)="openPage()" *ngIf="security.isResidentUser">
          Mi Perfil
        </button>
        <ion-item menuClose (click)="doLogout()">
          <ion-icon name="power" item-start color="danger"></ion-icon>
          <h2>Cerrar sesión</h2>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = null; //FirstRunPage
  mainPage = MainPage;
  homesSearchPage = HomesSearchPage;
  visitorsPage = VisitorsTabsPage;

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
              private storage: Storage) {

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
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
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
      title: 'Are you sure?',
      message: 'Are you sure you want to end your session?',
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
        content: "Closing session..."
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
