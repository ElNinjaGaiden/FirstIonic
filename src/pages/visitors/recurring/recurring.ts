import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Security } from '../../../providers/security';
import { NewVisitorPage } from '../new/new';

@Component({
    selector: 'recurring-visitors',
    templateUrl: 'recurring.html'
})
export class RecurringVisitorsPage {

    private nav: NavController;

    constructor(private security: Security,
                private app: App) {

        this.nav = this.app.getRootNav();
    }

    goToNewVisitor() {
        this.nav.push(NewVisitorPage, { visitorType: 'recurring' });
    }
}