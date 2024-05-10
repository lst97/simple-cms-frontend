import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button
} from '@mui/material';
import React from 'react';

export interface DialogBaseProps {
	open: boolean;
	onFinish: (form: Map<string, unknown>) => void;
	onClose: () => void;
}

interface ConfirmationDialogProps extends DialogBaseProps {
	isConfirmDisabled?: boolean;
	onConfirm: () => void;
	title: string;
	content: React.ReactNode | string;
}
export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
	const { open, onClose, onConfirm, title, content, isConfirmDisabled } =
		props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					color="primary"
					disabled={isConfirmDisabled ?? false}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export const PlainDialog = (
	props: DialogBaseProps & {
		title: string;
		content: React.ReactNode | string;
	}
) => {
	const { open, onClose, title, content } = props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{content}</DialogContent>
		</Dialog>
	);
};
