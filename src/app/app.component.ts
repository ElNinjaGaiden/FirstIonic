import { Component, ViewChild, } from '@angular/core';
import { Platform, Nav, Config, NavController } from 'ionic-angular';

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
//import { TopicsListPage } from '../pages/topics-list/topics-list';

import { Settings } from '../providers/providers';

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
        <ion-list-header color="danger">
          Development
        </ion-list-header>
        <button menuClose ion-item (click)="openPage(mainPage)">
          Topics
        </button>
        <ion-list-header color="light">
          Adminstración
        </ion-list-header>
        <button menuClose ion-item (click)="openPage()">
          Amenidades
        </button>
        <button menuClose ion-item (click)="openPage()">
          Cobros
        </button>
        <button menuClose ion-item (click)="openPage()">
          Usuarios
        </button>
        <ion-list-header color="light">
          Seguridad
        </ion-list-header>
        <button menuClose ion-item (click)="openPage()">
          Ingreso de Invitados
        </button>
        <ion-list-header color="light">
          Mi Condominio
        </ion-list-header>
        <button menuClose ion-item (click)="openPage()">
          Amenidades
        </button>
        <button menuClose ion-item (click)="openPage()">
          Pagos y facturas
        </button>
        <button menuClose ion-item (click)="openPage()">
          Visitas
        </button>
        <button menuClose ion-item (click)="openPage()">
          Alertas
        </button>
        <button menuClose ion-item (click)="openPage()">
          Servicios
        </button>
        <button menuClose ion-item (click)="openPage()">
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
  rootPage = FirstRunPage;
  mainPage = MainPage;

  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navCtrl: NavController;

  constructor(private translate: TranslateService, 
              private platform: Platform, 
              public settings: Settings, 
              private config: Config, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen) {

    this.initTranslate();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByName('red');
      this.statusBar.overlaysWebView(false);
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page) {
      this.nav.setRoot(page);
    }
  }

  doLogout() {
    this.nav.setRoot(WelcomePage);
  }
}
