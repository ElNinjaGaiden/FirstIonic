import { User } from './user';

export class Visitor extends User {
    visitorType: string;
    id: string;
    carId: string;

    constructor(firstName: string,
                lastName: string,
                visitorType: string,
                id: string,
                carId: string) {

        super(firstName, lastName);
        this.visitorType = visitorType;
        this.id = id;
        this.carId = carId;
    }

    isQuick() {
        return this.visitorType === 'quick';
    }

    isRecurring() {
        return this.visitorType === 'recurring';
    }

    isPermanent() {
        return this.visitorType === 'permanent';
    }
}