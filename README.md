# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Основные части проекта

Проект состоит из 6 основных экранов:

1 Таблица карточек (категория, название, картинка, цена). На каждую можно нажать.

2 Карточка открывается в модальном окне с подробным описанием и кнопкой: купить. После добавления товара в корзину кнопка меняется на: В корзину.

3 Модальное окно: корзина. В ней списком отображаются товары (название и цена). Каждый товар можно удалить, (увеличить или уменьшить количеств). Отображается сумма всех товаров. Есть кнопка: оформить.

4 При оформлении товара открывается новое модальное окно с выбором способа оплаты (безналичный расчет или наличные) и введением адреса доставки. При введении данных активируется кнопка "Далее".

5 При переходе кнопки Далее открывается модально окно, где пользователь вводит личные данные:  email и телефон. После того как будут введены корректно данные становится активной кнопка оплатить. 

6 Модальное окно: заказ оформлен. Есть кнопка: за новыми покупками (переход на главную).

## Базовый код

1 класс Api

В конструктор принимеается базовый урл. Класс имеет методы get и post, которые делают запросы на сервер. Предпологается что наследник будет вызывать get и post с указанием конкретного uri и передавать данные.

```
class Api {
	readonly baseUrl: string;
	protected options: RequestInit;
	constructor(baseUrl: string, options: RequestInit = {}) 
	protected handleResponse(response: Response): Promise<object> 
	get(uri: string) 
	post(uri: string, data: object, method: ApiPostMethods = 'POST') 
}
```

2 класс Component<T>

Код в конструкторе исполняется до всех объявлений в дочернем классе.
Абстрактный класс для компонентов отображения(view), является дженериком, принимает контейнер является корневым DOM элементом разметки за которую отвечает конкретный компонент отоброжения, то есть от него наследуются все компоненты отображения.
Имеет инструменты для работы с DOM в компонентах:
    - setText устанавливает текстовое содержимое
setDisabled, sethidden, setvisible,setImage, render).

```
abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement)
	toggleClass(element: HTMLElement, className: string, force?: boolean)
	protected setText(element: HTMLElement, value: unknown)
	setDisabled(element: HTMLElement, state: boolean) 
	protected setHidden(element: HTMLElement) 
	protected setVisible(element: HTMLElement) 
	protected setImage(element: HTMLImageElement, src: string, alt?: string) 
	render(data?: Partial<T>): HTMLElement 
}

```

//добавить описание работы компонента

Object.Assign

3 класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Класс имеет методы on ,  off ,  emit  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех подписчиков.
Интересным дополнением является метод  trigger , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса  EventEmitter . 
События идентифицируется по строке. Строка содержит описание инициатора события и действия которое произошло. Например если на форме с атрибуттом "name" происходит изменения поля ввода "email" тогда стригериться события "contacts.email:change".

```
class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>
	constructor() 
	on<T extends object>(eventName: EventName, callback: (event: T) => void) 
	off(eventName: EventName, callback: Subscriber) 
	emit<T extends object>(eventName: string, data?: T) 
	onAll(callback: (event: EmitterEvent) => void) 
	offAll() 
	trigger<T extends object>(eventName: string, context?: Partial<T>) 
}
```

4 класс Model<T> 

Является базовым классом для моделей. Нужен чтобы получить данные и уведомлять что данные поменялись.
Абстрактный класс является дженериком и принимает в переменной T тип данных в
конструктор.

```
abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents)
	emitChanges(event: string, payload?: object) 
}
```

## Компоненты модели данных (бизнес-логика)

1 класс BasketModel

Содержит id товаров, которые были добавлены в корзину и их количество.
Реализует интерфейс IBasketModel. Наследуется от Model.

Ключевые методы: add, remove - позволяет добавить товар и убавить.

```
class BasketModel extends Model<{ items: Map<string, number> }>
    implements IBasketModel
	items: Map<string, number>;
	constructor(events: IEvents)
	add(id: string): void
	remove(id: string): void
}
```

2 класс CatalogModel

Содержит продукты полученные с сервера.
Реализует интерфейс ICatalogModel.

Ключевые методы: setItems, getProduct - позволяют получить продукт по id этого продукта, он тригерит события в момент выставления items, по факту когда придут данные с сервера.

```
class CatalogModel implements ICatalogModel {
	items: IProduct[];
	constructor(protected events: IEventEmiter)
	protected _changed() 
	setItems(items: IProduct[]): void 
	getProduct(id: string): IProduct 
}
```
3 класс ContactsModel

