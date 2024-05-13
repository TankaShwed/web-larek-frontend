import { Model } from '../base/model';
import { IBasketModel, ICatalogModel } from '../../types/index';
import { IEvents } from '../../types';

export class BasketModel extends Model<{ items: Set<string> }>
	implements IBasketModel
{
	items: Set<string>;
	constructor(events: IEvents) {
		super({ items: new Set<string>() }, events);
	}
	validation(catalog: ICatalogModel): boolean{
		if(this.items.size == 0) {
			return false;
		}
		for (let id of Array.from(this.items.values())){
			if (catalog.findProductById(id).price === null)
				return false;
		}
		return true;
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
