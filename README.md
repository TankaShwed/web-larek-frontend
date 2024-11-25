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

----

## Установка и запуск

----

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

----

## Сборка

----

```
npm run build
```

или

```
yarn build
```

----

## Основные части проекта

----

Проект состоит из 6 основных экранов:

1 Таблица карточек (категория, название, картинка, цена). На каждую можно нажать.

2 Карточка открывается в модальном окне с подробным описанием и кнопкой: купить. После добавления товара в корзину кнопка меняется на: В корзину.

3 Модальное окно: корзина. В ней списком отображаются товары (название и цена). Каждый товар можно удалить, (увеличить или уменьшить количеств). Отображается сумма всех товаров. Есть кнопка: оформить.

4 При оформлении товара открывается новое модальное окно с выбором способа оплаты (безналичный расчет или наличные) и введением адреса доставки. При введении данных активируется кнопка "Далее".

5 При переходе кнопки Далее открывается модально окно, где пользователь вводит личные данные:  email и телефон. После того как будут введены корректно данные становится активной кнопка оплатить. 

6 Модальное окно: заказ оформлен. Есть кнопка: за новыми покупками (переход на главную).

----

## Базовый код

----

### класс Api

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

### класс Component```<T>```

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

### класс EventEmitter

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

### класс Model```<T>```

Является базовым классом для моделей. Нужен чтобы получить данные и уведомлять что данные поменялись.
Абстрактный класс является дженериком и принимает в переменной T тип данных в
конструктор.

```
abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents)
	emitChanges(event: string, payload?: object) 
}
```

----

## Компоненты модели данных

----

### класс BasketModel

Содержит id товаров, которые были добавлены в корзину и их количество.
Реализует интерфейс IBasketModel. Наследуется от Model```<IBasket>``` .

Ключевые методы: 
+ add() - добавляет товар
+ remove() - убирает товар
+ reset() - сбрасывает корзину, фактически удляет товары
+ getTotal() - получает общую сумму товаров
+ validation() - проверка можно ли формить заказ по товару(в случае бесценного товара заказ оформить не получится)

```
class BasketModel extends Model<IBasket> implements IBasketModel
	items: Set<string>
    private static getDefault(): IBasket
	constructor(events: IEvents)
    reset()
    getTotal(catalog: ICatalogModel): number | null
    validation(catalog: ICatalogModel): boolean
	add(id: string): void
	remove(id: string): void
}
```

### класс CatalogModel

Содержит полученные продукты(товары).
Реализует интерфейс ICatalogModel.

Ключевые методы: 
+ set items() - устанавливает список продуктов
+ get items() - возвращает список продуктотв
+ findProductById() - получает продукт по id
    
```
class CatalogModel implements ICatalogModel {
	private _items: IProduct[]
	constructor(protected events: IEventEmiter)
	set items(items: IProduct[])
    get items()
    findProductById(id: string)
}
```

### класс ContactsModel

Содержит контакты покупателя.
Наследуется от Model```<IContacts>``` .

Ключевые методы: 
+ reset() - брасывает данные, фактически удляет их
+ validate() - проверяет заполнены ли email и телефон 
+ set email() - устанавливает email покупателя
+ set phone() - устанавливает телефон покупателя
+ get email() - возвращает email
+ get phone() - возвращает телефон 

```
class ContactsModel extends Model<IContacts> {
	private _email: string;
	private _phone: string;
	private static getDefault(): IContacts
	constructor(events: IEvents)
    reset()
	validate(): string[]
    set email(value: string)
    set phone(value: string)
	get email(): string
	get phone(): string
}
```

### класс PaymentModel

Содержит id товаров, которые были добавлены в корзину и их количество.
Наследуется от Model```<IPayment>``` .

Ключевые методы: 
+ reset() - брасывает данные, фактически удляет их
+ validate() - проверяет заполнены ли адрес и выбрана оплата 
+ set payment() - устанавливает тип оплаты
+ set address() - устанавливает адрес покупателя
+ get payment() - возвращает тип оплаты
+ get address() - возвращает адрес 