```
class ContactsModel extends Model<IContacts> {
	private _email: string;
	private _phone: string;
	private static getDefault(): IContacts {}
	constructor() 
	validate()

    set email()
    set phone()
	get email()
	get phone()

}
```

4 класс PaymentModel

```
export class PaymentModel extends Model<IPayment> {
	private _payment: TPaymentMethod;
	private _address: string;
	private static getDefault(): IPayment {
		return { payment: 'card', address: '' }
	}
	constructor(events: IEvents) {}
	validate()
	set payment(value: TPaymentMethod)
	set address(value: string) 
	get payment()
	get address()
}
```

## Коммуникация

класс MarketAPI

Слой коммуникации с сервером который находится перед слоем модели

```
class MarketAPI extends Api {
	GetProductList(): Promise<TResponseProductList> 
	GetProductItem(id: string): Promise<TResponseProductItem> 
	PostOrder(order: IOrder): Promise<TResponseOrder> 
}
```

## Компоненты представления

1 класс BasketView

Отображение корзины целиком. Получает массив срендеренных элементов от BasketItemView. 
Ловит нажатие кнопки оформить заказ. Тригерит событие оформления заказа.

```
export class BasketView extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	constructor(protected events: EventEmitter)
	set items(items: HTMLElement[])
	set selected(items: string[])
	set total(total: number)
}
```

2 класс CardView

Отображает одну открытую карточку и ловит событие добавить в корзину. Будет использоваться в модальном окне. 

```
class CardView extends Component<IProduct> {
    protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
    protected _image: HTMLElement;
	protected _price: HTMLElement;
	constructor(protected events: IEventEmiter)
	set category(value: string)
	set title(value: string)
    set description(value: string)
    set image(value: string)
    set price(value: number)
}
```

3 класс CatalogView

Отображается на главной странице. Переопределяем рендер из базового класса так чтобы шаблон дублировать для каждого item. Ловит события нажатия на карточку.

```
class CatalogView extends Component<{ items: IProduct[] }> {
	constructor(private events: IEventEmiter) 
	render(data?: { items: IProduct[] }): HTMLElement
}
```

4 класс ContactsForm

Отображает модальное окно с вводом контактов заказчика: email, phone.

```
class ContactsForm extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(events: IEvents) 
	set adress(value: string) 
	set email(value: string) 
}

```

5 класс PageView

```
class PageView extends Component<IPageView> {
	//container это враппер всей страницы
	private _basketCount: HTMLSpanElement;

	constructor(
		container: HTMLElement,
		protected events: IEventEmiter,
		onBasketClick: () => void
	) {
		super(container);
		this._basketCount = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			this.container
		);
		const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		basketButton.addEventListener('click', onBasketClick);
	}

	set basketCount(value: number) {
		this.setText(this._basketCount, value.toString());
	}

	set scrollState(value: boolean) {
		this.toggleClass(this.container, 'page__wrapper_locked', value);
	}
}
```


6 класс PaymentForm

Отображает модальное окно с вводом адреса заказчика и выбором способа оплаты (card/cash). 

```
class PaymentForm extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	constructor(events: IEvents) 
	set adress(value: string) 
	set payment(value: TPaymentMethod)
}
```

## Базовые интерфейсы и типы

```
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

```
interface IOrder {
    id: string;
    total: number;
}
```

```
interface IOrderForm {
	payment: TPaymentMethod;
	address: string;
}
```

```
interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}
```

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

```
interface IModalData {
    content: HTMLElement ;
}
```

```
interface ISuccess {
	total: number;
}
```


```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```

```
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

```
interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void; // чтобы установить после загрузки из апи
	getProduct(id: string): IProduct; // чтобы получить при рендере списков
}
```

```
interface IBasketModel {
	items: Map<string, number>;
	add(id: string): void;
	remove(id: string): void;
}
```

Вариант ответов от сервера:

```
type TResponseProductList = {
    total: number;
    items: IProduct[];
}
```

При запросе списка всех продуктов, состоит из количества подуктов и массива самих продуктов.

```
type TResponseProductItem = IProduct | {error: "NotFound"};
```

По id ищет какой-то конкретный продукт или получает ошибку о том что продукт не найден.

```
type TResponseOrder = IOrder | {error: string};
```

```
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

type TPaymentMethod = 'card' | 'cash';

type TPaymentErrors = {
	payment?: string;
	address?: string;
};

type TContactsErrors = {
	email?: string;
	phone?: string;
};
```