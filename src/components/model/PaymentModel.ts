import { IEvents, IPayment, TPaymentMethod } from '../../types';
import { Model } from '../base/model';

export class PaymentModel extends Model<IPayment> {
	private _payment: TPaymentMethod;
	private _address: string;
	private static getDefault(): IPayment {
		return { payment: 'card', address: '' };
	}
	constructor(events: IEvents) {
		super(PaymentModel.getDefault(), events);
	}
	reset() {
		Object.assign(this, PaymentModel.getDefault());
	}
	validate(): string[] {
		const errors: string[] = [];
		if (!this.payment) {
			errors.push('Необходимо указать способ оплаты');
		}
		if (!this.address) {
			errors.push('Необходимо указать адрес');
		}
		return errors;
	}

	set payment(value: TPaymentMethod) {
		this._payment = value;
		this.emitChanges('payment:change');
	}

	set address(value: string) {
		this._address = value;
		this.emitChanges('payment:change');
	}

	get payment(): TPaymentMethod {
		return this._payment;
	}

	get address(): string {
		return this._address;
	}
}
