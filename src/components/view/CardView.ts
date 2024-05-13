import { IEventEmiter, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import {
	ensureElement,
	SelectorElement,
} from '../../utils/utils';
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

export class CardView extends Component<IProduct & { index?: number }> {
	private _index?: HTMLElement;
	private _title: HTMLElement;
	private _price: HTMLElement;
	private _description?: HTMLElement;
	private _image?: HTMLImageElement;
	private _category?: HTMLElement;
	private _button: HTMLElement;

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}

	set description(value: string) {
		if (this._description) this.setText(this._description, value);
	}

	set category(value: string) {
		if (this._category) this.setText(this._category, value);
		// todo: сделать разные цвета категорий
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
		this._button = ensureElement<HTMLButtonElement>('button', this.container);
		this._button.addEventListener('click', onClick);
	}
}