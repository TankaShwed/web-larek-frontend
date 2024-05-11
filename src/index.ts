import './scss/styles.scss';

import { MarketAPI } from './components/MarketAPI';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { EventEmitter } from './components/base/events';
import { IBasketModel, IEventEmiter, IProduct, IView } from './types';
import { API_URL } from './utils/constants';
import { CardView } from './components/Card';
import { Modal } from './components/common/Modal';
import { BasketModel } from './components/BasketModel';
import { ensureElement } from './utils/utils';
import { BasketView } from './components/BasketView';
import { BasketItemView } from './components/BasketItemView';

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
                basketItemView.setProduct(catalogModel.getProduct(el[0]))
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
	gallery.append(catalogView.render(event));
});

const basketModel = new BasketModel(events);

//Card
const card = new CardView(events);

events.on('card:click', (event: IProduct) => {
	// renderBasket(event.items);
	modal.render({ content: card.render(event) });
});

events.on('card:addToBasket', (product: IProduct) => {
	basketModel.add(product.id);
});

//Basket
// const basketView = new BasketView(document.querySelector('.basket'), events);
// const basket = new BasketModel(events);
// class BasketModel implements IBasketModel {
// 	constructor(protected events: IEventEmiter) {}
// 	items: Map<string, number>;

// 	protected _changed() {
// 		// метод генерирующий уведомление об изменении
// 		this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
// 	}

// 	add(id: string): void {
// 		// ...
// 		this._changed();
// 	}
// 	remove(id: string): void {
// 		// ...
// 		this._changed();
// 	}
// }

// class BasketItemView implements IView {
// 	// элементы внутри контейнера
// 	protected title: HTMLSpanElement;
// 	protected addButton: HTMLButtonElement;
// 	protected removeButton: HTMLButtonElement;

// 	// данные, которые хотим сохранить на будущее
// 	protected id: string | null = null;

// 	constructor(
// 		protected container: HTMLElement,
// 		protected events: IEventEmiter
// 	) {
// 		//инициализируем, чтобы не искать повторно
// 		this.title = container.querySelector(
// 			'.basket-item__title'
// 		) as HTMLSpanElement;
// 		this.addButton = container.querySelector(
// 			'.basket-item__add'
// 		) as HTMLButtonElement;
// 		this.removeButton = container.querySelector(
// 			'.basket-item__remove'
// 		) as HTMLButtonElement;

// 		//устанавливаем события
// 		this.addButton.addEventListener('click', () => {
// 			//генерируем событие в нашем брокере
// 			this.events.emit('ui:basket-add', { id: this.id });
// 		});

// 		this.addButton.addEventListener('click', () => {
// 			this.events.emit('ui:basket-remove', { id: this.id });
// 		});
// 	}

// 	render(data: { id: string; title: string }) {
// 		if (data) {
// 			this.id = data.id; //если есть новые данные; то запоминаем их
// 			this.title.textContent = data.title; //и выведем в интерфейс
// 		}
// 		return this.container;
// 	}
// }

// class BasketView implements IView {
// 	constructor(protected container: HTMLElement) {}
// 	render(data: { item: HTMLElement[] }) {
// 		if (data) {
// 			this.container.replaceChildren(...data.item);
// 		}
// 		return this.container;
// 	}
// }

//можно собрать в функции или классе отдельные экраны с логикой их формирования
// function renderBasket(items: string[]) {
//     basketView.render(
//         items.map(id => {
//             const itemView = new BasketItemView(events);
//             return itemView.render(catalogModel.getProduct(id));
//         })
//     );
// }

// //при изменении рендерим
// events.on('basket:change', (event: { items: string[] }) => {
// 	// renderBasket(event.items);
// });

// events.on('basket:change', (data: { items: string[] }) => {
// 	//выводить куда-то
// });

// //при действия изменяем модель, а после этого случится рендер
// events.on('ui:basket-add', (event: { id: string }) => {
// 	basketModel.add(event.id);
// });

// events.on('ui:basket-remove', (event: { id: string }) => {
// 	basketModel.remove(event.id);
// });
