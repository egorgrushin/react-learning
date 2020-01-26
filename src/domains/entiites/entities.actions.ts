import { AnyAction } from 'redux';

export enum Actions {
	AddList = '[Entities] Add List',
	ReplaceList = '[Entities] Replace List',
}

export const AddListAction = <T>(entities: T[], key: string): AnyAction => {
	return { type: Actions.AddList, payload: { entities, key } };
};

export const ReplaceList = <T>(entities: T[], key: string): AnyAction => {
	return { type: Actions.ReplaceList, payload: { entities, key } };
};
