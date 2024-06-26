import {
	IContacts,
	IEventEmiter,
	IEvents,
	IOrder,
	IPageView,
	IPayment,
	IProduct,
} from '../types';
import { CatalogModel } from './model/CatalogModel';
import { CatalogView } from './view/CatalogView';
import { Modal } from './common/Modal';
import { BasketModel } from './model/BasketModel';
import { PaymentModel } from './model/PaymentModel';
import { ContactsModel } from './model/ContactsModel';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { BasketView } from './view/BasketView';
import { PaymentForm } from './view/PaymentForm';
import { ContactsForm } from './view/ContactsForm';
import { SuccessView } from './common/Success';
import { CardView } from './view/CardView';
import { PageView } from './view/PageView';

export class Application {
	private catalogModel: CatalogModel;
	private catalogView: CatalogView;
	private basketModel: BasketModel;
	private paymentModel: PaymentModel;
	private contactsModel: ContactsModel;
	private paymentForm: PaymentForm;
	private contactsForm: ContactsForm;
	private successView: SuccessView;
	private modal: Modal;
	private basketView: BasketView;
	private currentCardView?: CardView;
	private pageView: IPageView;

	constructor(private events: IEventEmiter & IEvents) {
		this.catalogModel = new CatalogModel(events);
		this.catalogView = new CatalogView(events);
		this.basketModel = new BasketModel(events);
		this.paymentModel = new PaymentModel(events);
		this.contactsModel = new ContactsModel(events);
		this.paymentForm = new PaymentForm(events);
		this.contactsForm = new ContactsForm(events);
		this.successView = new SuccessView(events);
		this.pageView = new PageView(
			ensureElement<HTMLElement>('.page__wrapper'),
			events,
			() => {
				this.modal.render({
					content: this.renderBasket(),
				});
			}
		);
		this.modal = new Modal(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);
		this.basketView = new BasketView(cloneTemplate('#basket'), events);
	}

	renderBasket() {
		this.pageView.basketCount = this.basketModel.items.size;
		if (this.currentCardView) {
			this.currentCardView.render({
				disabledBuy: this.basketModel.items.has(this.currentCardView.id),
			});
		}

		return this.basketView.render({
			total: this.basketModel.getTotal(this.catalogModel),
			valid: this.basketModel.validation(this.catalogModel),
			items: Array.from(this.basketModel.items.values()).map((el, ind) => {
				const product = this.catalogModel.findProductById(el);
				const basketItemView = new CardView(
					cloneTemplate('#card-basket'),
					this.events,
					() => {
						this.basketModel.remove(product.id);
					}
				);
				return basketItemView.render({
					index: ind + 1,
					price: product.price,
					title: product.title,
				});
			}),
		});
	}

	updateCatalog(json: any) {
		this.catalogModel.items = json.items;
	}

	renderCatalog() {
		const itms = this.catalogModel.items.map((product) => {
			const cardView = new CardView(
				cloneTemplate('#card-catalog'),
				this.events,
				() => {
					this.events.emit('card:click', product);
				}
			);
			return cardView.render(product);
		});
		this.catalogView.render({ items: itms });
	}

	openCard(product: IProduct) {
		this.currentCardView = new CardView(
			cloneTemplate('#card-preview'),
			this.events,
			() => {
				this.basketModel.add(product.id);
			}
		);
		this.modal.render({
			content: this.currentCardView.render({
				...product,
				disabledBuy: this.basketModel.items.has(product.id),
			}),
		});
	}

	lockedWrapper() {
		this.pageView.scrollState = true;
	}

	unlockedWrapper() {
		this.pageView.scrollState = false;
	}

	buildOrder(): IOrder {
		return {
			items: Array.from(this.basketModel.items.values()),
			address: this.paymentModel.address,
			payment: this.paymentModel.payment,
			phone: this.contactsModel.phone,
			email: this.contactsModel.email,
			total: this.basketModel.getTotal(this.catalogModel),
		};
	}

	renderAnswer(total: number) {
		this.modal.render({ content: this.successView.render({ total: total }) });
		this.contactsModel.reset();
		this.paymentModel.reset();
		this.basketModel.reset();
	}

	closeModal() {
		this.modal.close();
	}

	openPayment() {
		this.modal.render({ content: this.renderPayment() });
	}

	openContacts() {
		this.modal.render({ content: this.renderContacts() });
	}

	updatePayment(field: keyof IPayment, value: any) {
		const mixin = { [field]: value };
		Object.assign(this.paymentModel, mixin);
	}

	renderPayment(): HTMLElement {
		const errors = this.paymentModel.validate();
		return this.paymentForm.render({
			payment: this.paymentModel.payment,
			address: this.paymentModel.address,
			errors: errors,
			valid: errors.length == 0,
		});
	}

	renderContacts(): HTMLElement {
		const errors = this.contactsModel.validate();
		return this.contactsForm.render({
			email: this.contactsModel.email,
			phone: this.contactsModel.phone,
			errors: errors,
			valid: errors.length == 0,
		});
	}

	updateContacts(field: keyof IContacts, value: any) {
		const mixin = { [field]: value };
		Object.assign(this.contactsModel, mixin);
	}
}
