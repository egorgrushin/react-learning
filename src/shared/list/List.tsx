import React from 'react';
import { IListOptions } from './List.types';
import { ListItem } from './ListItem';
import { defaultsDeepSafe, getSelectedMap } from '../../helpers/objects';
import styles from './List.module.scss';
import { Id, ILoadingState } from '../../core.types';
import { Spinner } from '../spinner/Spinner';

export const List = ({ items = [], options, loadingState, selected = [], onSelectedChange, itemTemplate, onSelect }: {
	items: any[],
	options?: Partial<IListOptions>,
	loadingState?: ILoadingState,
	selected?: Id[],
	onSelect?: (item: any) => void,
	onSelectedChange?: (selected: Id[], item: any, value: boolean) => void,
	itemTemplate?: (item: any) => void,
}) => {
	const resultOptions = defaultsDeepSafe<IListOptions>(options, { keyProp: 'id', displayProp: 'text' });
	const getIsSelected = (key: Id): boolean => {
		if (!resultOptions.selectable) return false;
		const selectedMap = getSelectedMap(selected);
		return Boolean(selectedMap[key]);
	};

	const onItemClick = (key: Id, item: any): void => {
		if (!resultOptions.selectable) return;
		const isSelected = getIsSelected(key);
		const newSelected = getSelected(selected, key, isSelected);
		onSelectedChange?.(newSelected, item, !isSelected);
	};

	const getSelected = (selected: Id[], key: Id, isSelected: boolean): Id[] => {
		if (resultOptions.multi) {
			if (isSelected) return selected.filter((id) => id !== key);
			return selected.concat([key]);
		}
		if (isSelected) return [];
		return [key];
	};

	return (
		<div {...{ className: styles.wrapper }}>
			{items.map((item) => {
				const key = item[resultOptions.keyProp];
				return (<ListItem {...{
					item,
					options: resultOptions,
					key,
					isSelected: getIsSelected(key),
					onClick: onItemClick.bind(null, key, item),
					template: itemTemplate,
				}}/>);
			})}
			{loadingState?.isLoading && (
				<div {...{ className: styles.spinnerWrapper }}><Spinner/></div>
			)}
		</div>
	);
};
