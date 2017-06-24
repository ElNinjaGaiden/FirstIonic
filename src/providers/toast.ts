import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Dialogs } from '@ionic-native/dialogs';

@Injectable()
export class Toast {

    constructor(private toastCtrl: ToastController, private vibration: Vibration, private dialogs: Dialogs) {

    }

    show(notification: any, duration: number = 5000, position: string = 'top') {
        const message = typeof notification === 'string' ? notification : (notification.body || notification.message);
        const toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: position
        });
        this.vibration.vibrate(700);
        this.dialogs.beep(1);
        toast.present();
    }
}