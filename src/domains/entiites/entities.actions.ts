import { IActionPayload } from '../../store.types';

export enum Actions {
	AddList = '[Entities] Add List',
	ReplaceList = '[Entities] Replace List',
}

export const AddListAction = <T>(entities: T[], key: string): IActionPayload => {
	return { type: Actions.AddList, payload: { entities, key } };
};

export const ReplaceList = <T>(entities: T[], key: string): IActionPayload => {
	return { type: Actions.ReplaceList, payload: { entities, key } };
};
