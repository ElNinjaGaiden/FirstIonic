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
    selector: 'visitor-editor',
    templateUrl: 'editor.html'
})
export class EditorVisitorPage {

    visitorForm: FormGroup;
    homesCollection: Array<Home>;
    visitor: Visitor;
    entryTypes: any = [];
    registrationTypes: any = [];
    showFavorite: boolean = true;
    deleteConfirmationMessage: string;

    //Posible modes:
    //'save' = new pre-register
    //'edit' = edit pre-register
    //'editFavorite' = edit favorite
    //'delete' = delete pre-register
    //'deletefavorite' = delete favorite
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

        if(this.navParams.data.mode) {
            this.mode = this.navParams.data.mode;
        }

        if(this.navParams.data.visitor) {
            const _visitor : Visitor = this.navParams.data.visitor;
            this.visitor = _visitor.clone();
            if(typeof this.navParams.data.isFavorite !== 'undefined') {
                this.visitor.isFavorite = this.navParams.data.isFavorite;
            }
        }
        else {
            //NOTE: Security users can only add inmediate visitors
            const registrationType = this.security.isSecurityUser ? VisitorRegistrationTypes.Inmediate : this.navParams.data.registrationType;
            this.visitor = new Visitor(null, '', '', registrationType, VisitorEntryTypes.Vehicle, '', this.navParams.data.isFavorite || false, null);
        }

        //Check if we need to hide the isFavorite field
        if(typeof this.navParams.data.showFavorite !== 'undefined') {
            this.showFavorite = this.navParams.data.showFavorite;

            if(!this.showFavorite && this.mode === 'save') {
                this.visitor.isFavorite = false;
            }
        }

        //NOTE: change this to set homeId dynamically when we support several houses per user
        this.visitor.homeId = visitors.currentHome.id;

        this.visitorForm = this.formBuilder.group({
            'homeId': new FormControl({ value: visitors.currentHome.id, disabled: !this.security.isResidentUser }, Validators.required),
            'name': [this.visitor.name, [Validators.required]],
            'identification': [this.visitor.identification, [Validators.required]],
            'carId': [this.visitor.carId, []],
            //registrationType: new FormControl({ value: this.security.isResidentUser ? this.navParams.data.registrationType : VisitorRegistrationTypes.Inmediate, disabled: !this.security.isResidentUser }, Validators.required),
            entryType: new FormControl({ value: VisitorEntryTypes.Vehicle }, this.requiresEntryType() ? Validators.required : null),
            'isFavorite': new FormControl({ value: this.visitor.isFavorite, disabled: !this.enableIsFavorite() })
        });

        const translations = [
            'VISITORS.REGISTRATION_TYPES.INMEDIATE',
            'VISITORS.REGISTRATION_TYPES.PERMANENT',

            'VISITORS.ENTRY_TYPES.PEDESTRIAN',
            'VISITORS.ENTRY_TYPES.VEHICLE',
            'VISITORS.ENTRY_TYPES.PUBLIC_TRANSPORTATION',

            'DELETE_CONFIRMATION_MESSAGE'
        ];

        translateService.get(translations).subscribe(values => {
            this.registrationTypes.push({ type: VisitorRegistrationTypes.Inmediate, text: values['VISITORS.REGISTRATION_TYPES.INMEDIATE'] });
            this.registrationTypes.push({ type: VisitorRegistrationTypes.Permanent, text: values['VISITORS.REGISTRATION_TYPES.PERMANENT'] });

            this.entryTypes.push({ type: VisitorEntryTypes.Pedestrian, text: values['VISITORS.ENTRY_TYPES.PEDESTRIAN'] });
            this.entryTypes.push({ type: VisitorEntryTypes.Vehicle, text: values['VISITORS.ENTRY_TYPES.VEHICLE'] });
            this.entryTypes.push({ type: VisitorEntryTypes.PublicTransportation, text: values['VISITORS.ENTRY_TYPES.PUBLIC_TRANSPORTATION'] });

            this.deleteConfirmationMessage = values['DELETE_CONFIRMATION_MESSAGE'];
        });

        this.homesCollection = this.navParams.data.homes;
    }

    requiresEntryType() {
        return this.mode !== 'editFavorite';
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

    enableEdit() {
        return this.visitor.isInmediate() && (this.mode === 'edit' || this.mode === 'editFavorite');
    }

    enableNext() {
        return this.visitor.isPermanent();
    }

    enableDelete() {
        return this.security.isResidentUser && (this.mode === 'edit' || this.mode === 'editFavorite');
    }

    enableIsFavorite() {
        const enable = this.security.isResidentUser && 
                        (this.mode === 'save' || this.mode === 'edit' || this.mode === 'editFavorite') &&
                        this.visitor.entryType !== VisitorEntryTypes.PublicTransportation &&
                        ((this.visitor.entryType === VisitorEntryTypes.Pedestrian && this.visitor.name && this.visitor.identification) || (this.visitor.entryType === VisitorEntryTypes.Vehicle && this.visitor.name && this.visitor.identification && this.visitor.carId));

        return enable;
    }

    goToRecurringDays(event) {
        event.preventDefault();
        this.navController.push(PermanentDaysView, { visitor: this.visitor, home: this.visitors.currentHome, mode: this.mode });
    }

    validateVisitorEntryType() {
        if(this.visitor.requiresCardId()) {
            return this.visitor.carId ? true : false;
        }
        return true;
    }

    notifyVisitorEntry() {
        event.preventDefault();
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.entry(this.visitor)
        .then(response => {
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

    onEditVisitor(event) {
        event.preventDefault();

        switch(this.mode) {
            case 'edit':
                this.editPreregister();
                break;

            case 'editFavorite':
                this.editFavorite();
                break;
        }
    }

    editPreregister() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.editPreRegister(this.visitor).then(response => {
            loader.dismiss();
            this.navController.pop();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
        }, error => {
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

    editFavorite() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.editFavorite(this.visitor).then(response => {
            loader.dismiss();
            this.navController.pop();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
        }, error => {
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

    deleteVisitor() {
        let confirmation = this.alertCtrl.create({
            title: this.utils.confirmationTitle,
            message: this.deleteConfirmationMessage,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        switch(this.mode) {
                            case 'edit':
                                this.deletePreRegister();
                                break;
                
                            case 'editFavorite':
                                this.deleteFavorite();
                                break;
                        }
                    }
                }
            ]
        });
        confirmation.present();
    }

    deletePreRegister() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.deletePreRegistration(this.visitor).then(response => {
            loader.dismiss();
            this.navController.pop();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
        }, error => {
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

    deleteFavorite() {
        let loader = this.loadingCtrl.create({
            content: this.utils.pleaseWaitMessage
        });
        loader.present();
        this.visitors.deleteFavorite(this.visitor).then(response => {
            loader.dismiss();
            this.navController.pop();
            this.visitors.loadVisitorsByHome(this.visitors.currentHome);
        }, error => {
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