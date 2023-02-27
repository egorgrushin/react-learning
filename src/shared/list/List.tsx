import React from 'react';
import { IListOptions, IListProps } from './List.types';
import { ListItem } from './ListItem';
import { defaultsDeepSafe, getSelectedMap } from '../../helpers/objects';
import styles from './List.module.scss';
import { Id } from '../../core.types';
import { Spinner } from '../spinner/Spinner';
import classNames from 'classnames';

export const List: React.FC<IListProps> = ({
	items,
	options,
	loadingState,
	selected = [],
	onSelectedChange,
	itemTemplate,
	className,
}) => {
	const resultOptions = defaultsDeepSafe<IListOptions>(options, { keyProp: 'id' });
	const getIsSelected = (key: Id): boolean => {
		if (!resultOptions.selectable) return false;
		const selectedMap = getSelectedMap(selected);
		return Boolean(selectedMap[key]);
	};

	const getSelected = (selected: Id[], key: Id, isSelected: boolean): Id[] => {
		if (resultOptions.multi) {
			if (isSelected) return selected.filter((id) => id !== key);
			return selected.concat([key]);
		}
		if (isSelected) return [];
		return [key];
	};

	const onItemClick = (key: Id, item: any): void => {
		if (!resultOptions.selectable) return;
		const isSelected = getIsSelected(key);
		const newSelected = getSelected(selected, key, isSelected);
		onSelectedChange?.(newSelected, item, !isSelected);
	};

	return (
		<div {...{ className: classNames(styles.wrapper, className) }}>
			{
				items?.map((item) => {
					const key = item[resultOptions.keyProp];
					return (
						<ListItem {...{
							item,
							options: resultOptions,
							key,
							isSelected: getIsSelected(key),
							onClick: onItemClick.bind(null, key, item),
							itemTemplate,
						}}/>
					);
				}) ??
				<React.Fragment>
					No items
				</React.Fragment>
			}
			{loadingState?.isLoading && (
				<Spinner {...{ className: styles.spinnerWrapper }}/>
			)}
		</div>
	);
};
