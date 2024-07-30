import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	ImageListItem,
	ImageListItemBar
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { IMediaContent } from '../../../models/share/collection/AttributeContents';

export const ImageViewer = ({
	baseUrl,
	items,
	selectedIndex,
	onClose
}: {
	baseUrl: string;
	items: IMediaContent[];
	selectedIndex: number;
	onChange?(value: IMediaContent): void;
	onClose?(): void;
}) => {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(selectedIndex);

	const handleClose = () => {
		setOpen(false);
		onClose?.();
	};

	const handleNext = () => {
		if (index < items.length - 1) {
			setIndex(index + 1);
		}
	};

	const handlePrevious = () => {
		if (index > 0) {
			setIndex(index - 1);
		}
	};

	useEffect(() => {
		setOpen(true);
	}, [selectedIndex]);

	return (
		<div>
			<Dialog open={open} onClose={handleClose} maxWidth="lg">
				<DialogTitle>
					Image Viewer
					<IconButton
						aria-label="close"
						onClick={handleClose}
						style={{ position: 'absolute', right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<ImageListItem key={items[index].url.split('/')[-1]}>
						<img
							crossOrigin="anonymous"
							src={`${baseUrl}/${items[index].url}`}
							alt={`Image ${index + 1}`}
							style={{ maxHeight: '80vh', maxWidth: '100%' }}
						/>
						<ImageListItemBar title={items[index].fileName} />
					</ImageListItem>
				</DialogContent>
				<DialogActions>
					<Button onClick={handlePrevious} disabled={index === 0}>
						Previous
					</Button>
					<Button
						onClick={handleNext}
						disabled={index === items.length - 1}
					>
						Next
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
