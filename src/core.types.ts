export type Id = number | string;

export interface ILoadingState {
	isLoading?: boolean;
	error?: string;
}

export interface IDictionary<T> {
	[key: string]: T;
}

