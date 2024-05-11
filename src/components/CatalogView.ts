import { IEventEmiter, IProduct } from '../types';
import { Component } from './base/component';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

export class CatalogView extends Component<{ items: IProduct[] }> {
	constructor(
		private events: IEventEmiter
	) {
		super(cloneTemplate('#card-catalog'));
	}

	render(data?: Partial<{ items: IProduct[] }>): HTMLElement {
		this.container.textContent = '';
		data.items.forEach((product) => {
			const wrapper = cloneTemplate<HTMLButtonElement>('#card-catalog');
			const category = ensureElement<HTMLSpanElement>(
				'.card__category',
				wrapper
			);
			category.textContent = product.category;
			const title = ensureElement<HTMLSpanElement>('.card__title', wrapper);
			title.textContent = product.title;
			const image = ensureElement<HTMLImageElement>('.card__image', wrapper);
			image.src = CDN_URL + product.image;
			const price = ensureElement<HTMLSpanElement>('.card__price', wrapper);
			price.textContent = product.price + ' синпасов';

			wrapper.addEventListener('click', () => {
				this.events.emit('card:click', product );
			});

			this.container.append(wrapper);
		});
		return this.container;
	}
}
