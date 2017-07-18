import { Injectable } from '@angular/core';
import { Home } from '../models/home';
import { Resident } from '../models/resident';
import { User } from '../providers/user';

@Injectable()
export class Homes {

    _userHomes: Array<Home>;

    constructor(private user: User) {

    }

    searchByNumber(parameters: any) : Promise<Array<Home>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    new Home(1, '101', [
                        new Resident('Sergio', 'Sanchez'),
                        new Resident('Juana', 'Consuelo'),
                    ]),
                    new Home(2, '102', [
                        new Resident('Sergio', 'Sanchez'),
                    ]),
                    new Home(3, '201', [
                        new Resident('Sergio', 'Sanchez'),
                        new Resident('Juana', 'Consuelo'),
                    ]),
                    new Home(4, '202', [
                        new Resident('Sergio', 'Sanchez')
                    ]),
                    new Home(5, '301', [
                        new Resident('Sergio', 'Sanchez'),
                        new Resident('Juana', 'Consuelo'),
                    ]),
                    new Home(6, '302', [
                        new Resident('Sergio', 'Sanchez'),
                        new Resident('Juana', 'Consuelo'),
                    ])
                ]);
            }, 400);
        });
    }

    get userHomes() : Array<Home> {
        if(!this._userHomes) {
            const userData = this.user.userData;
            this._userHomes = userData.homes.map(h => new Home(h.id, h.name, [ new Resident(userData.firstName, userData.lastName) ]));
        }
        return this._userHomes;
    }

    // searchByUser() : Promise<Array<Home>> {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             const userData = this.user.userData;
    //             const userHomes = userData.homes.map(h => new Home(h.id, h.name, [ new Resident(userData.firstName, userData.lastName) ]));
    //             resolve(userHomes);
    //         }, 400);
    //     });
    // }
}