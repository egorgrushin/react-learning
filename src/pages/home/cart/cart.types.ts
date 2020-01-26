export interface ICartProps {
	items: IWithPrice[];
	clear: () => void;
	className?: string;
}

export interface IWithPrice {
	price: number;
}
