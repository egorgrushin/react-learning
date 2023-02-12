import React from 'react';
import styles from './Textbox.module.scss';

export const Textbox = ({ value, onChange, className, placeholder, onEnter }: {
	className?: string,
	placeholder?: string,
	value?: string,
	onChange?: (value: string) => void,
	onEnter?: (value: string) => void,
}) => {
	// const [thisValue, setThisValue] = useState(value);
	const onKeyDownFn = (event: any) => {
		if (event.key === 'Enter') {
			onEnter?.(event.target.value);
		}
	};

	const onChangeFn = (event: any) => {
		const newValue = event.target.value;
		onChange?.(newValue);
	};

	return (
		<div {...{ className: [className, styles.wrapper].join(' ') }}>
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
