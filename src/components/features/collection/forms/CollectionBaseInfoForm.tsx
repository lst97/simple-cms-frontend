import { TextField } from '@mui/material';

interface CollectionBaseInfoFormValues {
	name: string;
	description: string;
	subdirectory: string;
}

interface CollectionBaseInfoFormOnChanges {
	onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSubdirectoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CollectionBaseInfoFormProps {
	values: CollectionBaseInfoFormValues;
	onChanges: CollectionBaseInfoFormOnChanges;
}

const CollectionBaseInfoForm = (props: CollectionBaseInfoFormProps) => {
	return (
		<div className="flex flex-col justify-between gap-2">
			<TextField
				id="create-collection-stepper-1-display-name"
				label="Display name"
				required={true}
				variant="outlined"
				onChange={props.onChanges.onNameChange}
				value={props.values.name}
			/>

			<TextField
				id="create-collection-stepper-1-description"
				label="Description"
				required={false}
				variant="outlined"
				onChange={props.onChanges.onDescriptionChange}
				value={props.values.description}
			/>

			<TextField
				id="create-collection-stepper-1-subdirectory"
				label="Subdirectory"
				required={false}
				variant="outlined"
				onChange={props.onChanges.onSubdirectoryChange}
				value={props.values.subdirectory}
			/>
		</div>
	);
};

export default CollectionBaseInfoForm;
