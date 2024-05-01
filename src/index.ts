import { EventEmitter } from './components/base/events';
import './scss/styles.scss';

// добавление или удаление количества товара в корзине
interface IBasketModel {
	items: Map<string, number>;
	add(id: string): void;
	remove(id: string): void;
}

interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

class BasketModel implements IBasketModel {
	constructor(protected events: IEventEmiter) {}

	protected _changed() {
		// метод генерирующий уведомление об изменении
		this.events.emit('basket:change', { item: Array.from(this.items.keys()) });
	}

	add(id: string): void {
		// ...
		this._changed();
	}
	remove(id: string): void {
		// ...
		this._changed();
	}
}

const events = new EventEmitter();

const basket = new BasketModel(events);

events.on('basket:change', (data: { items: string[] }) => {
	//выводить куда-то
});


//модель товаров находящихся в карзине?
interface CatalogModel {
    items: IProduct[];
    setItems(items; IProduct[]): void;  // чтобы установить после загрузки из апи
    getProduct(id: string): IProduct;  // чтобы получить при рендере списков
}

//интерфейс отображения
interface IViewConstructor {
    new (constructor: HTMLElement, events?: IEventEmiter): IView; //на выходе контейнер, в него выводить
}

interface IView {
    render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}