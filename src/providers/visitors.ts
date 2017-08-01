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

    loadVisitorsByHome(home: Home) : Promise<Array<Visitor>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let visitors = [
                    new Visitor('', 'Pedro', 'Perez', VisitorRegistrationTypes.Quick, VisitorEntryTypes.Vehicle, '', 0),
                    new Visitor('', 'Juan', 'Perez', VisitorRegistrationTypes.Quick, VisitorEntryTypes.Vehicle, '', 0),
                    new Visitor('', 'Mickey', 'Mouse', VisitorRegistrationTypes.Recurring, VisitorEntryTypes.Pedestrian, '', 0),
                    new Visitor('', 'Michael', 'Jordan', VisitorRegistrationTypes.Permanent, VisitorEntryTypes.PublicTransportation, '', 0)
                ];
                this.currentHome = home;
                this.quickVisitors = visitors.filter(v => v.isQuick());
                this.recurringVisitors = visitors.filter(v => v.isRecurring());
                this.permanentVisitors = visitors.filter(v => v.isPermanent());
                resolve(visitors);
            }, 400);
        });
    }

    preregister(visitor: Visitor) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getAccessData().then(accessData => {
                const currentUserData = this.user.userData;
                const data = {
                    "Identification" : visitor.id,
                    "Name": visitor.getFullName(),
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
                        "Content-type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accessData.access_token
                    })
                });

                this.api.post('api/visits/preRegister', data, requestOptions)
                .share()
                .map(res => res.json())
                .subscribe(responseData => {
                    console.log('Ojo', responseData);
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
        return new Promise((resolve) => {
            resolve({});
        });
    }

    entry(visitor: Visitor) : Promise<any> {
        return new Promise((resolve) => {
            resolve({});
        });
    }

    getActives() : Promise<Array<Visitor>> {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    exit(visitor: Visitor) : Promise<any> {
        return new Promise((resolve) => {
            resolve({});
        });
    }
}