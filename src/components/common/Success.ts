import { Component } from '../base/component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEventEmiter, ISuccess } from '../../types';

export class SuccessView extends Component<ISuccess> {
	private description: HTMLElement;

	constructor(private events: IEventEmiter) {
		super(cloneTemplate('#success'));

		const button = ensureElement<HTMLElement>('.order-success__close', this.container);
		button.addEventListener('click', () => {
			events.emit('successForm:okClick', {});
		});
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
	}

	set total(value: number) {
        this.setText(this.description, `Списанно ${value} синапсов`);
    }
}
