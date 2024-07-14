import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
	SupportedAttributeTypes,
	SupportedAttributes
} from '../../../../models/share/collection/CollectionBaseSchema';
import Grid from '@mui/material/Unstable_Grid2';
import {
	MediaTypes,
	TextContentTypes,
	TextTypes
} from '../../../../models/share/collection/BaseSchema';
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
	TextField,
	Typography
} from '@mui/material';
import {
	MediaTypeSetting,
	PostTypeSetting,
	SupportedAdvancedSettings,
	TextTypeSetting,
	TypeSetting,
	TypeSettingDbModel
} from '../../../../models/share/collection/AttributeTypeSettings';
import { FormikProps, useFormik } from 'formik';
import DebugFormik from '../../../debug/DebugFormik';
import { ReactNode } from 'react';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

class AttributeBaseSettings {
	attributeName: string = '';
	type: SupportedAttributeTypes = SupportedAttributes.text;
	subType?: TextTypes | MediaTypes | null = null;
	comment?: boolean = false;
	reaction?: boolean = false;
}

// included all the advanced settings
class AttributeAdvancedSettings {
	required: boolean = false;
	unique: boolean = false;
	private: boolean = false;
	maxLength?: number = 0;
	minLength?: number = 0;
	maxSize?: number = 0;
	minSize?: number = 0;
}

export class AttributeSettingsHelper {
	public static toAttributeInfoFormValues(typeSetting: TypeSettingDbModel) {
		const values = new AttributeInfoFormValues();
		values.baseSettings.type = typeSetting.type;
		values.baseSettings.attributeName = typeSetting.name;
		values.advancedSettings.required = typeSetting.isRequire;
		values.advancedSettings.unique = typeSetting.isUnique;
		values.advancedSettings.private = typeSetting.private;

		switch (typeSetting.type) {
			case 'text': {
				const textSetting = typeSetting as unknown as TextTypeSetting;
				values.baseSettings.subType = textSetting.subType;
				values.advancedSettings.maxLength = textSetting.maxLength;
				values.advancedSettings.minLength = textSetting.minLength;
				break;
			}
			case 'media': {
				const mediaSetting = typeSetting as unknown as MediaTypeSetting;
				values.baseSettings.subType = mediaSetting.subType;
				values.advancedSettings.maxLength = mediaSetting.maxLength;
				values.advancedSettings.minLength = mediaSetting.minLength;
				values.advancedSettings.maxSize = mediaSetting.maxSize;
				values.advancedSettings.minSize = mediaSetting.minSize;
				break;
			}
			case 'post': {
				const postSetting = typeSetting as unknown as PostTypeSetting;
				values.baseSettings.comment = postSetting.comment;
				values.baseSettings.reaction = postSetting.reaction;
				break;
			}
			case 'posts': {
				break;
			}
		}

		return values;
	}

	public static toTextTypeSetting(values: AttributeInfoFormValues) {
		const textSetting = new TextTypeSetting(
			values.baseSettings.subType as TextContentTypes,
			{
				name: values.baseSettings.attributeName,
				isRequire: values.advancedSettings.required,
				isUnique: values.advancedSettings.unique,
				isPrivate: values.advancedSettings.private,
				maxLength: values.advancedSettings.maxLength,
				minLength: values.advancedSettings.minLength
			}
		);
		return textSetting;
	}
}

const SettingsTabPanel = (props: Readonly<TabPanelProps>) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
};

const a11yProps = (index: number) => {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
};

export class AttributeInfoFormValues {
	baseSettings: AttributeBaseSettings;
	advancedSettings: AttributeAdvancedSettings;

	constructor(setting?: TypeSetting) {
		this.baseSettings = new AttributeBaseSettings();
		this.advancedSettings = new AttributeAdvancedSettings();

		switch (setting?.type) {
			case 'text':
				const textSetting = setting as TextTypeSetting;
				this.baseSettings.subType = textSetting.subType;
				this.baseSettings.attributeName = textSetting.name;
				this.advancedSettings.maxLength = textSetting.maxLength;
				this.advancedSettings.minLength = textSetting.minLength;
				break;

			case 'reaction':
			// TODO: add reaction setting
			case 'comment':
				// TODO: add comment setting
				break;
		}
	}
}

