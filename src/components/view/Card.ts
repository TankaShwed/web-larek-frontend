import { IEventEmiter, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class CardView extends Component<IProduct> {
	template: HTMLTemplateElement;
	constructor(
		protected events: IEventEmiter
	) {
		super(cloneTemplate('#card-preview'));
	}

	render(data: IProduct): HTMLElement {

		const category = ensureElement<HTMLSpanElement>('.card__category', this.container);
		category.textContent = data.category;
		const title = ensureElement<HTMLSpanElement>('.card__title', this.container);
		title.textContent = data.title;
		const description = ensureElement<HTMLSpanElement>('.card__text', this.container);
		description.textContent = data.description;
		const image = ensureElement<HTMLImageElement>('.card__image', this.container);
		image.src = CDN_URL + data.image;
		const price = ensureElement<HTMLSpanElement>('.card__price', this.container);
		price.textContent = data.price + ' синпасов';
		const button = ensureElement<HTMLSpanElement>('.card__button', this.container);
		button.addEventListener('click', ()=>this.events.emit('card:addToBasket', data));


		return this.container;
	}
}
