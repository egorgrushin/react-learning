import { defaultsDeep, memoize } from 'lodash';
import { Id, IDictionary } from '../core.types';

export const defaultsDeepSafe = <T>(...values: any[]): T => defaultsDeep({}, ...values);

export const getSelectedMap = memoize((selected: Id[]): IDictionary<boolean> =>
	selected?.reduce((memo: IDictionary<boolean>, id: Id) => {
		memo[id] = true;
		return memo;
	}, {}) || {});
