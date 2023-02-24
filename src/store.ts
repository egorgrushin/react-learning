import { combineReducers, createStore } from 'redux';
import { reducer as entitiesReducer } from './domains/entiites/entities.reducer';
import { IPages } from './domains/entiites/entities.types';

export interface IAppState {
	entities: IPages<any>;
}

const rootReducer = combineReducers<IAppState>({
	entities: entitiesReducer,
});

export const store = createStore(
	rootReducer,
	{},
	(window as any)?.__REDUX_DEVTOOLS_EXTENSION__,
);
