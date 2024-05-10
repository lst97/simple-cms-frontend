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
	AttributeSettingTypes,
	TextTypeSetting,
	SupportedAdvancedSettingTypes,
	SupportedAdvancedSettings,
	TypeSetting
} from '../../../../models/share/collection/AttributeTypeSettings';
import Validator from '../../../../utils/Validator';
import { TextTypeSettingsFormControl } from '../CollectionStepper';

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

export const AttributeTypesForm = ({
	onSubmit,
	controller,
	type,
	attributeId,
	submitButtonLabel
}: {
	onSubmit: (settings: TypeSetting, attributeId?: string) => void;
	controller?: TextTypeSettingsFormControl;
	attributeId?: string;
	type?: SupportedAttributeTypes;
	submitButtonLabel?: string;
}) => {
	// default values hook
	const [name, setName] = React.useState('');
	const [subtype, setSubtype] = React.useState(
		type === 'text' ? TextTypes.short_text : ''
	);
	const [advancedSettingFlag, setAdvancedSettingFlag] = React.useState(0);
	const [maxLength, setMaxLength] = React.useState(0);
	const [minLength, setMinLength] = React.useState(0);

	const [ctrl] = React.useState<TextTypeSettingsFormControl>(
		controller ??
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

	const [submitButtonEnable, setSubmitButtonEnable] = React.useState(false);

	// required, unique, maxLength, minLength
	const [tabValue, setTabValue] = React.useState(0);
	// const [fileType, setFileType] = React.useState<
	// 	ImageExtensions | AudioExtensions | VideoExtensions | MediaExtensions
	// >();

	const [setting, setSetting] = React.useState<AttributeSettingTypes>();

	React.useEffect(() => {
		switch (type) {
			case SupportedAttributes.text:
				setSetting(new TextTypeSetting());
				break;
			case 'number':
				break;
		}
	}, [type]);

	const handleSubmit = () => {
		if (setting) {
			if (setting instanceof TextTypeSetting) {
				// settings.maxLength = advancedSettingFlag & 4 ? 255 : 0;
				// settings.minLength = advancedSettingFlag & 8 ? 1 : 0;
				setting.isRequire = !!(ctrl.settingValue & 1);
				setting.isUnique = !!(ctrl.settingValue & 2);
				setting.setTextType(ctrl.subtype);
				setting.name = ctrl.name;
			}
			onSubmit(setting as TypeSetting, attributeId);
		}
	};
	const handleSubTypeChange = (
		_event: React.ChangeEvent<HTMLInputElement>,
		value: string
	) => {
		switch (value) {
			case TextTypes.short_text:
			case TextTypes.long_text:
			case TextTypes.reach_text:
				ctrl.onSubtypeChange(value);
				break;
			case 'media':
				break;
			case 'code':
				break;
		}
	};

	const handleTypeNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value;
		const isValid = Validator.isValidName(value);
		setSubmitButtonEnable(isValid);
		ctrl.onNameChange(value);
	};

	const handleAdvancedSettingsChange = (
		advancedSettingTypes: SupportedAdvancedSettingTypes,
		value: boolean
	) => {
		const prev = ctrl.settingValue;
		switch (advancedSettingTypes) {
			case SupportedAdvancedSettings.require:
				ctrl.onSettingValueChange(value ? prev | 1 : prev & ~1);
				break;
			case SupportedAdvancedSettings.unique:
				ctrl.onSettingValueChange(value ? prev | 2 : prev & ~2);
				break;
			case SupportedAdvancedSettings.max_length:
				ctrl.onSettingValueChange(value ? prev | 4 : prev & ~4);
				break;
			case SupportedAdvancedSettings.min_length:
				ctrl.onSettingValueChange(value ? prev | 8 : prev & ~8);
				break;
		}
	};

	const getSubTypeOptions = (type: SupportedAttributeTypes) => {
		return (
			<>
				<Typography variant="h6">Type</Typography>

				{type === 'text' && (
					<RadioGroup
						row
						aria-labelledby="text-type-radio-buttons-group-label"
						onChange={handleSubTypeChange}
						value={ctrl.subtype}
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
										Best for blog posts, articles, and
										notes.
									</Typography>
								</React.Fragment>
							}
						/>
					</RadioGroup>
				)}
			</>
		);
	};

	const BaseSettings = () => {
		switch (type) {
			case SupportedAttributes.text:
				return (
					<Box>
						<FormControl>
							<TextField
								id="type-name-input"
								label="Name"
								required={true}
								helperText="No spaces allowed"
								value={ctrl.name}
								variant="outlined"
								onChange={handleTypeNameChange}
							/>
							{/* TODO: Fix a bug that it lose focus when input */}
							{getSubTypeOptions(type)}
						</FormControl>
					</Box>
				);
			case 'number':
				return (
					<Box>
						<FormControl></FormControl>
					</Box>
				);
		}
	};

	const AdvancedSettings = ({
		required,
		unique,
		maxLength,
		minLength
	}: {
		required?: boolean;
		unique?: boolean;
		maxLength?: boolean;
		minLength?: boolean;
	}) => {
		switch (type) {
			case SupportedAttributes.text:
				return (
					<Box>
						<FormGroup>
							<Grid container spacing={2}>
								{required !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.require
											}
											control={
												<Checkbox
													checked={
														!!(
															ctrl.settingValue &
															1
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.require,
															e.target.checked
														);
													}}
												/>
											}
											label="Required"
										/>
									</Grid>
								)}
								{unique !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.unique
											}
											control={
												<Checkbox
													checked={
														!!(
															ctrl.settingValue &
															2
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.unique,
															e.target.checked
														);
													}}
												/>
											}
											label="Unique"
										/>
									</Grid>
								)}
								{maxLength !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.max_length
											}
											control={
												<Checkbox
													checked={
														!!(
															ctrl.settingValue &
															4
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.max_length,
															e.target.checked
														);
													}}
												/>
											}
											label="Max length"
										/>
									</Grid>
								)}
								{minLength !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.min_length
											}
											control={
												<Checkbox
													checked={
														!!(
															ctrl.settingValue &
															8
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.min_length,
															e.target.checked
														);
													}}
												/>
											}
											label="Min length"
										/>
									</Grid>
								)}
							</Grid>
						</FormGroup>
					</Box>
				);
			case 'number':
				return (
					<Box>
						<FormControl></FormControl>
					</Box>
				);
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
					onClick={handleSubmit}
					variant="contained"
					disabled={!submitButtonEnable}
				>
					{submitButtonLabel ?? null}
				</Button>
			</Box>
		);
	};

	return <>{ctrl ? <Box>{SettingTabs()}</Box> : null}</>;
};
