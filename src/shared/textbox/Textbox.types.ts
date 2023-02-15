export interface ITextboxProps {
	className?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	onEnter?: (value: string) => void;
}
