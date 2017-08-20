import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavParams, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Security } from '../../../providers/security';
import { Homes } from '../../../providers/homes';
import { Visitors } from '../../../providers/visitors';
import { Utils } from '../../../providers/utils';
import { Home } from '../../../models/home';
import { PermanentDaysView } from '../permanent/days';
import { Visitor, VisitorRegistrationTypes, VisitorEntryTypes } from '../../../models/visitor';

@Component({
    selector: 'new-visitor',
    templateUrl: 'new.html'
})
export class NewVisitorPage {

    visitorForm: FormGroup;
    homesCollection: Array<Home>;
    visitor: Visitor = new Visitor(null, '', '', null, null, '', false, null);
    entryTypes: any = [];
    registrationTypes: any = [];
    mode: string = 'save';

    constructor(public formBuilder: FormBuilder,
                public security: Security,
                public navParams: NavParams,
                private navController: NavController,
                private homes: Homes,
                private visitors: Visitors,
                private translateService: TranslateService,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private utils: Utils) {

        if(this.navParams.data.visitor) {
            this.visitor = this.navParams.data.visitor;

            if(this.navParams.data.mode) {
                this.mode = this.navParams.data.mode;
            }
        }

        //NOTE: Security users can only add quick visitors
        this.visitor.registrationType = this.security.isSecurityUser ? VisitorRegistrationTypes.Inmediate : this.navParams.data.registrationType;
        this.visitor.entryType = VisitorEntryTypes.Vehicle;
        //NOTE: change this to set homeId dynamically when we support several houses per user
        this.visitor.homeId = visitors.currentHome.id;

        //Check if it's a favorite visitor
        this.visitor.isFavorite = this.navParams.data.isFavorite || false;

        this.visitorForm = this.formBuilder.group({
            'homeId': new FormControl({ value: visitors.currentHome.id, disabled: !this.security.isResidentUser }, Validators.required),
            'name': [this.visitor.name, [Validators.required]],
            'identification': [this.visitor.identification, [Validators.required]],
            'carId': [this.visitor.carId, []],
            registrationType: new FormControl({ value: this.security.isResidentUser ? this.navParams.data.registrationType : VisitorRegistrationTypes.Inmediate, disabled: !this.security.isResidentUser }, Validators.required),
            entryType: new FormControl({ value: VisitorEntryTypes.Vehicle }, Validators.required),
            'isFavorite': new FormControl({ value: this.visitor.isFavorite, disabled: !this.enableIsFavorite() }, Validators.required)
        });

        const translations = [
            'VISITORS.REGISTRATION_TYPES.INMEDIATE',
            'VISITORS.REGISTRATION_TYPES.PERMANENT',

            'VISITORS.ENTRY_TYPES.PEDESTRIAN',
            'VISITORS.ENTRY_TYPES.VEHICLE',
            'VISITORS.ENTRY_TYPES.PUBLIC_TRANSPORTATION'
        ];

        translateService.get(translations).subscribe(values => {
            this.registrationTypes.push({ type: VisitorRegistrationTypes.Inmediate, text: values['VISITORS.REGISTRATION_TYPES.INMEDIATE'] });
            this.registrationTypes.push({ type: VisitorRegistrationTypes.Permanent, text: values['VISITORS.REGISTRATION_TYPES.PERMANENT'] });

            this.entryTypes.push({ type: VisitorEntryTypes.Pedestrian, text: values['VISITORS.ENTRY_TYPES.PEDESTRIAN'] });
            this.entryTypes.push({ type: VisitorEntryTypes.Vehicle, text: values['VISITORS.ENTRY_TYPES.VEHICLE'] });
            this.entryTypes.push({ type: VisitorEntryTypes.PublicTransportation, text: values['VISITORS.ENTRY_TYPES.PUBLIC_TRANSPORTATION'] });
        });

        this.homesCollection = this.navParams.data.homes;
    }

    onSubmit() {
        if(this.security.isResidentUser) {
            this._submitByResident();
        }
        else if(this.security.isSecurityUser) {
            this._submitBySecurityUser();
        }
    }

    _submitByResident() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.preregister(this.visitor)
        .then(response => {
            console.log(response);
            loader.dismiss();
            this.navController.popToRoot();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
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

    _submitBySecurityUser() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.register(this.visitor)
        .then(response => {
            console.log(response);
            loader.dismiss();
            this.navController.pop();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
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

    enableSave() {
        return this.visitor.isInmediate() && this.mode === 'save';
    }

    enableNext() {
        return this.visitor.isPermanent();
    }

    enableIsFavorite() {
        const enable = this.security.isResidentUser && 
                        this.visitor.registrationType === VisitorRegistrationTypes.Inmediate &&
                        this.visitor.entryType !== VisitorEntryTypes.PublicTransportation &&
                        ((this.visitor.entryType === VisitorEntryTypes.Pedestrian && this.visitor.name && this.visitor.identification) || (this.visitor.entryType === VisitorEntryTypes.Vehicle && this.visitor.name && this.visitor.identification && this.visitor.carId));

        if(!enable) {
            this.visitor.isFavorite = false;
        }

        return enable
    }

    goToRecurringDays(event) {
        event.preventDefault();
        this.navController.push(PermanentDaysView, { visitor: this.visitor, home: this.visitors.currentHome });
    }

    validateVisitorEntryType() {
        if(this.visitor.requiresCardId()) {
            return this.visitor.carId ? true : false;
        }
        return true;
    }

    enableVisitorEntry() {
        return this.mode === 'notify';
    }

    notifyVisitorEntry() {
        event.preventDefault();
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.entry(this.visitor)
        .then(response => {
            console.log(response);
            loader.dismiss();
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