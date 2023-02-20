import { useEffect, useMemo, useRef, useState } from 'react';
import { IDictionary, ILoadingState } from '../core.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { MD5 } from 'object-hash';
import { map, switchMap } from 'rxjs/operators';
import { affectState, IAffectStateSetterArg } from './affectState';

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
	const [pages, setPages] = useState<IDictionary<T[]>>({});

	const key = getKeyFromObject<F>(filterObj);
	const page = pages[key];

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
			setPages((prevPages) => {
				// FIXME(yrgrushi): refactor this shit
				let newEntities = pagePatch.entities || [];
				if (pagePatch.next === false) return { ...prevPages, [key]: newEntities };
				newEntities = (prevPages[key] || []).concat(newEntities);
				return { ...prevPages, [key]: newEntities };
			});
		});
		return (): void => sub.unsubscribe();
		// (yrgrushi:) setter$ depends on key, so it is not necessary to recreate this effect on key change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setPages, setter$]);

	return [
		page,
		loadingState,
		paginator,
	];
};
