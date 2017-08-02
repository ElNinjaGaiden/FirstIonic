import { Component, Input } from '@angular/core';
import { Visitor } from '../../models/visitor';
import { Security } from '../../providers/security';
import { Utils } from '../../providers/utils';

@Component({
    selector: 'visitor-item',
    templateUrl: 'visitorItem.html'
})
export class VisitorItem {

    _visitor: Visitor;

    constructor(private security: Security,
                private utils: Utils) {
        
    }

    @Input()
    set visitor(visitor: Visitor) {
        this._visitor = visitor;
    }

    get visitor() : Visitor {
        return this._visitor;
    }

    notifyVisitorIsArriving(slidingItem, visitor) {
        slidingItem.close();
    }

    cancelVisitor(slidingItem, visitor) {
        slidingItem.close();
    }

    getDaysLabels() : string {
        const daysLabels = this.utils.getDaysLabels(this.visitor.days);
        return daysLabels.join(', ');
    }

    formatTimeLabel() {
        return this.utils.formatTimeLabel(this.visitor.approxTime);
    }
}