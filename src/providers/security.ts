import { Injectable } from '@angular/core';

@Injectable()
export class Security {
    _userRoles: any = [];

    set Roles (roles: any) {
        this._userRoles = roles;
    }

    get isDevelopmentMode () : boolean {
        return false;
    }

    get isAdminUser () : boolean {
        return this._userRoles.indexOf('Administrator') > -1;
    }

    get isSecurityUser () : boolean {
        return this._userRoles.indexOf('Security') > -1;
    }

    get isResidentUser () : boolean {
        return this._userRoles.indexOf('User') > -1;
    }
}