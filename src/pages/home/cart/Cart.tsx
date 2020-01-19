import React from 'react';
import { IWithPrice } from './cart.types';
import { memoize } from 'lodash';
import styles from './Cart.module.scss';

export const Cart = ({ items = [], clear }: { items: IWithPrice[], clear: () => void }) => {

	const getTotalPrice = memoize(() => items.reduce((memo: number, item: IWithPrice) => memo + item.price, 0));

	return (
		<div {...{ className: styles.wrapper }}>
			<span>Total count: <strong>{items.length}</strong>, Total price: <strong>{getTotalPrice()}</strong></span>
			<button {...{
			    onClick: clear,
				disabled: items.length === 0
			}}>Clear</button>
		</div>
	);
};
