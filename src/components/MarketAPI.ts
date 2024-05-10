import {
	IOrder,
	TResponseOrder,
	TResponseProductItem,
	TResponseProductList,
} from '../types';
import { Api } from './base/api';

export class MarketAPI extends Api {
	GetProductList(): Promise<TResponseProductList> {
        return this.get('/product/') as Promise<TResponseProductList>;
	}
	GetProductItem(id: string): TResponseProductItem {
		throw 'not implemented yet';
	}
	PostOrder(order: IOrder): TResponseOrder {
		throw 'not implemented yet';
	}
}
