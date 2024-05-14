import { ApiListResponse } from "../components/base/api";

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

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement ;
}

export interface ISuccess {
	total: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

//PRODUCTS(CATALOG)
export interface ICatalogModel {
	items: IProduct[];
	findProductById(id: string): IProduct; // чтобы получить при рендере списков
}

//BASKET
export interface IBasketModel {
	items: Set<string>;
	add(id: string): void;
	remove(id: string): void;
	getTotal(catalog: ICatalogModel): number|null;
}

export interface IContacts{
	phone: string;
	email: string;
}

export interface IPayment{
	payment: TPaymentMethod;
	address: string;
}

//ORDER
export interface IOrder extends IContacts, IPayment {
	total: number;
	items: string[];
}

export interface IOrderForm {
	payment: TPaymentMethod;
	address: string;
}

//ответ от сервера
export type TResponseProductList = ApiListResponse<IProduct>;

//При запросе списка всех продуктов, состоит из количества подуктов и массива самих продуктов
export type TResponseProductItem = IProduct | { error: 'NotFound' };

//По id ищет какой-то конкретный продукт или получает ошибку о том что продукт не найден
export type TResponseOrder = { id: string; total: number } | { error: string };

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export type TPaymentMethod = 'card' | 'cash';
