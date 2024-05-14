import { Form } from '../common/Form';
import { IOrderForm, IPayment, TPaymentMethod } from '../../types';
import { IEvents } from '../../types';
import { cloneTemplate, ensureAllElements } from '../../utils/utils';

export class PaymentForm extends Form<IPayment> {
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

	set address(value: string) {
		this._address.value = value;
	}

	set payment(value: TPaymentMethod) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}
}
