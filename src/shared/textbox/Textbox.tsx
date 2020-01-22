import React from 'react';
import styles from './Textbox.module.scss';
import { ITextboxProps } from './Textbox.types';
import classNames from 'classnames';

export const Textbox: React.FC<ITextboxProps> = ({ value, onChange, className, placeholder, onEnter }) => {
	const onKeyDownFn = (event: any): void => {
		if (event.key === 'Enter') {
			onEnter?.(event.target.value);
		}
	};

	const onChangeFn = (event: any): void => {
		const newValue = event.target.value;
		onChange?.(newValue);
	};

	return (
		<div {...{ className: classNames(className, styles.wrapper) }}>
			<input {...{
				type: 'text',
				value: value,
				onChange: onChangeFn,
				onKeyDown: onKeyDownFn,
				placeholder,
				className: styles.input,
			}}/>
		</div>
	);
};
