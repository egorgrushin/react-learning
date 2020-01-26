import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

export interface IAffectStateSetterArg<E> {
	isLoading: boolean;
	error?: E;
	isInterrupted?: boolean;
}

export const affectState = <T, E = any>(
	setter: (args: IAffectStateSetterArg<E>) => void,
	rethrow?: boolean,
) => (source: Observable<T>): Observable<T> => {
	let stateCleared = false;
	return of(null).pipe(
		tap(() => {
			setter({ isLoading: true });
			stateCleared = false;
		}),
		switchMap(() => source.pipe(
			catchError((error: E) => {
				setter({ isLoading: false, error });
				stateCleared = true;
				return rethrow ? throwError(error) : EMPTY;
			}),
		)),
		tap(() => {
			setter({ isLoading: false });
			stateCleared = true;
		}),
		finalize(() => {
			if (stateCleared) return;
			setter({ isLoading: false, error: undefined, isInterrupted: true });
		}),
	);
};
