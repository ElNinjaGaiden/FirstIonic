import { User } from './user';

export class Resident extends User {

    constructor(firstName: string, lastName: string) {
        super(firstName, lastName);
    }
}