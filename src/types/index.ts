interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

type TResponseProductList = {
    total: number;
    items: IProduct[];
}

type TResponseProductItem = IProduct | {error: "NotFound"};

interface IOrder {
    id: string;
    total: number;
}

type TResponseOrder = IOrder | {error: string};
