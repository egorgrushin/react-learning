import React from 'react';
import { IListOptions } from './List.types';
import styles from './ListItem.module.scss';

export const ListItem = ({ item, options, isSelected, onClick, template }: {
	item: any,
	options: IListOptions,
	isSelected?: boolean,
	onClick?: () => void,
	template?: (item: any) => void,
}) => {
	const text = item[options.displayProp];
	const activeClassName = isSelected ? styles.active : '';
	const selectableClassName = options.selectable ? styles.selectable : '';
	return <div {...{
		className: [styles.item, activeClassName, selectableClassName].join(' '),
		onClick,
	}}>
		{template ? template(item) : text}
	</div>;
};
