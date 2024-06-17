import { TextField, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Config as ApiServiceConfig } from '@lst97/common-restful';
import { SubdirectoryRegex } from '../../../../schemas/SubdirectorySchema';
import { useFormik } from 'formik';
import DebugFormik from '../../../debug/DebugFormik';
import { useEffect } from 'react';

export class CollectionBaseInfoFormControl {}
export class CollectionBaseInfoFormValues {
	collectionName: string = '';
	collectionDescription: string = '';
	collectionSubdirectory: string = '';

	// subdirectory input textfield value
	pendingSubdirectory: string = '';
}

const CollectionBaseInfoForm = (props: {
	initialValues?: CollectionBaseInfoFormValues;
	onValuesChange?: (values: CollectionBaseInfoFormValues) => void;
}) => {
	const formik = useFormik({
		initialValues:
			props.initialValues ?? new CollectionBaseInfoFormValues(),
		onSubmit: (values) => {}
	});

	const extractSlug = (subdirectory: string) => {
		const parts = subdirectory.slice(0, -1).split('/');
		const slug = parts.pop();
		let newSubdirectory = parts.join('/').concat('/');

		if (newSubdirectory === '/') {
			newSubdirectory = '';
		}

		return { slug, newSubdirectory };
	};

	const handleSubdirectoryInputKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>
	) => {
		if (
			event.key === 'Backspace' &&
			formik.values.pendingSubdirectory === ''
		) {
			event.preventDefault();

			const { slug, newSubdirectory } = extractSlug(
				formik.values.collectionSubdirectory
			);

			formik.setFieldValue('collectionSubdirectory', newSubdirectory);
			formik.setFieldValue('pendingSubdirectory', slug);
		}
	};

	const handleSubdirectoryInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		let value = event.target.value.trim();

		switch (value) {
			case '':
				break;
			case '/':
				value = '';
				break;
			default:
				if (value.endsWith('/')) {
					// set the subdirectory value in formik
					formik.setFieldValue(
						'collectionSubdirectory',
						formik.values.collectionSubdirectory.concat(value)
					);

					value = '';
				}
		}
		formik.setFieldValue('pendingSubdirectory', value);
	};

	const handleCollectionNamesChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		formik.setFieldValue('collectionName', event.target.value.trim());
	};

	useEffect(() => {
		props.onValuesChange?.(formik.values);
	}, [formik.values, props]);

	return (
		<>
			<Grid container spacing={2}>
				<Grid xs={6}>
					<TextField
						id="create-collection-stepper-1-display-name"
						name="collectionName"
						sx={{ width: '100%' }}
						label="Display name"
						required={true}
						variant="outlined"
						onChange={handleCollectionNamesChange}
						value={formik.values.collectionName}
					/>
				</Grid>
				<Grid xs={6}>
					<TextField
						id="create-collection-stepper-1-description"
						name="collectionDescription"
						sx={{ width: '100%' }}
						label="Description"
						required={false}
						variant="outlined"
						onChange={formik.handleChange}
						value={formik.values.collectionDescription}
					/>
				</Grid>

				<Grid xs={12}>
					{/* This is a pending subdirectory, the actual form value controlled by handleSubdirectoryChange */}
					<TextField
						sx={{ width: '100%' }}
						id="create-collection-stepper-1-subdirectory"
						name="collectionSubdirectory"
						label="Subdirectory"
						required={false}
						variant="outlined"
						inputProps={{
							pattern:
								SubdirectoryRegex.collectionSubdirectoryRegex
									.source
						}}
						helperText={
							<Tooltip
								title={`${
									ApiServiceConfig.instance().baseUrl
								}/collections/${
									formik.values.collectionSubdirectory
								}${formik.values.collectionName.toLocaleLowerCase()}_[id]`}
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
									formik.values.collectionSubdirectory
								}${formik.values.collectionName.toLocaleLowerCase()}_[id]`}</Typography>
							</Tooltip>
						}
						onChange={handleSubdirectoryInputChange}
						value={formik.values.pendingSubdirectory}
						onKeyDown={handleSubdirectoryInputKeyDown}
					/>
				</Grid>
			</Grid>
			<DebugFormik formik={formik} />
		</>
	);
};

export default CollectionBaseInfoForm;