```
class PaymentModel extends Model<IPayment> {
	private _payment: TPaymentMethod
	private _address: string
	private static getDefault(): IPayment
	constructor(events: IEvents)
    reset()
	validate(): string[]
	set payment(value: TPaymentMethod)
	set address(value: string) 
	get payment(): TPaymentMethod
	get address(): string
}
```

----

## Коммуникация

----

### класс MarketAPI

Слой коммуникации с сервером который находится перед слоем модели. Наследуется от базового Api.

Ключевые методы: 
+ GetProductList() - получает список товаров
+ GetProductItem() - получает товар  по id
+ PostOrder() - отправляет заказ

```
class MarketAPI extends Api {
	GetProductList(): Promise<TResponseProductList> 
	GetProductItem(id: string): Promise<TResponseProductItem> 
	PostOrder(order: IOrder): Promise<TResponseOrder> 
}
```

----

## Презентер

----

### класс Application
Отвечает за связь между моделями и компонентами представления

Ключевые методы: 
+ renderBasket() - отрисовка карзины на базе её модели
+ updateCatalog() - обновляет продукт в модели 
+ renderCatalog() - на базе изменения модели отображает каталог на странице
+ openCard() - открывает карточку
+ lockedWrapper() - блокирует прокрутку страницы при открытии модального окна
+ unlockedWrapper() - разблокирует прокрутку страницы при закрытии модального окна
+ buildOrder() - собирает заказ из моделей
+ renderAnswer() - показывает модальное окно успешного заказа от сервера
+ closeModal() - закрытие модального окна
+ openPayment() - отткрывает форму с выбором оплаты
+ openContacts() - открывает форму с вводом контактов
+ updatePayment() - обновляет данные выбора оплаты у инпутов в соответсвии с изменением модели
+ renderPayment() - открывает форму со способом оплаты
+ renderContacts() - открывает форму с контактами
+ updateContacts() - обновляет данные контактов у инпутов в соответсвии с изменением модели


```
class Application {
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

	constructor(private events: IEventEmiter & IEvents) 
	renderBasket() 
	updateCatalog(json: any) 
	renderCatalog() 
	openCard(product: IProduct) 
	lockedWrapper() 
	unlockedWrapper() 
	buildOrder(): IOrder 
	renderAnswer(total: number)
	closeModal() 
	openPayment() 
	openContacts()
	updatePayment(field: keyof IPayment, value: any)
	renderPayment(): HTMLElement 
	renderContacts(): HTMLElement
	updateContacts(field: keyof IContacts, value: any)
}
```

----

## Компоненты представления

----

### класс BasketView

Отображение корзины целиком. Получает массив срендеренных элементов от BasketItemView. 
Ловит нажатие кнопки оформить заказ. Тригерит событие оформления заказа.

Ключевые методы: 
+ set items() - отображает список продуктов
+ set valid() - переключает состояние кнопки "Оформить"
+ set total() - отображает общую сумму заказа


```
class BasketView extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	constructor(protected container: HTMLElement, protected events: IEventEmiter)
	set items(items: HTMLElement[])
	set valid(value: boolean)
	set total(total: number)
}
```

### класс CardView

Отображает одну открытую карточку и ловит событие добавить в корзину. Будет использоваться в модальном окне. 
Наследуется от ```Component<IProduct & { index?: number, disabledBuy?: boolean} >```

Ключевые методы: 
+ set disabledBuy(value: boolean) - если карточка товара уже в корзине то кнопка купить товар блокируется
+ set title(value: string) - отображает заголовок
+ set price(value: number | null) - отображает цену товара
+ set description(value: string) - отображает описание товара
+ set category(value: string) - отображает категорию товара
+ set image(value: string) - отображает картинку товара
+ set index(value: number) - отображает в корзине порядковый номер


