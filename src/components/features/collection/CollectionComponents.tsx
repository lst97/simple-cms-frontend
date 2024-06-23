import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CreateCollectionStepper } from './CollectionStepper';
import { useContext } from 'react';
import {
	TextTypeSetting,
	TypeSetting
} from '../../../models/share/collection/AttributeTypeSettings';
import { CollectionAttributeDbModel } from '../../../models/share/collection/CollectionAttributes';
import { CollectionApiService } from '../../../services/ApiService';
import { CollectionDbModel } from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';
import { DialogBaseProps } from '../../common/dialogs/Dialogs';
import {
	AttributeInfoFormValues,
	AttributeSettingsHelper,
	AttributeTypesForm
} from './forms/AttributeTypesForm';

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

	const handleSubmit = (setting: TypeSetting, attributeId?: string) => {
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
						<AttributeTypesForm
							onSubmit={(values: AttributeInfoFormValues) => {
								console.log(attribute._id);
								switch (values.baseSettings.type) {
									case 'text':
										handleSubmit(
											AttributeSettingsHelper.toTextTypeSetting(
												values
											),
											attribute._id
										);
								}
							}}
							type={attribute.setting.type ?? undefined}
							submitLabel="Submit"
							initialValues={AttributeSettingsHelper.toAttributeInfoFormValues(
								attribute.setting
							)}
						/>
					</DialogContent>
				</>
			) : null}
		</Dialog>
	);
};
