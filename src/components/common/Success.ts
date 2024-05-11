import { Component } from '../base/component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEventEmiter, ISuccess } from '../../types';

export class SuccessView extends Component<ISuccess> {
	private _discription: HTMLElement;

	constructor(private events: IEventEmiter) {
		super(cloneTemplate('#success'));

		const button = ensureElement<HTMLElement>('.order-success__close', this.container);
		button.addEventListener('click', () => {
			events.emit('successForm:okClick', {});
		});
		this._discription = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
	}
	set total(value: number) {
        debugger
        this._discription.textContent = `Списанно ${value} синапсов`;
    }
}
