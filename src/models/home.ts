import { User } from './user';

export class Home {

    number: string;
    contacts: Array<User>;

    constructor(number: string, contacts: Array<User>) {
        this.number = number;
        this.contacts = contacts;
    }

}