import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';

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
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, 
              public user: User, 
              private menu: MenuController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private storage: Storage) { 
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  getToken() {
    let loader = this.loadingCtrl.create({
        content: "Starting session..."
    });
    loader.present();
    this.user.getAccessToken(this.account).then((accessTokenData) => {
      loader.dismiss();
      this.goToApp();
    }, (errorMessage) => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: errorMessage,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  goToApp() {
    this.navCtrl.setRoot(MainPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
}
