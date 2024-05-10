import { IEventEmiter, IProduct } from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/component';

export class CardView extends Component<IProduct> {
	template: HTMLTemplateElement;
	constructor(
		protected readonly container: HTMLElement,
		protected onAddBasketClick: ()=>void
	) {
		super(container);
		this.template = ensureElement<HTMLTemplateElement>('#card-preview');
	}

	render(data: IProduct): HTMLElement {
		this.container.textContent = '';

		const wrapper = cloneTemplate<HTMLButtonElement>(this.template);
		const category = ensureElement<HTMLSpanElement>('.card__category', wrapper);
		category.textContent = data.category;
		const title = ensureElement<HTMLSpanElement>('.card__title', wrapper);
		title.textContent = data.title;
		const image = ensureElement<HTMLImageElement>('.card__image', wrapper);
		image.src = CDN_URL + data.image;
		const price = ensureElement<HTMLSpanElement>('.card__price', wrapper);
		price.textContent = data.price + ' синпасов';

		wrapper.addEventListener('click', this.onAddBasketClick);

		this.container.append(wrapper);

		return this.container;
	}
}
