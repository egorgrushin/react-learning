import { useState } from 'react';
import { ILoadingState } from '../core.types';

export const useEntitiesLoader = <T>(fetcher: (...args: any[]) => Promise<T[]>): [
	T[],
	ILoadingState,
	(...args: any[]) => Promise<void>,
	(...args: any[]) => Promise<void>,
] => {
	const [entities, setEntities] = useState();
	const [loadingState, setLoadingState] = useState<ILoadingState>({});

	const invokeFetcher = async (...args: any[]): Promise<T[]> => {
		setLoadingState({ isLoading: true });
		try {
			const res = await fetcher(...args);
			setLoadingState({ isLoading: false });
			return res;
		} catch (err) {
			setLoadingState({ isLoading: false, error: err.message });
		}
		return [];
	};

	const load = async (...args: any[]): Promise<void> => {
		setEntities([]);
		const res = await invokeFetcher(...args);
		setEntities(res);
	};

	const loadMore = async (...args: any[]): Promise<void> => {
		const from = entities.length;
		const res = await invokeFetcher(...args, from);
		setEntities(entities.concat(res));
	};

	return [
		entities,
		loadingState,
		load,
		loadMore,
	];
};
