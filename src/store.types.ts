import { Action } from 'redux';

export interface IActionPayload<T = string, P = any> extends Action<T> {
	payload?: P;
}
