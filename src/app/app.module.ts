import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { TopicsListPage } from '../pages/topics-list/topics-list';

import { HomesSearchPage } from '../pages/homes/search/search';

import { VisitorsTabsPage } from '../pages/visitors/visitorsTabs/visitorsTabs';
import { QuickVisitorsPage } from '../pages/visitors/quick/quick';
import { PermanentVisitorsPage } from '../pages/visitors/permanent/permanent';
import { RecurringVisitorsPage } from '../pages/visitors/recurring/recurring';
import { RecurringDaysView } from '../pages/visitors/recurring/days';
import { NewVisitorPage } from '../pages/visitors/new/new';

import { VisitorItem } from '../components/visitor-item/visitorItem';

import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
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
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    CardsPage,
    ContentPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    TopicsListPage,
    HomesSearchPage,
    VisitorsTabsPage,
    PermanentVisitorsPage,
    QuickVisitorsPage,
    RecurringVisitorsPage,
    RecurringDaysView,
    NewVisitorPage,
    VisitorItem
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
    CardsPage,
    ContentPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    TopicsListPage,
    HomesSearchPage,
    VisitorsTabsPage,
    PermanentVisitorsPage,
    QuickVisitorsPage,
    RecurringVisitorsPage,
    RecurringDaysView,
    NewVisitorPage
  ],
  providers: [
    Api,
    Items,
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
