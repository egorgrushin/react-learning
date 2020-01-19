import React from 'react';
import { ILoadingState } from '../../core.types';
import { Spinner } from '../spinner/Spinner';

export const LoadingGuard = ({ loadingState, children }: { loadingState: ILoadingState, children: any }) => {
	if (loadingState?.isLoading) {
		return <Spinner/>;
	}
	if (loadingState?.error) {
		return <div>Error: {loadingState.error}</div>
	}
	return <div>{children}</div>;
};
