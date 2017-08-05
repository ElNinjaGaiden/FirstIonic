import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Homes } from '../../providers/homes';
import { User } from '../../providers/user';
import { Security } from '../../providers/security';
import { Toast } from '../../providers/toast';
import { VisitorsTabsPage } from '../visitors/visitorsTabs/visitorsTabs';
import { HomesSearchPage } from '../../pages/homes/search/search';
import { ActiveVisitorsPage } from '../../pages/visitors/actives/actives';
import { SettingsPage } from '../../pages/settings/settings';
import { TutorialPage } from '../../pages/tutorial/tutorial';
import { WelcomePage } from '../../pages/welcome/welcome';

declare var FCMPlugin;

@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {

    visitorsPage = VisitorsTabsPage;
    homesSearchPage = HomesSearchPage;
    settingsPage = SettingsPage;
    activeVisitorsPage = ActiveVisitorsPage;

    constructor(private homes: Homes,
                private security: Security,
                private user: User,
                private storage: Storage,
                private toast: Toast,
                private navCtrl: NavController,
                private loadingCtrl: LoadingController,) {

        this.configurePushNotificationsLsteners();
        this.storage.get('doneWithTutorial').then((doneWithTutorial) => {
            if(!doneWithTutorial) {
                this.navCtrl.push(TutorialPage);
            }
        });
    }

    onNavOptionClick(page, params) {
        if(page) {
            this.navCtrl.setRoot(page, params);
        }
    }
    
    configurePushNotificationsLsteners() {
        if(typeof FCMPlugin !== 'undefined') {
            if(!this.user.deviceRegistrationToken) {
                console.log('Configuring FCM integration');
                FCMPlugin.getToken(this.onFirebaseTokenReceived.bind(this));
            }
        }
        else {
            if(!this.user.deviceRegistrationToken) {
                this.onFirebaseTokenReceived('DummyDeviceRegistrationId-WebApp');
            }
        }
    }

    onFirebaseTokenReceived(firebaseToken) {

        if(typeof FCMPlugin !== 'undefined') {
            FCMPlugin.onTokenRefresh(this.onFirebaseTokenReceived.bind(this));
            FCMPlugin.onNotification(this.onNotificationReceived.bind(this));
        }

        if(!this.user.userData) {
            //First check if the current access token is not expired
            this.user.getAccessData().then((accessData) => {
            if(accessData) {
                if(!this.user.isTokenExpired(accessData)) {
                    this._doLogin(firebaseToken);
                }
                else {
                    //The access token is expired, we need to request a new access token
                    console.log('Re-login user because acces token was expired');
                    this.reLoginUser(firebaseToken);
                }
            }
            else {
                //There is no acces data
                //This should not happens because if the user gets to this page is because there is one but just in case...
                this.navCtrl.setRoot(WelcomePage);
            }
        });
    }
  }

  _doLogin(firebaseToken) {
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
          console.log('Error login the user again, maybe the password is wrong');
          loader.dismiss();
          this.navCtrl.setRoot(WelcomePage);
        });
      }, (error) => {
        //Error deleting the current access data
        console.log('Error deleting the current access data');
        loader.dismiss();
        this.navCtrl.setRoot(WelcomePage);
      });
    }, (error) => {
      //Error getting the current acces token data
      console.log('Error getting the current acces token data');
      loader.dismiss();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  onNotificationReceived(notificationData) {
    if(!notificationData.wasTapped) {
      this.toast.show(notificationData);
    }
  }
}