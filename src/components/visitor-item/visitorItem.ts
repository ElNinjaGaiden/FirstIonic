import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Visitor } from '../../models/visitor';
import { Security } from '../../providers/security';
import { Utils } from '../../providers/utils';

@Component({
    selector: 'visitor-item',
    templateUrl: 'visitorItem.html'
})
export class VisitorItem {

    _visitor: Visitor;

    @Output() visitorEntry = new EventEmitter();

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
        this.visitorEntry.emit(this.visitor);
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