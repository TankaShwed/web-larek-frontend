import { Model } from './base/model';
import { IBasketModel } from '../types/index';
import { IEvents } from './base/events';

export class BasketModel extends Model<{items: Map<string, number>}> implements IBasketModel
{
    items: Map<string, number>;
    constructor(events:IEvents){
        super({items: new Map<string, number>()}, events);
    }
    add(id: string): void {
        throw new Error('Method not implemented.');
    }
    remove(id: string): void {
        throw new Error('Method not implemented.');
    }

}
