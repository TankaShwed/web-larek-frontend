import { Form } from './common/Form';
import { IOrderForm, TPaymentMethod } from '../types';
import { EventEmitter, IEvents } from './base/events';
import {
	cloneTemplate,
	ensureAllElements,
	ensureElement,
} from '../utils/utils';

export class PaymentForm extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	constructor(events: IEvents) {
		super(cloneTemplate('#order'), events);

		this._paymentButtons = ensureAllElements('.button_alt', this.container);
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this._paymentButtons.forEach((b) =>
			b.addEventListener('click', () => {
				events.emit('order.payment:change', {
					field: 'payment',
					value: b.getAttribute('name'),
				});
			})
		);
	}

	set adress(value: string) {
		this._address.value = value;
	}

	set payment(value: TPaymentMethod) {
		console.log('here', value);
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}
}
