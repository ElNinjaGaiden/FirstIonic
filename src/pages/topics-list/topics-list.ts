import { Component } from '@angular/core';

import { Item } from '../../models/item';
import { Topics } from '../../providers/providers';

@Component({
    selector: 'topics-list',
    templateUrl: 'topics-list.html'
})
export class TopicsListPage {
    currentTopics: Item[];

    constructor(public topics: Topics) {
        this.currentTopics = topics.query();
    }

    subscribeToTopic(slidingItem, topic) {
        this.topics.subscribe(topic);
        slidingItem.close();
    }

    unsubscribeToTopic(slidingItem, topic) {
        this.topics.unsubscribe(topic);
        slidingItem.close();
    }
}