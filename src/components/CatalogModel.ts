import { ICatalogModel, IEventEmiter, IProduct } from '../types';

export class CatalogModel implements ICatalogModel {
	items: IProduct[];

	constructor(protected events: IEventEmiter) {}

	protected _changed() {
		// метод генерирующий уведомление об изменении
		this.events.emit('catalog:change', { items: this.items });
	}

	setItems(items: IProduct[]): void {
		this.items = items;
        this._changed();
	}
	getProduct(id: string): IProduct {
		return this.items.find(p=>p.id == id);
	}
}
