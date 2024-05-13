import { IEventEmiter, IProduct } from '../../types';
import { Component } from '../base/component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export class CatalogView extends Component<{ items: HTMLElement[] }> {
	constructor(private events: IEventEmiter) {
		super(ensureElement('.gallery'));
	}
	set items(value:HTMLElement[]){
		this.container.textContent = '';
		this.container.append(...value);
	}
}
