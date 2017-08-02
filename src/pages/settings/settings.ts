import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Settings } from '../../providers/settings';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  form: FormGroup;
  options: any;
  _currentLanguage: string; 

  constructor(public settings: Settings,
              public formBuilder: FormBuilder) {

    this.options = this.settings.allSettings;
    this._currentLanguage = this.options.language;

    this.form = this.formBuilder.group({
        'language': [this.options.language, [Validators.required]]
    });
  }

  onSubmit() {
    this.settings.setAll(this.options).then(() => {
      if(this._currentLanguage !== this.options.language) {
        //The language has changed, we need to reload the app
        location.reload();
      }
    });
  }
}
