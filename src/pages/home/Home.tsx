import React, { useEffect, useState } from 'react';
import { List } from '../../shared/list/List';
import styles from './Home.module.scss';
import { Textbox } from '../../shared/textbox/Textbox';
import { useEntitiesLoader } from '../../helpers/useEntitiesLoader';
import { fetchBooks } from './books.api';
import { Id } from '../../core.types';
import { IListOptions } from '../../shared/list/List.types';
import { Cart } from './cart/Cart';
import { IBook } from './books.types';
import { useObservable } from '../../helpers/useObservable';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const INITIAL_FILTER_VALUE = '';

const filter$ = new Subject<string>();

const debouncedFilter$ = filter$.pipe(
	debounceTime(300),
	distinctUntilChanged(),
);

export const Home: React.FC<{}> = () => {
	const [selected, setSelected] = useState<Id[]>([]);
	const [selectedBooks, setSelectedBooks] = useState<IBook[]>([]);
	const [books, loadingState, load, loadMore] = useEntitiesLoader(fetchBooks);

	const [filterInputValue] = useObservable(filter$, INITIAL_FILTER_VALUE);
	const [filter] = useObservable(debouncedFilter$, INITIAL_FILTER_VALUE);

	const listOptions: Partial<IListOptions> = {
		selectable: true,
		multi: true,
	};

	useEffect(() => {
		load(filter);
	}, [filter]);

	const applyFilter = (newFilter: string): void => {
		filter$.next(newFilter);
	};

	const clearFilter = (): void => {
		filter$.next(INITIAL_FILTER_VALUE);
	};

	const loadMoreFn = (): void => {
		loadMore(filter);
	};

	const getNewSelectedBooks = (
		selectedBooks: IBook[],
		item: IBook,
		value: boolean,
	): IBook[] => {
		if (value) return selectedBooks.concat([item]);
		return selectedBooks.filter((book) => book.id !== item.id);
	};

	const onSelectedChange = (
		newSelected: Id[],
		item: IBook,
		value: boolean,
	): void => {
		// FIXME(yrgrushi): find a better way to calculate selected books
		setSelected(newSelected);
		const newSelectedBooks = getNewSelectedBooks(
			selectedBooks,
			item,
			value,
		);
		setSelectedBooks(newSelectedBooks);
	};

	const onCartClear = (): void => {
		// FIXME(yrgrushi): find a better way to calculate selected books
		setSelected([]);
		setSelectedBooks([]);
	};

	return (
		<div {...{ className: styles.wrapper }}>
			<div {...{ className: styles.books }}>
				<h2>Books: </h2>
				<div {...{ className: styles.tools }}>
					<Textbox {...{
						value: filterInputValue,
						onChange: applyFilter,
						placeholder: 'Enter any text and press the enter',
						className: styles.filter,
					}}/>
					<div {...{ className: styles.buttons }}>
						<button {...{
							onClick: clearFilter,
							disabled: loadingState.isLoading,
							className: styles.button,
						}}>Clear filter
						</button>
						<button {...{
							onClick: loadMoreFn,
							disabled: loadingState.isLoading,
							className: styles.button,
						}}>Load more
						</button>
					</div>
				</div>
				<div {...{ className: styles.listWrapper }}>
					<List {...{
						items: books,
						itemTemplate: (item: IBook): string => item.title,
						options: listOptions,
						loadingState,
						selected,
						onSelectedChange,
					}}/>
				</div>
			</div>
			<div {...{ className: styles.form }}>
				<Cart {...{
					items: selectedBooks,
					clear: onCartClear,
				}}/>
			</div>
		</div>
	);
};
