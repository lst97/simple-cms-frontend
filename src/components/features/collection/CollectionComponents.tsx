import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateCollectionStepper } from './CollectionStepper';
import { useContext } from 'react';
import { TypeSetting } from '../../../models/share/collection/AttributeTypeSettings';
import { CollectionAttributeDbModel } from '../../../models/share/collection/CollectionAttributes';
import { CollectionApiService } from '../../../services/ApiService';
import { CollectionDbModel } from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';
import { DialogBaseProps } from '../../common/dialogs/Dialogs';

interface EditAttributeDialogProps extends DialogBaseProps {
	collection: CollectionDbModel;
	attribute: CollectionAttributeDbModel;
}

export const CreateCollectionDialog = (props: DialogBaseProps) => {
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
};

export const EditAttributeDialog = (props: EditAttributeDialogProps) => {
	const { onClose, open, attribute, collection } = props;

	const { collections, setCollections } = useContext(CollectionContext);

	const handleEditAttributeDialogClose = () => {
		onClose();
	};

	const handleOnSubmit = (setting: TypeSetting, attributeId?: string) => {
		const attribute = collection.attributes.find(
			(attr) => attr._id === attributeId
		);

		if (!attribute) return;

		CollectionApiService.updateCollectionAttribute(
			collection.slug,
			attribute._id,
			{
				setting: setting
			}
		)
			.then(() => {
				const updatedCollections = collections.map((col) => {
					if (col._id === collection._id) {
						return {
							...col,
							attributes: col.attributes.map((attr) => {
								if (attr._id === attribute._id) {
									return {
										...attr,
										setting: {
											...attr.setting,
											...setting
										}
									};
								}
								return attr;
							})
						};
					}
					return col;
				});

				setCollections(updatedCollections as CollectionDbModel[]);

				handleEditAttributeDialogClose();
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Dialog onClose={handleEditAttributeDialogClose} open={open}>
			{attribute ? (
				<>
					<DialogTitle>Edit attribute</DialogTitle>

					<DialogContent>
						{/* <AttributeTypesForm
							onSubmit={handleOnSubmit}
							type={attribute.setting.type ?? undefined}
							attributeId={attribute._id}
							controller={ctrl}
							submitButtonLabel="Submit"
						/> */}
					</DialogContent>
				</>
			) : null}
		</Dialog>
	);
};
