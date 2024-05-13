import { Model } from '../base/model';
import { IBasketModel } from '../../types/index';
import { IEvents } from '../../types';

export class BasketModel extends Model<{ items: Set<string> }>
	implements IBasketModel
{
	items: Set<string>;
	constructor(events: IEvents) {
		super({ items: new Set<string>() }, events);
	}
	add(id: string): void {
		this.items.add(id);
		this.emitChanges('basket:change', this.items);
	}
	remove(id: string): void {
		this.items.delete(id);
		this.emitChanges('basket:change', this.items);
	}
}
