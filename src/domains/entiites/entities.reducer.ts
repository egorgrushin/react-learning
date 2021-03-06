import { IPages } from './entities.types';
import { Actions } from './entities.actions';
import { IActionPayload } from '../../store.types';

export const reducer = <T>(state: IPages<T> = {}, action: IActionPayload): IPages<T> => {
	switch (action.type) {
		case Actions.AddList: {
			const { entities, key } = action.payload;
			return {
				...state,
				[key]: (state[key] || []).concat(entities),
			};
		}
		case Actions.ReplaceList: {
			const { entities, key } = action.payload;
			return {
				...state,
				[key]: entities,
			};
		}
		default:
			return state;
	}
};
