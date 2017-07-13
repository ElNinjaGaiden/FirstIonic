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
import { WelcomePage } from '../../pages/welcome/welcome';

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
      this.onFirebaseTokenReceived('DummyDeviceRegistrationId-WebApp');
    }
  }

  onFirebaseTokenReceived(firebaseToken) {
    let loader = this.loadingCtrl.create({
        content: "Loading data..."
    });
    loader.present();
    this.user.login(firebaseToken).then((userData) => {
      loader.dismiss();
    }, (error) => {
      console.log(error);
      loader.dismiss();
      if(error.status === 401) {
        this.reLoginUser(firebaseToken);
        //This means the token has expired, we need to login again
      }
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

  reLoginUser(firebaseToken) {
    let loader = this.loadingCtrl.create({
        content: "Renewing session..."
    });
    loader.present();
    //Get the current acces data (to pull the name and password)
    this.user.getAccessData().then((currenAccesData) => {
      let email = currenAccesData.userName;
      let password = currenAccesData.password;
      //Remove the current access token
      this.user.deleteAccessData().then(() => {
        this.user.getToken({ email, password }).then((accessTokenData) => {
          loader.dismiss();
          this.onFirebaseTokenReceived(firebaseToken);
        }, (error) => {
          //Error login the user again, maybe the password is wrong
          loader.dismiss();
          this.navCtrl.setRoot(WelcomePage);
        });
      }, (error) => {
        //Error deleting the current access data
        loader.dismiss();
        this.navCtrl.setRoot(WelcomePage);
      });
    }, (error) => {
      //Error getting the current acces token data
      loader.dismiss();
      this.navCtrl.setRoot(WelcomePage);
    });
  }
}
