import { User } from './user';

export class Visitor extends User {
    registrationType: number;
    id: string;
    carId: string;
    approxTime: string;
    entryType: number;
    homeId: number;
    days: Array<string>;

    constructor(id: string,
                firstName: string,
                lastName: string,
                registrationType: number,
                entryType: number,
                carId: string,
                homeId: number) {

        super(firstName, lastName);
        this.registrationType = registrationType;
        this.entryType = entryType;
        this.id = id;
        this.carId = carId;
        this.homeId = homeId;
    }

    isQuick() {
        return this.registrationType === VisitorRegistrationTypes.Quick;
    }

    isRecurring() {
        return this.registrationType === VisitorRegistrationTypes.Recurring;
    }

    isPermanent() {
        return this.registrationType === VisitorRegistrationTypes.Permanent;
    }

    requiresCardId() {
        return this.entryType === VisitorEntryTypes.Vehicle || this.entryType === VisitorEntryTypes.PublicTransportation;
    }

    getDaysToSubmit() {
        if(this.isRecurring()) {
            return this.days.join(',');
        }
        return null;
    }

    getApproxTimeToSubmit() {
        if(this.isRecurring()) {
            return this.approxTime;
        }
        return null;
    }
}

export const VisitorEntryTypes = {
    Pedestrian: 1,
    PublicTransportation: 2,
    Vehicle: 3
};

export const VisitorRegistrationTypes = {
    Quick: 1,
    Recurring: 2,
    Permanent: 3
};