const BaseSettings = (props: {
	formik?: FormikProps<AttributeInfoFormValues>;
}) => {
	const SubTypeOptions = (props: { type: SupportedAttributeTypes }) => {
		switch (props.type) {
			case SupportedAttributes.text:
				return textSubTypeOptions();
			case SupportedAttributes.media:
				return mediaSubTypeOptions();
		}
	};

	const AdditionalBaseOptions = (props: {
		type: SupportedAttributeTypes;
	}) => {
		switch (props.type) {
			case 'post':
				return postAdditionalBaseOptions();
		}
	};

	const textSubTypeOptions = () => {
		return (
			props.formik !== undefined && (
				<RadioGroup
					row
					aria-labelledby="text-type-radio-buttons-group-label"
					onChange={props.formik.handleChange('baseSettings.subType')}
					onBlur={props.formik.handleBlur}
					value={props.formik.values.baseSettings.subType}
					name="text-type-radio-buttons-group"
				>
					<FormControlLabel
						value={TextTypes.short_text}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">
									Short Text
								</Typography>
								<Typography variant="caption">
									Best for titles, names, and links(URL).
								</Typography>
							</React.Fragment>
						}
					/>
					<FormControlLabel
						value={TextTypes.long_text}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">
									Long Text
								</Typography>
								<Typography variant="caption">
									Best for descriptions, biography.
								</Typography>
							</React.Fragment>
						}
					/>
					<FormControlLabel
						value={TextTypes.reach_text}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">
									Reach Text
								</Typography>
								<Typography variant="caption">
									Best for blog posts, articles, and notes.
								</Typography>
							</React.Fragment>
						}
					/>
				</RadioGroup>
			)
		);
	};

	const mediaSubTypeOptions = () => {
		return (
			props.formik !== undefined && (
				<RadioGroup
					row
					aria-labelledby="media-type-radio-buttons-group-label"
					onChange={props.formik.handleChange('baseSettings.subType')}
					value={props.formik.values.baseSettings.subType}
					name="media-type-radio-buttons-group"
				>
					<FormControlLabel
						value={MediaTypes.image}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">Image</Typography>
								<Typography variant="caption">
									jpg, png, gif, svg.
								</Typography>
							</React.Fragment>
						}
					/>
					<FormControlLabel
						value={MediaTypes.audio}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">Audio</Typography>
								<Typography variant="caption">
									mp3, wav, ogg.
								</Typography>
							</React.Fragment>
						}
					/>
					<FormControlLabel
						value={MediaTypes.video}
						control={<Radio />}
						label={
							<React.Fragment>
								<Typography variant="body1">Video</Typography>
								<Typography variant="caption">
									mp4, webm, ogg
								</Typography>
							</React.Fragment>
						}
					/>
				</RadioGroup>
			)
		);
	};

	const postAdditionalBaseOptions = () => {
		return (
			props.formik !== undefined && (
				<FormGroup>
					<FormControlLabel
						value="comment"
						name="comment"
						control={
							<Checkbox
								checked={
									props.formik.values.baseSettings.comment
								}
								onChange={props.formik.handleChange(
									'baseSettings.comment'
								)}
							/>
						}
						label="Comment"
					/>
					<FormControlLabel
						value="reaction"
						name="reaction"
						control={
							<Checkbox
								checked={
									props.formik.values.baseSettings.reaction
								}
								onChange={props.formik.handleChange(
									'baseSettings.reaction'
								)}
							/>
						}
						label="Reaction"
					/>
				</FormGroup>
			)
		);
	};

	return (
		props.formik !== undefined && (
			<Box>
				<FormControl>
					{props.formik.values.baseSettings.type !== 'post' && (
						<TextField
							id="type-name-input"
							label="Attribute name"
							name="attributeName"
							required={true}
							helperText="No spaces allowed"
							value={
								props.formik.values.baseSettings.attributeName
							}
							variant="outlined"
							onChange={props.formik.handleChange(
								'baseSettings.attributeName'
							)}
						/>
					)}
					<SubTypeOptions
						type={props.formik.values.baseSettings.type}
					/>
					<AdditionalBaseOptions
						type={props.formik.values.baseSettings.type}
					/>
				</FormControl>
			</Box>
		)
	);
};

