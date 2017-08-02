import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavParams, LoadingController, NavController, AlertController } from 'ionic-angular';
import { Visitor } from '../../../models/visitor';
import { Home } from '../../../models/home';
import { Visitors } from '../../../providers/visitors';
import { Utils } from '../../../providers/utils';

@Component({
    selector: 'recurring-days',
    templateUrl: 'days.html'
})
export class RecurringDaysView {

    daysForm: FormGroup;
    visitor: Visitor;
    home: Home;
    approxTime: string = null;
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

        this.daysForm = this.formBuilder.group({
            'mondaySelected': [''],
            'tuesdaySelected': [''],
            'wednesdaySelected': [''],
            'thursdaySelected': [''],
            'fridaySelected': [''],
            'saturdaySelected': [''],
            'sundaySelected': [''],
            'approxTime': ['', [Validators.required]]
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
        this.visitor.days = this.getSelectedDays().map(d => d.key);
        this.visitor.approxTime = this.approxTime;
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.preregister(this.visitor)
        .then(response => {
            console.log(response);
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