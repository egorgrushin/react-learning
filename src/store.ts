import { createStore } from 'redux';

export interface IAppState {}

const rootReducer = (state: IAppState = {}, action: any) => state;

export const store = createStore(
	rootReducer,
	{},
	(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