const AdvancedSettings = (props: {
	formik?: FormikProps<AttributeInfoFormValues>;
}) => {
	const advancedSettingBase = () => {
		return (
			props.formik !== undefined && (
				<FormGroup>
					<Grid container spacing={2}>
						<Grid xs={6}>
							<FormControlLabel
								value={SupportedAdvancedSettings.require}
								label="Required"
								name="required"
								control={
									<Checkbox
										checked={
											props.formik.values.advancedSettings
												.required
										}
										onChange={props.formik.handleChange(
											'advancedSettings.required'
										)}
									/>
								}
							/>
						</Grid>

						<Grid xs={6}>
							<FormControlLabel
								value={SupportedAdvancedSettings.unique}
								control={
									<Checkbox
										checked={
											props.formik.values.advancedSettings
												.unique
										}
										onChange={props.formik.handleChange(
											'advancedSettings.unique'
										)}
									/>
								}
								label="Unique"
							/>
						</Grid>

						<Grid xs={6}>
							<FormControlLabel
								value={SupportedAdvancedSettings.max_length}
								control={
									<>
										<Checkbox
											checked={
												props.formik.values
													.advancedSettings
													.maxLength !== 0
											}
										/>
										<TextField
											type="number"
											value={
												props.formik.values
													.advancedSettings.maxLength
											}
											onChange={props.formik.handleChange(
												'advancedSettings.maxLength'
											)}
										/>
									</>
								}
								label="Max length"
							/>
						</Grid>

						<Grid xs={6}>
							<FormControlLabel
								value={SupportedAdvancedSettings.min_length}
								control={
									<>
										<Checkbox
											checked={
												props.formik.values
													.advancedSettings
													.minLength !== 0
											}
										/>
										<TextField
											type="number"
											value={
												props.formik.values
													.advancedSettings.minLength
											}
											onChange={props.formik.handleChange(
												'advancedSettings.minLength'
											)}
										/>
									</>
								}
								label="Min length"
							/>
						</Grid>
					</Grid>
				</FormGroup>
			)
		);
	};

	const AdvancedSettingsBase = (props: { type: SupportedAttributeTypes }) => {
		switch (props.type) {
			case SupportedAttributes.text:
			case SupportedAttributes.media:
				return advancedSettingBase();
		}
	};

	return (
		props.formik !== undefined && (
			<Box>
				<AdvancedSettingsBase
					type={props.formik.values.baseSettings.type}
				/>
			</Box>
		)
	);
};

const SettingTabs = ({
	children,
	formik
}: {
	children: ReactNode[];
	formik: FormikProps<AttributeInfoFormValues>;
}) => {
	// required, unique, maxLength, minLength
	const [tabValue, setTabValue] = React.useState(0);

	const baseSettings = React.Children.map(children, (child) => {
		if ((child as any).type === BaseSettings) {
			return React.cloneElement(child as any, { formik });
		}
		return child;
	});

	const advancedSettings = React.Children.map(children, (child) => {
		if ((child as any).type === AdvancedSettings) {
			return React.cloneElement(child as any, { formik });
		}
		return child;
	});

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={tabValue}
						onChange={handleChange}
						aria-label="setting tabs"
					>
						<Tab label="BASE SETTINGS" {...a11yProps(0)} />
						<Tab label="ADVANCED SETTINGS" {...a11yProps(1)} />
					</Tabs>
				</Box>
				<SettingsTabPanel value={tabValue} index={0}>
					{baseSettings}
				</SettingsTabPanel>
				<SettingsTabPanel value={tabValue} index={1}>
					{advancedSettings}
				</SettingsTabPanel>
			</Box>
			<DebugFormik formik={formik} />
		</>
	);
};

export const AttributeTypesForm = (props: {
	type: SupportedAttributeTypes;
	submitLabel: string;
	initialValues?: AttributeInfoFormValues;
	onSubmit?: (values: AttributeInfoFormValues) => void;
}) => {
	const formik = useFormik({
		initialValues: props.initialValues ?? new AttributeInfoFormValues(),
		onSubmit: (values: AttributeInfoFormValues) => {
			if (props.onSubmit) {
				props.onSubmit(values);
			}
		}
	});

	React.useEffect(() => {
		if (!props.initialValues) {
			switch (props.type) {
				case SupportedAttributes.text:
					formik.setFieldValue('baseSettings.type', 'text');
					formik.setFieldValue('baseSettings.subType', 'short_text');
					break;
				case SupportedAttributes.media:
					formik.setFieldValue('baseSettings.type', 'media');
					formik.setFieldValue('baseSettings.subType', 'image');
					break;
				case SupportedAttributes.post:
					formik.setFieldValue('baseSettings.type', 'post');
					break;
				case SupportedAttributes.posts:
					formik.setFieldValue('baseSettings.type', 'posts');
					break;
			}
		}
	}, [props.type]);

	return (
		<Box>
			<SettingTabs formik={formik}>
				<BaseSettings />
				<AdvancedSettings />
				<Button
					onClick={() => formik.handleSubmit()}
					variant="contained"
					disabled={
						formik.values.baseSettings.type !== 'post'
							? formik.values.baseSettings.attributeName === ''
							: false
					}
				>
					{props.submitLabel ?? 'Submit'}
				</Button>
			</SettingTabs>
		</Box>
	);
};
