import { TextField } from '@mui/material';
import { useState } from 'react';

/**
 * initial values for the collection base info form
 */
interface CollectionBaseInfoFormValues {
	name: string;
	description: string;
	subdirectory: string;
}

interface CollectionBaseInfoFormOnChanges {
	onNameChange: React.Dispatch<React.SetStateAction<string>>;
	onDescriptionChange: React.Dispatch<React.SetStateAction<string>>;
	onSubdirectoryChange: React.Dispatch<React.SetStateAction<string>>;
}

export interface CollectionBaseInfoFormProps {
	values: CollectionBaseInfoFormValues;
	onChanges: CollectionBaseInfoFormOnChanges;
}

export class CollectionBaseInfoFormControl {
	private _values: CollectionBaseInfoFormValues;
	private _onChanges: CollectionBaseInfoFormOnChanges;

	set values(values: CollectionBaseInfoFormValues) {
		this._values.name = values.name ?? '';
		this._values.description = values.description ?? '';
		this._values.subdirectory = values.subdirectory ?? '';
	}

	set onChanges(onChanges: CollectionBaseInfoFormOnChanges) {
		this._onChanges.onNameChange = onChanges.onNameChange;
		this._onChanges.onDescriptionChange = onChanges.onDescriptionChange;
		this._onChanges.onSubdirectoryChange = onChanges.onSubdirectoryChange;
	}

	get onChanges(): CollectionBaseInfoFormOnChanges {
		return this._onChanges;
	}

	get values(): CollectionBaseInfoFormValues {
		return this._values;
	}

	constructor(props?: CollectionBaseInfoFormProps) {
		if (!props) {
			props = {
				values: {
					name: '',
					description: '',
					subdirectory: ''
				},
				onChanges: {
					onNameChange: () => {},
					onDescriptionChange: () => {},
					onSubdirectoryChange: () => {}
				}
			};
		}

		this._values = props.values ?? {};
		this._onChanges = props.onChanges;
	}
}

const CollectionBaseInfoForm = ({
	controller
}: {
	controller?: CollectionBaseInfoFormControl;
}) => {
	const [values, setValues] = useState<CollectionBaseInfoFormValues>(
		controller?.values ?? {
			name: controller?.values?.name ?? '',
			description: controller?.values?.description ?? '',
			subdirectory: controller?.values?.subdirectory ?? ''
		}
	);

	return (
		<div className="flex flex-col justify-between gap-2">
			<TextField
				id="create-collection-stepper-1-display-name"
				label="Display name"
				required={true}
				variant="outlined"
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setValues({ ...values, name: event.target.value });
					controller?.onChanges.onNameChange(event.target.value);
				}}
				value={values.name}
			/>

			<TextField
				id="create-collection-stepper-1-description"
				label="Description"
				required={false}
				variant="outlined"
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setValues({ ...values, description: event.target.value });
					controller?.onChanges.onDescriptionChange(
						event.target.value
					);
				}}
				value={values.description}
			/>

			<TextField
				id="create-collection-stepper-1-subdirectory"
				label="Subdirectory"
				required={false}
				variant="outlined"
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setValues({ ...values, subdirectory: event.target.value });
					controller?.onChanges.onSubdirectoryChange(
						event.target.value
					);
				}}
				value={values.subdirectory}
			/>
		</div>
	);
};

export default CollectionBaseInfoForm;
