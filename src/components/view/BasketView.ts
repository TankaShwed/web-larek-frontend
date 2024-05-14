import { Component } from '../base/component';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class BasketView extends Component<IBasketView> {
	protected _items: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._items.replaceChildren(...items);
		} else {
			this._items.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set valid(value: boolean) {
		this.setDisabled(this._button, !value);
	}

	set total(total: number | null) {
		if (total === null) {
		    this.setText(this._total, 'Бесценно');
		} else {
			this.setText(this._total, formatNumber(total) + ' синапсов');
		}
	}
}
