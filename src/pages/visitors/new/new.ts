import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavParams } from 'ionic-angular';
import { Security } from '../../../providers/security';
import { Homes } from '../../../providers/homes';
import { Visitors } from '../../../providers/visitors';
import { Home } from '../../../models/home';

@Component({
    selector: 'new-visitors',
    templateUrl: 'new.html'
})
export class NewVisitorPage {

    visitorForm: FormGroup;
    homesCollection: Array<Home>;

    visitor: any = {
        houseId: '',
        firstName: '',
        lastName: '',
        id: '',
        carId: '',
        visitorType: ''
    };

    visitorTypes: any = [];

    constructor(public formBuilder: FormBuilder,
                public security: Security,
                public navParams: NavParams,
                private homes: Homes,
                private visitors: Visitors,
                private translateService: TranslateService) {

        //NOTE: Security users can only add quick visitors
        this.visitor.visitorType = this.security.isSecurityUser ? 'quick' : this.navParams.data.visitorType;
        this.visitor.houseId = visitors.currentHome.id;

        this.visitorForm = this.formBuilder.group({
            'houseId': new FormControl({ value: visitors.currentHome.id, disabled: !this.security.isResidentUser }, Validators.required),
            'firstName': ['', [Validators.required]],
            'lastName': ['', [Validators.required]],
            'id': ['', [Validators.required]],
            'carId': ['', []],
            visitorType: new FormControl({ value: this.security.isResidentUser ? this.navParams.data.visitorType : 'quick', disabled: !this.security.isResidentUser }, Validators.required)
        });

        translateService.get(['VISITORS.VISITORS_TYPES.QUICK', 'VISITORS.VISITORS_TYPES.RECURRING', 'VISITORS.VISITORS_TYPES.PERMANENT']).subscribe(values => {
            this.visitorTypes.push({ type: 'quick', name: values['VISITORS.VISITORS_TYPES.QUICK'] });
            this.visitorTypes.push({ type: 'recurring', name: values['VISITORS.VISITORS_TYPES.RECURRING'] });
            this.visitorTypes.push({ type: 'permanent', name: values['VISITORS.VISITORS_TYPES.PERMANENT'] });
        });

        this.homesCollection = this.navParams.data.homes;
    }

    onSubmit() {
        console.log('submitting form', this.visitor);
    }
}