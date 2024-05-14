import './scss/styles.scss';

import { MarketAPI } from './components/MarketAPI';
import { CatalogModel } from './components/model/CatalogModel';
import { CatalogView } from './components/view/CatalogView';
import { EventEmitter } from './components/base/events';
import { IContacts, IPayment } from './types';
import {IProduct, TResponseOrder } from './types';
import { API_URL } from './utils/constants';
import { CardView } from './components/view/CardView';
import { Modal } from './components/common/Modal';
import { BasketModel } from './components/model/BasketModel';
import { PaymentModel } from './components/model/PaymentModel';
import { ContactsModel } from './components/model/ContactsModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketView } from './components/view/BasketView';
import { PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/common/Success';

import { Application} from './components/Application';


const api = new MarketAPI(API_URL);

const events = new EventEmitter();
const application = new Application(events);

const catalogModel = new CatalogModel(events);
const catalogView = new CatalogView(events);
const basketModel = new BasketModel(events);
const paymentModel = new PaymentModel(events);
const contactsModel = new ContactsModel(events);
const paymentForm = new PaymentForm(events);
const contactsForm = new ContactsForm(events);
const successView = new SuccessView(events);


const modal = new Modal(document.querySelector('#modal-container'), events);
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketView = new BasketView(cloneTemplate('#basket'), events);

const renderBasket = () => {application.renderBasket()};

basketButton.addEventListener('click', () => {
	modal.render({
		content: renderBasket(),
	});
});

api
	.GetProductList()
	.then((json) => application.updateCatalog(json))
	.catch((err) => console.error(err));

events.on('catalog:change', (event: { items: IProduct[] }) => {
	const itms = event.items.map((product) => {
		const cardView = new CardView(
			cloneTemplate('#card-catalog'),
			events,
			() => {
				events.emit('card:click', product);
			}
		);
		return cardView.render(product);
	});
	catalogView.render({ items: itms });
});

events.on('card:click', (event: IProduct) => {
	const cardView = new CardView(cloneTemplate('#card-preview'), events, () => {
		basketModel.add(event.id);
	});
	modal.render({ content: cardView.render(event) });
});

events.on('basket:change', renderBasket);

events.on('contacts:submit', () => {
	api
		.PostOrder({
			items: Array.from(basketModel.items.values()),
			address: paymentModel.address,
			payment: paymentModel.payment,
			phone: contactsModel.phone,
			email: contactsModel.email,
			total: basketModel.getTotal(catalogModel),
		})
		.then((r: TResponseOrder) => {
			//@ts-ignore
			modal.render({ content: successView.render({ total: r.total }) });
			contactsModel.reset();
            console.log('dfg')
			paymentModel.reset();
			basketModel.reset();
		});
});

events.on('successForm:okClick', () => {
	modal.close();
});

events.on('order:open', () => {
	const errors = paymentModel.validate();
	modal.render({
		content: paymentForm.render({
			payment: paymentModel.payment,
			address: paymentModel.address,
			errors: errors,
			valid: errors.length == 0,
		}),
	});
});

events.on('order:submit', () => {
	const errors = contactsModel.validate();
	modal.render({
		content: contactsForm.render({
			email: contactsModel.email,
			phone: contactsModel.phone,
			errors: errors,
			valid: errors.length == 0,
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IPayment; value: any }) => {
		const mixin = { [data.field]: data.value };
		Object.assign(paymentModel, mixin);
	}
);

events.on('payment:change', () => {
	const errors = paymentModel.validate();
	paymentForm.render({
		payment: paymentModel.payment,
		address: paymentModel.address,
		errors: errors,
		valid: errors.length == 0,
	});
});

events.on('contacts:change', () => {
	const errors = contactsModel.validate();
	contactsForm.render({
		email: contactsModel.email,
		phone: contactsModel.phone,
		errors: errors,
		valid: errors.length == 0,
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: any }) => {
		const mixin = { [data.field]: data.value };
		Object.assign(contactsModel, mixin);
	}
);
