import { IEventEmiter, IProduct } from '../../types';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export class CatalogView extends Component<{ items: HTMLElement[] }> {
	constructor(private events: IEventEmiter) {
		super(ensureElement('.gallery'));
	}
	set items(value: HTMLElement[]) {
		this.container.textContent = '';
		this.container.append(...value);
	}
}
