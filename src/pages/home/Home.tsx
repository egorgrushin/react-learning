import React, { useState } from 'react';
import { List } from '../../shared/list/List';
import styles from './Home.module.scss';
import { Textbox } from '../../shared/textbox/Textbox';
import { fetchBooks } from './books.api';
import { Id } from '../../core.types';
import { IListOptions } from '../../shared/list/List.types';
import { Cart } from './cart/Cart';
import { IBook } from './books.types';
import { useObservable } from '../../helpers/useObservable';
import { from, Observable, Subject } from 'rxjs';
import { useEntitiesLoader } from '../../helpers/useEntitiesLoader';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const INITIAL_FILTER_VALUE = '';

const LIST_OPTIONS: Partial<IListOptions> = {
	selectable: true,
	multi: true,
};

const filter$ = new Subject<string>();

const books$Factory = (
	value: string | undefined,
	fromIndex: number,
	toIndex: number,
): Observable<IBook[]> => from(fetchBooks(value, fromIndex, toIndex));

const debouncedFilter$ = filter$.pipe(
	debounceTime(500),
	distinctUntilChanged(),
);

export const Home: React.FC = () => {
	const [selected, setSelected] = useState<Id[]>([]);
	const [selectedBooks, setSelectedBooks] = useState<IBook[]>([]);
	const [filterInputValue] = useObservable(filter$, INITIAL_FILTER_VALUE);
	const [filterObj] = useObservable(debouncedFilter$, filterInputValue);

	const [books, loadingState, paginator] = useEntitiesLoader(filterObj, books$Factory, 5);

	const applyFilter = (newFilter: string): void => {
		filter$.next(newFilter);
	};

	// FIXME(yrgrushi): there is a bug - it doesn't clear the filterObj immediately
	const clearFilter = (): void => {
		filter$.next(INITIAL_FILTER_VALUE);
	};

	const loadMoreFn = (): void => {
		paginator.next(true);
	};

	const refreshFn = (): void => {
		paginator.next(false);
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
						<button {...{
							onClick: refreshFn,
							disabled: loadingState.isLoading,
							className: styles.button,
						}}>Refresh
						</button>
					</div>
				</div>
				<List {...{
					items: books,
					itemTemplate: (item: IBook): string => item.title,
					options: LIST_OPTIONS,
					loadingState,
					selected,
					onSelectedChange,
					className: styles.listWrapper,
				}}/>
			</div>
			<div {...{ className: styles.right }}>
				<Cart {...{
					items: selectedBooks,
					clear: onCartClear,
				}}/>
			</div>
		</div>
	);
};
