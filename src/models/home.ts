import { Resident } from './resident';

export class Home {

    id: number;
    name: string;
    contacts: Array<Resident>;

    constructor(id: number, name: string, contacts: Array<Resident>) {
        this.id = id;
        this.name = name;
        this.contacts = contacts;
    }

}