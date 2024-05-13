import { Component } from '../base/component';
import { cloneTemplate, createElement, ensureElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class BasketView extends Component<IBasketView> {
	protected _items: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(protected container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.modal__actions',
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

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total) + ' синапсов');
	}
}
