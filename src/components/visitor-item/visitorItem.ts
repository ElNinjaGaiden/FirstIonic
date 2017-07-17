import { Component, Input } from '@angular/core';
import { Visitor } from '../../models/visitor';

@Component({
    selector: 'visitor-item',
    templateUrl: 'visitorItem.html'
})
export class VisitorItem {

    _visitor: Visitor;

    @Input()
    set visitor(visitor: Visitor) {
        this._visitor = visitor;
    }

    get visitor() : Visitor {
        return this._visitor;
    }
}