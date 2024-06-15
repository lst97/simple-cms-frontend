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
import { SupportedAdvancedSettings } from '../../../../models/share/collection/AttributeTypeSettings';
import { useFormik } from 'formik';
import DebugFormik from '../../../debug/DebugFormik';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function SettingsTabPanel(props: Readonly<TabPanelProps>) {
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
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

class AttributeBaseSettings {
	attributeName: string = '';
	type: SupportedAttributeTypes = SupportedAttributes.text;
	subType: TextTypes | MediaTypes = TextTypes.short_text;
}

// included all the advanced settings
class AttributeAdvancedSettings {
	required: boolean = false;
	unique: boolean = false;
	private: boolean = false;
	maxLength: number = 0;
	minLength: number = 0;
	maxSize: number = 0;
	minSize: number = 0;
	comment: boolean = false;
	reaction: boolean = false;
}

interface AttributeAdvancedSettingsProps {
	required?: boolean;
	unique?: boolean;
	maxLength?: boolean;
	minLength?: boolean;
	maxSize?: boolean;
	minSize?: boolean;
}

export class AttributeInfoFormValues {
	baseSettings: AttributeBaseSettings = new AttributeBaseSettings();
	advancedSettings: AttributeAdvancedSettings =
		new AttributeAdvancedSettings();
}

export const AttributeTypesForm = ({
	onSubmit,
	onValuesChange,
	initialValues,
	type,
	attributeId,
	submitButtonLabel
}: {
	onSubmit?: (values: AttributeInfoFormValues) => void;
	onValuesChange?: (values: AttributeInfoFormValues) => void;
	initialValues?: AttributeInfoFormValues;
	attributeId?: string;
	type?: SupportedAttributeTypes;
	submitButtonLabel?: string;
}) => {
	const formik = useFormik({
		initialValues: initialValues ?? new AttributeInfoFormValues(),
		onSubmit: (values) => {}
	});

	const [submitButtonEnable, setSubmitButtonEnable] = React.useState(false);

	// required, unique, maxLength, minLength
	const [tabValue, setTabValue] = React.useState(0);

	React.useEffect(() => {
		switch (type) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type]);

	// React.useEffect(() => {
	// 	if (onValuesChange) {
	// 		onValuesChange(formik.values);
	// 	}
	// }, [formik.values, onValuesChange]);

	const handleSubmit = (values: AttributeInfoFormValues) => {
		if (onSubmit) {
			onSubmit(values);
		}
	};

	const textSubTypeOptions = () => {
		return (
			<RadioGroup
				row
				aria-labelledby="text-type-radio-buttons-group-label"
				onChange={formik.handleChange('baseSettings.subType')}
				onBlur={formik.handleBlur}
				value={formik.values.baseSettings.subType}
				name="text-type-radio-buttons-group"
			>
				<FormControlLabel
					value={TextTypes.short_text}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Short Text</Typography>
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
							<Typography variant="body1">Long Text</Typography>
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
							<Typography variant="body1">Reach Text</Typography>
							<Typography variant="caption">
								Best for blog posts, articles, and notes.
							</Typography>
						</React.Fragment>
					}
				/>
			</RadioGroup>
		);
	};

	const mediaSubTypeOptions = () => {
		return (
			<RadioGroup
				row
				aria-labelledby="media-type-radio-buttons-group-label"
				onChange={formik.handleChange('baseSettings.subType')}
				value={formik.values.baseSettings.subType}
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
		);
	};

	const postAdditionalBaseOptions = () => {
		return (
			<FormGroup>
				<FormControlLabel
					value="comment"
					name="comment"
					control={
						<Checkbox
							checked={formik.values.advancedSettings.comment}
							onChange={formik.handleChange}
						/>
					}
					label="Comment"
				/>
				<FormControlLabel
					value="reaction"
					name="reaction"
					control={
						<Checkbox
							checked={formik.values.advancedSettings.reaction}
							onChange={formik.handleChange}
						/>
					}
					label="Reaction"
				/>
			</FormGroup>
		);
	};

	const advancedSettingBase = () => {
		return (
			<Box>
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
											formik.values.advancedSettings
												.required
										}
										onChange={formik.handleChange(
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
											formik.values.advancedSettings
												.unique
										}
										onChange={formik.handleChange(
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
												formik.values.advancedSettings
													.maxLength !== 0
											}
										/>
										<TextField
											type="number"
											value={
												formik.values.advancedSettings
													.maxLength
											}
											onChange={formik.handleChange(
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
												formik.values.advancedSettings
													.minLength !== 0
											}
										/>
										<TextField
											type="number"
											value={
												formik.values.advancedSettings
													.minLength
											}
											onChange={formik.handleChange(
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
			</Box>
		);
	};

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

	const BaseSettings = () => {
		if (type) {
			return (
				<Box>
					<FormControl>
						<TextField
							id="type-name-input"
							label="Attribute name"
							name="attributeName"
							required={true}
							helperText="No spaces allowed"
							value={formik.values.baseSettings.attributeName}
							variant="outlined"
							onChange={formik.handleChange(
								'baseSettings.attributeName'
							)}
						/>
						<SubTypeOptions type={type} />
						<AdditionalBaseOptions type={type} />
					</FormControl>
				</Box>
			);
		}
	};

	const AdvancedSettings = (props: AttributeAdvancedSettingsProps) => {
		switch (type) {
			case SupportedAttributes.text:
			case SupportedAttributes.media:
				return advancedSettingBase();
		}
	};

	const SettingTabs = () => {
		const handleChange = (
			_event: React.SyntheticEvent,
			newValue: number
		) => {
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
						{BaseSettings()}
					</SettingsTabPanel>
					<SettingsTabPanel value={tabValue} index={1}>
						<AdvancedSettings
							required={false}
							unique={false}
							maxLength={false}
							minLength={false}
						/>
					</SettingsTabPanel>

					<Button
						onClick={() => handleSubmit(formik.values)}
						variant="contained"
						disabled={
							formik.values.baseSettings.attributeName === ''
						}
					>
						{submitButtonLabel ?? 'Submit'}
					</Button>
				</Box>
				<DebugFormik formik={formik} />
			</>
		);
	};

	return <Box>{SettingTabs()}</Box>;
};
