import React from 'react';
import styles from './ListItem.module.scss';
import { IListItemProps } from './ListItem.types';
import classNames from 'classnames';

export const ListItem: React.FC<IListItemProps> = ({ item, options, isSelected, onClick, itemTemplate }) => {
	const activeClassName = isSelected ? styles.active : '';
	const selectableClassName = options.selectable ? styles.selectable : '';
	return <div {...{
		className: classNames(styles.item, activeClassName, selectableClassName),
		onClick,
	}}>
		{itemTemplate(item)}
	</div>;
};
