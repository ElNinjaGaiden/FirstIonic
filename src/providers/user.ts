import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Security } from './security';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _accessData: any;
  _deviceRegistrationToken: string;

  constructor(public http: Http, 
              public api: Api,
              private security: Security,
              private storage: Storage) {
  }

  get deviceRegistrationToken() {
    return this._deviceRegistrationToken;
  }

  set deviceRegistrationToken(value) {
    this._deviceRegistrationToken = value;
  }

  getAccessData() : Promise<any> {
    return new Promise((resolve) => {
      if(this._accessData) {
        resolve(this._accessData);
      }
      else {
        this.storage.get('accessData').then((accessData) => {
          if(accessData) {
            this._accessData = accessData;
            resolve(accessData);
          }
          else {
            resolve(null);
          }
        });
      }
    });
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  getToken(userAccount: any) {
    let body = new URLSearchParams();
    body.set('username', userAccount.email);
    body.set('password', userAccount.password);
    body.set('grant_type', "password");

    let requestOptions = new RequestOptions({
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      })
    });

    return new Promise((resolve, reject) => {
        this.api.post('token', body, requestOptions)
        .share()
        .map(res => res.json())
        .subscribe(accessData => {
          accessData.userName = userAccount.email;
          accessData.password = userAccount.password;
          accessData.expiresAt = this.getNowInSeconds() + accessData.expires_in;
          this._tokenReceived(accessData).then(() => {
            resolve(accessData);
          });
        }, error => {
          let errorMessage = 'There was an error reaching the server, please try again';
          if(error && typeof error.text === 'function') {
            const errorData = JSON.parse(error.text());
            if(errorData.error_description) {
              errorMessage = errorData.error_description;
            }
          }
          reject(errorMessage);
        });
    });
  }

  getNowInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  isTokenExpired(accessData: any) {
    let nowInSeconds = this.getNowInSeconds();
    return nowInSeconds >= accessData.expiresAt;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(deviceRegistrationToken) {
    this._deviceRegistrationToken = deviceRegistrationToken;
    return new Promise((resolve, reject) => {
      this.getAccessData().then((accessData) => {

        let body = new URLSearchParams();
        body.set('username', accessData.userName);
        body.set('deviceRegistrationTokenId', deviceRegistrationToken);

        let requestOptions = new RequestOptions({
          headers: new Headers({
            "Content-type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Authorization": 'Bearer ' + accessData.access_token
          })
        });

        this.api.post('api/account/logIn', body, requestOptions)
        .share()
        .map(res => res.json())
        .subscribe(userData => {
          this.security.Roles = userData.role;
          resolve(userData);
        }, er => {
          //console.log(er);
          let error = {
            status: er.status,
            message: 'There was an error reaching the server, please try again'
          };
          if(er && typeof er.text === 'function') {
            const errorData = JSON.parse(er.text());
            if(errorData.error_description) {
              error.message = errorData.error_description;
            }
          }
          reject(error);
        });
      });
    });
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    return new Promise((resolve, reject) => {
      this.getAccessData().then((accessData) => {

        let body = new URLSearchParams();
        body.set('username', accessData.userName);
        body.set('deviceRegistrationTokenId', this.deviceRegistrationToken);

        let requestOptions = new RequestOptions({
          headers: new Headers({
            "Content-type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Authorization": 'Bearer ' + accessData.access_token
          })
        });

        this.api.post('api/account/logOut', body, requestOptions)
        .share()
        .map(res => res.json())
        .subscribe(logoutResponse => {
          if(logoutResponse && logoutResponse.result === true) {
            this._deleteAccessData().then(() => {
              resolve(logoutResponse.result);
            });
          }
          else {
            reject('There was an error closing your session');
          }
        }, error => {
          let errorMessage = 'There was an error reaching the server, please try again';
          if(error && typeof error.text === 'function') {
            const errorData = JSON.parse(error.text());
            if(errorData.error_description) {
              errorMessage = errorData.error_description;
            }
          }
          reject(errorMessage);
        });
      });
    });
  }

  /**
   * Store 
   */
  _tokenReceived(accessData) {
    this._accessData = accessData;
    return this.storage.set('accessData', accessData);
  }

  deleteAccessData() {
    return this._deleteAccessData();
  }

  _deleteAccessData() {
    this._accessData = null;
    this._deviceRegistrationToken = null;
    return this.storage.remove('accessData');
  }
}
