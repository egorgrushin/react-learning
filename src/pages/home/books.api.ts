import { IBook } from './books.types';

import { data as API_BOOKS } from './books.json';
import { PAGE_SIZE } from '../../core.constants';
import { fakeRequest } from '../../helpers/fakeRequest';

export const fetchBooks = async (
	title: string = '',
	from: number = 0,
	to: number = from + PAGE_SIZE,
): Promise<IBook[]> => {
	const filteredBooks: IBook[] = API_BOOKS.filter((book: IBook) => book.title.includes(title)).slice(from, to);
	return fakeRequest(filteredBooks);
};
