import { Injectable } from '@angular/core';
import { Visitor } from '../models/visitor';

@Injectable()
export class Visitors {

    _quickVisitors: Array<Visitor> = [];
    _recurrentVisitors: Array<Visitor> = [];
    _permanentVisitors: Array<Visitor> = [];

    get quickVisitors() : Array<Visitor> {
        return this._quickVisitors;
    }

    set quickVisitors(visitors: Array<Visitor>) {
        this._quickVisitors = visitors;
    }

    get recurringVisitors() : Array<Visitor> {
        return this._recurrentVisitors;
    }

    set recurringVisitors(visitors: Array<Visitor>) {
        this._recurrentVisitors = visitors;
    }

    get permanentVisitors() : Array<Visitor> {
        return this._permanentVisitors;
    }

    set permanentVisitors(visitors: Array<Visitor>) {
        this._permanentVisitors = visitors;
    }

    loadVisitorsByHome(homeNumber: string) : Promise<Array<Visitor>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let visitors = [
                    new Visitor('Pedro', 'Perez', 'quick', '', ''),
                    new Visitor('Juan', 'Perez', 'quick', '', ''),
                    new Visitor('Mickey', 'Mouse', 'recurring', '', ''),
                    new Visitor('Michael', 'Jordan', 'permanent', '', '')
                ];
                this.quickVisitors = visitors.filter(v => v.isQuick());
                this.recurringVisitors = visitors.filter(v => v.isRecurring());
                this.permanentVisitors = visitors.filter(v => v.isPermanent());
                resolve(visitors);
            }, 400);
        });
    }
}