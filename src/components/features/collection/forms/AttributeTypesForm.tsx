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
	AudioExtensions,
	ImageExtensions,
	MediaExtensions,
	TextContentTypes,
	TextTypes,
	VideoExtensions
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
	SupportedAdvancedSettings
} from '../../../../models/share/collection/AttributeTypeSettings';
import Validator from '../../../../utils/Validator';
import { TextTypeSettingsFormControl } from '../CollectionStepper';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function SettingsTabPanel(props: TabPanelProps) {
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
	type,
	controller
}: {
	onSubmit: (settings: AttributeSettingTypes) => void;
	type: SupportedAttributeTypes;
	controller: TextTypeSettingsFormControl;
}) => {
	const [addAnotherFieldEnabled, setAddAnotherFieldEnabled] =
		React.useState(false);

	// required, unique, maxLength, minLength
	const [tabValue, setTabValue] = React.useState(0);
	const [fileType, setFileType] = React.useState<
		ImageExtensions | AudioExtensions | VideoExtensions | MediaExtensions
	>();

	const [setting, setSetting] = React.useState<AttributeSettingTypes>();

	React.useEffect(() => {
		switch (type) {
			case SupportedAttributes.text:
				setSetting(new TextTypeSetting());
				break;
			case 'number':
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddAnotherField = () => {
		if (setting) {
			if (setting instanceof TextTypeSetting) {
				// settings.maxLength = advancedSettingFlag & 4 ? 255 : 0;
				// settings.minLength = advancedSettingFlag & 8 ? 1 : 0;
				setting.isRequire = controller.settingValue & 1 ? true : false;
				setting.isUnique = controller.settingValue & 2 ? true : false;
				setting.textType = controller.subtype as TextContentTypes;
				setting.name = controller.name;
			}

			onSubmit(setting);
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
				controller.onSubtypeChange(value as TextContentTypes);
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
		setAddAnotherFieldEnabled(isValid);
		controller.onNameChange(value);
	};

	const handleAdvancedSettingsChange = (
		advancedSettingTypes: SupportedAdvancedSettingTypes,
		value: boolean
	) => {
		const prev = controller.settingValue;
		switch (advancedSettingTypes) {
			case SupportedAdvancedSettings.require:
				controller.onSettingValueChange(value ? prev | 1 : prev & ~1);
				break;
			case SupportedAdvancedSettings.unique:
				controller.onSettingValueChange(value ? prev | 2 : prev & ~2);
				break;
			case SupportedAdvancedSettings.max_length:
				controller.onSettingValueChange(value ? prev | 4 : prev & ~4);
				break;
			case SupportedAdvancedSettings.min_length:
				controller.onSettingValueChange(value ? prev | 8 : prev & ~8);
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
						value={controller.subtype}
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
								value={controller.name}
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
														controller.settingValue &
														1
															? true
															: false
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
														controller.settingValue &
														2
															? true
															: false
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
														controller.settingValue &
														4
															? true
															: false
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
														controller.settingValue &
														8
															? true
															: false
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
					onClick={handleAddAnotherField}
					variant="contained"
					disabled={!addAnotherFieldEnabled}
				>
					Add another field
				</Button>
			</Box>
		);
	};

	return <Box>{SettingTabs()}</Box>;
};
