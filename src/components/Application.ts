import { IEventEmiter, IEvents } from '../types';
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
	private basketButton: HTMLButtonElement;
	private basketView: BasketView;

	private container: HTMLElement;

	constructor(private events: IEventEmiter & IEvents) {
		this.catalogModel = new CatalogModel(events);
		this.catalogView = new CatalogView(events);
		this.basketModel = new BasketModel(events);
		this.paymentModel = new PaymentModel(events);
		this.contactsModel = new ContactsModel(events);
		this.paymentForm = new PaymentForm(events);
		this.contactsForm = new ContactsForm(events);
		this.successView = new SuccessView(events);

		this.modal = new Modal(this.container, events);
		const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this.basketView = new BasketView(this.container, events);
	}

	renderBasket() {
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
        this.catalogModel.items = json.items
    }
}
