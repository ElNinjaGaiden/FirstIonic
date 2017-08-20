import { Home } from './home';

export class Visitor {
    registrationType: number;
    id: number;
    name: string;
    identification: string;
    carId: string;
    approxTime: string;
    entryType: number;
    homeId: number;
    days: Array<string>;
    isFavorite: boolean;
    isActive: boolean;
    home: Home;

    constructor(id: number,
                name: string,
                identification: string,
                registrationType: number,
                entryType: number,
                carId: string,
                isFavorite: boolean,
                homeId: number) {

        this.registrationType = registrationType;
        this.name = name;
        this.identification = identification;
        this.entryType = entryType;
        this.id = id;
        this.carId = carId;
        this.isFavorite = isFavorite;
        this.homeId = homeId;
    }

    isInmediate() {
        return this.registrationType === VisitorRegistrationTypes.Inmediate;
    }

    isPermanent() {
        return this.registrationType === VisitorRegistrationTypes.Permanent;
    }

    requiresCardId() {
        return this.entryType === VisitorEntryTypes.Vehicle || this.entryType === VisitorEntryTypes.PublicTransportation;
    }

    getDaysToSubmit() {
        if(this.isPermanent()) {
            return this.days.join(',');
        }
        return null;
    }    

    getApproxTimeToSubmit() {
        if(this.isPermanent()) {
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
    Inmediate: 1,
    Permanent: 2
};