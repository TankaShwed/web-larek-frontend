//cв-ва одного товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

//интерфейс отображения
export interface IViewConstructor {
	new (constructor: HTMLElement, events?: IEventEmiter): IView; //на выходе контейнер, в него выводить
}

export interface IView {
	render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}

//PRODUCTS(CATALOG)
export interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void; // чтобы установить после загрузки из апи
	getProduct(id: string): IProduct; // чтобы получить при рендере списков
}

//BASKET
export interface IBasketModel {
	items: Map<string, number>;
	add(id: string): void;
	remove(id: string): void;
}

//ORDER
export interface IOrder {
	payment: string;
	email: string;
	phone: number;
	address: string;
	total: number;
	items: string[];
}

//ответ от сервера
export type TResponseProductList = {
	total: number;
	items: IProduct[];
};

//При запросе списка всех продуктов, состоит из количества подуктов и массива самих продуктов
export type TResponseProductItem = IProduct | { error: 'NotFound' };

//По id ищет какой-то конкретный продукт или получает ошибку о том что продукт не найден
export type TResponseOrder = { id: string; total: number } | { error: string };

// export type TUser = Pick<IOrder, 'email' | 'phone'>;
