import React from 'react';
import { Spinner } from '../spinner/Spinner';
import { ILoadingGuardProps } from './LoadingGuard.types';

export const LoadingGuard: React.FC<ILoadingGuardProps> = ({ loadingState, children }) => {
	if (loadingState.isLoading) {
		return <Spinner/>;
	}
	if (loadingState.error) {
		return <div>Error: {loadingState.error}</div>;
	}
	return <div>{children}</div>;
};