```
class CardView extends Component<IProduct & { index?: number, disabledBuy?: boolean} > {
    private _index?: HTMLElement;
	private _title: HTMLElement;
	private _price: HTMLElement;
	private _description?: HTMLElement;
	private _image?: HTMLImageElement;
	private _category?: HTMLElement;
	private _button: HTMLElement;
	id: string;
    constructor(
		container: HTMLElement,
		protected events: IEventEmiter,
		onClick: () => void
	)
    set disabledBuy(value: boolean)
	set title(value: string)
    set price(value: number | null)
    set description(value: string)
    set category(value: string)
    set image(value: string)
    set index(value: number)
}
```

### класс CatalogView

Отображается на главной странице. Переопределяем рендер из базового класса так чтобы шаблон дублировать для каждого item. Ловит события нажатия на карточку.
Наследуется от ```Component<{ items: HTMLElement[] }>```

Ключевые методы: 
+ set items() - отображает каталог товаров


```
class CatalogView extends Component<{ items: HTMLElement[] }> {
	constructor(private events: IEventEmiter) 
	set items(value: HTMLElement[])
}
```

### класс ContactsForm

Отображает модальное окно с вводом контактов заказчика: email, phone.
Наследуется от ```Form<IContacts>```

Ключевые методы: 
+ set phone() - отображает значениев поля телефон
+ set email() - отображает значение поля email


```
class ContactsForm extends Form<IContacts> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(events: IEvents) 
	set phone(value: string) 
	set email(value: string) 
}

```

### класс PageView

Отображение элементов главной страницы
Наследуется от ```Component<IPageView>```

Ключевые методы: 
+ set basketCount() - количество отоваров
+ set scrollState() - блокировка прокрутки страницы при открытии модаольного окна

```
class PageView extends Component<IPageView> {
	private _basketCount: HTMLSpanElement;
	constructor(
		container: HTMLElement,
		protected events: IEventEmiter,
		onBasketClick: () => void
	)
	set basketCount(value: number)
	set scrollState(value: boolean)
}
```

### класс PaymentForm

Отображает модальное окно с вводом адреса заказчика и выбором способа оплаты (card/cash). 
Наследуется от ```Form<IPayment>```

Ключевые методы: 
+ set adress() - отображает значения поля адрес
+ set payment() - отображает значение оплаты


```
class PaymentForm extends Form<IPayment> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	constructor(events: IEvents) 
	set adress(value: string) 
	set payment(value: TPaymentMethod)
}
```

----

## Базовые интерфейсы и типы

----

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
interface IBasket {
	items: Set<string>;
}
```

```
interface IBasketView {
    items: HTMLElement[];
    total: number |null;
    valid: boolean;
}
```

```
interface IPageView {
	set basketCount(value: number);
	set scrollState(value: boolean);
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
	findProductById(id: string): IProduct; // чтобы получить при рендере списков
}
```

```
interface IBasketModel {
	items: Set<string>;
	add(id: string): void;
	remove(id: string): void;
	getTotal(catalog: ICatalogModel): number|null;
}
```

```
interface IContacts{
	phone: string;
	email: string;
}
```

```
interface IPayment{
	payment: TPaymentMethod;
	address: string;
}
```

```
interface IOrder extends IContacts, IPayment {
	total: number;
	items: string[];
}
```

```
interface IOrderForm {
	payment: TPaymentMethod;
	address: string;
}
```

```
type TResponseProductList = ApiListResponse<IProduct>;
```

При запросе списка всех продуктов, состоит из количества подуктов и массива самих продуктов
```
type TResponseProductItem = IProduct | { error: 'NotFound' };
```

По id ищет какой-то конкретный продукт или получает ошибку о том что продукт не найден
```
type TResponseOrder = { id: string; total: number } | { error: string };
```

```
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};
```

```
type TPaymentMethod = 'card' | 'cash';
```
