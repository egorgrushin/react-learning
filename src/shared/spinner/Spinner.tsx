import React from 'react';
import styles from './Spinner.module.scss';
import classNames from 'classnames';
import { ISpinnerProps } from './Spinner.types';

export const Spinner: React.FC<ISpinnerProps> = ({ className }) => {
	return (
		<div {...{ className: classNames(styles.spinner, className) }}>
			<div/>
			<div/>
			<div/>
			<div/>
		</div>
	);
};
