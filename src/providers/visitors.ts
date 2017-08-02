import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Visitor, VisitorRegistrationTypes, VisitorEntryTypes } from '../models/visitor';
import { Home } from '../models/home';
import { User } from './user';
import {Api } from './api';

@Injectable()
export class Visitors {

    _quickVisitors: Array<Visitor> = [];
    _recurrentVisitors: Array<Visitor> = [];
    _permanentVisitors: Array<Visitor> = [];
    _activeVisitors: Array<Visitor> = [];
    _currentHome: Home;

    constructor(private user: User,
                private api: Api) {
    }

    get currentHome() : Home {
        return this._currentHome;
    }

    set currentHome(home: Home) {
        this._currentHome = home;
    }

    get quickVisitors() : Array<Visitor> {
        return this._quickVisitors;
    }

    set quickVisitors(visitors: Array<Visitor>) {
        this._quickVisitors = visitors;
    }

    get recurringVisitors() : Array<Visitor> {
        return this._recurrentVisitors;
    }

    set recurringVisitors(visitors: Array<Visitor>) {
        this._recurrentVisitors = visitors;
    }

    get permanentVisitors() : Array<Visitor> {
        return this._permanentVisitors;
    }

    set permanentVisitors(visitors: Array<Visitor>) {
        this._permanentVisitors = visitors;
    }

    set activeVisitors (visitors: Array<Visitor>) {
        this._activeVisitors = visitors;
    }

    get activeVisitors() : Array<Visitor> {
        return this._activeVisitors;
    }

    loadVisitorsByHome(home: Home) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.get('api/visits/registers', { id: home.id }, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    this.currentHome = home;
                    if(responseData.current) {
                        const visitors: Array<Visitor> = responseData.current.map(v => this._parseVisitor(v));
                        this.quickVisitors = visitors.filter(v => v.isQuick());
                        this.recurringVisitors = visitors.filter(v => v.isRecurring());
                        this.permanentVisitors = visitors.filter(v => v.isPermanent());
                    }
                    else {
                        this.quickVisitors = responseData.inmediate.map(v => this._parseVisitor(v));
                        this.recurringVisitors = responseData.recurrent.map(v => this._parseVisitor(v));
                        this.permanentVisitors = responseData.permanent.map(v => this._parseVisitor(v));
                    }
                    resolve();
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }

    _parseVisitor(data: any) : Visitor {
        const visitor = new Visitor(data.id, data.name, data.identification, data.idVisitRegistrationType, data.idVisitEntryType, data.plate, data.idHome);
        if(visitor.isRecurring()) {
            if(data.days) {
                visitor.days = data.days.split(',');
            }
            visitor.approxTime = data.aproxHour;
        }
        return visitor;
    }

    preregister(visitor: Visitor) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const currentUserData = this.user.userData;
                const data = {
                    "Identification" : visitor.id,
                    "Name": visitor.name,
                    "Plate": visitor.carId,
                    "EntryType": visitor.entryType,
                    "RegistrationType": visitor.registrationType,
                    "Days": visitor.getDaysToSubmit(),
                    "AproxHour": visitor.getApproxTimeToSubmit(),
                    "IdHome" : visitor.homeId,
                    "IsFavorite": false,
                    "UserName": currentUserData.email
                };
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.post('api/visits/preRegister', data, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    resolve(responseData);
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }

    register(visitor: Visitor) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const currentUserData = this.user.userData;
                const data = {
                    "Identification" : visitor.id,
                    "Name": visitor.name,
                    "Plate": visitor.carId,
                    "EntryType": visitor.entryType,
                    "RegistrationType": visitor.registrationType,
                    "IdHome" : visitor.homeId,
                    "IsFavorite": false,
                    "UserName": currentUserData.email
                };
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.post('api/visits/register', data, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    resolve(responseData);
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }

    entry(visitor: Visitor) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const currentUserData = this.user.userData;
                const data = {
                    "Id": visitor.id,
                    "Identification" : visitor.id,
                    "Name": visitor.name,
                    "Plate": visitor.carId,
                    "EntryType": visitor.entryType,
                    //"RegistrationType": visitor.registrationType,
                    "IdHome" : visitor.homeId,
                    //"IsFavorite": false,
                    "UserName": currentUserData.email
                };
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.post('api/visits/entry', data, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    resolve(responseData);
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }

    loadActiveVisitors() : Promise<Array<Visitor>> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.get('api/visits/active', { }, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    this.activeVisitors = responseData.map(v => this._parseVisitor(v));
                    this.activeVisitors.forEach(v => {
                        v.isActive = true;
                    });
                    resolve(this.activeVisitors);
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }

    exit(visitor: Visitor) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const currentUserData = this.user.userData;
                const data = {
                    "Id": visitor.id,
                    "UserName": currentUserData.email
                };
                const requestOptions = new RequestOptions({
                    headers: new Headers({
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.post('api/visits/exit', data, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    resolve(responseData);
                }, er => {
                    console.log(er);
                    let error = {
                        status: er.status,
                        message: 'There was an error reaching the server, please try again'
                    };
                    if(er && typeof er.text === 'function') {
                        const errorData = JSON.parse(er.text());
                        console.log('Error data', errorData);
                        if(errorData.error_description || errorData.message) {
                            error.message = errorData.error_description || errorData.message;
                        }
                    }
                    reject(error);
                });
            });
        });
    }
}