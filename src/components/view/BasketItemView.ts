import { Component } from '../base/component';
import { IEventEmiter, IProduct } from '../../types/index';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class BasketItemView extends Component<IProduct> {
    private _index: HTMLElement;
    private _title: HTMLElement;
    private _price: HTMLElement;

	constructor(protected events: IEventEmiter, ) {
		super(cloneTemplate('#card-basket'));
        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
	}
    setProduct(product: IProduct){
        this._title.textContent = product.title;
        this._price.textContent = product.price + ' синапсов';
    }
    setIndex(index: number){
        this._index.textContent = index + '';
    }
    setCount(index: number){

    }
}
