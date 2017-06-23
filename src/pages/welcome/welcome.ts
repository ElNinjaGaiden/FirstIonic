import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { User } from '../../providers/user';
import { Toast } from '../../providers/toast';
import { MainPage } from '../../pages/pages';

declare var FCMPlugin;

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: '123'
  };

  constructor(public navCtrl: NavController, 
              public user: User, 
              private toast: Toast) { 

  }

  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
      this.configurePushNotificationsLsteners();
    }, (err) => {
      // Unable to log in ...
      this.navCtrl.push(MainPage);
      this.configurePushNotificationsLsteners();
    });
  }

  configurePushNotificationsLsteners() {
    if(typeof FCMPlugin !== 'undefined') {
      FCMPlugin.getToken(function(token){
          console.log('getToken', token);
      });

      FCMPlugin.onTokenRefresh(function(token){
          console.log('onTokenRefresh', token);
      });

      FCMPlugin.onNotification(this.onNotificationReceived.bind(this));
    }
  }

  onNotificationReceived(data) {
    if(!data.wasTapped) {
      this.toast.show(data.body);
    }
  }
}
