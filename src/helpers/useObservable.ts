import { Observable } from 'rxjs';
import { useEffect, useState } from 'react';

export const useObservable = <T>(observable: Observable<T>, initialValue?: T): [T | undefined] => {
	const [state, setState] = useState<T | undefined>(initialValue);

	useEffect(() => {
		const sub = observable.subscribe(setState);
		return () => sub.unsubscribe();
	}, [observable, setState]);

	return [state];
};

