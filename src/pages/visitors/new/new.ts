import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavParams } from 'ionic-angular';
import { Security } from '../../../providers/security';

@Component({
    selector: 'new-visitors',
    templateUrl: 'new.html'
})
export class NewVisitorPage {

    visitorForm: FormGroup;

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
                private translateService: TranslateService) {

        this.visitor.visitorType = this.security.isResidentUser ? this.navParams.data.visitorType : 'quick';

        this.visitorForm = this.formBuilder.group({
            'houseId': ['', [Validators.required]],
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
    }

    onSubmit() {
        console.log('submitting form', this.visitor);
    }
}