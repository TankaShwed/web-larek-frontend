import './scss/styles.scss';

import { MarketAPI } from './components/MarketAPI';
import { CatalogModel } from './components/model/CatalogModel';
import { CatalogView } from './components/view/CatalogView';
import { EventEmitter } from './components/base/events';
import { IEvents } from './types';
import {
	IOrder,
	IProduct,
	TContactsErrors,
	TPaymentErrors,
	TResponseOrder,
} from './types';
import { API_URL } from './utils/constants';
import { CardView } from './components/view/CardView';
import { Modal } from './components/common/Modal';
import { BasketModel } from './components/model/BasketModel';
import { ensureElement } from './utils/utils';
import { BasketView } from './components/view/BasketView';
import { BasketItemView } from './components/view/BasketItemView';
import { PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Model } from './components/base/model';
import { SuccessView } from './components/common/Success';

//инициализация
const api = new MarketAPI(API_URL);

//Presenter
const events = new EventEmitter();

//Catalog
const catalogModel = new CatalogModel(events);
const catalogView = new CatalogView(events);
const modal = new Modal(document.querySelector('#modal-container'), events);
const gallery = ensureElement<HTMLDivElement>('.gallery');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketView = new BasketView(events);

basketButton.addEventListener('click', () => {
	modal.render({
		content: basketView.render({
			items: Array.from(basketModel.items.entries()).map((el, ind) => {
				const basketItemView = new BasketItemView(events);
				basketItemView.setProduct(catalogModel.getProduct(el[0]));
				basketItemView.setIndex(ind);
				basketItemView.setCount(el[1]);
				return basketItemView.render(); // htmlelement
			}),
		}),
	});
});

api
	.GetProductList()
	.then((json) => catalogModel.setItems(json.items))
	.catch((err) => console.error(err));

events.on('catalog:change', (event: { items: IProduct[] }) => {
	catalogView.render(event);
});

const basketModel = new BasketModel(events);

//Card
const card = new CardView(events);

events.on('card:click', (event: IProduct) => {
	// renderBasket(event.items);
	modal.render({ content: card.render(event) });
});

const order: IOrder = {
	payment: 'card',
	email: '',
	phone: 0,
	address: '',
	total: 0,
	items: [],
	valid: false,
	errors: [],
};

class OrderModel extends Model<IOrder> {
	constructor(order: IOrder, events: IEvents) {
		super(order, events);
	}
}

const orderModel = new OrderModel(order, events);
const paymentform = new PaymentForm(events);
const contactsForm = new ContactsForm(events);
const successView = new SuccessView(events);

events.on('order:open', () => {
	modal.render({ content: paymentform.render(order) });
});

events.on('card:addToBasket', (product: IProduct) => {
	basketModel.add(product.id);
	const ids = Array.from(basketModel.items.keys());
	order.items = [];
	order.total = 0;
	ids.forEach((productId) => {
		const count = basketModel.items.get(productId);
		const price = count * catalogModel.getProduct(productId).price;
		for (let i = 0; i < count; i++) {
			order.items.push(productId);
		}
		order.total = order.total + price;
	});
});

events.on('order:submit', () => {
	modal.render({ content: contactsForm.render(order) });
});

events.on('contacts:submit', () => {
	api.PostOrder(order).then((r: TResponseOrder) => {
		//@ts-ignore
		successView.total = r.total;
		modal.render({ content: successView.render(order) });
	});
});

events.on('successForm:okClick', () => {
	modal.close();
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrder; value: any }) => {
	const mixin = { [data.field]: data.value };
	Object.assign(paymentform, mixin);
	Object.assign(order, mixin);
	console.log(data, paymentValidate(), order);
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: any }) => {
		const mixin = { [data.field]: data.value };
		Object.assign(contactsForm, mixin);
		Object.assign(order, mixin);
		contactsValidate();
	}
);

events.on('paymentFormError:change', (errors) => {
	const vls = Object.values(errors);
	const valid = vls.length === 0;
	Object.assign(paymentform, { valid, errors: vls.join('. ') });
});

events.on('contactsFormError:change', (errors) => {
	const vls = Object.values(errors);
	const valid = vls.length === 0;
	console.log('consta form error', vls);
	Object.assign(contactsForm, { valid, errors: vls.join('. ') });
});

function paymentValidate() {
	const errors: TPaymentErrors = {};
	if (!order.payment) {
		errors.payment = 'Необходимо указать способ оплаты';
	}
	if (!order.address) {
		errors.address = 'Необходимо указать адрес';
	}
	console.log(errors);
	events.emit('paymentFormError:change', errors);
	return Object.keys(errors).length === 0;
}

function contactsValidate() {
	const errors: TContactsErrors = {};
	if (!order.email) {
		errors.email = 'Необходимо указать email';
	}
	if (!order.phone) {
		errors.phone = 'Необходимо указать телефон';
	}
	events.emit('contactsFormError:change', errors);
	return Object.keys(errors).length === 0;
}
