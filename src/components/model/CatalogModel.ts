import { ICatalogModel, IEventEmiter, IProduct } from '../../types';

export class CatalogModel implements ICatalogModel {  
	private _items: IProduct[];

	constructor(protected events: IEventEmiter) {}

	set items(items: IProduct[]){
		this._items = items;
		this.events.emit('catalog:change', { items: this.items });
	}

	get items() {
		return this._items;
	}

	findProductById(id: string): IProduct {
		return this.items.find(p=>p.id == id);
	}
}
