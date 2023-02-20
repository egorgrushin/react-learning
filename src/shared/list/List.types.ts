import { Id, ILoadingState } from '../../core.types';
import { ReactNode } from 'react';

export interface IListProps<T = any> {
	items: T[] | undefined;
	options?: Partial<IListOptions>;
	loadingState?: ILoadingState;
	selected?: Id[];
	onSelect?: (item: T) => void;
	onSelectedChange?: (selected: Id[], item: T, value: boolean) => void;
	itemTemplate: (item: T) => ReactNode;
	className?: string;
}

export interface IListOptions {
	keyProp: string;
	selectable?: boolean;
	multi?: boolean;
}
