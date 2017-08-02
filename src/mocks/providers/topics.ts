import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Item } from '../../models/item';
import { Utils } from '../../providers/utils';

declare var FCMPlugin;

@Injectable()
export class Topics {
  items: Item[] = [];

  constructor(private storage: Storage, private loadingCtrl: LoadingController, private utils: Utils) {
    let items = [
        { name: 'admin', icon: 'briefcase', subscribed: false },
        { name: 'news', icon: 'information-circle', subscribed: false },
        { name: 'security', icon: 'lock', subscribed: false },
        { name: 'common', icon: 'people', subscribed: false },
        { name: 'parking', icon: 'car', subscribed: false }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }

    this.storage.get('subscribedTopics').then((data) => {
        let subscribedTopics = data || [];
        for (let subscribedTopic of subscribedTopics) {
            let topic = this.items.find(t => t['name'] === subscribedTopic);
            if(topic) {
                topic['subscribed'] = true;
            }
        }
    });
  }

    query() {
        return this.items;
    }

    subscribe(item: Item) {
        let subscribedTopics = this.items.filter(t => t['subscribed'] === true).map(t => t['name']);
        if(subscribedTopics.indexOf(item['name']) === -1) {

            if(typeof FCMPlugin !== 'undefined') {

                let loader = this.loadingCtrl.create({
                    content: this.utils.pleaseWaitMessage
                });
                loader.present();

                FCMPlugin.subscribeToTopic(item['name'], () => {
                    loader.dismiss();
                    this._onSubscribeCallback(item, subscribedTopics);
                }, (error) => {
                    loader.dismiss();
                });
            }
            else {
                this._onSubscribeCallback(item, subscribedTopics);
            }
        }
    }

    _onSubscribeCallback(item: Item, subscribedTopics: any[]) {
        item['subscribed'] = true;
        subscribedTopics.push(item['name']);
        this.storage.set('subscribedTopics', subscribedTopics);
    }

    unsubscribe(item: Item) {
        let subscribedTopics = this.items.filter(t => t['subscribed'] === true).map(t => t['name']);
        let topicToUnsuscribeIndex = subscribedTopics.indexOf(item['name']);
        if(topicToUnsuscribeIndex >= 0) {

            if(typeof FCMPlugin !== 'undefined') {

                let loader = this.loadingCtrl.create({
                    content: this.utils.pleaseWaitMessage
                });
                loader.present();

                FCMPlugin.unsubscribeFromTopic(item['name'], () => {
                    loader.dismiss();
                    this._onUnsubscribeCallback(item, topicToUnsuscribeIndex, subscribedTopics);
                }, (err) => {
                    loader.dismiss();
                });
            }
            else {
                this._onUnsubscribeCallback(item, topicToUnsuscribeIndex, subscribedTopics);
            }
        }
    }

    _onUnsubscribeCallback(item: Item, topicToUnsuscribeIndex: number, subscribedTopics: any[]) {
        item['subscribed'] = false;
        subscribedTopics.splice(topicToUnsuscribeIndex, 1);
        this.storage.set('subscribedTopics', subscribedTopics);
    }
}
