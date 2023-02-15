import { IListOptions } from './List.types';
import { ReactNode } from 'react';

export interface IListItemProps<T = any> {
	item: T;
	options: IListOptions;
	itemTemplate: (item: T) => ReactNode;
	isSelected?: boolean;
	onClick?: () => void;
}
