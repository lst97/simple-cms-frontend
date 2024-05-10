import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import {
	CreateCollectionStepper,
	TextTypeSettingsFormControl
} from './CollectionStepper';
import { AttributeTypesForm } from './forms/AttributeTypesForm';
import { getCollectionAdvancedSettingFlag } from '../../../utils/Flags';
import { useContext, useEffect, useState } from 'react';
import {
	TextTypeSettingDbModel,
	TypeSetting
} from '../../../models/share/collection/AttributeTypeSettings';
import { TextContentTypes } from '../../../models/share/collection/BaseSchema';
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

	const [name, setName] = useState(attribute.setting.name ?? '');
	const [subtype, setSubtype] = useState<string>(
		attribute.setting.type === 'text'
			? (attribute.setting as TextTypeSettingDbModel).textType
			: ''
	);
	const [advancedSettingFlag, setAdvancedSettingFlag] = useState(
		getCollectionAdvancedSettingFlag({
			required: attribute.setting.isRequire,
			unique: attribute.setting.isUnique,
			private: attribute.setting.private
		})
	);

	// not current
	const [maxLength, setMaxLength] = useState(0);
	const [minLength, setMinLength] = useState(0);

	const [ctrl] = useState<TextTypeSettingsFormControl>(
		new TextTypeSettingsFormControl({
			values: {
				name: name,
				subtype: subtype as TextContentTypes,
				maxLength: maxLength,
				minLength: minLength
			},
			onChanges: {
				onNameChange: setName,
				onMaxLengthChange: setMaxLength,
				onMinLengthChange: setMinLength,
				onSubtypeChange: setSubtype
			},
			advancedSettingCtrl: {
				value: advancedSettingFlag,
				onValueChange: setAdvancedSettingFlag
			}
		})
	);

	useEffect(() => {
		setName(attribute.setting.name);
		setSubtype(
			attribute.setting.type === 'text'
				? (attribute.setting as TextTypeSettingDbModel).textType
				: ''
		);
		setAdvancedSettingFlag(
			getCollectionAdvancedSettingFlag({
				required: attribute.setting.isRequire,
				unique: attribute.setting.isUnique,
				private: attribute.setting.private
			})
		);
	}, [attribute]);

	const { collections, setCollections } = useContext(CollectionContext);

	const handleEditAttributeDialogClose = () => {
		onClose();
	};

	const handleOnSubmit = (setting: TypeSetting, attributeId?: string) => {
		const attribute = collection.attributes.find(
			(attr) => attr._id === attributeId
		);

		if (!attribute) return;

		collection.attributes = collection.attributes.map((attr) => {
			if (attr._id === attributeId) {
				return {
					...attr,
					setting: {
						...attr.setting,
						_id: attributeId
					}
				};
			}
			return attr;
		});

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
							onSubmit={handleOnSubmit}
							type={attribute.setting.type ?? undefined}
							attributeId={attribute._id}
							controller={ctrl}
							submitButtonLabel="Submit"
						/>
					</DialogContent>
				</>
			) : null}
		</Dialog>
	);
};
