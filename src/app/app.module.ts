import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { TopicsListPage } from '../pages/topics-list/topics-list';

import { HomePage } from '../pages/home/home';
import { HomesSearchPage } from '../pages/homes/search/search';
import { VisitorsTabsPage } from '../pages/visitors/visitorsTabs/visitorsTabs';
import { InmediateVisitorsPage } from '../pages/visitors/inmediate/inmediate';
import { PermanentVisitorsPage } from '../pages/visitors/permanent/permanent';
import { FavoritesVisitorsPage } from '../pages/visitors/favorites/favorites';
import { PermanentDaysView } from '../pages/visitors/permanent/days';
import { NewVisitorPage } from '../pages/visitors/new/new';
import { ActiveVisitorsPage } from '../pages/visitors/actives/actives';

import { VisitorItem } from '../components/visitor-item/visitorItem';

import { Api } from '../providers/api';
import { Settings, DefaultLanguage } from '../providers/settings';
import { User } from '../providers/user';
import { Security } from '../providers/security';
import { Toast } from '../providers/toast';
import { Topics } from '../mocks/providers/topics';
import { Homes } from '../providers/homes';
import { Visitors } from '../providers/visitors';
import { Utils } from '../providers/utils';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { Dialogs } from '@ionic-native/dialogs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    language: DefaultLanguage
  });
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SettingsPage,
    SignupPage,
    TutorialPage,
    WelcomePage,
    TopicsListPage,
    HomesSearchPage,
    VisitorsTabsPage,
    PermanentVisitorsPage,
    InmediateVisitorsPage,
    FavoritesVisitorsPage,
    PermanentDaysView,
    NewVisitorPage,
    VisitorItem,
    ActiveVisitorsPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SettingsPage,
    SignupPage,
    TutorialPage,
    WelcomePage,
    TopicsListPage,
    HomesSearchPage,
    VisitorsTabsPage,
    PermanentVisitorsPage,
    InmediateVisitorsPage,
    FavoritesVisitorsPage,
    PermanentDaysView,
    NewVisitorPage,
    ActiveVisitorsPage,
    HomePage
  ],
  providers: [
    Api,
    User,
    Security,
    Toast,
    Topics,
    Homes,
    Camera,
    Visitors,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    Vibration,
    Utils,
    Dialogs,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
