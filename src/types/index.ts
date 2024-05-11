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
    selected: string[];
}

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

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

export type TPaymentMethod = 'card' | 'cash';

export type TPaymentErrors = {
	payment?: string;
	address?: string;
};

export type TContactsErrors = {
	email?: string;
	phone?: string;
};

//ORDER
export interface IOrder {
	payment: TPaymentMethod;
	email: string;
	phone: number;
	address: string;
	total: number;
	items: string[];
	valid: boolean;
	errors: string[];
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
