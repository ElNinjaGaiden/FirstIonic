import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, LoadingController, NavController, AlertController } from 'ionic-angular';
import { Visitor } from '../../../models/visitor';
import { Home } from '../../../models/home';
import { Visitors } from '../../../providers/visitors';
import { Utils } from '../../../providers/utils';

@Component({
    selector: 'recurring-days',
    templateUrl: 'days.html'
})
export class PermanentDaysView {

    daysForm: FormGroup;
    visitor: Visitor;
    home: Home;
    approxTime: string = null;
    mode: string;
    days: any = {
        monday: {
            key: 'L',
            selected: false
        },
        tuesday: {
            key: 'K',
            selected: false
        },
        wednesday: {
            key: 'M',
            selected: false
        },
        thursday: {
            key: 'J',
            selected: false
        },
        friday: {
            key: 'V',
            selected: false
        },
        saturday: {
            key: 'S',
            selected: false
        },
        sunday: {
            key: 'D',
            selected: false
        }
    };

    constructor(private navParams: NavParams,
                private formBuilder: FormBuilder,
                private visitors: Visitors,
                private loadingCtrl: LoadingController,
                private navController: NavController,
                private alertCtrl: AlertController,
                private utils: Utils) {

        this.visitor = navParams.data.visitor;
        this.home = navParams.data.home;
        this.mode = this.navParams.data.mode;
        const days = this.visitor.days || [];

        this.days.monday.selected = days.indexOf('L') >= 0;
        this.days.tuesday.selected = days.indexOf('K') >= 0;
        this.days.wednesday.selected = days.indexOf('M') >= 0;
        this.days.thursday.selected = days.indexOf('J') >= 0;
        this.days.friday.selected = days.indexOf('V') >= 0;
        this.days.saturday.selected = days.indexOf('S') >= 0;
        this.days.sunday.selected = days.indexOf('D') >= 0;

        const now = new Date();
        if(this.visitor.approxTime) {
            
            this.approxTime = `${now.getFullYear()}-${this.utils.padLeft((now.getMonth() + 1).toString())}-${this.utils.padLeft(now.getDate().toString())}T${this.visitor.approxTime}:00.000Z`;
        }
        else {
            this.approxTime = `${now.getFullYear()}-${this.utils.padLeft((now.getMonth() + 1).toString())}-${this.utils.padLeft(now.getDate().toString())}T07:00:00.000Z`;
        }

        this.daysForm = this.formBuilder.group({
            'mondaySelected': [this.days.monday.selected],
            'tuesdaySelected': [this.days.tuesday.selected],
            'wednesdaySelected': [this.days.wednesday.selected],
            'thursdaySelected': [this.days.thursday.selected],
            'fridaySelected': [this.days.friday.selected],
            'saturdaySelected': [this.days.saturday.selected],
            'sundaySelected': [this.days.sunday.selected],
            'approxTime': [this.approxTime, [Validators.required]]
        });
    }

    getSelectedDays() : Array<any> {
        let selectedDays = [];
        for (var dayName in this.days) {
            if (this.days.hasOwnProperty(dayName)) {
                const day = this.days[dayName];
                if(day.selected)
                    selectedDays.push(day);
            }
        }
        return selectedDays;
    }

    validateDaysSelection() {
        const selectedDays = this.getSelectedDays();
        return selectedDays.length > 0;
    }

    onSubmit () {
        switch(this.mode) {
            case 'save':
                this.save();
                break;

            case 'edit':
                this.edit();
                break;
        }
    }

    parseAproxTime() {
        const dateParts = this.approxTime.split('T');
        const timeParts = dateParts[1].split(':');
        return `${timeParts[0]}:${timeParts[1]}`;
    }

    save() {
        this.visitor.days = this.getSelectedDays().map(d => d.key);
        this.visitor.approxTime = this.parseAproxTime();
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.preregister(this.visitor)
        .then(response => {
            loader.dismiss();
            this.visitors.loadVisitorsByHome(this.home);
            this.navController.popToRoot();
        })
        .catch(error => {
            loader.dismiss();
            console.error(error);
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: error.message,
                buttons: ['OK']
            });
            alert.present();
        });
    }

    edit() {
        this.visitor.days = this.getSelectedDays().map(d => d.key);
        this.visitor.approxTime = this.parseAproxTime();
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.editPreRegister(this.visitor)
        .then(response => {
            loader.dismiss();
            this.visitors.loadVisitorsByHome(this.home);
            this.navController.popToRoot();
        })
        .catch(error => {
            loader.dismiss();
            console.error(error);
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: error.message,
                buttons: ['OK']
            });
            alert.present();
        });
    }
}