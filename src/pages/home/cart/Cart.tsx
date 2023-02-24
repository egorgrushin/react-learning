import React from 'react';
import { ICartProps, IWithPrice } from './cart.types';
import styles from './Cart.module.scss';
import classNames from 'classnames';

export const Cart: React.FC<ICartProps> = ({ items = [], clear, className }) => {

	const getTotalPrice = (): number => items.reduce((
		memo: number,
		item: IWithPrice,
	) => memo + item.price, 0);

	return (
		<div {...{ className: classNames(styles.wrapper, className) }}>
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
