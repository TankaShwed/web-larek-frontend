interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface IOrder {
    payment: string;
    email: string;
    phone: number;
    address: string;
    total: number;
    items: string[];
}

type TResponseProductList = {
    total: number;
    items: IProduct[];
}

type TResponseProductItem = IProduct | {error: "NotFound"};

type TResponseOrder = {id: string, total: number} | {error: string};

