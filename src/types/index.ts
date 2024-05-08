//cв-ва одного товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: number;
    address: string;
    total: number;
    items: string[];
}



//
export type TResponseProductList = {
    total: number;
    items: IProduct[];
}

//При запросе списка всех продуктов, состоит из количества подуктов и массива самих продуктов
export type TResponseProductItem = IProduct | {error: "NotFound"};

//По id ищет какой-то конкретный продукт или получает ошибку о том что продукт не найден
export type TResponseOrder = IOrder | {error: string};

// export type TUser = Pick<IOrder, 'email' | 'phone'>;
