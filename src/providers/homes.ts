import { Injectable } from '@angular/core';
import { Home } from '../models/home';
import { User } from '../models/user';

@Injectable()
export class Homes {

    searchByNumber(parameters: any) : Promise<Array<Home>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    new Home('101', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ]),
                    new Home('102', [
                        new User('Sergio', 'Sanchez'),
                    ]),
                    new Home('201', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ]),
                    new Home('202', [
                        new User('Sergio', 'Sanchez')
                    ]),
                    new Home('301', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ]),
                    new Home('302', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ])
                ]);
            }, 400);
        });
    }

    searchByUser(parameters: any) : Promise<Array<Home>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    new Home('101', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ]),
                    new Home('102', [
                        new User('Sergio', 'Sanchez'),
                        new User('Juana', 'Consuelo'),
                    ]),
                ]);
            }, 400);
        });
    }
}