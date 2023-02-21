export interface ICartProps {
	items: IWithPrice[];
	clear: () => void;
}

export interface IWithPrice {
	price: number;
}
