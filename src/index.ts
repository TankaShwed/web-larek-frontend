import './scss/styles.scss';

import { MarketAPI } from './components/MarketAPI';
import { EventEmitter } from './components/base/events';
import { IContacts, IPayment } from './types';
import { IProduct, TResponseOrder } from './types';
import { API_URL } from './utils/constants'
import { Application } from './components/Application';

const api = new MarketAPI(API_URL);
const events = new EventEmitter();
const application = new Application(events);

api
	.GetProductList()
	.then((json) => application.updateCatalog(json))
	.catch((err) => console.error(err));

events.on('catalog:change', () => {
	application.renderCatalog();
});

events.on('card:click', (event: IProduct) => {
	application.openCard(event);
});

events.on('basket:change', () => {
	application.renderBasket();
});

events.on('contacts:submit', () => {
	api.PostOrder(application.buildOrder()).then((r: TResponseOrder) => {
		//@ts-ignore
		application.renderAnswer(r.total);
	});
});

events.on('successForm:okClick', () => {
	application.closeModal();
});

events.on('order:open', () => {
	application.openPayment();
});

events.on('order:submit', () => {
	application.openContacts();
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IPayment; value: any }) => {
        application.updatePayment(data.field, data.value);
	}
);

events.on('payment:change', () => {
	application.renderPayment();
});

events.on('contacts:change', () => {
	application.renderContacts();
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: any }) => {
		application.updateContacts(data.field, data.value);
	}
);

events.on('modal:open', ()=>{
    application.lockedWrapper();
});

events.on('modal:close', ()=>{
    application.unlockedWrapper();
})