import { useEffect, useMemo, useRef, useState } from 'react';
import { ILoadingState } from '../core.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { MD5 } from 'object-hash';
import { map, switchMap } from 'rxjs/operators';
import { affectState, IAffectStateSetterArg } from './affectState';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../store';
import { IPages } from '../domains/entiites/entities.types';
import { AddListAction, ReplaceList } from '../domains/entiites/entities.actions';

const getKeyFromObject = <T>(value?: T): string => MD5(value);

interface IEntitiesLoaderPagePatch<T> {
	entities?: T[];
	next: boolean;
}

export const useEntitiesLoader = <T, F = any>(
	filterObj: F | undefined,
	dataSource$Factory: (value: F | undefined, from: number, to: number) => Observable<T[]>,
	pageSize: number = 50,
): [
	T[] | undefined,
	ILoadingState,
	BehaviorSubject<boolean>,
] => {
	const [loadingState, setLoadingState] = useState<ILoadingState>({});
	// (yrgrushi): paginator instance must depends filterObj in order to reset last emitted 'next' value
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const paginator = useMemo(() => new BehaviorSubject<boolean>(false), [filterObj]);
	const pages = useSelector<IAppState, IPages<T>>((state) => state.entities);
	const dispatch = useDispatch();

	const key = getKeyFromObject<F>(filterObj);
	const page: T[] = pages[key];

	const pageRef = useRef(page);
	pageRef.current = page;

	const loadingStateSetter = ({ isLoading, error }: IAffectStateSetterArg<Error>): void => setLoadingState({
		isLoading,
		error: error?.message,
	});

	const setter$ = useMemo(
		(): Observable<IEntitiesLoaderPagePatch<T>> => paginator.pipe(
			switchMap((next: boolean) => {
				const from = next ? pageRef.current?.length ?? 0 : 0;
				const to = from + pageSize;
				return dataSource$Factory(filterObj, from, to).pipe(
					affectState<T[]>(loadingStateSetter),
					map((entities: T[]) => ({ entities, next })),
				);
			}),
		),
		[pageRef, paginator, pageSize, filterObj, dataSource$Factory],
	);

	useEffect(() => {
		const sub = setter$.subscribe((pagePatch) => {
			const entities = pagePatch.entities || [];
			const action = pagePatch.next
				? AddListAction<T>(entities, key)
				: ReplaceList<T>(entities, key);
			dispatch(action);
		});
		return (): void => sub.unsubscribe();
		// (yrgrushi:) setter$ depends on key, so it is not necessary to recreate this effect on key change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setter$]);

	return [
		page,
		loadingState,
		paginator,
	];
};
