import { IEventEmiter, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement, SelectorElement } from '../../utils/utils';
import { Component } from '../base/component';

const customeEnsureElement = <T extends HTMLElement>(
	selector: SelectorElement<T>,
	container: HTMLElement
): T | null => {
	try {
		return ensureElement<T>(selector, container);
	} catch (e) {
		// если элемент не найден вместо исключение вернём нул
		return null;
	}
};

type TCategoryClassPostfix =
	| 'other'
	| 'soft'
	| 'button'
	| 'additional'
	| 'hard';

const categoryMap: { [key: string]: TCategoryClassPostfix } = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};

export class CardView extends Component<IProduct & { index?: number, disabledBuy?: boolean} > {
	private _index?: HTMLElement;
	private _title: HTMLElement;
	private _price: HTMLElement;
	private _description?: HTMLElement;
	private _image?: HTMLImageElement;
	private _category?: HTMLElement;
	private _button: HTMLElement;
	id: string; 

	set disabledBuy(value: boolean) {
		this.setDisabled(this._button, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set description(value: string) {
		if (this._description) this.setText(this._description, value);
	}

	set category(value: string) {
		if (!this._category) return;
		this.setText(this._category, value);
		Object.keys(categoryMap).forEach((k) => {
			this.toggleClass(
				this._category,
				'card__category_' + categoryMap[k],
				value == k
			);
		});
	}

	set image(value: string) {
		if (this._image) this.setImage(this._image, CDN_URL + value);
	}

	set index(value: number) {
		if (this._index) this.setText(this._index, value);
	}

	constructor(
		container: HTMLElement,
		protected events: IEventEmiter,
		onClick: () => void
	) {
		super(container);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);
		this._title = ensureElement<HTMLSpanElement>(
			'.card__title',
			this.container
		);
		this._category = customeEnsureElement<HTMLSpanElement>(
			'.card__category',
			this.container
		);
		this._description = customeEnsureElement<HTMLSpanElement>(
			'.card__text',
			this.container
		);
		this._image = customeEnsureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._index = customeEnsureElement<HTMLSpanElement>(
			'.basket__item-index',
			this.container
		);
		this._button =
			customeEnsureElement<HTMLButtonElement>('button', this.container) ||
			this.container;
		this._button.addEventListener('click', onClick);
	}
}
