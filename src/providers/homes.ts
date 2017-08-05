import { Injectable } from '@angular/core';
import { Home } from '../models/home';
import { Resident } from '../models/resident';
import { User } from '../providers/user';
import { Security } from '../providers/security';

@Injectable()
export class Homes {

    _userHomes: Array<Home>;

    constructor(private user: User,
                private security: Security) {

    }

    searchByNumber(searchTerm: string) : Array<Home> {
        const searchRegex = new RegExp(searchTerm, 'i');
        return this.userHomes.filter(h => h.name.match(searchRegex));
    }

    get userHomes() : Array<Home> {
        if(!this._userHomes) {
            const userData = this.user.userData;
            this._userHomes = userData.homes.map(h => this._parseHome(h, userData));
        }
        return this._userHomes;
    }

    _parseHome(data, userData) : Home {
        let residents : Array<Resident>;
        if(this.security.isSecurityUser) {
            residents = data.users.split(',').map(n => new Resident(n)); 
        }
        else if(this.security.isResidentUser) {
            residents = [new Resident(`${userData.firstName} ${userData.lastName}`)];
        }
        
        return new Home(data.id, data.name, residents);
    }
}