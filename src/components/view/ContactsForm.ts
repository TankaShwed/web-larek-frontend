import { Form } from '../common/Form';
import { IOrderForm } from '../../types';
import { IEvents } from '../../types';
import { cloneTemplate } from '../../utils/utils';

export class ContactsForm extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(events: IEvents) {
		super(cloneTemplate('#contacts'), events);

		this._email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set adress(value: string) {
		this._phone.value = value;
	}
	set email(value: string) {
		this._email.value = value;
	}
}
