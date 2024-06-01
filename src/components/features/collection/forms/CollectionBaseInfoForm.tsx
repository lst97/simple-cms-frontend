import { TextField, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useState } from 'react';
import { Config as ApiServiceConfig } from '@lst97/common-restful';
import { SubdirectoryRegex } from '../../../../schemas/SubdirectorySchema';
import { extractSlug } from '../../../../utils/Misc';
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

	const [pendingSubdirectory, setPendingSubdirectory] = useState<string>('');

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Backspace' && pendingSubdirectory === '') {
			event.preventDefault();
			const { slug, modifiedUrl } = extractSlug(values.subdirectory);
			setValues({
				...values,
				subdirectory: modifiedUrl
			});
			controller?.onChanges.onSubdirectoryChange(modifiedUrl);
			setPendingSubdirectory(slug ?? '');
		}
	};

	const handleSubdirectoryChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value.trim();

		if (value === '') {
			setPendingSubdirectory(value);
			return;
		}

		if (
			RegExp(SubdirectoryRegex.collectionSubdirectoryRegex).test(
				value
			) === false ||
			value.startsWith('/')
		) {
			return;
		}

		if (value.endsWith('/')) {
			setValues({
				...values,
				subdirectory: values.subdirectory + value
			});
			setPendingSubdirectory('');
			controller?.onChanges.onSubdirectoryChange(
				values.subdirectory + value
			);

			return;
		}

		setPendingSubdirectory(value);
	};

	return (
		<Grid container spacing={2}>
			<Grid xs={6}>
				<TextField
					id="create-collection-stepper-1-display-name"
					sx={{ width: '100%' }}
					label="Display name"
					required={true}
					variant="outlined"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						const value = event.target.value.toLocaleLowerCase();

						if (value === '') {
							setValues({
								...values,
								name: event.target.value
							});
							controller?.onChanges.onNameChange(
								event.target.value
							);
							return;
						}

						if (
							RegExp(SubdirectoryRegex.collectionNameRegex).test(
								value
							) === false
						) {
							return;
						}

						setValues({
							...values,
							name: event.target.value.trim().toLowerCase()
						});
						controller?.onChanges.onNameChange(
							event.target.value.trim().toLowerCase()
						);
					}}
					value={values.name}
				/>
			</Grid>
			<Grid xs={6}>
				<TextField
					id="create-collection-stepper-1-description"
					sx={{ width: '100%' }}
					label="Description"
					required={false}
					variant="outlined"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setValues({
							...values,
							description: event.target.value
						});
						controller?.onChanges.onDescriptionChange(
							event.target.value
						);
					}}
					value={values.description}
				/>
			</Grid>

			<Grid xs={12}>
				<TextField
					sx={{ width: '100%' }}
					id="create-collection-stepper-1-subdirectory"
					label="Subdirectory"
					required={false}
					variant="outlined"
					helperText={
						<Tooltip
							title={`${
								ApiServiceConfig.instance().baseUrl
							}/collections/${
								values.subdirectory
							}${values.name.toLocaleLowerCase()}_[id]`}
						>
							<Typography
								sx={{
									maxWidth: '75%',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									direction: 'rtl', // Right-to-left text direction
									textAlign: 'left' // Align text to the left (within RTL)
								}}
							>{`${
								ApiServiceConfig.instance().baseUrl
							}/collections/${
								values.subdirectory
							}${values.name.toLocaleLowerCase()}_[id]`}</Typography>
						</Tooltip>
					}
					onChange={handleSubdirectoryChange}
					value={pendingSubdirectory}
					onKeyDown={handleKeyDown}
				/>
			</Grid>
		</Grid>
	);
};

export default CollectionBaseInfoForm;
