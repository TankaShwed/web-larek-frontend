import { Model } from './base/model';
import { IBasketModel } from '../types/index';
import { IEvents } from './base/events';

export class BasketModel
	extends Model<{ items: Map<string, number> }>
	implements IBasketModel
{
	items: Map<string, number>;
	constructor(events: IEvents) {
		super({ items: new Map<string, number>() }, events);
	}
	add(id: string): void {
		if (!this.items.has(id)) {
			this.items.set(id, 0);
		}
		this.items.set(id, this.items.get(id) + 1);
        this.emitChanges('basket:change', this.items);
	}
	remove(id: string): void {
		if (!this.items.has(id)) return;
		const val = this.items.get(id);
		if (val == 1) this.items.delete(id);
		else this.items.set(id, val - 1);
        this.emitChanges('basket:change', this.items);
	}
}
