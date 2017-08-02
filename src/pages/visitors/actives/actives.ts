import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import {Visitors  } from '../../../providers/visitors';
import { Visitor } from '../../../models/visitor';
import { Utils } from '../../../providers/utils';

@Component({
    selector: 'active-visitors',
    templateUrl: 'actives.html'
})
export class ActiveVisitorsPage {

    activeVisitos: Array<Visitor> = [];

    constructor(private visitors: Visitors,
                private loadingCtrl: LoadingController,
                private utils: Utils) {

        this.loadActiveVisitors();
    }

    loadActiveVisitors() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.loadActiveVisitors()
        .then((visitors) => {
            this.activeVisitos = visitors;
            loader.dismiss();
        })
        .catch((error) => {
            loader.dismiss();
            console.error(error);
        });
    }

    filterActiveVisitors(event) {

    }

    onVisitorDeparture (visitor: Visitor) {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.exit(visitor)
        .then(() => {
            loader.dismiss();
            this.loadActiveVisitors();
        })
        .catch(error => {
            loader.dismiss();
            console.error(error);
        });
    }
}