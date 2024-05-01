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

	protected _changed() {  // метод генерирующий уведомление об изменении
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

// class BasketModel implements IBasketModel {
// 	items: Map<string, number> = new Map();

// 	add(id: string): void {
// 		if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
// 		this.items.set(id, this.items.get(id)! + 1); // прибавляем количество
// 	}
// 	remove(id: string): void {
// 		if (!this.items.has(id)) return; //если нет, тот и делать с ним нечего
// 		if (this.items.get(id)! > 0) {  // если есть т больше нуля то
// 			this.items.set(id, this.items.get(id)! - 1); // уменьшить
// 			if (this.items.get(id) === 0) this.items.delete(id); // если опустили до нуля то удалить
// 		}
// 	}
// }

