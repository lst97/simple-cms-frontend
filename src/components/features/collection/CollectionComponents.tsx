import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateCollectionStepper } from './CollectionStepper';

export interface CreateCollectionDialogProps {
	open: boolean;
	onFinish: (form: Map<string, unknown>) => void;
	onClose: () => void;
}
export function CreateCollectionDialog(props: CreateCollectionDialogProps) {
	const { onClose, open } = props;

	const handleCreateCollectionDialogClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleCreateCollectionDialogClose} open={open}>
			<DialogTitle>Create collection</DialogTitle>
			<DialogContent>{CreateCollectionStepper()}</DialogContent>
		</Dialog>
	);
}
