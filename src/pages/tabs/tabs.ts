import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { User } from '../../providers/user';
import { Toast } from '../../providers/toast';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { TutorialPage } from '../../pages/tutorial/tutorial';

declare var FCMPlugin;

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              private loadingCtrl: LoadingController,
              public user: User, 
              private toast: Toast,
              private storage: Storage) {

    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
    });
  }

  ionViewDidLoad() {
    this.configurePushNotificationsLsteners();
    this.storage.get('doneWithTutorial').then((doneWithTutorial) => {
      if(!doneWithTutorial) {
        this.navCtrl.push(TutorialPage);
      }
    });
  }

  configurePushNotificationsLsteners() {
    console.log('Configuring FCM integration');
    if(typeof FCMPlugin !== 'undefined') {
      FCMPlugin.getToken(this.onFirebaseTokenReceived.bind(this));
      FCMPlugin.onTokenRefresh(this.configurePushNotificationsLsteners.bind(this));
      FCMPlugin.onNotification(this.onNotificationReceived.bind(this));
    }
    else {
      this.onFirebaseTokenReceived(null);
    }
  }

  onFirebaseTokenReceived(token) {
    let loader = this.loadingCtrl.create({
        content: "Loading data..."
    });
    loader.present();
    this.user.login(token).then((userData) => {
      loader.dismiss();
    }, (errorMessage) => {
      loader.dismiss();
    });
  }

  onFirebaseTokenRefreshed(token) {
    console.log('onTokenRefresh', token);
  }

  onNotificationReceived(notificationData) {
    if(!notificationData.wasTapped) {
      this.toast.show(notificationData);
    }
  }
}
