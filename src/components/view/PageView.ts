import { IEventEmiter, IPageView, IProduct } from '../../types';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export class PageView extends Component<IPageView> {
	//container это враппер всей страницы
	private _basketCount: HTMLSpanElement;

	constructor(
		container: HTMLElement,
		protected events: IEventEmiter,
		onBasketClick: () => void
	) {
		super(container);
		this._basketCount = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			this.container
		);
		const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		basketButton.addEventListener('click', onBasketClick);
	}

	set basketCount(value: number) {
		this.setText(this._basketCount, value.toString());
	}

	set scrollState(value: boolean) {
		this.toggleClass(this.container, 'page__wrapper_locked', value);
	}
}
