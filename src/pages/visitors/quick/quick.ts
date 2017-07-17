import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Security } from '../../../providers/security';
import { NewVisitorPage } from '../new/new';

@Component({
    selector: 'quick-visitors',
    templateUrl: 'quick.html'
})
export class QuickVisitorsPage {

    private nav: NavController;

    constructor(private security: Security,
                private app: App) {

        this.nav = this.app.getRootNav();
    }

    goToNewVisitor() {
        this.nav.push(NewVisitorPage, { visitorType: 'quick' });
    }
}