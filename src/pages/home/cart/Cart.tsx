import React from 'react';
import { ICartProps, IWithPrice } from './cart.types';
import styles from './Cart.module.scss';

export const Cart: React.FC<ICartProps> = ({ items = [], clear }) => {

	const getTotalPrice = (): number => items.reduce((
		memo: number,
		item: IWithPrice,
	) => memo + item.price, 0);

	return (
		<div {...{ className: styles.wrapper }}>
			<span>Total count: <strong>{items.length}</strong>, Total price: <strong>{getTotalPrice()}</strong></span>
			<button {...{
				onClick: clear,
				disabled: items.length === 0,
			}}>
				Clear
			</button>
		</div>
	);
};
