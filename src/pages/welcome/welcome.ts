import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, MenuController } from 'ionic-angular';

import { User } from '../../providers/user';
import { MainPage } from '../../pages/pages';

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
              private menu: MenuController,
              private storage: Storage) { 
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.goToApp();
    }, (err) => {
      // Unable to log in ...
      this.goToApp();
    });
  }

  goToApp() {
    this.storage.set('userAccount', this.account).then(() => {
      this.navCtrl.setRoot(MainPage, {}, {
        animate: true,
        direction: 'forward'
      });
    });
  }
}
